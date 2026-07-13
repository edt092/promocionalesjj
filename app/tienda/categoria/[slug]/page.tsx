import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import PaginatedProductGrid from '@/components/PaginatedProductGrid';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

export function generateStaticParams() {
  return categoriesData.map((cat) => ({ slug: cat.slug }));
}

function getCategory(slug: string) {
  return categoriesData.find((c) => c.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} Personalizados con Logo`,
    description: `${category.description} Personalización con tu logo y precio mayorista, con envíos a toda Colombia.`,
    alternates: { canonical: `/tienda/categoria/${category.slug}/` },
  };
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const products = productsData.filter((p) => p.categoria_slug === category.slug);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs
          items={[{ label: 'Inicio', href: '/' }, { label: 'Tienda', href: '/tienda/' }, { label: category.name }]}
        />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">{category.name} Personalizados</h1>
        <p className="mt-3 max-w-2xl text-slate-500">{category.description}</p>

        {products.length > 0 ? (
          <div className="mt-10">
            <PaginatedProductGrid products={products} />
          </div>
        ) : (
          <p className="mt-10 text-slate-500">
            Estamos ampliando el catálogo de esta categoría. Escríbenos por WhatsApp y te cotizamos opciones
            disponibles de inmediato.
          </p>
        )}
      </div>
    </div>
  );
}
