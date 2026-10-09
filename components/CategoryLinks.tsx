import Link from 'next/link';
import { categories } from '@/lib/catalog';

/** Enlaces a categorías publicadas con productos; nunca a categorías vacías o retiradas. */
export default function CategoryLinks({ current, title }: { current?: string; title?: string }) {
  return (
    <div>
      {title && <h2 className="text-lg font-semibold text-ink-700">{title}</h2>}
      {/* En móvil, una fila desplazable: su altura no cambia cuando carga la fuente (evita CLS por re-flujo). */}
      <ul className={`${title ? 'mt-4 ' : ''}-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0`}>
        {categories.map((cat) => (
          <li key={cat.slug} className="flex-shrink-0">
            {cat.slug === current ? (
              <span aria-current="page" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-ink-700 px-4 text-sm text-white">
                {cat.name}
              </span>
            ) : (
              <Link
                href={`/tienda/categoria/${cat.slug}/`}
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-slate-200 px-4 text-sm text-ink-700 hover:border-brand hover:text-brand transition-colors"
              >
                {cat.name}
                <span className="ml-1.5 text-xs text-slate-500">({cat.count})</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
