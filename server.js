import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

async function proxyMetricoolJson(res, targetUrl) {
  if (!process.env.METRICOOL_TOKEN) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'METRICOOL_TOKEN not configured' }));
    return;
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'X-Mc-Auth': process.env.METRICOOL_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    const text = await upstream.text();
    res.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') || 'application/json' });
    res.end(text);
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = requestUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Mc-Auth');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && pathname === '/api/metricool/brand-summary') {
    const blogId = requestUrl.searchParams.get('blogId') || '5526619';
    const userId = requestUrl.searchParams.get('userId') || '4289908';
    proxyMetricoolJson(
      res,
      `https://app.metricool.com/evolution/brandSummary?blogId=${encodeURIComponent(blogId)}&userId=${encodeURIComponent(userId)}`
    );
    return;
  }

  if (req.method === 'GET' && pathname === '/api/metricool/analytics/posts') {
    proxyMetricoolJson(
      res,
      `https://app.metricool.com/api/v2/analytics/brand-summary/posts?${requestUrl.searchParams.toString()}`
    );
    return;
  }

  if (req.method === 'GET' && pathname === '/api/metricool/analytics/timelines') {
    proxyMetricoolJson(
      res,
      `https://app.metricool.com/api/v2/analytics/timelines?${requestUrl.searchParams.toString()}`
    );
    return;
  }

  // Serve index.html with token injected
  if (pathname === '/' || pathname === '/index.html') {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    html = html.replace('{{METRICOOL_TOKEN}}', process.env.METRICOOL_TOKEN || '');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Serve static files
  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath);
    const contentType = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    }[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`\n🚀 GrowthAI Server running at http://localhost:${PORT}`);
  console.log(`   Metricool token: ${process.env.METRICOOL_TOKEN ? '✓ Loaded from .env' : '⚠ NOT FOUND'}\n`);
});
