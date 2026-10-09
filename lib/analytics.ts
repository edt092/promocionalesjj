/**
 * Medición desacoplada (plan SEO sección 9 y plan UX sección 21). No inserta ningún ID de GA4: si en
 * el futuro se carga gtag o Google Tag Manager, los eventos llegan por esas vías; si no hay ninguna,
 * no se envía nada.
 *
 * Nunca se envían datos personales, logos, el texto de una búsqueda ni el mensaje de cotización:
 * solo identificadores de producto/categoría, conteos, tramos y booleanos.
 * `whatsapp_open_clicked` significa apertura intentada de WhatsApp, no mensaje enviado ni lead.
 */
export type AnalyticsEvent =
  | 'search_used'
  | 'product_viewed'
  | 'quote_item_added'
  | 'quote_summary_ready'
  | 'quote_start'
  | 'whatsapp_open_clicked';

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Tramo de cantidad: evita enviar cifras exactas de un pedido. */
export function quantityBand(quantity: number): string {
  if (!quantity) return 'sin_cantidad';
  if (quantity < 100) return '1-99';
  if (quantity < 500) return '100-499';
  if (quantity < 1000) return '500-999';
  return '1000+';
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const payload = { page_path: window.location.pathname, ...params };
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...payload });
  }
  if (process.env.NODE_ENV === 'development') console.debug('[analytics]', event, payload);
}
