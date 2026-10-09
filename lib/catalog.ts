import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

/**
 * Capa de catálogo: todo lo que las rutas muestran o declaran sobre un producto sale de aquí y se
 * deriva solo de los datos existentes (SEO-04, SEO-06, SEO-14). Lo que no está en los datos se
 * omite; nunca se completa con valores supuestos.
 */

type RawProduct = (typeof productsData)[number];
type RawCategory = (typeof categoriesData)[number] & {
  publicada?: boolean;
  h1?: string;
  seoTitle?: string;
  intro?: string[];
};

export interface Spec {
  label: string;
  value: string;
}

export interface CatalogProduct {
  slug: string;
  sku: string;
  nombre: string;
  /** Nombre visible: nombre con tildes y, si el nombre es solo un código del proveedor, el tipo genérico delante. */
  displayName: string;
  tipoKey: string;
  categoriaSlug: string;
  categoriaNombre: string;
  categorias: string[];
  descripcion: string;
  notas: string[];
  specs: Spec[];
  tecnicas: string[];
  imagenUrl: string;
  hasRealImage: boolean;
  metaTitle: string;
  metaDescription: string;
  referenciaProveedor: string;
}

export interface CatalogCategory {
  slug: string;
  name: string;
  description: string;
  h1: string;
  seoTitle: string;
  intro: string[];
  count: number;
}

export const PAGE_SIZE = 24;

// ---------------------------------------------------------------------------------------------
// Normalización de texto

const strip = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Tildes tomadas de la forma acentuada que el propio catálogo usa en sus descripciones. */
const ACCENTS: Record<string, string> = {
  boligrafo: 'bolígrafo',
  boligrafos: 'bolígrafos',
  metalico: 'metálico',
  metalica: 'metálica',
  portatil: 'portátil',
  multifuncion: 'multifunción',
  produccion: 'producción',
  inalambrico: 'inalámbrico',
  lampara: 'lámpara',
  alcancia: 'alcancía',
  maletin: 'maletín',
  plastico: 'plástico',
  plastica: 'plástica',
  ceramica: 'cerámica',
  neon: 'neón',
  audifono: 'audífono',
  audifonos: 'audífonos',
  moviles: 'móviles',
  boton: 'botón',
  camion: 'camión',
  antiestres: 'antiestrés',
  lapiz: 'lápiz',
  triangulo: 'triángulo',
  cafe: 'café',
  carton: 'cartón',
  solido: 'sólido',
  bambu: 'bambú',
  vacio: 'vacío',
  sublimacion: 'sublimación',
  induccion: 'inducción',
  portaboligrafo: 'portabolígrafo',
  portaboligrafos: 'portabolígrafos',
  ecologico: 'ecológico',
  ecologica: 'ecológica',
  domino: 'dominó',
  algodon: 'algodón',
  magnetico: 'magnético',
  magnetica: 'magnética',
  portalapices: 'portalápices',
  cordon: 'cordón',
  camara: 'cámara',
  presion: 'presión',
  neumaticos: 'neumáticos',
  retractil: 'retráctil',
  tajalapiz: 'tajalápiz',
};

/** Conectores que se escriben en minúscula dentro de un nombre. */
const LOWER_WORDS = new Set(['de', 'del', 'en', 'con', 'y', 'para', 'la', 'el', 'a', 'x', 'o']);

/** Siglas y unidades que el proveedor escribe en formato título ("Rpet", "700Ml"). */
const UPPER_TOKENS: Record<string, string> = {
  rpet: 'RPET', petg: 'PETG', pctg: 'PCTG', usb: 'USB', pvc: 'PVC', led: 'LED', lcd: 'LCD', abs: 'ABS', ii: 'II', iii: 'III',
};

function fixAccents(text: string): string {
  return text.replace(/[A-Za-zÁÉÍÓÚáéíóúÑñ]+/g, (word) => {
    const accented = ACCENTS[word.toLowerCase()];
    if (!accented) return word;
    return word[0] === word[0].toUpperCase() ? accented.charAt(0).toUpperCase() + accented.slice(1) : accented;
  });
}

function fixName(rawName: string): string {
  const name = rawName
    .replace(/\s*-\s*Prod(ucci[oó]n)? Nacional\s*$/i, ' (producción nacional)')
    .replace(/[\s-]+$/, '')
    .replace(/(\d)\s?(ml|oz|gr|gb|w)\b/gi, (_, n: string, unit: string) => `${n} ${unit.toLowerCase() === 'gb' ? 'GB' : unit.toLowerCase() === 'w' ? 'W' : unit.toLowerCase()}`);
  return name
    .split(/(\s+)/)
    .map((token, index) => {
      if (/^\s+$/.test(token)) return token;
      const lower = token.toLowerCase();
      if (UPPER_TOKENS[lower]) return UPPER_TOKENS[lower];
      const accented = ACCENTS[lower];
      const word = accented ?? token;
      if (index > 0 && LOWER_WORDS.has(lower)) return lower;
      if (accented) return word.charAt(0).toUpperCase() + word.slice(1);
      return word;
    })
    .join('');
}

