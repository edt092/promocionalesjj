'use client';

import { useState } from 'react';
import ProductCard, { ProductCardData } from './ProductCard';

const PAGE_SIZE = 24;

/**
 * El catálogo real (scraped) puede traer cientos de productos por categoría. Para no enviar
 * un HTML gigante ni una lista infinita sin control, se renderiza el primer lote en el
 * servidor (SEO: los primeros PAGE_SIZE productos son crawleables sin JS) y el resto se revela
 * client-side con "Ver más" sin peticiones de red adicionales (el array completo ya viene en
 * el bundle de la página).
 */
export default function PaginatedProductGrid({ products }: { products: ProductCardData[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {shown.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full border border-slate-200 text-sm font-semibold text-ink-700 hover:border-brand hover:text-brand transition-colors"
          >
            Ver más productos ({products.length - visible} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
