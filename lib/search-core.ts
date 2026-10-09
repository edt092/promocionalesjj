/**
 * Búsqueda del catálogo (H02). Módulo puro: recibe el índice ya cargado y devuelve coincidencias.
 * Probado en tests/search-core.test.ts.
 */

export interface SearchDoc {
  slug: string;
  sku: string;
  name: string;
  /** Categorías (slug) a las que pertenece: primaria y secundarias. */
  categories: string[];
  materials: string[];
  techniques: string[];
  image: string;
  hasRealImage: boolean;
  categoryName: string;
  /** Texto adicional indexable (descripción del proveedor, referencia). */
  text: string;
  quantityNote?: string;
}

export interface SearchFilters {
  category?: string;
  material?: string;
  technique?: string;
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sinónimos usados en Colombia. Cada grupo se trata como equivalente para buscar; solo se incluyen
 * términos que corresponden a productos reales del catálogo.
 */
const SYNONYM_GROUPS = [
  ['mug', 'mugs', 'taza', 'tazas', 'pocillo', 'pocillos'],
  ['gorra', 'gorras', 'cachucha', 'cachuchas'],
  ['boligrafo', 'boligrafos', 'esfero', 'esferos', 'lapicero', 'lapiceros', 'pluma'],
  ['botilito', 'botilitos', 'tomatodo', 'tomatodos', 'botella', 'botellas', 'termo-agua'],
  ['termo', 'termos'],
  ['paraguas', 'sombrilla', 'sombrillas'],
  ['bolsa', 'bolsas', 'tula', 'tulas', 'bolso', 'bolsos', 'tote'],
  ['libreta', 'libretas', 'cuaderno', 'cuadernos', 'agenda', 'agendas', 'planeador'],
  ['memoria', 'memorias', 'usb'],
  ['speaker', 'speakers', 'parlante', 'parlantes', 'bafle', 'altavoz'],
  ['audifono', 'audifonos', 'auricular', 'auriculares'],
  ['cargador', 'cargadores', 'powerbank', 'bateria'],
  ['llavero', 'llaveros'],
  ['vaso', 'vasos'],
  ['reloj', 'relojes'],
  ['antiestres', 'estres', 'pelota'],
];

const SYNONYMS = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) for (const word of group) SYNONYMS.set(word, group);

/** Cada término de la consulta se expande a su grupo de sinónimos (si tiene uno). */
export function expandQuery(query: string): string[][] {
  return normalize(query)
    .split(' ')
    .filter((t) => t.length > 0)
    .map((term) => SYNONYMS.get(term) ?? [term]);
}

function haystack(doc: SearchDoc): string {
  return normalize(`${doc.name} ${doc.sku} ${doc.sku.replace(/^jj-0*/i, '')} ${doc.categoryName} ${doc.text}`);
}

const cache = new WeakMap<SearchDoc, string>();

export interface SearchResult {
  items: SearchDoc[];
  total: number;
}

/**
 * Todos los términos deben coincidir (Y), cada uno con cualquiera de sus sinónimos (O). Se puntúa más
 * alto la coincidencia en el nombre y la referencia exacta, y se conserva el orden por SKU al empatar.
 */
export function searchProducts(docs: SearchDoc[], query: string, filters: SearchFilters = {}): SearchResult {
  const groups = expandQuery(query);
  const scored: Array<{ doc: SearchDoc; score: number }> = [];
  for (const doc of docs) {
    if (filters.category && !doc.categories.includes(filters.category)) continue;
    if (filters.material && !doc.materials.includes(filters.material)) continue;
    if (filters.technique && !doc.techniques.includes(filters.technique)) continue;
    let text = cache.get(doc);
    if (!text) {
      text = haystack(doc);
      cache.set(doc, text);
    }
    let score = 0;
    let matchesAll = true;
    const name = normalize(doc.name);
    for (const group of groups) {
      const hit = group.find((term) => text!.includes(term));
      if (!hit) {
        matchesAll = false;
        break;
      }
      score += name.includes(hit) ? 3 : 1;
      if (normalize(doc.sku) === hit) score += 10;
    }
    if (matchesAll) scored.push({ doc, score });
  }
  scored.sort((a, b) => b.score - a.score || a.doc.sku.localeCompare(b.doc.sku));
  return { items: scored.map((s) => s.doc), total: scored.length };
}

/** Opciones de filtro con su conteo dentro de un conjunto: solo se muestran valores que existen. */
export function facetCounts(docs: SearchDoc[], key: 'categories' | 'materials' | 'techniques'): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  for (const doc of docs) for (const value of doc[key]) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}
