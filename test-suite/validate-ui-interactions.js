#!/usr/bin/env node
/** Smoke validation for key module interactions on the real HTML interface. */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const requested = req.url === '/' ? '/cost-of-delay-calculator.html' : req.url;
  const seg = requested.split('?')[0].replace(/^\//, '');
  const file = path.join(ROOT, seg);
  const normalized = path.normalize(file);
  const rootNorm = path.normalize(ROOT) + path.sep;

  if (normalized !== path.normalize(ROOT) && !normalized.startsWith(rootNorm)) {
    res.writeHead(403).end();
    return;
  }

  fs.readFile(normalized, (err, data) => {
    if (err) {
      res.writeHead(404).end('Not found');
      return;
    }

    const ext = path.extname(normalized);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

function fail(message) {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
}

async function run(port) {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
    puppeteer = puppeteer.default || puppeteer;
  } catch (_) {
    fail('Puppeteer is not installed. Run npm install.');
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const consoleErrors = [];
  const missingResources = [];

  await page.evaluateOnNewDocument(() => {
    if (typeof window.Chart === 'undefined') {
      window.Chart = function ChartStub() {
        return { destroy: () => {} };
      };
    }
    window.__printCalled = false;
    window.print = () => { window.__printCalled = true; };
  });

  page.on('pageerror', (error) => {
    consoleErrors.push(`pageerror:${error.message}`);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('response', (response) => {
    if (response.status() !== 404) return;
    const resourceUrl = response.url();
    if (resourceUrl.includes('/favicon.ico')) return;
    missingResources.push(resourceUrl);
  });

  const url = `http://127.0.0.1:${port}/cost-of-delay-calculator.html`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // wait for calculator object to be ready
  await page.waitForFunction(() => window.calculator && typeof window.calculator.calculate === 'function', { timeout: 15000 });

  // validate floating action buttons are centered horizontally and vertically
  const floatingButtonAlignment = await page.evaluate(() => {
    const ids = ['scrollToTopBtn', 'scrollToExecutiveBtn'];
    return ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, present: false };
      const style = window.getComputedStyle(el);
      return {
        id,
        present: true,
        textAlign: style.textAlign,
        display: style.display,
        alignItems: style.alignItems,
        justifyContent: style.justifyContent,
        justifyItems: style.justifyItems
      };
    });
  });

  for (const button of floatingButtonAlignment) {
    if (!button.present) {
      fail(`Missing floating button: ${button.id}`);
    }
    const isFlexCentered =
      button.display === 'flex' &&
      button.alignItems === 'center' &&
      button.justifyContent === 'center';
    const isGridCentered =
      button.display === 'grid' &&
      button.alignItems === 'center' &&
      button.justifyItems === 'center';

    if (button.textAlign !== 'center' || (!isFlexCentered && !isGridCentered)) {
      fail(
        `Floating button alignment failed for ${button.id}: ` +
        JSON.stringify(button)
      );
    }
  }

  await page.evaluate(() => {
    const setValue = (selector, value) => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    setValue('#projectName', 'Module Interaction Validation');
    setValue('#weeklyValue', '100000');
    setValue('#developmentWeeks', '8');
    setValue('#delayWeeks', '3');
    setValue('#urgencyProfile', 'standard');
    setValue('#annualSalary', '120000');
    setValue('#teamSize', '4');
    setValue('#currencyCode', 'USD');
  });

  await page.$eval('#calculateBtn', el => el.click());
  // log internal states for diagnostics
  const diagnostics = await page.evaluate(() => {
    const qs = document.getElementById('quickStats');
    const err = document.getElementById('errorMessage');
    return {
      qsDisplay: qs ? qs.style.display : 'missing',
      errDisplay: err ? err.style.display : 'missing',
      errText: err ? err.textContent : ''
    };
  });
  console.log('DIAG after click', diagnostics);

  await page.waitForFunction(() => {
    const quickStats = document.getElementById('quickStats');
    return quickStats && quickStats.style.display !== 'none';
  }, { timeout: 20000 });



  // invalid input should show an inline error message
  await page.evaluate(() => {
    document.getElementById('weeklyValue').value = '';
    document.getElementById('developmentWeeks').value = '0';
    document.getElementById('delayWeeks').value = '2';
    document.getElementById('calculateBtn').click();
  });
  await page.waitForSelector('#errorMessage', { visible: true, timeout: 5000 });
  const errorText = await page.$eval('#errorMessage', el => el.textContent || '');
  if (!/(valid values|must be greater than 0|cannot be negative)/i.test(errorText)) {
    fail('Unexpected inline error text: ' + errorText);
  }

  await page.$eval('body', el => el.click());
  const isExportMenuClosed = await page.$eval('#exportDropdown', (el) => !el.classList.contains('show'));
  if (!isExportMenuClosed) {
    fail('Export dropdown did not close on outside click.');
  }

  await browser.close();

  if (missingResources.length > 0) {
    fail(`Missing resources detected: ${missingResources.slice(0, 3).join(' | ')}`);
  }

  if (consoleErrors.length > 0) {
    const actionable = consoleErrors.filter((text) => !text.includes('404 (Not Found)'));
    if (actionable.length > 0) {
      fail(`Console/page errors detected: ${actionable.slice(0, 3).join(' | ')}`);
    }
  }

  console.log('UI module interaction validation passed.');
}

server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address();
  try {
    await run(port);
    server.close(() => process.exit(0));
  } catch (error) {
    console.error(error && error.stack ? error.stack : String(error));
    server.close(() => process.exit(1));
  }
});
