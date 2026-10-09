import Link from 'next/link';
import { categories, type CatalogCategory } from '@/lib/catalog';

const COMPACT_COUNT = 8;

function Chip({ cat, current }: { cat: CatalogCategory; current?: string }) {
  return cat.slug === current ? (
    <span aria-current="page" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-ink-700 px-4 text-sm text-white">
      {cat.name}
    </span>
  ) : (
    <Link
      href={`/tienda/categoria/${cat.slug}/`}
      className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-slate-200 px-4 text-sm text-ink-700 hover:border-brand hover:text-brand transition-colors"
    >
      {cat.name}
      <span className="ml-1.5 text-xs text-slate-600">({cat.count})</span>
    </Link>
  );
}

/**
 * Enlaces a categorías publicadas con productos; nunca a categorías vacías o retiradas.
 * `compact`: muestra primero las categorías con más productos y el resto dentro de "Ver todas"
 * (<details>, los enlaces siguen en el HTML y son rastreables). Reduce la carga visual sin ocultar acceso.
 */
export default function CategoryLinks({ current, title, compact }: { current?: string; title?: string; compact?: boolean }) {
  const ordered = compact ? [...categories].sort((a, b) => b.count - a.count) : categories;
  const main = compact ? ordered.slice(0, COMPACT_COUNT) : ordered;
  const rest = compact ? ordered.slice(COMPACT_COUNT).sort((a, b) => a.name.localeCompare(b.name, 'es')) : [];

  return (
    <div>
      {title && <h2 className="text-lg font-semibold text-ink-700">{title}</h2>}
      {/* En móvil, una fila desplazable: su altura no cambia cuando carga la fuente (evita CLS por re-flujo). */}
      <ul className={`${title ? 'mt-4 ' : ''}-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0`}>
        {main.map((cat) => (
          <li key={cat.slug} className="flex-shrink-0">
            <Chip cat={cat} current={current} />
          </li>
        ))}
      </ul>
      {rest.length > 0 && (
        <details className="group mt-3">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-full text-sm font-semibold text-brand-600 hover:text-brand-700 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Ver todas las categorías ({categories.length})</span>
            <span className="hidden group-open:inline">Ocultar categorías</span>
          </summary>
          <ul className="mt-3 flex flex-wrap gap-2">
            {rest.map((cat) => (
              <li key={cat.slug}>
                <Chip cat={cat} current={current} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
