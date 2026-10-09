import Link from 'next/link';
import { categories } from '@/lib/catalog';
import ScrollRevealGroup from './ScrollRevealGroup';
import TiltCard from './TiltCard';

const FEATURED_SLUGS = [
  'articulos-escritura',
  'tecnologia',
  'bolsas',
  'tomatodos-y-botilitos-personalizados',
  'mugs',
  'libretas',
  'llaveros',
  'herramientas',
  'bar-y-vino',
  'juegos',
  'relojes',
  'paraguas',
];

/**
 * Grid de categorías con stagger-reveal (prompt.md secc. 3B: "The Eye Path & Content Grid").
 * Enlaza a URLs indexables /tienda/categoria/[slug]/ — patrón de taxonomía estable del
 * blueprint informe_promodirect_frontend_seo.md.
 */
export default function CategoryGrid() {
  const featured = FEATURED_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is (typeof categories)[number] => Boolean(c)
  );

  return (
    <section id="categorias" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-2">Catálogo</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-700">Explora por categoría</h2>
          <p className="mt-3 text-slate-500">
            {categories.length} categorías de artículos promocionales personalizables con tu logo para
            empresas en Colombia.
          </p>
        </div>
        <ScrollRevealGroup
          itemSelector=":scope > div"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {featured.map((cat) => (
            <TiltCard key={cat.slug}>
              <Link
                href={`/tienda/categoria/${cat.slug}/`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-shadow duration-300 hover:shadow-lift hover:border-sky-200"
              >
                <span className="text-base font-semibold text-ink-700 group-hover:text-brand transition-colors">
                  {cat.name}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-sky-700">
                  {cat.count} productos
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </TiltCard>
          ))}
        </ScrollRevealGroup>
        <div className="mt-8 text-center">
          <Link href="/tienda/" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand hover:text-brand-600 transition-colors">
            Ver todas las categorías →
          </Link>
        </div>
      </div>
    </section>
  );
}
