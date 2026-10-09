import Link from 'next/link';
import { pagePath } from '@/lib/catalog';

/**
 * Paginación rastreable (SEO-02): enlaces <a href> reales a rutas exportadas, sin depender de
 * JavaScript, scroll ni parámetros. La página 1 vive en la ruta base (sin /pagina/1/).
 */
export default function Pagination({ basePath, page, total }: { basePath: string; page: number; total: number }) {
  if (total <= 1) return null;

  // Ventana de números alrededor de la página actual, siempre con primera y última.
  const pages = new Set<number>([1, total, page - 2, page - 1, page, page + 1, page + 2]);
  const visible = Array.from(pages).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const base = 'inline-flex min-w-11 h-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors';
  return (
    <nav aria-label="Paginación del catálogo" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={pagePath(basePath, page - 1)} rel="prev" className={`${base} border border-slate-200 text-ink-700 hover:border-brand hover:text-brand`}>
          ← Anterior
        </Link>
      )}
      {visible.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && n - visible[i - 1] > 1 && <span aria-hidden="true" className="text-slate-400">…</span>}
          {n === page ? (
            <span aria-current="page" className={`${base} bg-ink-700 text-white`}>
              {n}
            </span>
          ) : (
            <Link href={pagePath(basePath, n)} className={`${base} border border-slate-200 text-ink-700 hover:border-brand hover:text-brand`} aria-label={`Página ${n}`}>
              {n}
            </Link>
          )}
        </span>
      ))}
      {page < total && (
        <Link href={pagePath(basePath, page + 1)} rel="next" className={`${base} border border-slate-200 text-ink-700 hover:border-brand hover:text-brand`}>
          Siguiente →
        </Link>
      )}
    </nav>
  );
}
