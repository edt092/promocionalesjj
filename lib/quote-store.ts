'use client';

import { useSyncExternalStore } from 'react';
import type { QuoteDetails, QuoteItem } from './quote-rules';

/**
 * Borrador de cotización en localStorage (solo en este navegador). Guarda lo mínimo para preparar el
 * mensaje: productos, cantidades, notas, ciudad, fecha y preferencia de técnica. No guarda logos ni
 * datos de contacto. Se borra con clearQuote() desde la página de cotización.
 */
export interface QuoteDraft {
  items: QuoteItem[];
  details: QuoteDetails;
}

const KEY = 'jj-cotizacion-v1';
const EVENT = 'jj-cotizacion-cambio';
const EMPTY: QuoteDraft = { items: [], details: { city: '', department: '', date: '', noDate: false, technique: '', needsAdvice: false, goal: '', budget: '', company: '' } };

let cache: QuoteDraft = EMPTY;
let cacheRaw: string | null = null;
let storageAvailable = true;

function read(): QuoteDraft {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    const parsed = raw ? (JSON.parse(raw) as Partial<QuoteDraft>) : null;
    cache = parsed && Array.isArray(parsed.items) ? { items: parsed.items, details: { ...EMPTY.details, ...parsed.details } } : EMPTY;
  } catch {
    storageAvailable = false;
  }
  return cache;
}

function write(draft: QuoteDraft) {
  cache = draft;
  try {
    cacheRaw = JSON.stringify(draft);
    window.localStorage.setItem(KEY, cacheRaw);
  } catch {
    // Sin almacenamiento (modo privado, cuota): el borrador vive solo mientras la pestaña esté abierta.
    storageAvailable = false;
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange); // cambios desde otra pestaña
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function useQuote(): QuoteDraft {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function isStorageAvailable() {
  return storageAvailable;
}

export function addItem(item: Omit<QuoteItem, 'quantity'> & { quantity?: string }): 'agregado' | 'ya-estaba' {
  const draft = read();
  if (draft.items.some((i) => i.slug === item.slug)) return 'ya-estaba';
  write({ ...draft, items: [...draft.items, { quantity: '', notes: '', ...item }] });
  return 'agregado';
}

export function updateItem(slug: string, patch: Partial<QuoteItem>) {
  const draft = read();
  write({ ...draft, items: draft.items.map((i) => (i.slug === slug ? { ...i, ...patch } : i)) });
}

export function removeItem(slug: string) {
  const draft = read();
  write({ ...draft, items: draft.items.filter((i) => i.slug !== slug) });
}

export function updateDetails(patch: Partial<QuoteDetails>) {
  const draft = read();
  write({ ...draft, details: { ...draft.details, ...patch } });
}

export function clearQuote() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* sin almacenamiento: basta con vaciar la memoria */
  }
  cache = EMPTY;
  cacheRaw = null;
  window.dispatchEvent(new Event(EVENT));
}
