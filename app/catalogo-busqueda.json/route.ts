import { categories, products } from '@/lib/catalog';
import type { SearchDoc } from '@/lib/search-core';
import { quantityNote } from '@/lib/quote-rules';

// Archivo estático generado en el build (output: 'export'). El buscador lo descarga solo al usarse.
export const dynamic = 'force-static';

export function GET() {
  const docs: SearchDoc[] = products.map((p) => ({
    slug: p.slug,
    sku: p.sku,
    name: p.displayName,
    categories: p.categorias,
    materials: p.materiales,
    techniques: p.tecnicas,
    image: p.imagenUrl,
    hasRealImage: p.hasRealImage,
    categoryName: p.categoriaNombre,
    text: `${p.descripcion} ${p.referenciaProveedor}`,
    quantityNote: quantityNote(p.quantityRule),
  }));
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  return Response.json({ generated: new Date().toISOString().slice(0, 10), categoryNames, docs });
}
