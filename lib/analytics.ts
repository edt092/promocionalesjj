/**
 * Medición desacoplada (plan SEO, sección 9). No inserta ningún ID de GA4: si en el futuro se carga
 * gtag o Google Tag Manager, los eventos llegan por esas vías; si no hay ninguna, no se envía nada.
 * Nunca se mandan datos personales ni el texto libre de una cotización: solo el tipo de CTA y la ruta.
 */
export type AnalyticsEvent = 'whatsapp_click' | 'quote_start' | 'quote_submit_success' | 'quote_submit_error';

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
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
