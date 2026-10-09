'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import ProductCard from './ProductCard';
import { facetCounts, searchProducts, type SearchDoc, type SearchFilters } from '@/lib/search-core';
import { track } from '@/lib/analytics';
import { whatsappHref } from '@/lib/contact';

interface SearchIndex {
  categoryNames: Record<string, string>;
  docs: SearchDoc[];
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const STEP = 24;
const MATERIAL_LABELS: Record<string, string> = {
  bambu: 'Bambú', corcho: 'Corcho', acero: 'Acero inoxidable', algodon: 'Algodón', rpet: 'Plástico reciclado RPET',
  trigo: 'Fibra de trigo', madera: 'Madera', silicona: 'Silicona', cuero: 'Cuero', yute: 'Yute', cambrel: 'Cambrel',
  metal: 'Metal', plastic: 'Plástico', vidrio: 'Vidrio', ceramica: 'Cerámica', tritan: 'Tritán',
};
const RESTORE_KEY = 'jj-busqueda-retorno';

let indexPromise: Promise<SearchIndex> | null = null;
function loadIndex(): Promise<SearchIndex> {
  if (!indexPromise) {
    indexPromise = fetch('/catalogo-busqueda.json')
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<SearchIndex>;
      })
      .catch((err) => {
        indexPromise = null; // permite reintentar
        throw err;
      });
  }
  return indexPromise;
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') ?? '',
    filters: {
      category: params.get('categoria') ?? undefined,
      material: params.get('material') ?? undefined,
      technique: params.get('tecnica') ?? undefined,
    } as SearchFilters,
  };
}

function writeUrlState(q: string, filters: SearchFilters) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (filters.category) params.set('categoria', filters.category);
  if (filters.material) params.set('material', filters.material);
  if (filters.technique) params.set('tecnica', filters.technique);
  const qs = params.toString();
  // replaceState: la búsqueda queda en la URL (se conserva al volver desde una ficha) sin llenar el historial.
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
}

/**
 * Buscador y filtros del catálogo (H02). Mientras no hay búsqueda ni filtros se muestra el listado
 * paginado del servidor (children), que sigue siendo la vía rastreable. El índice se descarga solo
 * cuando se usa el buscador o la URL ya trae una búsqueda.
 */
