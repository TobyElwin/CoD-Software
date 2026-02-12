#!/usr/bin/env node
/** Serve test-runner.html and open in default browser (no Puppeteer). */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/test-suite/test-runner.html`;
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} "${url}"`, () => {});
  console.log('Test runner opened in browser:', url);
  console.log('Close the server with Ctrl+C when done.');
});
