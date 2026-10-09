import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import QuoteSteps from '@/components/QuoteSteps';
import { colombia } from '@/data/geo-data';
import { getCategory } from '@/lib/catalog';
import { whatsappHref } from '@/lib/contact';
import { jsonLdString, pageMetadata } from '@/lib/seo';
import { ORGANIZATION_ID, absoluteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return colombia.ciudades.map((c) => ({ ciudad: c.slug }));
}

function getCiudad(slug: string) {
  return colombia.ciudades.find((c) => c.slug === slug);
}

export function generateMetadata({ params }: { params: { ciudad: string } }): Metadata {
  const ciudad = getCiudad(params.ciudad);
  if (!ciudad) return {};
  return pageMetadata({
    title: ciudad.seoTitle,
    description: ciudad.seoDescription,
    path: `/productos-promocionales-colombia/${ciudad.slug}/`,
  });
}

export default function CiudadPage({ params }: { params: { ciudad: string } }) {
  const ciudad = getCiudad(params.ciudad);
  if (!ciudad) notFound();

  const path = `/productos-promocionales-colombia/${ciudad.slug}/`;
  const destacadas = ciudad.categoriasDestacadas
    .map((slug) => getCategory(slug))
    .filter((c): c is NonNullable<ReturnType<typeof getCategory>> => Boolean(c));

  // Cobertura de servicio, no una sucursal: J&J no tiene sede acreditada en cada ciudad (SEO-08).
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: ciudad.h1,
    serviceType: 'Productos promocionales y merchandising personalizado con logo',
    url: absoluteUrl(path),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'City', name: ciudad.nombre, containedInPlace: { '@type': 'Country', name: 'Colombia' } },
  };

  return (
    <div className="pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(serviceJsonLd) }} />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Colombia', href: '/productos-promocionales-colombia/' },
            { label: ciudad.nombre },
          ]}
        />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">{ciudad.h1}</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">{ciudad.intro}</p>
        <a
          href={whatsappHref(`Hola, quiero cotizar productos promocionales con el logo de mi empresa para entregar en ${ciudad.nombre}.`)}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="ciudad"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-danger px-7 text-sm font-semibold text-white hover:bg-danger-600 transition-colors"
        >
          Cotizar para {ciudad.nombre}
        </a>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ciudad.caracteristicas.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-ink-700">
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-danger" />
              {item}
            </li>
          ))}
        </ul>

        {ciudad.secciones?.map((seccion) => (
          <section key={seccion.titulo} className="mt-12">
            <h2 className="text-2xl font-bold text-ink-700">{seccion.titulo}</h2>
            {seccion.parrafos.map((parrafo) => (
              <p key={parrafo.slice(0, 40)} className="mt-4 text-slate-600 leading-relaxed">
                {parrafo}
              </p>
            ))}
          </section>
        ))}

        {destacadas.length > 0 && (
          <section className="mt-12" aria-labelledby="categorias-ciudad">
            <h2 id="categorias-ciudad" className="text-2xl font-bold text-ink-700">
              Productos para empresas en {ciudad.nombre}
            </h2>
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destacadas.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tienda/categoria/${cat.slug}/`}
                    className="flex min-h-11 items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm font-medium text-ink-700 hover:border-brand hover:text-brand transition-colors"
                  >
                    {cat.name}
                    <span className="text-xs text-slate-500">{cat.count} modelos</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/tienda/" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand hover:text-brand-600">
              Ver el catálogo completo →
            </Link>
          </section>
        )}

        <div className="mt-12">
          <QuoteSteps heading={`Cómo cotizar productos promocionales en ${ciudad.nombre}`} />
        </div>
      </div>

      <div className="mt-14">
        <CTABanner />
      </div>
    </div>
  );
}
