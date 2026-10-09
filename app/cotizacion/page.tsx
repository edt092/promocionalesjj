import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuoteBuilder from '@/components/QuoteBuilder';
import { products } from '@/lib/catalog';
import type { QuantityRule } from '@/lib/quote-rules';
import { pageMetadata } from '@/lib/seo';

// Página de herramienta (contenido por usuario): no se indexa ni se incluye en el sitemap.
export const metadata: Metadata = pageMetadata({
  title: 'Preparar cotización',
  description: 'Prepara tu cotización de productos promocionales: cantidades, ciudad, fecha y personalización, y envíala por WhatsApp.',
  path: '/cotizacion/',
  noindex: true,
});

// Solo se envían al cliente las reglas que existen (84 productos), no el catálogo completo.
const rules: Record<string, QuantityRule> = Object.fromEntries(
  products.filter((p) => p.quantityRule).map((p) => [p.slug, p.quantityRule as QuantityRule])
);

export default function CotizacionPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Tienda', href: '/tienda/' }, { label: 'Preparar cotización' }]} />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">Preparar cotización</h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Reúne los productos, cantidades y datos de entrega en un solo mensaje. Disponibilidad, valor y fechas se confirman en la
          respuesta de nuestro equipo.
        </p>
        <div className="mt-10">
          <QuoteBuilder rules={rules} />
        </div>
      </div>
    </div>
  );
}
