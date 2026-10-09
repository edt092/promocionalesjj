'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { buildQuoteMessage, checkQuantity, quoteProblems, type QuantityRule } from '@/lib/quote-rules';
import { clearQuote, isStorageAvailable, removeItem, updateDetails, updateItem, useQuote } from '@/lib/quote-store';
import { track } from '@/lib/analytics';
import { WHATSAPP_DISPLAY, whatsappHref } from '@/lib/contact';

const TECHNIQUES = ['Tampografía', 'Láser', 'Serigrafía', 'Screen', 'Bordado', 'Sublimación'];

const field =
  'mt-1.5 block w-full min-h-11 rounded-xl border bg-white px-4 text-base text-ink-700 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';
const label = 'block text-sm font-medium text-ink-700';

/**
 * Cotización guiada y lista multiproducto (H04, H11). Prepara contexto para WhatsApp; no es un checkout
 * ni registra una solicitud: la conversación la inicia y envía la persona.
 */
export default function QuoteBuilder({ rules }: { rules: Record<string, QuantityRule> }) {
  const draft = useQuote();
  const { items, details } = draft;
  const [mounted, setMounted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const started = useRef(false);
  const readyTracked = useRef(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const problems = useMemo(() => quoteProblems(items, details, rules), [items, details, rules]);
  const generated = useMemo(() => buildQuoteMessage(items, details), [items, details]);
  const message = customMessage ?? generated;
  const ready = problems.length === 0;

  useEffect(() => {
    if (ready && !readyTracked.current && items.length + (details.goal ? 1 : 0) > 0) {
      readyTracked.current = true;
      track('quote_summary_ready', {
        item_count: items.length,
        has_date: Boolean(details.date) && !details.noDate,
        needs_advice: Boolean(details.needsAdvice),
        has_technique: Boolean(details.technique),
      });
    }
  }, [ready, items.length, details]);

  function onInteract() {
    if (started.current) return;
    started.current = true;
    track('quote_start', { form: 'cotizacion', item_count: items.length });
  }

  function onOpenWhatsApp(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!ready) {
      event.preventDefault();
      setShowErrors(true);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    // Apertura intentada: no se puede saber si el mensaje se envió.
    setStatus('Abrimos WhatsApp con tu resumen en una pestaña nueva. Revisa el mensaje y envíalo. Si no se abrió, usa “Copiar mensaje”.');
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setStatus(`Mensaje copiado. Pégalo en WhatsApp al ${WHATSAPP_DISPLAY}.`);
    } catch {
      const area = document.getElementById('mensaje-cotizacion') as HTMLTextAreaElement | null;
      area?.select();
      setStatus('No pudimos copiar automáticamente: el mensaje quedó seleccionado, cópialo con Ctrl+C o mantén pulsado.');
    }
  }

  const errorFor = (name: string) => (showErrors ? problems.find((p) => p.field === name)?.message : undefined);

  if (!mounted) {
    return <p className="text-slate-700">Cargando tu lista de cotización…</p>;
  }

  return (
    <div onChangeCapture={onInteract} className="space-y-10">
      {!isStorageAvailable() && (
        <p role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          Tu navegador no permite guardar datos: la lista se conservará solo mientras esta pestaña esté abierta.
        </p>
      )}

      {showErrors && problems.length > 0 && (
        <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="rounded-2xl border border-danger-600 bg-danger-50 p-5">
          <h2 className="text-base font-semibold text-ink-700">Revisa estos datos antes de continuar</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-700">
            {problems.map((p) => (
              <li key={p.field}>
                <a href={`#${p.field}`} className="underline">
                  {p.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Paso 1 */}
      <section aria-labelledby="paso-pedido">
        <h2 id="paso-pedido" className="text-xl font-bold text-ink-700">
          1. Tu pedido
        </h2>
        {items.length === 0 ? (
          <div id="productos" className="mt-4 rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-700">
            <p>Tu lista está vacía. Agrega productos desde su ficha con “Preparar cotización” o “Agregar a mi lista”.</p>
            <Link href="/tienda/" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-600 underline">
              Ir al catálogo
            </Link>
            <p className="mt-2">¿Aún no sabes qué elegir? Marca “Necesito asesoría” y cuéntanos para qué es el pedido.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {items.map((item) => {
              const rule = rules[item.slug];
              const check = item.quantity.trim() ? checkQuantity(item.quantity, rule) : null;
              const fieldError = errorFor(`cantidad-${item.slug}`);
              const inlineError = check && !check.ok ? check : null;
              const errorId = `cantidad-${item.slug}-error`;
              return (
                <li key={item.slug} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link href={`/tienda/${item.slug}/`} className="font-semibold text-ink-700 underline-offset-4 hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-600">Referencia {item.sku}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="inline-flex min-h-11 items-center text-sm font-medium text-slate-700 underline hover:text-danger-700"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`cantidad-${item.slug}`} className={label}>
                        Cantidad {details.needsAdvice ? '(opcional)' : ''}
                      </label>
                      <input
                        id={`cantidad-${item.slug}`}
                        inputMode="numeric"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.slug, { quantity: e.target.value })}
                        aria-invalid={Boolean(inlineError || fieldError)}
                        aria-describedby={`${item.slug}-regla ${inlineError || fieldError ? errorId : ''}`.trim()}
                        className={`${field} ${inlineError || fieldError ? 'border-danger-600' : 'border-slate-300'}`}
                        placeholder={rule ? `Múltiplos de ${rule.multiple}` : 'Ej.: 200'}
                      />
                      <p id={`${item.slug}-regla`} className="mt-1 text-xs text-slate-600">
                        {rule
                          ? `Se vende en múltiplos de ${rule.multiple} unidades${rule.perColor ? ' por color' : ''}.`
                          : 'Sin mínimo publicado: lo confirmamos al cotizar.'}
                      </p>
                      {(inlineError || fieldError) && (
                        <div id={errorId} className="mt-1 text-sm text-danger-700">
                          <p>{inlineError ? inlineError.message : fieldError}</p>
                          {inlineError && inlineError.suggestions.length > 0 && (
                            <p className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-ink-700">Usar:</span>
                              {inlineError.suggestions.map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => updateItem(item.slug, { quantity: String(n) })}
                                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink-700 px-3 text-sm font-semibold text-ink-700"
                                >
                                  {n.toLocaleString('es-CO')}
                                </button>
                              ))}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`notas-${item.slug}`} className={label}>
                        Colores o distribución (opcional)
                      </label>
                      <input
                        id={`notas-${item.slug}`}
                        value={item.notes ?? ''}
                        onChange={(e) => updateItem(item.slug, { notes: e.target.value })}
                        className={`${field} border-slate-300`}
                        placeholder="Ej.: 100 azules y 50 negros"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 sm:p-5">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={Boolean(details.needsAdvice)}
              onChange={(e) => updateDetails({ needsAdvice: e.target.checked })}
              className="h-6 w-6 flex-shrink-0 accent-brand"
            />
            Necesito asesoría para elegir productos, cantidades o técnica
          </label>
          {details.needsAdvice && (
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="objetivo" className={label}>
                  ¿Para qué es el pedido? {items.length === 0 ? '*' : '(opcional)'}
                </label>
                <input
                  id="objetivo"
                  value={details.goal ?? ''}
                  onChange={(e) => updateDetails({ goal: e.target.value })}
                  className={`${field} ${errorFor('productos') ? 'border-danger-600' : 'border-slate-300'}`}
                  placeholder="Ej.: regalos para 200 asistentes a una feria"
                />
              </div>
              <div>
                <label htmlFor="presupuesto" className={label}>
                  Presupuesto aproximado (opcional)
                </label>
                <input
                  id="presupuesto"
                  value={details.budget ?? ''}
                  onChange={(e) => updateDetails({ budget: e.target.value })}
                  className={`${field} border-slate-300`}
                  placeholder="Ej.: hasta $10.000 por unidad"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Paso 2 */}
      <section aria-labelledby="paso-entrega">
        <h2 id="paso-entrega" className="text-xl font-bold text-ink-700">
          2. Entrega
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ciudad" className={label}>
              Ciudad o municipio *
            </label>
            <input
              id="ciudad"
              value={details.city}
              onChange={(e) => updateDetails({ city: e.target.value })}
              aria-invalid={Boolean(errorFor('ciudad'))}
              aria-describedby={errorFor('ciudad') ? 'ciudad-error' : undefined}
              className={`${field} ${errorFor('ciudad') ? 'border-danger-600' : 'border-slate-300'}`}
              autoComplete="address-level2"
            />
            {errorFor('ciudad') && (
              <p id="ciudad-error" className="mt-1 text-sm text-danger-700">
                {errorFor('ciudad')}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="departamento" className={label}>
              Departamento (opcional)
            </label>
            <input
              id="departamento"
              value={details.department ?? ''}
              onChange={(e) => updateDetails({ department: e.target.value })}
              className={`${field} border-slate-300`}
              autoComplete="address-level1"
            />
          </div>
          <div>
            <label htmlFor="fecha" className={label}>
              Fecha requerida {details.noDate ? '' : '*'}
            </label>
            <input
              id="fecha"
              type="date"
              value={details.date ?? ''}
              disabled={details.noDate}
              onChange={(e) => updateDetails({ date: e.target.value })}
              aria-invalid={Boolean(errorFor('fecha'))}
              aria-describedby="fecha-ayuda"
              className={`${field} ${errorFor('fecha') ? 'border-danger-600' : 'border-slate-300'} disabled:bg-slate-100`}
            />
            <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={Boolean(details.noDate)}
                onChange={(e) => updateDetails({ noDate: e.target.checked, date: e.target.checked ? '' : details.date })}
                className="h-6 w-6 flex-shrink-0 accent-brand"
              />
              Sin fecha definida
            </label>
            <p id="fecha-ayuda" className="mt-1 text-xs text-slate-600">
              {errorFor('fecha') ?? 'La fecha no es una promesa de entrega: confirmamos si es viable al cotizar.'}
            </p>
          </div>
          <div>
            <label htmlFor="empresa" className={label}>
              Empresa (opcional)
            </label>
            <input
              id="empresa"
              value={details.company ?? ''}
              onChange={(e) => updateDetails({ company: e.target.value })}
              className={`${field} border-slate-300`}
              autoComplete="organization"
            />
          </div>
        </div>
      </section>

      {/* Paso 3 */}
      <section aria-labelledby="paso-personalizacion">
        <h2 id="paso-personalizacion" className="text-xl font-bold text-ink-700">
          3. Personalización
        </h2>
        <div className="mt-4 max-w-md">
          <label htmlFor="tecnica" className={label}>
            Técnica de marcación (opcional)
          </label>
          <select
            id="tecnica"
            value={details.technique ?? ''}
            onChange={(e) => updateDetails({ technique: e.target.value })}
            className={`${field} border-slate-300`}
          >
            <option value="">Recomiéndenme</option>
            {TECHNIQUES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-600">
            La técnica disponible depende del producto. Tu logo lo envías por WhatsApp cuando lo tengas; no es necesario para cotizar.
          </p>
        </div>
      </section>

      {/* Paso 4 */}
      <section aria-labelledby="paso-revisar">
        <h2 id="paso-revisar" className="text-xl font-bold text-ink-700">
          4. Revisa y envía
        </h2>
        <label htmlFor="mensaje-cotizacion" className={`${label} mt-4`}>
          Mensaje para WhatsApp (puedes editarlo)
        </label>
        <textarea
          id="mensaje-cotizacion"
          value={message}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={Math.min(14, message.split('\n').length + 1)}
          className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-ink-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        {customMessage !== null && (
          <button type="button" onClick={() => setCustomMessage(null)} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-600 underline">
            Volver al mensaje generado con los datos del formulario
          </button>
        )}
        <p className="mt-3 text-sm text-slate-700">
          Se abrirá WhatsApp con el resumen. Revisa el mensaje y envíalo para consultar tu pedido.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={whatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpenWhatsApp}
            data-cta="cotizacion_resumen"
            data-ready={ready ? 'true' : 'false'}
            aria-describedby={ready ? undefined : 'whatsapp-pendiente'}
            className={`inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-white transition-colors ${
              ready ? 'bg-danger-600 hover:bg-danger-700' : 'bg-slate-500'
            }`}
          >
            Abrir WhatsApp con este mensaje
          </a>
          <button
            type="button"
            onClick={copyMessage}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink-700 px-7 text-sm font-semibold text-ink-700"
          >
            Copiar mensaje
          </button>
        </div>
        {!ready && (
          <p id="whatsapp-pendiente" className="mt-3 text-sm text-slate-700">
            Faltan datos: al pulsar el botón te indicamos cuáles.
          </p>
        )}
        <p className="mt-3 text-sm text-slate-700">
          ¿No se abre WhatsApp? Escríbenos al <strong>{WHATSAPP_DISPLAY}</strong> y pega el mensaje copiado.
        </p>
        <p aria-live="polite" role="status" className="mt-3 text-sm font-medium text-ink-700">
          {status}
        </p>
      </section>

      <div className="border-t border-slate-100 pt-6 text-sm text-slate-700">
        <p>Esta lista se guarda solo en este navegador para que no pierdas tu selección al seguir explorando.</p>
        {confirmClear ? (
          <p className="mt-2 flex flex-wrap items-center gap-3">
            <span>¿Borrar la lista y los datos del formulario?</span>
            <button
              type="button"
              onClick={() => {
                clearQuote();
                setCustomMessage(null);
                setConfirmClear(false);
                setShowErrors(false);
                setStatus('Lista y datos borrados.');
              }}
              className="inline-flex min-h-11 items-center rounded-full bg-ink-700 px-5 font-semibold text-white"
            >
              Sí, borrar
            </button>
            <button type="button" onClick={() => setConfirmClear(false)} className="inline-flex min-h-11 items-center px-3 font-semibold underline">
              Cancelar
            </button>
          </p>
        ) : (
          <button type="button" onClick={() => setConfirmClear(true)} className="mt-2 inline-flex min-h-11 items-center font-semibold underline">
            Vaciar lista y borrar datos
          </button>
        )}
      </div>
    </div>
  );
}
