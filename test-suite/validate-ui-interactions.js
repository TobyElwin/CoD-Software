#!/usr/bin/env node
/** Smoke validation for key module interactions on the real HTML interface. */
const http = require('http');
const fs = require('fs');
const path = require('path');

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
    puppeteer = require('puppeteer');
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

  await page.type('#projectName', 'Module Interaction Validation');
  await page.type('#weeklyValue', '100000');
  await page.type('#developmentWeeks', '8');
  await page.type('#delayWeeks', '3');
  await page.select('#urgencyProfile', 'standard');
  await page.type('#annualSalary', '120000');
  await page.type('#teamSize', '4');

  await page.$eval('#calculateBtn', el => el.click());
  await page.waitForFunction(() => {
    const quickStats = document.getElementById('quickStats');
    const headerActions = document.getElementById('headerActions');
    return quickStats && quickStats.style.display !== 'none' && headerActions && headerActions.style.display !== 'none';
  }, { timeout: 15000 });

  await page.$eval('#addToPortfolioBtn', el => el.click());
  await page.waitForFunction(() => {
    const section = document.getElementById('portfolioSection');
    const cards = document.querySelectorAll('#projectCards .project-card');
    return section && section.style.display !== 'none' && cards.length > 0;
  }, { timeout: 15000 });

  await page.$eval('#exportDropdownBtn', el => el.click());
  const isExportMenuOpen = await page.$eval('#exportDropdown', (el) => el.classList.contains('show'));
  if (!isExportMenuOpen) {
    fail('Export dropdown did not open on button click.');
  }

  await page.$eval('#printResultsBtn', el => el.click());
  const printCalled = await page.evaluate(() => window.__printCalled === true);
  if (!printCalled) {
    fail('Print button did not trigger window.print().');
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
