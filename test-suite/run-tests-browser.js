#!/usr/bin/env node
/** Serve test-runner.html and open in default browser (no Puppeteer). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const PORT = 8766;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  const seg = (req.url === '/' ? 'test-runner.html' : req.url.replace(/^\//, '')).split('?')[0];
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
    const ct = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct }).end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}/test-suite/test-runner.html`;
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} "${url}"`, () => {});
  console.log('Test runner opened in browser:', url);
  console.log('Close the server with Ctrl+C when done.');
});
