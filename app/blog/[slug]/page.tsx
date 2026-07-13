import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import blogPosts from '@/data/blog-posts.json';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.seo_title,
    description: post.seo_description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { title: post.seo_title, description: post.seo_description, images: [{ url: post.imagen_destacada }] },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.seo_description,
    image: post.imagen_destacada,
    datePublished: post.fecha_publicacion,
    author: { '@type': 'Organization', name: post.autor },
  };

  return (
    <article className="pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs
          items={[{ label: 'Inicio', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: post.titulo }]}
        />
        <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-sky-600">
          {post.categoria}
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-ink-700">{post.titulo}</h1>
        <p className="mt-3 text-sm text-slate-400">
          {post.fecha_publicacion} · {post.tiempo_lectura} · {post.autor}
        </p>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
          <Image src={post.imagen_destacada} alt={post.titulo} fill className="object-cover" unoptimized priority />
        </div>

        <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: post.contenido_html }} />

        <ul className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
