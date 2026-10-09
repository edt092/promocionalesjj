import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductRail from '@/components/ProductRail';
import ProductActions from '@/components/ProductActions';
import { toCardData } from '@/components/ProductCard';
import { getCategory, getProduct, getRelatedProducts, products } from '@/lib/catalog';
import { jsonLdString, pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return pageMetadata({
    title: product.metaTitle,
    description: product.metaDescription,
    path: `/tienda/${product.slug}/`,
    image: product.hasRealImage ? product.imagenUrl : undefined,
    imageAlt: product.displayName,
  });
}

export default function ProductoPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const category = getCategory(product.categoriaSlug);
  const related = getRelatedProducts(product).map(toCardData);
  const url = absoluteUrl(`/tienda/${product.slug}/`);

  // Product semántico sin offers: no hay precio público ni inventario verificable (SEO-04).
  // Sin brand: J&J distribuye, no fabrica, y la marca del fabricante no está en los datos.
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.displayName,
    ...(product.descripcion ? { description: product.descripcion } : {}),
    ...(product.hasRealImage ? { image: absoluteUrl(product.imagenUrl) } : {}),
    sku: product.sku,
    url,
    ...(category ? { category: category.name } : {}),
  };

  const rule = product.quantityRule;
  // La venta mínima se muestra en su propio bloque (H03); el resto de atributos va en la tabla.
  const attributes = product.specs.filter((spec) => spec.label !== 'Venta mínima');

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(productJsonLd) }} />
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Tienda', href: '/tienda/' },
            ...(category ? [{ label: category.name, href: `/tienda/categoria/${category.slug}/` }] : []),
            { label: product.displayName },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="relative aspect-[4/3] sm:aspect-square max-h-[50vh] sm:max-h-none rounded-2xl bg-slate-50 overflow-hidden">
            {product.hasRealImage ? (
              <Image
                src={product.imagenUrl}
                alt={product.displayName}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-contain p-6 sm:p-10"
                priority
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center text-slate-600">
                <span className="text-sm font-semibold">Fotografía no disponible</span>
                <span className="text-xs">Te enviamos imágenes del modelo al cotizar.</span>
              </div>
            )}
          </div>

          <div>
            {category && (
              <Link
                href={`/tienda/categoria/${category.slug}/`}
                className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-wider text-sky-700 hover:text-brand"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-ink-700">{product.displayName}</h1>
            <p className="mt-2 text-sm text-slate-600">Referencia {product.sku}</p>
            {product.descripcion && <p className="mt-4 text-slate-700 leading-relaxed">{product.descripcion}</p>}

            <section aria-labelledby="cantidad-producto" className="mt-6 rounded-2xl border border-slate-200 p-4">
              <h2 id="cantidad-producto" className="text-sm font-semibold text-ink-700">
                Cantidad
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                {rule
                  ? `Pedido en múltiplos de ${rule.multiple} unidades${rule.perColor ? ' por color' : ''} (${rule.multiple}, ${rule.multiple * 2}, ${rule.multiple * 3}…), según la ficha del proveedor.`
                  : 'La ficha no publica una cantidad mínima: te la confirmamos al cotizar.'}
              </p>
            </section>

            <div className="mt-6">
              <ProductActions slug={product.slug} sku={product.sku} name={product.displayName} categorySlug={product.categoriaSlug} />
            </div>

            {attributes.length > 0 && (
              <section aria-labelledby="atributos-producto" className="mt-8">
                <h2 id="atributos-producto" className="text-sm font-semibold text-ink-700">
                  Características
                </h2>
                <dl className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-100 text-sm">
                  {attributes.map((spec) => (
                    <div key={spec.label} className="grid grid-cols-3 gap-4 px-4 py-3">
                      <dt className="text-slate-600">{spec.label}</dt>
                      <dd className="col-span-2 text-ink-700">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section aria-labelledby="condiciones-producto" className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <h2 id="condiciones-producto" className="font-semibold text-ink-700">
                Se confirma al cotizar
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Colores y disponibilidad del modelo.</li>
                <li>Valor por unidad con la marcación de tu logo.</li>
                <li>Técnica y área de marcación definitivas.</li>
                <li>Tiempos de producción y opciones de entrega en tu ciudad.</li>
              </ul>
              {product.notas.map((nota) => (
                <p key={nota} className="mt-2">
                  {nota}
                </p>
              ))}
            </section>
          </div>
        </div>
      </div>

      <ProductRail title="Productos similares" products={related} />
    </div>
  );
}
