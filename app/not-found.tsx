import type { Metadata } from 'next';
import Link from 'next/link';

// El 404 no declara canonical (antes heredaba la del inicio); Next.js ya añade robots noindex.
export const metadata: Metadata = {
  title: 'Página no encontrada',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">Error 404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-ink-700">No encontramos esta página</h1>
      <p className="mt-3 max-w-md text-slate-600">
        El contenido que buscas no existe o se movió. Explora nuestro catálogo de productos promocionales.
      </p>
      <Link
        href="/tienda/"
        className="mt-8 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-brand hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
      >
        Ver catálogo
      </Link>
    </div>
  );
}