/**
 * Primeras palabras que ya describen el tipo de producto. Si el nombre no empieza por una de ellas
 * (p. ej. "Trevon"), se antepone el tipo que declara la descripción del proveedor.
 */
const TYPE_WORDS = new Set(
  (
    'boligrafo set bolsa mini llavero metro botilito libreta speaker estuche cargador mug sticky resaltador juego ' +
    'soporte espejo reloj sporty puerto lapiz cepillo organizador portacomidas destapador memo morral bola mouse cable ' +
    'maletin portatarjetas calendario esterilizador paraguas funda nevera clip identificador banda regla memoria mop ' +
    'linterna herramientero portaboligrafos masajeador pitillo medidor dispensador alcancia antiestres tajalapiz gorra ' +
    'carpeta pila joyero planeador cinta candado bandeja calculadora bolso florero portapapel portanotas audifono ' +
    'audifonos colgador boton globo camion frisbee cubo grip apoya portaminas roller marcador borrador canguro aireador ' +
    'portabotellas cooler hielera molde descorchador mezclador cuello timbre termo portaliquido cafetera taza domino ' +
    'portaretrato portarretrato martillo portadocumentos tabla cuerpo torre portacelular pastillero abanico lazo gafas ' +
    'cordon vaso tangram cubre luz nivelador portaidentificador pvc'
  ).split(' ')
);
const TYPE_ADJECTIVES = new Set(['plastico', 'plastica', 'metalico', 'metalica', 'ecologico', 'ecologica', 'reciclado', 'retractil']);

function firstWords(text: string): string[] {
  return text.split(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9]+/).filter(Boolean);
}

function deriveType(nombre: string, descripcion: string): { prefix: string; key: string } {
  const nameFirst = strip(firstWords(nombre)[0] ?? '');
  if (TYPE_WORDS.has(nameFirst)) return { prefix: '', key: nameFirst };
  const words = firstWords(descripcion);
  const first = strip(words[0] ?? '');
  if (!TYPE_WORDS.has(first) || first === 'set' || first === 'mini') return { prefix: '', key: nameFirst };
  let prefix = ACCENTS[first] ?? words[0].toLowerCase();
  const second = strip(words[1] ?? '');
  // El adjetivo ("metálico") solo se añade si el nombre no lo incluye ya ("Dickens Metálico").
  if (TYPE_ADJECTIVES.has(second) && !strip(nombre).split(/\s+/).includes(second)) {
    prefix += ` ${ACCENTS[second] ?? words[1].toLowerCase()}`;
  }
  return { prefix: prefix.charAt(0).toUpperCase() + prefix.slice(1), key: first };
}

// ---------------------------------------------------------------------------------------------
// Especificaciones a partir de la descripción del proveedor

const TECHNIQUES: Array<[RegExp, string]> = [
  [/tampograf/i, 'Tampografía'],
  [/l[aá]ser/i, 'Láser'],
  [/serigraf/i, 'Serigrafía'],
  [/screen/i, 'Screen'],
  [/bordad/i, 'Bordado'],
  [/sublimaci/i, 'Sublimación'],
  [/full\s*color|impresi[oó]n digital|digital/i, 'Impresión digital'],
  [/transfer/i, 'Transfer'],
];

const NATIONAL_NOTE = /PARA REFERENCIAS DE PRODUCCI[ÓO]N NACIONAL,?\s*CONSULTE CON SU ASESORA LA DISPONIBILIDAD DE INVENTARIO INTERNO\.?/i;

