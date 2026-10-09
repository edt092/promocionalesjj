/**
 * Reglas de cantidad y construcción del mensaje de cotización (H04). Módulo puro, sin dependencias,
 * para poder probarlo con `node --test` (tests/quote-rules.test.ts).
 *
 * Las reglas salen del texto del proveedor de cada producto ("Venta mínima en múltiplos de caja de 50
 * unidades por color"). No hay regla global: un producto sin regla publicada no se valida por múltiplos.
 */

export interface QuantityRule {
  /** Tamaño de caja: la cantidad debe ser múltiplo de este valor (y al menos uno). */
  multiple: number;
  /** La regla aplica a cada color por separado. */
  perColor: boolean;
}

export function parseQuantityRule(text: string): QuantityRule | undefined {
  const m = text.match(/m[uú]ltiplos de caja de (\d+) unidades( por color)?/i);
  if (!m) return undefined;
  const multiple = Number(m[1]);
  if (!Number.isInteger(multiple) || multiple <= 0) return undefined;
  return { multiple, perColor: Boolean(m[2]) };
}

/** Texto corto de la regla para tarjetas y listados. */
export function quantityNote(rule?: QuantityRule): string | undefined {
  return rule ? `Pedido en múltiplos de ${rule.multiple}${rule.perColor ? ' por color' : ''}` : undefined;
}

export type QuantityCheck =
  | { ok: true }
  | { ok: false; reason: 'vacia' | 'no-numerica' | 'no-positiva' | 'no-multiplo'; message: string; suggestions: number[] };

/**
 * Valida una cantidad sin corregirla: si no cumple, explica la regla y sugiere los dos valores válidos
 * más cercanos para que la persona decida (nunca se redondea automáticamente).
 */
export function checkQuantity(raw: string, rule?: QuantityRule): QuantityCheck {
  const value = raw.trim();
  if (!value) return { ok: false, reason: 'vacia', message: 'Indica cuántas unidades necesitas.', suggestions: [] };
  if (!/^\d+$/.test(value)) {
    return { ok: false, reason: 'no-numerica', message: 'Escribe la cantidad solo con números, sin puntos ni letras.', suggestions: [] };
  }
  const n = Number(value);
  if (n <= 0) return { ok: false, reason: 'no-positiva', message: 'La cantidad debe ser mayor que cero.', suggestions: [] };
  if (!rule || n % rule.multiple === 0) return { ok: true };

  const lower = Math.floor(n / rule.multiple) * rule.multiple;
  const upper = lower + rule.multiple;
  const suggestions = [lower, upper].filter((x) => x >= rule.multiple);
  const scope = rule.perColor ? ' por color' : '';
  const examples = [1, 2, 3].map((k) => (k * rule.multiple).toLocaleString('es-CO')).join(', ');
  return {
    ok: false,
    reason: 'no-multiplo',
    message: `Este producto se vende en múltiplos de ${rule.multiple} unidades${scope}: por ejemplo ${examples} o más.`,
    suggestions,
  };
}

export interface QuoteItem {
  slug: string;
  sku: string;
  name: string;
  quantity: string;
  /** Distribución por colores u otra nota del producto (texto libre opcional). */
  notes?: string;
}

export interface QuoteDetails {
  city: string;
  department?: string;
  /** Fecha ISO (AAAA-MM-DD) o vacío cuando la persona marca "sin fecha definida". */
  date?: string;
  noDate?: boolean;
  technique?: string;
  needsAdvice?: boolean;
  /** Para qué es el pedido (evento, campaña, regalo). Útil cuando se pide asesoría. */
  goal?: string;
  /** Presupuesto aproximado, opcional y en texto libre. */
  budget?: string;
  company?: string;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

/** Mensaje precompletado para WhatsApp. No promete precio, stock ni fecha: pide confirmarlos. */
export function buildQuoteMessage(items: QuoteItem[], details: QuoteDetails): string {
  const lines: string[] = [items.length ? 'Hola, quiero cotizar:' : 'Hola, necesito asesoría para elegir productos promocionales.'];
  for (const item of items) {
    const qty = item.quantity.trim() ? `${Number(item.quantity).toLocaleString('es-CO')} unidades` : 'cantidad por definir';
    lines.push(`• ${item.name} (${item.sku}): ${qty}${item.notes?.trim() ? ` — ${item.notes.trim()}` : ''}`);
  }
  const place = [details.city.trim(), details.department?.trim()].filter(Boolean).join(', ');
  lines.push(`Ciudad de entrega: ${place || 'por definir'}.`);
  lines.push(`Fecha requerida: ${details.noDate || !details.date ? 'sin fecha definida' : formatDate(details.date)}.`);
  const technique = details.technique?.trim();
  if (details.needsAdvice) lines.push('Personalización: necesito asesoría.');
  else if (technique) lines.push(`Personalización: ${technique}.`);
  if (details.goal?.trim()) lines.push(`Uso o evento: ${details.goal.trim()}.`);
  if (details.budget?.trim()) lines.push(`Presupuesto aproximado: ${details.budget.trim()}.`);
  if (details.company?.trim()) lines.push(`Empresa: ${details.company.trim()}.`);
  lines.push('Por favor confirmen disponibilidad, valor con marcación y opciones de entrega.');
  return lines.join('\n');
}

export interface QuoteProblem {
  field: string;
  message: string;
}

/**
 * Qué falta para que el resumen esté listo. Con "necesito asesoría" la cantidad puede quedar por
 * definir (si se escribe, se valida igual) y se puede pedir ayuda sin productos si se describe el uso.
 */
export function quoteProblems(items: QuoteItem[], details: QuoteDetails, rules: Record<string, QuantityRule | undefined>): QuoteProblem[] {
  const problems: QuoteProblem[] = [];
  if (items.length === 0 && !(details.needsAdvice && details.goal?.trim())) {
    problems.push({ field: 'productos', message: 'Agrega al menos un producto o marca “Necesito asesoría” y cuéntanos para qué es el pedido.' });
  }
  for (const item of items) {
    if (details.needsAdvice && !item.quantity.trim()) continue;
    const check = checkQuantity(item.quantity, rules[item.slug]);
    if (!check.ok) problems.push({ field: `cantidad-${item.slug}`, message: `${item.name}: ${check.message}` });
  }
  if (!details.city.trim()) problems.push({ field: 'ciudad', message: 'Indica la ciudad de entrega.' });
  if (!details.noDate && !details.date) problems.push({ field: 'fecha', message: 'Indica la fecha requerida o marca “Sin fecha definida”.' });
  return problems;
}

/** Campos mínimos para considerar el resumen listo. */
export function isQuoteReady(items: QuoteItem[], details: QuoteDetails, rules: Record<string, QuantityRule | undefined>): boolean {
  return quoteProblems(items, details, rules).length === 0;
}
