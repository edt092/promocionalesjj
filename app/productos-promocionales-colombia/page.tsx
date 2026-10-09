import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { colombia } from '@/data/geo-data';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: colombia.seoTitle,
  description: colombia.seoDescription,
  path: '/productos-promocionales-colombia/',
});

export default function ColombiaPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Colombia' }]} />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">{colombia.h1}</h1>
        <p className="mt-4 max-w-2xl text-slate-600">{colombia.intro}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {colombia.ciudades.map((ciudad) => (
            <Link
              key={ciudad.slug}
              href={`/productos-promocionales-colombia/${ciudad.slug}/`}
              className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-lift"
            >
              <h2 className="text-xl font-semibold text-ink-700 group-hover:text-brand transition-colors">
                {ciudad.nombre}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{ciudad.seoDescription}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-sky-600">
                Ver detalles
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
