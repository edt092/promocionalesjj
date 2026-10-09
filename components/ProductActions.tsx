'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addItem, useQuote } from '@/lib/quote-store';
import { track } from '@/lib/analytics';
import { whatsappHref } from '@/lib/contact';

interface Props {
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
}

/**
 * Acciones de la ficha (H04): "Preparar cotización" (ruta guiada opcional), "Agregar a mi lista" para
 * cotizar varios productos y el acceso directo a WhatsApp, que se conserva como camino rápido.
 */
export default function ProductActions({ slug, sku, name, categorySlug }: Props) {
  const router = useRouter();
  const draft = useQuote();
  const inList = draft.items.some((i) => i.slug === slug);
  const [status, setStatus] = useState('');

  useEffect(() => {
    track('product_viewed', { product_id: sku, category_id: categorySlug });
  }, [sku, categorySlug]);

  function add() {
    const result = addItem({ slug, sku, name });
    if (result === 'agregado') track('quote_item_added', { product_id: sku, category_id: categorySlug });
    return result;
  }

  function prepare() {
    add();
    router.push('/cotizacion/');
  }

  function addToList() {
    const result = add();
    setStatus(result === 'agregado' ? `${name} quedó en tu lista de cotización.` : 'Este producto ya está en tu lista.');
  }

  const directMessage = `Hola, quiero cotizar "${name}" (${sku}) con el logo de mi empresa. ¿Me ayudan con cantidades, valor y entrega?`;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={prepare}
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-danger-600 px-8 font-semibold text-white transition-colors hover:bg-danger-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-700"
        >
          Preparar cotización
        </button>
        <a
          href={whatsappHref(directMessage)}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="producto_directo"
          data-product={sku}
          className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[#1a8f47] px-7 font-semibold text-[#0f6b33] transition-colors hover:bg-[#e9f8ef]"
        >
          Consultar por WhatsApp
        </a>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {inList ? (
          <Link href="/cotizacion/" className="inline-flex min-h-11 items-center font-semibold text-brand-600 underline-offset-4 hover:underline">
            Ver mi lista de cotización ({draft.items.length})
          </Link>
        ) : (
          <button type="button" onClick={addToList} className="inline-flex min-h-11 items-center font-semibold text-brand-600 underline-offset-4 hover:underline">
            + Agregar a mi lista para cotizar varios productos
          </button>
        )}
      </div>
      <p aria-live="polite" className="text-sm text-slate-700">
        {status}
      </p>
    </div>
  );
}
