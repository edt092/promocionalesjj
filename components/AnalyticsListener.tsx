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
      // Resumen incompleto: el enlace no abre WhatsApp (muestra los errores), no cuenta como apertura.
      if (!link || link.getAttribute('data-ready') === 'false') return;
      track('whatsapp_open_clicked', { cta: link.getAttribute('data-cta') ?? 'sin_etiqueta', product_id: link.getAttribute('data-product') ?? undefined });
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
