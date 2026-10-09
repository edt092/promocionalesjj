import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import blogPosts from '@/data/blog-posts.json';
import { getCategory } from '@/lib/catalog';
import { formatDate, readingTime } from '@/lib/blog';
import { jsonLdString, pageMetadata } from '@/lib/seo';
import { ORGANIZATION_ID, absoluteUrl } from '@/lib/site';

type Post = (typeof blogPosts)[number] & { fecha_modificacion?: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

function getPost(slug: string): Post | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seo_title,
    description: post.seo_description,
    path: `/blog/${post.slug}/`,
    image: post.imagen_destacada,
    imageAlt: post.titulo,
    type: 'article',
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}/`);
  // dateModified solo cambia con una revisión sustancial registrada en los datos (fecha_modificacion).
  const modified = post.fecha_modificacion ?? post.fecha_publicacion;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titulo,
    description: post.seo_description,
    image: [post.imagen_destacada],
    datePublished: post.fecha_publicacion,
    dateModified: modified,
    inLanguage: 'es-CO',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    // La autoría declarada en los datos es la empresa; no se inventa una persona autora.
    author: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: post.autor },
    publisher: { '@id': ORGANIZATION_ID },
  };
  const relacionadas = post.categorias_relacionadas
    .map((slug) => getCategory(slug))
    .filter((c): c is NonNullable<ReturnType<typeof getCategory>> => Boolean(c));

  return (
    <article className="pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd) }} />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: post.titulo }]} />
        <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-sky-700">{post.categoria}</span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-ink-700">{post.titulo}</h1>
        <p className="mt-3 text-sm text-slate-500">
          <time dateTime={post.fecha_publicacion}>{formatDate(post.fecha_publicacion)}</time> · {readingTime(post.contenido_html)} ·{' '}
          {post.autor}
        </p>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
          {/* Imagen remota (Unsplash): el CDN de Netlify no tiene autorizado ese origen. */}
          <Image src={post.imagen_destacada} alt={post.titulo} fill className="object-cover" unoptimized priority />
        </div>

        <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: post.contenido_html }} />

        {relacionadas.length > 0 && (
          <aside className="mt-10 rounded-2xl bg-slate-50 p-6" aria-labelledby="catalogo-relacionado">
            <h2 id="catalogo-relacionado" className="text-lg font-semibold text-ink-700">
              Productos del catálogo relacionados con esta guía
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {relacionadas.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tienda/categoria/${cat.slug}/`}
                    className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-sm text-ink-700 hover:border-brand hover:text-brand transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <ul className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
