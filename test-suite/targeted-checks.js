#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const requested = req.url === '/' ? '/cost-of-delay-calculator.html' : req.url;
  const seg = requested.split('?')[0].replace(/^\//, '');
  const file = path.join(ROOT, seg);
  const normalized = path.normalize(file);
  const rootNorm = path.normalize(ROOT) + path.sep;
  if (normalized !== path.normalize(ROOT) && !normalized.startsWith(rootNorm)) { res.writeHead(403).end(); return; }
  fs.readFile(normalized, (err, data) => {
    if (err) { res.writeHead(404).end('Not found'); return; }
    const ext = path.extname(normalized);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

async function run(port) {
  let puppeteer;
  try { puppeteer = require('puppeteer'); } catch (e) { console.error('Puppeteer not installed'); process.exit(1); }
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.evaluateOnNewDocument(() => {
    if (typeof window.Chart === 'undefined') {
      window.Chart = function ChartStub() { return { destroy: () => {} }; };
    }
    window.__printCalled = false;
    window.print = () => { window.__printCalled = true; };
  });

  const url = `http://127.0.0.1:${port}/cost-of-delay-calculator.html`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Fill inputs and calculate
  await page.$eval('#projectName', (el) => el.value = 'Targeted Check Project');
  await page.$eval('#weeklyValue', (el) => el.value = '50000');
  await page.$eval('#developmentWeeks', (el) => el.value = '6');
  await page.$eval('#delayWeeks', (el) => el.value = '2');
  await page.$eval('#urgencyProfile', (el) => el.value = 'standard');
  await page.$eval('#annualSalary', (el) => el.value = '100000');
  await page.$eval('#teamSize', (el) => el.value = '3');

  await page.$eval('#calculateBtn', el => el.click());

  // Wait for quickStats and overview to appear
  await page.waitForFunction(() => {
    const qs = document.getElementById('quickStats');
    const ov = document.getElementById('overviewSection');
    return qs && qs.style.display !== 'none' && ov && ov.style.display !== 'none';
  }, { timeout: 10000 });

  // Capture overview text and call exportExecutiveAnalysis directly to get returned text
  const result = await page.evaluate(() => {
    const overviewText = (document.getElementById('overviewContent') || {}).innerText || '';
    let exportText = null;
    try {
      if (window.calculator && typeof window.calculator.exportExecutiveAnalysis === 'function') {
        exportText = window.calculator.exportExecutiveAnalysis();
      }
    } catch (e) { exportText = 'ERROR:' + e.message; }
    // add to comparison
    let added = false;
    try { if (window.calculator && typeof window.calculator.addToComparison === 'function') { window.calculator.addToComparison(); added = true; } } catch(e){ added = false; }
    const compCount = window.calculator && window.calculator.comparisonProjects ? window.calculator.comparisonProjects.length : 0;
    const selections = window.calculator && window.calculator.comparisonSelections ? Array.from(window.calculator.comparisonSelections) : [];
    const visualsBuilt = window.calculator ? !!window.calculator.visualsBuilt : false;
    return { overviewText, exportText, added, compCount, selections, visualsBuilt };
  });

  console.log('TARGETED CHECK RESULTS:');
  console.log('overviewText (snippet):', result.overviewText.slice(0,200));
  console.log('exportText (snippet):', (result.exportText || '').slice(0,200));
  console.log('addedToComparison:', result.added, 'comparisonCount:', result.compCount);
  console.log('selections:', result.selections);
  console.log('visualsBuilt flag:', result.visualsBuilt);

  await browser.close();
}

server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address();
  try {
    await run(port);
    server.close(() => process.exit(0));
  } catch (err) {
    console.error(err && err.stack ? err.stack : String(err));
    server.close(() => process.exit(1));
  }
});