function parseDescription(raw: string) {
  let text = raw.replace(/\s+/g, ' ').trim();
  const notas: string[] = [];
  if (NATIONAL_NOTE.test(text)) {
    text = text.replace(NATIONAL_NOTE, '').trim();
    notas.push('Referencia de producción nacional: la disponibilidad se confirma al cotizar.');
  }

  const specs: Spec[] = [];
  const take = (re: RegExp) => {
    const m = text.match(re);
    if (!m) return undefined;
    text = text.replace(m[0], ' ').replace(/\s+/g, ' ').trim();
    return m[1].trim().replace(/[.\s]+$/, '');
  };

  const minima = take(/(Venta m[ií]nima[^.]*)\.?/i);
  const marca = take(/Marca:\s*(.+?)(?=\s+Venta m[ií]nima|\s+Empaque|$)/i);
  const medidas = take(/Medidas?:\s*(.+?)(?=\s+Marca:|\s+Venta m[ií]nima|\s+Empaque|\.\s|\.$|$)/i);
  const empaque = take(/(Empaque[^.]*)\.?/i);
  const capacidad = raw.match(/(\d+(?:[.,]\d+)?)\s?(ml|oz|gb)\b/i);

  if (medidas) specs.push({ label: 'Medidas', value: medidas });
  if (capacidad) specs.push({ label: 'Capacidad', value: `${capacidad[1]} ${capacidad[2].toLowerCase() === 'gb' ? 'GB' : capacidad[2].toLowerCase()}` });
  if (marca) specs.push({ label: 'Área y técnica de marcación', value: marca });
  if (minima) {
    const value = fixAccents(minima.replace(/^Venta m[ií]nima\s*/i, '').replace(/^(y|de)\s+/i, ''));
    specs.push({ label: 'Venta mínima', value: value ? value.charAt(0).toUpperCase() + value.slice(1) : minima });
  }
  if (empaque) specs.push({ label: 'Empaque', value: empaque.replace(/^Empaque\s*/i, '').replace(/^\w/, (c) => c.toUpperCase()) });

  const tecnicas = marca ? TECHNIQUES.filter(([re]) => re.test(marca)).map(([, label]) => label) : [];
  const descripcion = fixAccents(text.replace(/\s+\./g, '.').replace(/\.(?=[A-ZÁÉÍÓÚ])/g, '. ').trim());
  return { descripcion, specs, tecnicas, notas };
}

