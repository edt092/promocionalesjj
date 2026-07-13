import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import ProductRail from '@/components/ProductRail';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

export const metadata: Metadata = {
  title: 'Promociones de Productos Promocionales',
  description:
    'Ofertas y precios especiales en productos promocionales personalizados con logo para empresas en Colombia.',
  alternates: { canonical: '/promociones/' },
};

export default function PromocionesPage() {
  const ofertas = productsData.filter((p) => p.categoria_slug === 'precio-bomba');
  const destacadas = ofertas.length > 0 ? ofertas : productsData.slice(0, 4);
  const precioBomba = categoriesData.find((c) => c.slug === 'precio-bomba');

  return (
    <div className="pt-24 pb-4">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Promociones' }]} />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">Promociones</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          {precioBomba?.description ??
            'Productos promocionales con precio especial para pedidos corporativos en Colombia.'}
        </p>
      </div>

      <ProductRail title="Ofertas activas" products={destacadas} />
      <CTABanner />
    </div>
  );
}
