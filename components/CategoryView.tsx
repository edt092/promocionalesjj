import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryLinks from '@/components/CategoryLinks';
import Pagination from '@/components/Pagination';
import ProductGrid from '@/components/ProductGrid';
import { toCardData } from '@/components/ProductCard';
import { CatalogCategory, categoryFacts, getCategoryProducts, pageCount, paginate, PAGE_SIZE } from '@/lib/catalog';
import { whatsappHref } from '@/lib/contact';

export function categoryTotalPages(slug: string) {
  return pageCount(getCategoryProducts(slug).length);
}

/** Página de categoría. El contenido editorial y el resumen solo aparecen en la página 1. */
export default function CategoryView({ category, page }: { category: CatalogCategory; page: number }) {
  const all = getCategoryProducts(category.slug);
  const items = paginate(all, page).map(toCardData);
  const total = pageCount(all.length);
  const basePath = `/tienda/categoria/${category.slug}/`;
  const facts = page === 1 ? categoryFacts(category.slug) : null;
  const first = (page - 1) * PAGE_SIZE + 1;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Tienda', href: '/tienda/' },
            ...(page === 1 ? [{ label: category.name }] : [{ label: category.name, href: basePath }, { label: `Página ${page}` }]),
          ]}
        />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">
          {category.h1}
          {page > 1 ? ` — página ${page}` : ''}
        </h1>

        {page === 1 ? (
          <div className="mt-4 max-w-3xl space-y-3 text-slate-600 leading-relaxed">
            <p>{category.description}</p>
            {category.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-slate-600">
            Mostrando del {first} al {first + items.length - 1} de {all.length} productos.
          </p>
        )}

        {facts && (
          <section aria-labelledby="resumen-categoria" className="mt-8 rounded-2xl bg-slate-50 p-6 max-w-3xl">
            <h2 id="resumen-categoria" className="text-lg font-semibold text-ink-700">
              En esta categoría
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>
                {facts.total} {facts.total === 1 ? 'modelo disponible' : 'modelos disponibles'} para cotizar con tu logo.
              </li>
              {facts.materiales.length > 0 && (
                <li>Materiales presentes en las fichas: {facts.materiales.map((m) => m.label).join(', ')}.</li>
              )}
              {facts.tecnicas.length > 0 && (
                <li>
                  Técnicas de marcación indicadas: {facts.tecnicas.map((t) => `${t.label.toLowerCase()} (${t.count})`).join(', ')}.
                </li>
              )}
              {facts.conMinima > 0 && <li>{facts.conMinima} fichas indican la venta mínima del modelo.</li>}
              <li>
                Para modelos sin medidas o técnica publicadas, confirmamos esos datos en la cotización.
              </li>
            </ul>
            <a
              href={whatsappHref(`Hola, quiero cotizar productos de la categoría ${category.name} con el logo de mi empresa.`)}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="categoria"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-danger-600 px-6 text-sm font-semibold text-white hover:bg-danger-600 transition-colors"
            >
              Cotizar {category.name.toLowerCase()} por WhatsApp
            </a>
          </section>
        )}

        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
        <Pagination basePath={basePath} page={page} total={total} />

        <div className="mt-16 border-t border-slate-100 pt-10">
          <CategoryLinks current={category.slug} title="Otras categorías" />
        </div>
      </div>
    </div>
  );
}
