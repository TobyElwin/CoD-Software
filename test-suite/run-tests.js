#!/usr/bin/env node
/**
 * Headless acceptance tests: loads test-runner-headless.html then injects
 * cost-of-delay-calculator.js (from disk) before Jasmine/specs so the class
 * is available. Requires: npm install puppeteer (or npx puppeteer browsers install chrome).
 * Alternative: npm run test:browser (no Puppeteer; opens runner in your browser).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/test-runner.html' : req.url;
  const seg = url.split('?')[0].replace(/^\//, '');
  const file = path.join(ROOT, seg);
  const normalizedFile = path.normalize(file);
  const normalizedRoot = path.normalize(ROOT) + path.sep;
  if (normalizedFile !== ROOT && !normalizedFile.startsWith(normalizedRoot)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.readFile(normalizedFile, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(normalizedFile);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

function getSystemChromePath() {
  const { platform } = process;
  if (platform === 'darwin') {
    const paths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      process.env.PUPPETEER_EXECUTABLE_PATH
    ].filter(Boolean);
    const fs = require('fs');
    for (const p of paths) {
      try {
        if (fs.existsSync(p)) return p;
      } catch (_) {}
    }
  }
  if (platform === 'win32') {
    const paths = [
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.PUPPETEER_EXECUTABLE_PATH
    ].filter(Boolean);
    const fs = require('fs');
    for (const p of paths) {
      try {
        if (p && fs.existsSync(p)) return p;
      } catch (_) {}
    }
  }
  return null;
}

async function run(port) {
  let Puppeteer;
  try {
    Puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer not installed. Run: npm install puppeteer');
    process.exit(2);
  }
  const launchOpts = { headless: 'new' };
  const systemChrome = getSystemChromePath();
  if (systemChrome) launchOpts.executablePath = systemChrome;
  let browser;
  try {
    browser = await Puppeteer.launch(launchOpts);
  } catch (launchErr) {
    const msg = launchErr.message || '';
    const needChrome = msg.includes('Could not find Chrome') || msg.includes('Failed to launch');
    if (needChrome) {
      console.error('Browser launch failed:', msg.split('\n')[0]);
      console.error('\nRun tests in your browser instead (no Chrome/Puppeteer needed):');
      console.error('  npm run test:browser');
      console.error('\nOr install Chrome for Puppeteer: npx puppeteer browsers install chrome');
      process.exit(2);
    }
    throw launchErr;
  }
  const page = await browser.newPage();
  const failures = [];
  const allLogs = [];
  page.on('console', (msg) => {
    const text = msg.text();
    allLogs.push(text);
    if (text.startsWith('Jasmine:') || text.includes('FAILED') || text.includes('Expected')) failures.push(text);
  });
  await page.goto(`http://127.0.0.1:${port}/test-suite/test-runner-headless.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.addScriptTag({ path: path.join(ROOT, 'cost-of-delay-calculator.js') });
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/chart.js' });
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.99.0/jasmine.min.js' });
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.99.0/jasmine-html.min.js' });
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.99.0/boot0.min.js' });
  const testsDir = path.join(ROOT, 'test-suite', 'tests');
  const specFiles = fs.readdirSync(testsDir)
    .filter((name) => name.endsWith('.js'))
    .sort();
  for (const spec of specFiles) {
    await page.addScriptTag({ path: path.join(testsDir, spec) });
  }
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.99.0/boot1.min.js' });
  await page.waitForSelector('.jasmine-results .jasmine-bar', { timeout: 30000 }).catch(() => null);
  await new Promise((r) => setTimeout(r, 2000));
  const { failedCount, summary, failureDetails } = await page.evaluate(() => {
    const failBar = document.querySelector('.jasmine-results .jasmine-bar.jasmine-failures');
    const anyBar = document.querySelector('.jasmine-results .jasmine-bar');
    let failedCount = 0;
    if (failBar) {
      const m = failBar.textContent.match(/(\d+)\s+fail/);
      if (m) failedCount = parseInt(m[1], 10);
    }
    const failureEls = document.querySelectorAll('.jasmine-results .jasmine-failures .jasmine-result-message');
    const failureDetails = Array.from(failureEls).slice(0, 15).map((el) => el.textContent.trim());
    return {
      failedCount,
      summary: anyBar ? anyBar.innerText : '',
      failureDetails
    };
  });
  await browser.close();
  return { failedCount, summary, failureDetails, failures, allLogs };
}

server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address();
  const { failedCount, summary, failureDetails, failures, allLogs } = await run(port);
  server.close();
  console.log(summary || 'Tests completed.');
  if (failureDetails.length) {
    console.log('\nFailures:');
    failureDetails.forEach((f) => console.log('  ', f));
  }
  if (failures.length) {
    console.log('\nConsole:');
    failures.slice(0, 15).forEach((f) => console.log(' ', f));
  }
  if (failedCount > 0 && allLogs.some((l) => l.includes('Error') || l.includes('error'))) {
    console.log('\nRelevant console output:');
    allLogs.filter((l) => l.includes('Error') || l.includes('error') || l.includes('CostOfDelay')).slice(0, 10).forEach((l) => console.log(' ', l));
  }
  process.exit(failedCount > 0 ? 1 : 0);
});
