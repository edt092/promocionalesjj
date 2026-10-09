'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Un único listener delegado para todos los enlaces a WhatsApp: evita el doble conteo de tener un
 * onClick por botón. `data-cta` identifica la ubicación (producto, categoría, flotante…).
 */
export default function AnalyticsListener() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (!link) return;
      track('whatsapp_click', { cta: link.getAttribute('data-cta') ?? 'sin_etiqueta' });
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
