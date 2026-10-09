import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

// Sin directiva Host (obsoleta, solo Yandex). No se bloquea nada: las URLs con noindex deben poder rastrearse.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
