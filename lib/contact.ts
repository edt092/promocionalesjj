export { SITE_URL } from './site';
export const WHATSAPP_NUMBER = '573155595134'; // +57 315 5595134
export const WHATSAPP_DISPLAY = '+57 315 5595134';
export const WHATSAPP_E164 = '+573155595134';

export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  'Hola, me interesa cotizar productos promocionales personalizados para mi empresa en Colombia.';
