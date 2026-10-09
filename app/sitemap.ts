import { MetadataRoute } from 'next';
import blogPosts from '@/data/blog-posts.json';
import { colombia } from '@/data/geo-data';
import { categories, products } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/site';

/**
 * Sitemap = destinos canónicos indexables, generados desde las mismas fuentes que las rutas (SEO-13).
 * - Sin lastmod donde no se conoce una fecha real de cambio (no se usa la fecha del build).
 * - Sin priority/changefreq: Google los ignora.
 * - Las páginas /pagina/n/ se descubren por enlaces; no hace falta listarlas.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/', '/tienda/', '/promociones/', '/blog/', '/contacto/', '/productos-promocionales-colombia/'];

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path) })),
    ...colombia.ciudades.map((ciudad) => ({ url: absoluteUrl(`/productos-promocionales-colombia/${ciudad.slug}/`) })),
    ...categories.map((cat) => ({ url: absoluteUrl(`/tienda/categoria/${cat.slug}/`) })),
    ...products.map((product) => ({ url: absoluteUrl(`/tienda/${product.slug}/`) })),
    ...blogPosts.map((post) => {
      const modified = (post as { fecha_modificacion?: string }).fecha_modificacion ?? post.fecha_publicacion;
      return { url: absoluteUrl(`/blog/${post.slug}/`), lastModified: modified };
    }),
  ];
}