export function firstSentence(text: string): string {
  const m = text.match(/^(.+?[.!?])(\s|$)/);
  const sentence = (m ? m[1] : text).trim();
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

/** Descripción con frases completas: se añaden frases opcionales solo mientras quepan (guía ~155). */
function composeDescription(required: string, optional: string[], budget = 158): string {
  let out = required;
  for (const sentence of optional) {
    if (!sentence) continue;
    if ((out + ' ' + sentence).length <= budget) out += ` ${sentence}`;
  }
  return out;
}

// ---------------------------------------------------------------------------------------------

const rawCategories = categoriesData as RawCategory[];
export const publishedCategorySlugs = new Set(rawCategories.filter((c) => c.publicada !== false).map((c) => c.slug));

function enrich(p: RawProduct): CatalogProduct {
  const raw = p as RawProduct & { categorias_secundarias?: string[] };
  const { descripcion, specs, tecnicas, notas } = parseDescription(p.descripcion_corta || '');
  const baseName = fixName(p.nombre);
  const type = deriveType(p.nombre, p.descripcion_corta || '');
  const displayName = type.prefix ? `${type.prefix} ${baseName}` : baseName;
  const hasRealImage = !/placeholder/i.test(p.imagen_url);
  const categorias = [p.categoria_slug, ...(raw.categorias_secundarias ?? [])].filter((s) => publishedCategorySlugs.has(s));

  // Primera frase de la descripción que aporte algo más que el propio nombre.
  const sentences = descripcion.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
  const nameText = strip(displayName);
  const lead = sentences
    .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`))
    .find((s) => !nameText.includes(strip(s).replace(/[.!?]$/, '').trim()) && s.length > 12);
  const metaDescription = composeDescription(`${displayName} para personalizar con el logo de tu empresa.`, [
    lead && lead.length <= 110 ? lead : '',
    tecnicas.length ? `Marcación en ${tecnicas.join(', ').toLowerCase()}.` : '',
    'Cotiza por WhatsApp.',
  ]);

  return {
    slug: p.slug,
    sku: p.sku,
    nombre: p.nombre,
    displayName,
    tipoKey: type.key,
    categoriaSlug: p.categoria_slug,
    categoriaNombre: p.categoria,
    categorias,
    descripcion,
    notas,
    specs,
    tecnicas,
    imagenUrl: p.imagen_url,
    hasRealImage,
    metaTitle: `${displayName} con logo personalizado`,
    metaDescription,
    referenciaProveedor: p.referencia_proveedor,
  };
}

export const products: CatalogProduct[] = productsData.map(enrich);

// Modelos distintos con el mismo nombre comercial: se distinguen por la referencia del proveedor.
const nameCounts = new Map<string, number>();
products.forEach((p) => nameCounts.set(p.displayName, (nameCounts.get(p.displayName) ?? 0) + 1));
for (const p of products) {
  if ((nameCounts.get(p.displayName) ?? 0) > 1) {
    p.displayName = `${p.displayName} (ref. ${p.referenciaProveedor})`;
    p.metaTitle = `${p.displayName} con logo personalizado`;
  }
}
const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string) {
  return productBySlug.get(slug);
}

const membersBySlug = new Map<string, CatalogProduct[]>();
for (const p of products) {
  for (const slug of p.categorias) {
    if (!membersBySlug.has(slug)) membersBySlug.set(slug, []);
    membersBySlug.get(slug)!.push(p);
  }
}

/** Productos de una categoría (primarios y secundarios) en orden estable por SKU. */
export function getCategoryProducts(slug: string): CatalogProduct[] {
  return membersBySlug.get(slug) ?? [];
}

function toCategory(c: RawCategory): CatalogCategory {
  const count = getCategoryProducts(c.slug).length;
  const name = c.name;
  const alreadyPersonalized = /personalizad/i.test(name);
  return {
    slug: c.slug,
    name,
    description: c.description,
    h1: c.h1 ?? (alreadyPersonalized ? name : `${name} personalizables con tu logo`),
    seoTitle: c.seoTitle ?? (alreadyPersonalized ? `${name} con logo` : `${name} personalizables con logo`),
    intro: c.intro ?? [],
    count,
  };
}

/** Solo categorías publicadas con al menos un producto: son las únicas que se generan y enlazan. */
export const categories: CatalogCategory[] = rawCategories
  .filter((c) => c.publicada !== false)
  .map(toCategory)
  .filter((c) => c.count > 0);
const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string) {
  return categoryBySlug.get(slug);
}

// ---------------------------------------------------------------------------------------------
// Paginación (SEO-02): página 1 en la ruta base; páginas 2..n en /pagina/n/.

export function pageCount(total: number) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function paginate<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

export function pagePath(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}pagina/${page}/`;
}

// ---------------------------------------------------------------------------------------------
// Relacionados por atributos compatibles (SEO-18), no por orden de archivo.

const MATERIALS = ['bambu', 'corcho', 'acero', 'algodon', 'rpet', 'trigo', 'madera', 'silicona', 'cuero', 'yute', 'cambrel', 'metal', 'plastic', 'vidrio', 'ceramica', 'tritan'];

function materialsOf(p: CatalogProduct): Set<string> {
  const text = strip(`${p.nombre} ${p.descripcion}`);
  return new Set(MATERIALS.filter((m) => text.includes(m)));
}

export function getRelatedProducts(product: CatalogProduct, limit = 8): CatalogProduct[] {
  const mats = materialsOf(product);
  return products
    .filter((p) => p.slug !== product.slug)
    .map((p) => {
      let score = 0;
      if (p.tipoKey === product.tipoKey) score += 3;
      if (p.categorias.some((c) => product.categorias.includes(c))) score += 2;
      materialsOf(p).forEach((m) => { if (mats.has(m)) score += 1; });
      if (p.hasRealImage) score += 0.5;
      return { p, score };
    })
    .filter((x) => x.score >= 2.5)
    .sort((a, b) => b.score - a.score || a.p.sku.localeCompare(b.p.sku))
    .slice(0, limit)
    .map((x) => x.p);
}

// ---------------------------------------------------------------------------------------------
// Resumen factual de una categoría, calculado desde las fichas (sin texto genérico de relleno).

export function categoryFacts(slug: string) {
  const items = getCategoryProducts(slug);
  const tecnicas = new Map<string, number>();
  const materiales = new Map<string, number>();
  let conMedidas = 0;
  let conMinima = 0;
  for (const p of items) {
    p.tecnicas.forEach((t) => tecnicas.set(t, (tecnicas.get(t) ?? 0) + 1));
    materialsOf(p).forEach((m) => materiales.set(m, (materiales.get(m) ?? 0) + 1));
    if (p.specs.some((s) => s.label === 'Medidas')) conMedidas++;
    if (p.specs.some((s) => s.label === 'Venta mínima')) conMinima++;
  }
  const MATERIAL_LABELS: Record<string, string> = {
    bambu: 'bambú', corcho: 'corcho', acero: 'acero inoxidable', algodon: 'algodón', rpet: 'plástico reciclado RPET',
    trigo: 'fibra de trigo', madera: 'madera', silicona: 'silicona', cuero: 'cuero', yute: 'yute', cambrel: 'cambrel',
    metal: 'metal', plastic: 'plástico', vidrio: 'vidrio', ceramica: 'cerámica', tritan: 'Tritán',
  };
  const sorted = (m: Map<string, number>) => Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  return {
    total: items.length,
    conImagenReal: items.filter((p) => p.hasRealImage).length,
    tecnicas: sorted(tecnicas).map(([t, n]) => ({ label: t, count: n })),
    materiales: sorted(materiales)
      .slice(0, 6)
      .map(([m, n]) => ({ label: MATERIAL_LABELS[m] ?? m, count: n })),
    conMedidas,
    conMinima,
  };
}
