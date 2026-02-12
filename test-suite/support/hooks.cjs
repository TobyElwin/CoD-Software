const { BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const http = require("http");
const fs = require("fs");
const path = require("path");

setDefaultTimeout(60 * 1000);

const ROOT = path.resolve(__dirname, "../..");

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

let server = null;
let baseUrl = null;
let browser = null;

function startStaticServer() {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const requested = req.url === "/" ? "/index.html" : req.url;
      const pathname = requested.split("?")[0];
      const rel = pathname.replace(/^\//, "");
      const file = path.join(ROOT, rel);

      const normalized = path.normalize(file);
      const rootNorm = path.normalize(ROOT) + path.sep;

      if (normalized !== path.normalize(ROOT) && !normalized.startsWith(rootNorm)) {
        res.writeHead(403).end("Forbidden");
        return;
      }

      fs.readFile(normalized, (err, data) => {
        if (err) {
          res.writeHead(404).end("Not found");
          return;
        }
        const ext = path.extname(normalized);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      });
    });

    s.listen(0, "127.0.0.1", () => resolve(s));
  });
}

BeforeAll(async () => {
  server = await startStaticServer();
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;

  const puppeteer = require("puppeteer");
  browser = await puppeteer.launch({ headless: "new" });
});

AfterAll(async () => {
  try { if (browser) await browser.close(); } catch (e) {}
  try { if (server) server.close(); } catch (e) {}
});

Before(async function () {
  this.baseUrl = baseUrl;
  this.browser = browser;
  this.page = await browser.newPage();
});

After(async function () {
  try { if (this.page) await this.page.close(); } catch (e) {}
});
