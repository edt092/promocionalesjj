import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import PaginatedProductGrid from '@/components/PaginatedProductGrid';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

export const metadata: Metadata = {
  title: 'Catálogo de Productos Promocionales en Colombia',
  description:
    'Explora nuestro catálogo completo de productos promocionales personalizables con logo para empresas en Colombia. Precio mayorista y envíos a todo el país.',
  alternates: { canonical: '/tienda/' },
};

export default function TiendaPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Tienda' }]} />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">Catálogo de Productos Promocionales</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          {productsData.length} productos personalizables con tu logo, organizados en {categoriesData.length}{' '}
          categorías, con envíos a toda Colombia.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tienda/categoria/${cat.slug}/`}
              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-ink-700 hover:border-brand hover:text-brand transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <PaginatedProductGrid products={productsData} />
        </div>
      </div>
    </div>
  );
}
