import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const configuredHeaders = new Map();
let globalRule = false;
for (const line of fs.readFileSync(path.join(root, '_headers'), 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue;
  if (line === line.trim()) {
    globalRule = line.trim() === '/*';
    continue;
  }
  if (!globalRule) continue;
  const separator = line.indexOf(':');
  if (separator < 1) continue;
  configuredHeaders.set(line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim());
}
const localApiHeaders = Object.fromEntries(configuredHeaders);
http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/api/contact' && req.method === 'POST') {
    res.writeHead(503, { ...localApiHeaders, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    return res.end(JSON.stringify({ message: 'Contact delivery is not configured in the local preview. Please use LinkedIn for now.' }));
  }
  let target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!target.startsWith(root + path.sep) && target !== path.join(root, 'index.html')) return res.writeHead(400).end('Bad request');
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) return res.writeHead(404).end('Not found');
  res.writeHead(200, { ...localApiHeaders, 'content-type': mime[path.extname(target)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(target).pipe(res);
}).listen(Number(process.env.PORT ?? 4173), '127.0.0.1');