export default function CatalogSearch({ children, totalProducts }: { children: ReactNode; totalProducts: number }) {
  const [state, setState] = useState<LoadState>('idle');
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [visible, setVisible] = useState(STEP);
  const restored = useRef(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const ensureIndex = useCallback(() => {
    if (index || state === 'loading') return;
    setState('loading');
    loadIndex()
      .then((data) => {
        setIndex(data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [index, state]);

  // Estado inicial desde la URL (volver desde una ficha o enlace compartido).
  useEffect(() => {
    const initial = readUrlState();
    if (initial.q || initial.filters.category || initial.filters.material || initial.filters.technique) {
      setQ(initial.q);
      setFilters(initial.filters);
      ensureIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = Boolean(q.trim() || filters.category || filters.material || filters.technique);

  const result = useMemo(() => (index && active ? searchProducts(index.docs, q, filters) : null), [index, active, q, filters]);

  // Opciones de cada filtro calculadas sobre la búsqueda actual sin ese filtro: solo valores con resultados.
  const facets = useMemo(() => {
    if (!index) return null;
    const without = (key: keyof SearchFilters) => searchProducts(index.docs, q, { ...filters, [key]: undefined }).items;
    return {
      categories: facetCounts(without('category'), 'categories'),
      materials: facetCounts(without('material'), 'materials'),
      techniques: facetCounts(without('technique'), 'techniques'),
    };
  }, [index, q, filters]);

  useEffect(() => {
    if (!index) return;
    writeUrlState(q, filters);
  }, [index, q, filters]);

  // Analítica: solo conteo y categoría, nunca el texto buscado. Se envía cuando la búsqueda se estabiliza
  // o, si la persona abre un resultado antes, al salir del buscador (para no perder la búsqueda).
  const pendingSearch = useRef<Record<string, string | number | boolean> | null>(null);
  const flushSearch = useCallback(() => {
    if (pendingSearch.current) track('search_used', pendingSearch.current);
    pendingSearch.current = null;
  }, []);
  useEffect(() => {
    if (!result) return;
    pendingSearch.current = { results: result.total, category: filters.category ?? 'todas', has_query: Boolean(q.trim()) };
    const timer = window.setTimeout(flushSearch, 1200);
    return () => window.clearTimeout(timer);
  }, [result, filters.category, q, flushSearch]);
  useEffect(() => flushSearch, [flushSearch]);

  // Restaurar cantidad mostrada y posición al volver desde una ficha.
  useEffect(() => {
    if (!result || restored.current) return;
    restored.current = true;
    try {
      const saved = JSON.parse(sessionStorage.getItem(RESTORE_KEY) ?? 'null') as { url: string; visible: number; scrollY: number } | null;
      if (saved && saved.url === window.location.pathname + window.location.search) {
        setVisible(saved.visible);
        requestAnimationFrame(() => window.scrollTo(0, saved.scrollY));
      }
      sessionStorage.removeItem(RESTORE_KEY);
    } catch {
      /* sin sessionStorage: se empieza desde arriba */
    }
  }, [result]);

  function rememberPosition() {
    try {
      sessionStorage.setItem(RESTORE_KEY, JSON.stringify({ url: window.location.pathname + window.location.search, visible, scrollY: window.scrollY }));
    } catch {
      /* opcional */
    }
  }

  function setFilter(key: keyof SearchFilters, value: string) {
    setFilters((f) => ({ ...f, [key]: value || undefined }));
    setVisible(STEP);
  }

  function clearAll() {
    setQ('');
    setFilters({});
    setVisible(STEP);
  }

  const label = (key: keyof SearchFilters, value: string) =>
    key === 'category' ? index?.categoryNames[value] ?? value : key === 'material' ? MATERIAL_LABELS[value] ?? value : value;

  const shown = result ? result.items.slice(0, visible) : [];
  const selectClass =
    'mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
        <label htmlFor="buscar-productos" className="block text-sm font-semibold text-ink-700">
          Buscar productos
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="buscar-productos"
            type="search"
            value={q}
            onFocus={ensureIndex}
            onChange={(e) => {
              setQ(e.target.value);
              setVisible(STEP);
              ensureIndex();
            }}
            placeholder="Por producto o referencia (ej.: mug, esfero, JJ-000001)"
            autoComplete="off"
            aria-describedby="buscar-ayuda"
            className="block w-full min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-base text-ink-700 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <p id="buscar-ayuda" className="mt-1.5 text-xs text-slate-600">
          Busca entre los {totalProducts} productos por nombre, tipo o SKU. Reconoce sinónimos como taza/mug o esfero/bolígrafo.
        </p>

        {facets && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="filtro-categoria" className="text-xs font-medium text-slate-700">
                Categoría
              </label>
              <select id="filtro-categoria" value={filters.category ?? ''} onChange={(e) => setFilter('category', e.target.value)} className={selectClass}>
                <option value="">Todas</option>
                {facets.categories.map((f) => (
                  <option key={f.value} value={f.value}>
                    {label('category', f.value)} ({f.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filtro-material" className="text-xs font-medium text-slate-700">
                Material (según la ficha)
              </label>
              <select id="filtro-material" value={filters.material ?? ''} onChange={(e) => setFilter('material', e.target.value)} className={selectClass}>
                <option value="">Todos</option>
                {facets.materials.map((f) => (
                  <option key={f.value} value={f.value}>
                    {label('material', f.value)} ({f.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filtro-tecnica" className="text-xs font-medium text-slate-700">
                Técnica indicada en la ficha
              </label>
              <select id="filtro-tecnica" value={filters.technique ?? ''} onChange={(e) => setFilter('technique', e.target.value)} className={selectClass}>
                <option value="">Todas</option>
                {facets.techniques.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.value} ({f.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>

      <div aria-live="polite" className="mt-4 text-sm text-slate-700">
        {state === 'loading' && <p>Cargando el buscador…</p>}
        {state === 'error' && (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-danger-600/30 bg-danger-50 p-4 text-ink-700">
            <span>No pudimos cargar el buscador. Puedes reintentar o seguir explorando el catálogo por categorías.</span>
            <button
              type="button"
              onClick={() => {
                setState('idle');
                setTimeout(ensureIndex, 0);
              }}
              className="inline-flex min-h-11 items-center rounded-full border border-ink-700 px-5 text-sm font-semibold"
            >
              Reintentar
            </button>
          </div>
        )}
        {result && (
          <p ref={statusRef}>
            {result.total === 0
              ? 'Sin resultados.'
              : `${result.total} ${result.total === 1 ? 'producto encontrado' : 'productos encontrados'} · mostrando ${Math.min(visible, result.total)}`}
          </p>
        )}
      </div>

      {result && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(['category', 'material', 'technique'] as const).map((key) =>
            filters[key] ? (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key, '')}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-700 px-4 text-sm text-white"
                aria-label={`Quitar filtro ${label(key, filters[key]!)}`}
              >
                {label(key, filters[key]!)} <span aria-hidden="true">×</span>
              </button>
            ) : null
          )}
          <button type="button" onClick={clearAll} className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-ink-700 hover:border-brand hover:text-brand">
            Limpiar búsqueda y filtros
          </button>
        </div>
      )}

      {result && result.total === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-ink-700">No encontramos productos con esa búsqueda</h2>
          <p className="mt-2 text-sm text-slate-700">Prueba otro nombre o referencia, o quita algunos filtros. También podemos ayudarte a encontrar una alternativa.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={clearAll} className="inline-flex min-h-11 items-center rounded-full border border-ink-700 px-5 text-sm font-semibold text-ink-700">
              Limpiar búsqueda
            </button>
            <a
              href={whatsappHref(`Hola, busco ${q.trim() ? `"${q.trim()}"` : 'un producto'} personalizado para mi empresa y no lo encontré en el catálogo. ¿Me ayudan con opciones?`)}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="busqueda_sin_resultados"
              className="inline-flex min-h-11 items-center rounded-full bg-danger-600 px-5 text-sm font-semibold text-white hover:bg-danger-700"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      )}

      {result && result.total > 0 && (
        <>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5" onClickCapture={rememberPosition}>
            {shown.map((doc) => (
              <li key={doc.slug}>
                <ProductCard
                  product={{ slug: doc.slug, displayName: doc.name, categoriaNombre: doc.categoryName, imagenUrl: doc.image, hasRealImage: doc.hasRealImage, sku: doc.sku, quantityNote: doc.quantityNote }}
                />
              </li>
            ))}
          </ul>
          {visible < result.total && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + STEP)}
                className="inline-flex min-h-12 items-center rounded-full border border-slate-300 px-8 text-sm font-semibold text-ink-700 hover:border-brand hover:text-brand"
              >
                Mostrar {Math.min(STEP, result.total - visible)} más ({result.total - visible} restantes)
              </button>
            </div>
          )}
        </>
      )}

      {/* Sin búsqueda activa: listado paginado del servidor (rastreable). */}
      <div hidden={Boolean(result)}>{children}</div>
    </div>
  );
}
