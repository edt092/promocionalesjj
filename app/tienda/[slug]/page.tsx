import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductRail from '@/components/ProductRail';
import MagneticButton from '@/components/MagneticButton';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import { whatsappHref } from '@/lib/contact';

const SITE_URL = 'https://promocionalesjj.co';

export function generateStaticParams() {
  return productsData.map((p) => ({ slug: p.slug }));
}

function getProduct(slug: string) {
  return productsData.find((p) => p.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.seo_title || product.nombre,
    description: product.seo_description,
    alternates: { canonical: `/tienda/${product.slug}/` },
    openGraph: {
      title: product.seo_title || product.nombre,
      description: product.seo_description,
      images: [{ url: product.imagen_url }],
    },
  };
}

export default function ProductoPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const category = categoriesData.find((c) => c.slug === product.categoria_slug);
  const related = productsData.filter((p) => p.categoria_slug === product.categoria_slug && p.slug !== product.slug).slice(0, 4);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion_corta,
    image: `${SITE_URL}${product.imagen_url}`,
    sku: product.sku,
    category: product.categoria,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      areaServed: 'CO',
      url: `${SITE_URL}/tienda/${product.slug}/`,
    },
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Tienda', href: '/tienda/' },
            ...(category ? [{ label: category.name, href: `/tienda/categoria/${category.slug}/` }] : []),
            { label: product.nombre },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden">
            <Image src={product.imagen_url} alt={product.nombre} fill className="object-contain p-10" unoptimized priority />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">{product.categoria}</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-ink-700">{product.nombre}</h1>
            <p className="mt-4 text-slate-500 leading-relaxed">{product.descripcion_corta}</p>
            <p className="mt-4 text-sm text-slate-400">SKU: {product.sku}</p>

            <div className="mt-8">
              <MagneticButton>
                <a
                  href={whatsappHref(
                    `Hola, quiero cotizar ${product.nombre} personalizado con el logo de mi empresa para Colombia.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-danger hover:bg-danger-600 text-white font-semibold transition-colors duration-200 shadow-danger-glow"
                >
                  Cotizar este producto
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <ProductRail title="Productos relacionados" products={related} />
    </div>
  );
}
