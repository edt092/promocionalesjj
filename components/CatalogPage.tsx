import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryLinks from '@/components/CategoryLinks';
import Pagination from '@/components/Pagination';
import ProductGrid from '@/components/ProductGrid';
import { toCardData } from '@/components/ProductCard';
import { categories, pageCount, paginate, products, PAGE_SIZE } from '@/lib/catalog';

export const tiendaTotalPages = pageCount(products.length);

/** Listado completo del catálogo, página `page` (1 = /tienda/). */
export default function CatalogPage({ page }: { page: number }) {
  const items = paginate(products, page).map(toCardData);
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = first + items.length - 1;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs
          items={
            page === 1
              ? [{ label: 'Inicio', href: '/' }, { label: 'Tienda' }]
              : [{ label: 'Inicio', href: '/' }, { label: 'Tienda', href: '/tienda/' }, { label: `Página ${page}` }]
          }
        />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">
          Catálogo de productos promocionales{page > 1 ? ` — página ${page}` : ''}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {products.length} productos personalizables con tu logo, organizados en {categories.length} categorías.
          {page > 1 && ` Mostrando del ${first} al ${last}.`}
        </p>

        {page === 1 && (
          <div className="mt-8">
            <CategoryLinks />
          </div>
        )}

        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
        <Pagination basePath="/tienda/" page={page} total={tiendaTotalPages} />
      </div>
    </div>
  );
}
