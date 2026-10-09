import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, ORGANIZATION_ID, SITE_NAME, SITE_URL, WEBSITE_ID, absoluteUrl, normalizePath } from './site';
import { WHATSAPP_E164 } from './contact';

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Imagen real de la página (ruta local o URL). Sin imagen se usa la imagen social de marca. */
  image?: string;
  imageAlt?: string;
  /** El inicio usa título absoluto; el resto recibe el sufijo de marca de la plantilla del layout. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: 'website' | 'article';
}

/**
 * Metadata por ruta (SEO-06/07): canonical propio, og:url y Twitter coherentes con la misma URL.
 * Ninguna página hereda la canónica u og:url del layout.
 */
export function pageMetadata({ title, description, path, image, imageAlt, absoluteTitle, noindex, type = 'website' }: PageMetadataInput): Metadata {
  const url = absoluteUrl(normalizePath(path));
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);
  const isDefaultImage = !image;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      locale: 'es_CO',
      images: [
        isDefaultImage
          ? { url: ogImage, width: 1200, height: 630, alt: SITE_NAME }
          : { url: ogImage, alt: imageAlt ?? title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

/** Organization + WebSite enlazados por @id estable (SEO-08). Solo datos verificados en el sitio. */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/promocionalesjj_icon.png'),
          width: 497,
          height: 358,
        },
        description:
          'Proveedor de productos promocionales y merchandising corporativo personalizado con logo para empresas en Colombia.',
        areaServed: { '@type': 'Country', name: 'Colombia' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: WHATSAPP_E164,
          areaServed: 'CO',
          availableLanguage: ['es'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: 'es-CO',
        publisher: { '@id': ORGANIZATION_ID },
      },
    ],
  };
}

/** Serializa JSON-LD escapando "<" para que el contenido no pueda cerrar la etiqueta <script>. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
