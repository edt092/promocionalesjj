'use client';

import { useRef, useState } from 'react';
import { whatsappHref } from '@/lib/contact';
import { track } from '@/lib/analytics';

/**
 * Formulario de cotización sin backend (SEO-19): compone el mensaje y lo abre en WhatsApp, que es el
 * canal real del negocio. No simula un envío: el usuario ve y envía el mensaje en WhatsApp.
 * Analítica: solo `quote_start`; no se envían datos del formulario.
 */
export default function QuoteForm() {
  const started = useRef(false);
  const [error, setError] = useState('');

  function onFocus() {
    if (started.current) return;
    started.current = true;
    track('quote_start', { form: 'contacto' });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? '').trim();
    if (!get('producto') || !get('cantidad') || !get('ciudad')) {
      setError('Indica el producto, la cantidad y la ciudad de entrega.');
      return;
    }
    setError('');
    const lines = [
      'Hola, quiero solicitar una cotización:',
      `• Producto o SKU: ${get('producto')}`,
      `• Cantidad: ${get('cantidad')}`,
      `• Ciudad de entrega: ${get('ciudad')}`,
      get('fecha') && `• Fecha requerida: ${get('fecha')}`,
      get('tecnica') && `• Técnica o detalle de marcación: ${get('tecnica')}`,
      get('empresa') && `• Empresa: ${get('empresa')}`,
      'Les envío el logo por este chat.',
    ].filter(Boolean);
    window.open(whatsappHref(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }

  const field = 'mt-1.5 block w-full min-h-11 rounded-xl border border-slate-200 px-4 text-sm text-ink-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';
  const label = 'block text-sm font-medium text-ink-700';

  return (
    <form onSubmit={onSubmit} onFocus={onFocus} noValidate className="space-y-4">
      <div>
        <label htmlFor="producto" className={label}>
          Producto o SKU *
        </label>
        <input id="producto" name="producto" required className={field} placeholder="Ej.: Bolígrafo Ballpop, JJ-000001" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cantidad" className={label}>
            Cantidad *
          </label>
          <input id="cantidad" name="cantidad" required inputMode="numeric" className={field} placeholder="Ej.: 200 unidades" />
        </div>
        <div>
          <label htmlFor="ciudad" className={label}>
            Ciudad de entrega *
          </label>
          <input id="ciudad" name="ciudad" required className={field} placeholder="Ej.: Bogotá" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha" className={label}>
            Fecha requerida
          </label>
          <input id="fecha" name="fecha" type="date" className={field} />
        </div>
        <div>
          <label htmlFor="empresa" className={label}>
            Empresa
          </label>
          <input id="empresa" name="empresa" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="tecnica" className={label}>
          Técnica o detalle de marcación
        </label>
        <input id="tecnica" name="tecnica" className={field} placeholder="Ej.: logo a una tinta, grabado láser" />
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="inline-flex min-h-12 items-center rounded-full bg-danger px-7 text-sm font-semibold text-white hover:bg-danger-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-700"
      >
        Continuar en WhatsApp
      </button>
      <p className="text-xs text-slate-500">
        Se abrirá WhatsApp con el mensaje listo para que lo revises y lo envíes. Este formulario no guarda tus datos.
      </p>
    </form>
  );
}
