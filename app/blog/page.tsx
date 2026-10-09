import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import blogPosts from '@/data/blog-posts.json';
import { pageMetadata } from '@/lib/seo';
import { formatDate, readingTime } from '@/lib/blog';

export const metadata: Metadata = pageMetadata({
  title: 'Blog de productos promocionales en Colombia',
  description:
    'Guías y consejos sobre merchandising corporativo, regalos empresariales y productos promocionales para empresas en Colombia.',
  path: '/blog/',
});

export default function BlogPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Blog' }]} />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">Blog de productos promocionales y merchandising</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Guías prácticas sobre productos promocionales y merchandising corporativo para empresas en Colombia.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lift"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <Image
                  src={post.imagen_destacada}
                  alt={post.titulo}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  // Imagen remota (Unsplash): el CDN de Netlify no tiene autorizado ese origen.
                  unoptimized
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">{post.categoria}</span>
                <h2 className="mt-2 text-lg font-semibold text-ink-700 leading-snug group-hover:text-brand transition-colors">
                  {post.titulo}
                </h2>
                <p className="mt-2 text-sm text-slate-500 line-clamp-3">{post.extracto}</p>
                <span className="mt-4 text-xs text-slate-600">
                  <time dateTime={post.fecha_publicacion}>{formatDate(post.fecha_publicacion)}</time> · {readingTime(post.contenido_html)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
