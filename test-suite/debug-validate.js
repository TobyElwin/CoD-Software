#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml' };
const server = http.createServer((req,res)=>{
  const requested = req.url === '/' ? '/cost-of-delay-calculator.html' : req.url;
  const seg = requested.split('?')[0].replace(/^\//,'');
  const file = path.join(ROOT, seg);
  const normalized = path.normalize(file);
  const rootNorm = path.normalize(ROOT) + path.sep;
  if (normalized !== path.normalize(ROOT) && !normalized.startsWith(rootNorm)) { res.writeHead(403).end(); return; }
  fs.readFile(normalized,(err,data)=>{ if (err) { res.writeHead(404).end('Not found'); return; } const ext=path.extname(normalized); res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream'}); res.end(data); });
});

async function run(port){
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => { console.log('PAGE LOG:', msg.type(), msg.text()); });
  page.on('pageerror', err => { console.error('PAGE ERROR:', err && err.stack ? err.stack : err.message); });
  page.on('response', res => { if (res.status() === 404) console.warn('RESOURCE 404:', res.url()); });

  await page.evaluateOnNewDocument(() => {
    if (typeof window.Chart === 'undefined') {
      window.Chart = function ChartStub() { return { destroy: () => {} }; };
    }
    window.__printCalled = false; window.print = () => { window.__printCalled = true; };
  });

  const url = `http://127.0.0.1:${port}/cost-of-delay-calculator.html`;
  console.log('Visiting', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  const loadErrors = await page.evaluate(() => window.__loadErrors || []);
  console.log('window.__loadErrors:', JSON.stringify(loadErrors.slice(0,20), null, 2));

  const hasCalculator = await page.evaluate(() => typeof window.calculator !== 'undefined');
  console.log('Has global calculator instance?', hasCalculator);

  await page.type('#projectName', 'Debug Project');
  await page.type('#weeklyValue', '100000');
  await page.type('#developmentWeeks', '8');
  await page.type('#delayWeeks', '3');
  await page.select('#urgencyProfile', 'standard');
  await page.type('#annualSalary', '120000');
  await page.type('#teamSize', '4');

  console.log('Clicking calculate...');
  await page.click('#calculateBtn');

  // wait short time then dump states
    if (typeof page.waitForTimeout === 'function') {
      await page.waitForTimeout(2000);
    } else if (typeof page.waitFor === 'function') {
      await page.waitFor(2000);
    } else {
      // fallback busy-wait in page
      await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));
    }

    // Attempt to detect which script (inline or external) has a parsing error by trying to parse inline scripts
    const scriptChecks = await page.$$eval('script', (nodes) => {
      return nodes.map((n, idx) => {
        try {
          const code = n.src ? (`/* external:${n.src} */`) : n.innerText;
          // Try to parse using Function constructor to surface syntax errors
          new Function(code);
          return { index: idx, src: n.src || null, ok: true };
        } catch (err) {
          return { index: idx, src: n.src || null, ok: false, error: err.message };
        }
      });
    });
    console.log('Script parse checks:', scriptChecks.slice(0, 20));
    // Print inline script content (if any) for inspection
    const inlineScripts = await page.$$eval('script:not([src])', nodes => nodes.map(n => n.innerText));
    inlineScripts.forEach((code, i) => {
      console.log(`--- inline script [${i}] length=${code.length} ---`);
      console.log(code.slice(0, 2000));
    });
  const quickStatsDisp = await page.$eval('#quickStats', el => el ? el.style.display : 'missing').catch(()=> 'missing');
  const headerActionsDisp = await page.$eval('#headerActions', el => el ? el.style.display : 'missing').catch(()=> 'missing');
  const quickStatsHtml = await page.$eval('#quickStats', el => el ? el.innerHTML : '').catch(()=> '');
  const headerActionsHtml = await page.$eval('#headerActions', el => el ? el.innerHTML : '').catch(()=> '');

  console.log('quickStats.style.display=', quickStatsDisp);
  console.log('headerActions.style.display=', headerActionsDisp);
  console.log('quickStats innerHTML:', quickStatsHtml.slice(0,300));
  console.log('headerActions innerHTML:', headerActionsHtml.slice(0,300));

  // also check for any console errors collected on page
  const errors = await page.evaluate(() => window.__lastConsoleErrors || []);
  console.log('window.__lastConsoleErrors (if any):', errors);

  await browser.close();
}

server.listen(0,'127.0.0.1', async ()=>{
  const { port } = server.address();
  try { await run(port); server.close(() => process.exit(0)); } catch (err) { console.error(err && err.stack ? err.stack : String(err)); server.close(()=>process.exit(1)); }
});
