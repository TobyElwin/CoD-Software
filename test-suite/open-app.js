#!/usr/bin/env node
/** Serve the app and open in default browser for manual testing. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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

server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/cost-of-delay-calculator.html`;
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} "${url}"`, () => {});

  console.log('App opened in browser:', url);
  console.log('Use Ctrl+C to stop this server when finished testing.');
});
