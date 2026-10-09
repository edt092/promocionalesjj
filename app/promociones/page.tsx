import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import ProductRail from '@/components/ProductRail';
import { toCardData } from '@/components/ProductCard';
import { getCategory, getCategoryProducts } from '@/lib/catalog';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Promociones de productos promocionales',
  description:
    'Productos promocionales en promoción para personalizar con el logo de tu empresa en Colombia. Consulta condiciones vigentes por WhatsApp.',
  path: '/promociones/',
});

export default function PromocionesPage() {
  const precioBomba = getCategory('precio-bomba');
  const ofertas = getCategoryProducts('precio-bomba').map(toCardData);

  return (
    <div className="pt-24 pb-4">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Promociones' }]} />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">Promociones en productos promocionales</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {ofertas.length > 0
            ? 'Referencias marcadas por el proveedor como precio especial. Las condiciones y la vigencia se confirman en cada cotización.'
            : 'En este momento no hay referencias en promoción publicadas. Escríbenos y te contamos qué condiciones especiales aplican a tu pedido.'}
        </p>
      </div>

      {precioBomba && <ProductRail title="Referencias en promoción" products={ofertas} />}
      <CTABanner />
    </div>
  );
}
