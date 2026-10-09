#!/usr/bin/env node
/**
 * Auditoría SEO del export estático (out/). Analiza el HTML generado, no los JSON ni el payload RSC:
 * los enlaces solo cuentan si existen como <a href> fuera de <script>.
 *
 * Uso:  node scripts/seo-check.mjs [outDir] [--csv ruta.csv] [--json ruta.json] [--strict]
 * --strict devuelve exit 1 si alguna comprobación bloqueante falla (útil tras el build).
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, sep, dirname } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const OUT = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))) || 'out';
const STRICT = args.includes('--strict');
const EXPECTED_ORIGIN = 'https://www.promocionalesjj.co';
const BRAND = 'Promocionales J&J';

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === '_next') continue;
      files.push(...walk(full));
    } else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return m ? decode(m[1]) : undefined;
};

function fileToPath(file) {
  let rel = relative(OUT, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel; // p. ej. 404.html
}

function pageType(path) {
  if (path === '/') return 'inicio';
  if (path === '/404/' || path.endsWith('.html')) return 'especial';
  if (path === '/promociones/' || path === '/contacto/') return 'institucional';
  if (/^\/tienda\/pagina\/\d+\/$/.test(path)) return 'tienda-paginada';
  if (path === '/tienda/') return 'tienda';
  if (/^\/tienda\/categoria\/[^/]+\/pagina\/\d+\/$/.test(path)) return 'categoria-paginada';
  if (/^\/tienda\/categoria\/[^/]+\/$/.test(path)) return 'categoria';
  if (path === '/tienda/categoria/') return 'indice-categorias';
  if (/^\/tienda\/[^/]+\/$/.test(path)) return 'producto';
  if (path === '/productos-promocionales-colombia/') return 'hub-colombia';
  if (/^\/productos-promocionales-colombia\/[^/]+\/$/.test(path)) return 'ciudad';
  if (path === '/blog/') return 'blog';
  if (/^\/blog\/[^/]+\/$/.test(path)) return 'articulo';
  if (path.endsWith('.html')) return 'especial';
  return 'otra';
}

function analyze(file) {
  const html = readFileSync(file, 'utf8');
  const head = html.slice(0, html.indexOf('</head>') + 7);
  const path = fileToPath(file);
  const linkTags = head.match(/<link[^>]+>/gi) || [];
  const metaTags = head.match(/<meta[^>]+>/gi) || [];
  const canonicalTag = linkTags.find((t) => /rel="canonical"/i.test(t));
  const meta = (key) => {
    const t = metaTags.find((m) => new RegExp(`(name|property)="${key}"`, 'i').test(m));
    return t ? attr(t, 'content') : undefined;
  };
  const titleM = head.match(/<title>([\s\S]*?)<\/title>/i);

  const jsonLd = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      jsonLd.push(JSON.parse(m[1]));
    } catch {
      jsonLd.push({ __parseError: true });
    }
  }
  // Solo HTML visible: se descartan <script> (incluye el payload RSC) antes de buscar enlaces y H1.
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const links = new Set();
  for (const m of body.matchAll(/<a\s[^>]*href="([^"#]*)(#[^"]*)?"/gi)) {
    const href = decode(m[1]);
    if (href.startsWith('/') && !href.startsWith('//')) links.add(href);
    else if (href.startsWith(EXPECTED_ORIGIN)) links.add(href.slice(EXPECTED_ORIGIN.length) || '/');
  }
  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  );
  const preloadImages = linkTags.filter((t) => /rel="preload"/i.test(t) && /as="image"/i.test(t)).length;

  return {
    path,
    type: pageType(path),
    bytes: Buffer.byteLength(html),
    title: titleM ? decode(titleM[1]) : '',
    description: meta('description') || '',
    canonical: canonicalTag ? attr(canonicalTag, 'href') : '',
    robots: meta('robots') || '',
    ogUrl: meta('og:url') || '',
    ogImage: meta('og:image') || '',
    hreflang: linkTags.filter((t) => /hreflang=/i.test(t)).length,
    h1s,
    jsonLd,
    links: [...links],
    preloadImages,
  };
}

function flattenTypes(nodes) {
  const out = [];
  const visit = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(visit);
    if (n['@type']) out.push(n);
    if (n['@graph']) visit(n['@graph']);
  };
  visit(nodes);
  return out;
}

// ---------------------------------------------------------------------------
if (!existsSync(OUT)) {
  console.error(`No existe ${OUT}/. Ejecuta pnpm build primero.`);
  process.exit(2);
}
const pages = walk(OUT).map(analyze);
const byPath = new Map(pages.map((p) => [p.path, p]));

// Crawl BFS desde inicio sobre enlaces HTML.
const norm = (href) => {
  let p = href.split('?')[0];
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  return p;
};
const reachable = new Set(['/']);
const queue = ['/'];
const brokenLinks = new Map();
while (queue.length) {
  const cur = byPath.get(queue.shift());
  if (!cur) continue;
  for (const href of cur.links) {
    const target = norm(href);
    if (/\.(xml|txt|png|jpg|jpeg|svg|webp|avif|ico|pdf)$/i.test(target)) continue;
    if (!byPath.has(target)) {
      if (!brokenLinks.has(target)) brokenLinks.set(target, cur.path);
      continue;
    }
    if (!reachable.has(target)) {
      reachable.add(target);
      queue.push(target);
    }
  }
}

// Sitemap.
const sitemapFile = join(OUT, 'sitemap.xml');
const sitemapLocs = existsSync(sitemapFile)
  ? [...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  : [];
const sitemapXml = existsSync(sitemapFile) ? readFileSync(sitemapFile, 'utf8') : '';
const lastmods = [...sitemapXml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
const robotsTxt = existsSync(join(OUT, 'robots.txt')) ? readFileSync(join(OUT, 'robots.txt'), 'utf8') : '';

const issues = [];
const add = (severity, code, path, detail) => issues.push({ severity, code, path, detail });

const contentPages = pages.filter((p) => p.type !== 'especial');
for (const p of pages) {
  const indexable = !/noindex/i.test(p.robots);
  if (p.type === 'especial') {
    if (p.canonical) add('error', 'canonical-en-404', p.path, p.canonical);
    continue;
  }
  const expected = EXPECTED_ORIGIN + p.path;
  if (indexable && p.canonical !== expected) add('error', 'canonical-incorrecto', p.path, p.canonical || '(sin canonical)');
  if (p.ogUrl && p.ogUrl !== expected) add('error', 'og-url-incorrecto', p.path, p.ogUrl);
  if (p.hreflang) add('warn', 'hreflang-presente', p.path, String(p.hreflang));
  if (!p.title) add('error', 'sin-title', p.path, '');
  const brandHits = p.title.split(BRAND).length - 1;
  if (brandHits > 1) add('error', 'marca-duplicada-title', p.path, p.title);
  if (/Personalizados Personalizados/i.test(p.title + ' ' + p.h1s.join(' '))) add('error', 'personalizados-duplicado', p.path, p.title);
  if (!p.description) add('error', 'sin-description', p.path, '');
  else if (!/[.!?…)]$/.test(p.description.trim())) add('warn', 'description-sin-cierre', p.path, p.description.slice(-40));
  if (p.h1s.length !== 1) add('error', 'h1-no-unico', p.path, String(p.h1s.length));
  if (!p.ogImage) add('warn', 'sin-og-image', p.path, '');
  if (p.preloadImages > 2) add('warn', 'precargas-imagen', p.path, String(p.preloadImages));

  for (const node of flattenTypes(p.jsonLd)) {
    const t = [].concat(node['@type']);
    const urls = JSON.stringify(node).match(/https?:\/\/[^"]+/g) || [];
    for (const u of urls) if (/promocionalesjj\.co/.test(u) && !u.startsWith(EXPECTED_ORIGIN)) add('error', 'jsonld-host', p.path, u);
    if (t.includes('LocalBusiness')) add('error', 'localbusiness-sin-sede', p.path, node.name || '');
    if (t.includes('Product')) {
      const offers = node.offers;
      if (offers && !(offers.price || offers.priceSpecification || offers.lowPrice)) add('error', 'offer-sin-precio', p.path, '');
      if (/placeholder/i.test(JSON.stringify(node.image || ''))) add('error', 'product-imagen-placeholder', p.path, '');
    }
  }
  if (p.jsonLd.some((j) => j.__parseError)) add('error', 'jsonld-invalido', p.path, '');
}

const sitemapPaths = sitemapLocs.map((u) => (u.startsWith(EXPECTED_ORIGIN) ? u.slice(EXPECTED_ORIGIN.length) : null));
sitemapLocs.forEach((u, i) => {
  const path = sitemapPaths[i];
  if (path === null) return add('error', 'sitemap-host', u, '');
  const page = byPath.get(path);
  if (!page) return add('error', 'sitemap-url-inexistente', u, '');
  if (/noindex/i.test(page.robots)) add('error', 'sitemap-noindex', u, '');
  if (page.canonical && page.canonical !== u) add('error', 'sitemap-no-canonical', u, page.canonical);
});
const inSitemap = new Set(sitemapPaths.filter(Boolean));
for (const p of contentPages) {
  if (!/noindex/i.test(p.robots) && !inSitemap.has(p.path) && !/\/pagina\/\d+\/$/.test(p.path))
    add('warn', 'indexable-fuera-de-sitemap', p.path, '');
}
const lastmodCounts = lastmods.reduce((acc, d) => ((acc[d] = (acc[d] || 0) + 1), acc), {});
const topLastmod = Object.entries(lastmodCounts).sort((a, b) => b[1] - a[1])[0];
if (topLastmod && topLastmod[1] > sitemapLocs.length * 0.5)
  add('warn', 'lastmod-uniforme', 'sitemap.xml', `${topLastmod[1]}/${sitemapLocs.length} = ${topLastmod[0]}`);
if (/^Host:/im.test(robotsTxt)) add('warn', 'robots-host-obsoleto', 'robots.txt', '');
if (!robotsTxt.includes(`Sitemap: ${EXPECTED_ORIGIN}/sitemap.xml`)) add('error', 'robots-sitemap-host', 'robots.txt', '');
for (const [target, from] of brokenLinks) add('error', 'enlace-roto', target, `desde ${from}`);

const products = pages.filter((p) => p.type === 'producto');
const unreachableProducts = products.filter((p) => !reachable.has(p.path)).map((p) => p.path);

const countBy = (arr, key) => arr.reduce((acc, x) => ((acc[x[key]] = (acc[x[key]] || 0) + 1), acc), {});
const issueCounts = issues.reduce((acc, i) => {
  const k = `${i.severity}:${i.code}`;
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});

const summary = {
  generado: new Date().toISOString(),
  directorio: OUT,
  paginasHtml: pages.length,
  porTipo: countBy(pages, 'type'),
  sitemapUrls: sitemapLocs.length,
  alcanzablesDesdeInicio: reachable.size,
  productos: products.length,
  productosAlcanzables: products.length - unreachableProducts.length,
  productosSinCamino: unreachableProducts.length,
  bytesTienda: byPath.get('/tienda/')?.bytes,
  bytesInicio: byPath.get('/')?.bytes,
  incidencias: issueCounts,
};

console.log(JSON.stringify(summary, null, 2));

const csvPath = flag('--csv');
if (csvPath) {
  mkdirSync(dirname(csvPath), { recursive: true });
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['path', 'tipo', 'bytes', 'title', 'h1', 'canonical', 'robots', 'description', 'og_image', 'jsonld', 'enlaces_internos', 'alcanzable', 'en_sitemap'];
  const rows = pages.map((p) =>
    [
      p.path,
      p.type,
      p.bytes,
      p.title,
      p.h1s.join(' || '),
      p.canonical,
      p.robots,
      p.description,
      p.ogImage,
      flattenTypes(p.jsonLd).map((n) => [].concat(n['@type']).join('+')).join(' '),
      p.links.length,
      reachable.has(p.path) ? 'si' : 'no',
      inSitemap.has(p.path) ? 'si' : 'no',
    ]
      .map(esc)
      .join(',')
  );
  writeFileSync(csvPath, [header.join(','), ...rows].join('\n'));
}
const jsonPath = flag('--json');
if (jsonPath) {
  mkdirSync(dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, JSON.stringify({ summary, unreachableProducts, issues }, null, 2));
}

const blocking = issues.filter((i) => i.severity === 'error');
if (STRICT && blocking.length) {
  console.error(`\n${blocking.length} incidencias bloqueantes. Primeras 15:`);
  blocking.slice(0, 15).forEach((i) => console.error(` - [${i.code}] ${i.path} ${i.detail}`));
  process.exit(1);
}
