#!/usr/bin/env node
/**
 * Servidor de previsualización de out/ que imita a Netlify en lo que afecta a la validación SEO:
 * - /ruta/ -> out/ruta/index.html; /ruta (sin slash) -> 301 a /ruta/.
 * - Rutas inexistentes -> out/404.html con estado 404 real.
 * - /.netlify/images?url=... se reenvía al Image CDN de producción (las fotos ya están publicadas),
 *   para medir el peso real de las imágenes optimizadas. Con --offline sirve el archivo local.
 * - Respuestas de texto comprimidas con gzip, como en Netlify, para que las mediciones sean comparables.
 * Uso: node scripts/preview-server.mjs [puerto] [--offline] [--root=out]
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const PORT = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 4173);
const OFFLINE = process.argv.includes('--offline');
const rootArg = process.argv.find((a) => a.startsWith('--root='));
const ROOT = resolve(rootArg ? rootArg.slice(7) : join(process.cwd(), 'out'));
const PROD = 'https://www.promocionalesjj.co';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
};

const imageCache = new Map();

function send(req, res, status, file) {
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  let body = readFileSync(file);
  const headers = { 'Content-Type': type };
  if (/text|javascript|json|xml|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(body);
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/.netlify/images') {
    const src = url.searchParams.get('url') ?? '';
    if (OFFLINE) {
      const local = join(ROOT, normalize(decodeURIComponent(src)));
      return existsSync(local) ? send(req, res, 200, local) : (res.writeHead(404), res.end());
    }
    try {
      // Caché en memoria por URL+formato: el Image CDN también cachea las variantes ya transformadas.
      const key = `${url.search}|${/avif/.test(req.headers.accept ?? '') ? 'avif' : /webp/.test(req.headers.accept ?? '') ? 'webp' : 'orig'}`;
      if (!imageCache.has(key)) {
        const upstream = await fetch(`${PROD}${url.pathname}${url.search}`, { headers: { accept: req.headers.accept ?? '*/*' } });
        imageCache.set(key, { status: upstream.status, type: upstream.headers.get('content-type') ?? 'image/jpeg', body: Buffer.from(await upstream.arrayBuffer()) });
      }
      const hit = imageCache.get(key);
      res.writeHead(hit.status, { 'Content-Type': hit.type });
      return res.end(hit.body);
    } catch {
      res.writeHead(502);
      return res.end();
    }
  }

  const path = decodeURIComponent(url.pathname);
  const target = join(ROOT, normalize(path));
  if (!target.startsWith(ROOT)) return (res.writeHead(400), res.end());
  if (existsSync(target) && statSync(target).isFile()) return send(req, res, 200, target);
  if (!path.endsWith('/') && existsSync(join(target, 'index.html'))) {
    res.writeHead(301, { Location: `${path}/${url.search}` });
    return res.end();
  }
  const index = join(target, 'index.html');
  if (existsSync(index)) return send(req, res, 200, index);
  return send(req, res, 404, join(ROOT, '404.html'));
}).listen(PORT, () => console.log(`Preview de out/ en http://localhost:${PORT}${OFFLINE ? ' (offline)' : ''}`));
