#!/usr/bin/env node
/**
 * SEO-03 / SEO-15: aplica la reclasificación del catálogo con reglas explícitas y revisables.
 *
 * - Categoría primaria (`categoria_slug`): solo se cambia cuando el producto está en una categoría
 *   comodín (variedades) o claramente equivocada (botilitos en mugs, portavasos en vasos). La URL
 *   del producto no cambia; solo la miga de pan.
 * - Categorías secundarias (`categorias_secundarias`): pertenencia múltiple sin duplicar URLs.
 * - Categorías retiradas (`publicada: false`): no se generan ni se enlazan.
 *
 * Las reglas usan el prefijo del slug (tipo de producto que el proveedor pone primero en el nombre),
 * nunca coincidencias sueltas dentro de la descripción. Es idempotente: se puede volver a ejecutar.
 * Uso: node scripts/taxonomy-apply.mjs [--dry]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry');
const productsPath = new URL('../data/products.json', import.meta.url);
const categoriesPath = new URL('../data/categories.json', import.meta.url);
// Cada archivo conserva su formato original (fin de línea y salto final) para que el diff muestre solo cambios reales.
const readJson = (path) => {
  const raw = readFileSync(path, 'utf8');
  const CRLF = String.fromCharCode(13, 10);
  return { data: JSON.parse(raw), eol: raw.includes(CRLF) ? CRLF : '\n', trailing: raw.endsWith('\n') };
};
const writeJson = (path, file) => {
  const text = JSON.stringify(file.data, null, 2).split('\n').join(file.eol);
  writeFileSync(path, file.trailing ? text + file.eol : text);
};
const productsFile = readJson(productsPath);
const categoriesFile = readJson(categoriesPath);
const products = productsFile.data;
const categories = categoriesFile.data;

// Nuevas categorías creadas al dividir "Variedades" por tipo de producto.
const NEW_CATEGORIES = [
  {
    id: 'bolsas',
    slug: 'bolsas',
    name: 'Bolsas',
    description: 'Bolsas y tulas personalizadas con tu logo en algodón, cambrel, yute y materiales reciclados.',
    providerUrl: null,
    keywords: ['bolsas personalizadas', 'bolsas ecológicas con logo', 'tulas personalizadas'],
  },
  {
    id: 'libretas',
    slug: 'libretas',
    name: 'Libretas',
    description: 'Libretas, cuadernos y planeadores personalizables con el logo de tu empresa.',
    providerUrl: null,
    keywords: ['libretas personalizadas', 'cuadernos con logo', 'libretas ecológicas'],
  },
];

// Reglas de categoría primaria: [slug destino, regex sobre slug del producto, categorías origen permitidas].
const PRIMARY_RULES = [
  ['tomatodos-y-botilitos-personalizados', /^botilito-/, ['mugs', 'variedades']],
  ['memorias-usb', /^(memoria-usb-|pvc-memoria-usb-)/, ['variedades']],
  ['tecnologia', /^(cargador-|speaker-|puerto-usb-|mouse-inalambrico-|mouse-bamboo$|cable-multicargador-|audifonos?-)/, ['variedades']],
  ['relojes', /^reloj-(?!de-arena)/, ['variedades']],
  ['juegos', /^(juego-|set-de-juegos?-|domino-|torre-de-madera-|set-de-cartas-)/, ['variedades']],
  ['paraguas', /^paraguas-/, ['variedades']],
  ['bolsas', /^(bolsa-|mini-bolsa-|sporty-bag-)/, ['variedades']],
  ['libretas', /^(libreta-|planeador-|cuaderno-)/, ['variedades']],
  // Portavasos no son vasos: se mueven a Hogar para no mezclar intenciones.
  ['hogar', /^(set-portavasos-|set-de-portavasos-)/, ['vasos-personalizados']],
  // "Taza en vidrio" se describe como vaso de borosilicato en la ficha del proveedor.
  ['vasos-personalizados', /^taza-en-vidrio-/, ['variedades']],
];

// Reglas de pertenencia secundaria: el producto conserva su primaria y además aparece aquí.
const SECONDARY_RULES = [
  ['tomatodos-y-botilitos-personalizados', /^botilito-/],
  ['memorias-usb', /^(memoria-usb-|pvc-memoria-usb-)/],
  ['tecnologia', /^(cargador-|speaker-|puerto-usb-|mouse-inalambrico-|mouse-bamboo$|cable-multicargador-|audifonos?-|memoria-usb-|pvc-memoria-usb-)/],
  ['relojes', /^reloj-(?!de-arena)/],
  ['paraguas', /^paraguas-/],
  ['gorras', /^gorra-/],
  ['bolsas', /^(bolsa-|mini-bolsa-|sporty-bag-)/],
  ['produccion-nacional', /(produccion-nacional|prod-nacional)$/],
];

// Categorías sin oferta verificable en los datos actuales (ver docs/seo/decisiones-categorias.md).
const RETIRED = ['confeccion', 'deportes', 'econature', 'medicos', 'productos-2023'];

const log = [];
const catBySlug = new Map(categories.map((c) => [c.slug, c]));
for (const nc of NEW_CATEGORIES) {
  if (!catBySlug.has(nc.slug)) {
    // Se insertan antes de "variedades" para que el listado mantenga un orden lógico.
    const idx = categories.findIndex((c) => c.slug === 'variedades');
    categories.splice(idx, 0, { ...nc, publicada: true });
    catBySlug.set(nc.slug, nc);
    log.push(`+ categoría nueva: ${nc.slug}`);
  }
}
for (const c of categories) c.publicada = !RETIRED.includes(c.slug);

for (const p of products) {
  for (const [target, re, from] of PRIMARY_RULES) {
    if (re.test(p.slug) && from.includes(p.categoria_slug) && p.categoria_slug !== target) {
      log.push(`primaria  ${p.slug}: ${p.categoria_slug} -> ${target}`);
      p.categoria_slug = target;
      p.categoria = catBySlug.get(target).name;
      break;
    }
  }
  const secondary = new Set(p.categorias_secundarias || []);
  for (const [target, re] of SECONDARY_RULES) {
    if (re.test(p.slug) && p.categoria_slug !== target && !secondary.has(target)) {
      secondary.add(target);
      log.push(`secundaria ${p.slug}: + ${target}`);
    }
  }
  secondary.delete(p.categoria_slug);
  p.categorias_secundarias = [...secondary];
}

const counts = {};
for (const p of products) {
  for (const s of [p.categoria_slug, ...p.categorias_secundarias]) counts[s] = (counts[s] || 0) + 1;
}
console.log(log.join('\n') || '(sin cambios: ya aplicado)');
console.log('\nProductos por categoría (primaria + secundaria):');
for (const c of categories) console.log(`  ${c.publicada ? ' ' : 'x'} ${c.slug.padEnd(40)} ${counts[c.slug] || 0}`);

if (!DRY) {
  writeJson(productsPath, productsFile);
  writeJson(categoriesPath, categoriesFile);
}
