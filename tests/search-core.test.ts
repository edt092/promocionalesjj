import { test } from 'node:test';
import assert from 'node:assert/strict';
import { facetCounts, normalize, searchProducts, type SearchDoc } from '../lib/search-core.ts';

const doc = (over: Partial<SearchDoc>): SearchDoc => ({
  slug: 'x', sku: 'JJ-000000', name: '', categories: [], materials: [], techniques: [],
  image: '', hasRealImage: true, categoryName: '', text: '', ...over,
});
const docs: SearchDoc[] = [
  doc({ slug: 'boligrafo-ballpop', sku: 'JJ-000001', name: 'Bolígrafo Ballpop', categories: ['antiestres'], materials: ['silicona'], techniques: ['Tampografía'] }),
  doc({ slug: 'mug-ceramica-ottis-11oz', sku: 'JJ-000300', name: 'Mug Cerámica Ottis 11 oz', categories: ['mugs'], materials: ['ceramica'] }),
  doc({ slug: 'gorra-emergency', sku: 'JJ-000500', name: 'Gorra Emergency', categories: ['reflectivos', 'gorras'], materials: [] }),
  doc({ slug: 'trevon', sku: 'JJ-000018', name: 'Bolígrafo plástico Trevon', categories: ['articulos-escritura'], text: 'Clip metálico' }),
];

test('normaliza tildes y mayúsculas', () => {
  assert.equal(normalize('BOLÍGRAFO  Cerámica'), 'boligrafo ceramica');
});

test('busca por nombre sin tildes', () => {
  assert.deepEqual(searchProducts(docs, 'boligrafo').items.map((d) => d.slug), ['boligrafo-ballpop', 'trevon']);
});

test('busca por SKU completo o por su número', () => {
  assert.equal(searchProducts(docs, 'JJ-000018').items[0].slug, 'trevon');
  assert.equal(searchProducts(docs, '18').items[0].slug, 'trevon');
});

test('sinónimos colombianos: taza→mug, cachucha→gorra, esfero→bolígrafo', () => {
  assert.equal(searchProducts(docs, 'taza').items[0].slug, 'mug-ceramica-ottis-11oz');
  assert.equal(searchProducts(docs, 'cachucha').items[0].slug, 'gorra-emergency');
  assert.equal(searchProducts(docs, 'esferos').total, 2);
});

test('todos los términos deben coincidir', () => {
  assert.deepEqual(searchProducts(docs, 'esfero trevon').items.map((d) => d.slug), ['trevon']);
  assert.equal(searchProducts(docs, 'esfero ceramica').total, 0);
});

test('los filtros usan pertenencia secundaria y se combinan con la consulta', () => {
  assert.equal(searchProducts(docs, '', { category: 'gorras' }).items[0].slug, 'gorra-emergency');
  assert.equal(searchProducts(docs, 'boligrafo', { technique: 'Tampografía' }).total, 1);
  assert.equal(searchProducts(docs, 'mug', { category: 'gorras' }).total, 0);
});

test('consulta vacía sin filtros devuelve todo en orden por SKU', () => {
  assert.deepEqual(searchProducts(docs, '').items.map((d) => d.sku), ['JJ-000001', 'JJ-000018', 'JJ-000300', 'JJ-000500']);
});

test('las facetas solo listan valores existentes con su conteo', () => {
  assert.deepEqual(facetCounts(docs, 'categories').find((f) => f.value === 'gorras'), { value: 'gorras', count: 1 });
  assert.equal(facetCounts(docs, 'techniques').length, 1);
});
