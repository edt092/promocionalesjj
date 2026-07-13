import { MetadataRoute } from 'next';
import productsData from '@/data/products.json';
import blogPosts from '@/data/blog-posts.json';
import { colombia } from '@/data/geo-data';

const SITE_URL = 'https://promocionalesjj.co';

export default function sitemap(): MetadataRoute.Sitemap {
  const STATIC_UPDATED = new Date('2026-07-13');

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: STATIC_UPDATED, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/tienda/`, lastModified: STATIC_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/promociones/`, lastModified: STATIC_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog/`, lastModified: STATIC_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const colombiaPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/productos-promocionales-colombia/`, lastModified: STATIC_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    ...colombia.ciudades.map((ciudad) => ({
      url: `${SITE_URL}/productos-promocionales-colombia/${ciudad.slug}/`,
      lastModified: STATIC_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];

  const uniqueCategories = Array.from(new Set(productsData.map((p) => p.categoria_slug)));
  const categoryPages: MetadataRoute.Sitemap = uniqueCategories.map((slug) => ({
    url: `${SITE_URL}/tienda/categoria/${slug}/`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const productPages: MetadataRoute.Sitemap = productsData.map((product) => ({
    url: `${SITE_URL}/tienda/${product.slug}/`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: new Date(post.fecha_publicacion),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...colombiaPages, ...categoryPages, ...productPages, ...blogPages];
}
