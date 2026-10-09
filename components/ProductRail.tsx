import ProductCard, { ProductCardData } from './ProductCard';
import ScrollRevealGroup from './ScrollRevealGroup';

const TRUST_SIGNALS = ['Personalización con tu logo', 'Cotización por volumen', 'Envíos a toda Colombia'];

/**
 * "Carrusel/rail de producto con señales de confianza" — patrón del blueprint
 * informe_promodirect_frontend_seo.md, reutilizado en Home, categoría y producto (relacionados).
 */
export default function ProductRail({
  title,
  products,
  id,
}: {
  title: string;
  products: ProductCardData[];
  id?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-700">{title}</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
            {TRUST_SIGNALS.map((signal) => (
              <li key={signal} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
        <ScrollRevealGroup
          itemSelector=":scope > div"
          stagger={0.06}
          className="-mx-5 sm:mx-0 flex gap-4 overflow-x-auto px-5 sm:px-0 pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:overflow-visible"
        >
          {products.map((product) => (
            <div key={product.slug} className="w-56 flex-shrink-0 sm:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
