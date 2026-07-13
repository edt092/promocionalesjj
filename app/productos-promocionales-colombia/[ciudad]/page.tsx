import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import { colombia } from '@/data/geo-data';

const SITE_URL = 'https://promocionalesjj.co';

export function generateStaticParams() {
  return colombia.ciudades.map((c) => ({ ciudad: c.slug }));
}

function getCiudad(slug: string) {
  return colombia.ciudades.find((c) => c.slug === slug);
}

export function generateMetadata({ params }: { params: { ciudad: string } }): Metadata {
  const ciudad = getCiudad(params.ciudad);
  if (!ciudad) return {};
  return {
    title: ciudad.seoTitle,
    description: ciudad.seoDescription,
    alternates: { canonical: `/productos-promocionales-colombia/${ciudad.slug}/` },
  };
}

export default function CiudadPage({ params }: { params: { ciudad: string } }) {
  const ciudad = getCiudad(params.ciudad);
  if (!ciudad) notFound();

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Promocionales J&J — ${ciudad.nombre}`,
    url: `${SITE_URL}/productos-promocionales-colombia/${ciudad.slug}/`,
    areaServed: {
      '@type': 'City',
      name: ciudad.nombre,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: ciudad.nombre,
      addressCountry: 'CO',
    },
  };

  return (
    <div className="pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Colombia', href: '/productos-promocionales-colombia/' },
            { label: ciudad.nombre },
          ]}
        />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">{ciudad.h1}</h1>
        <p className="mt-4 text-slate-500 leading-relaxed">{ciudad.intro}</p>

        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ciudad.caracteristicas.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-ink-700">
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-danger" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14">
        <CTABanner />
      </div>
    </div>
  );
}
