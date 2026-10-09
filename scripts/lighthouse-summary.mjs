#!/usr/bin/env node
// Resume las corridas de Lighthouse (mediana por versión y página). Uso: node scripts/lighthouse-summary.mjs docs/seo/lighthouse
import { readdirSync, readFileSync } from 'node:fs';
const dir = process.argv[2] ?? 'docs/seo/lighthouse';
const groups = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const [version, page] = f.replace(/-\d+\.json$/, '').split('-');
  const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
  const a = j.audits;
  (groups[`${page} ${version}`] ??= []).push({
    score: j.categories.performance.score * 100,
    lcp: a['largest-contentful-paint'].numericValue,
    fcp: a['first-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    si: a['speed-index'].numericValue,
    kb: a['total-byte-weight'].numericValue / 1024,
    img: (a['resource-summary']?.details?.items ?? []).find((i) => i.resourceType === 'image')?.transferSize / 1024 || 0,
  });
}
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const rows = Object.entries(groups).sort().map(([k, runs]) => {
  const m = (key) => median(runs.map((r) => r[key]));
  return { 'página versión': k, corridas: runs.length, score: Math.round(m('score')), 'LCP s': (m('lcp') / 1000).toFixed(2), 'FCP s': (m('fcp') / 1000).toFixed(2), 'TBT ms': Math.round(m('tbt')), CLS: m('cls').toFixed(3), 'SI s': (m('si') / 1000).toFixed(2), 'peso KB': Math.round(m('kb')), 'imágenes KB': Math.round(m('img')) };
});
console.table(rows);
if (process.argv.includes('--md')) {
  const cols = Object.keys(rows[0]);
  console.log(`| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|\n${rows.map((r) => `| ${cols.map((c) => r[c]).join(' | ')} |`).join('\n')}`);
}
