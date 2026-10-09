import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildQuoteMessage, checkQuantity, isQuoteReady, parseQuantityRule } from '../lib/quote-rules.ts';

test('extrae la regla por color de la ficha Ballpop', () => {
  const rule = parseQuantityRule('Medidas: 10.5 cm Marca: 3 cm / Tampografía Venta mínima en múltiplos de caja de 50 unidades por color.');
  assert.deepEqual(rule, { multiple: 50, perColor: true });
});

test('distingue reglas sin "por color" y acepta "multiplos" sin tilde', () => {
  assert.deepEqual(parseQuantityRule('Venta mínima y en multiplos de caja de 100 unidades'), { multiple: 100, perColor: false });
});

test('un producto sin regla publicada no se valida por múltiplos (no hay mínimo global)', () => {
  assert.equal(parseQuantityRule('Bolígrafo plástico. Clip metálico.'), undefined);
  assert.deepEqual(checkQuantity('37'), { ok: true });
});

test('cantidad que no es múltiplo: explica la regla y sugiere valores sin redondear', () => {
  const result = checkQuantity('120', { multiple: 50, perColor: true });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.reason, 'no-multiplo');
  assert.deepEqual(result.suggestions, [100, 150]);
  assert.match(result.message, /múltiplos de 50 unidades por color/);
});

test('por debajo del mínimo solo sugiere valores válidos (nunca 0)', () => {
  const result = checkQuantity('30', { multiple: 50, perColor: false });
  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(result.suggestions, [50]);
});

test('rechaza formatos ambiguos en lugar de interpretarlos', () => {
  for (const raw of ['1.000', '100 und', '-50', '']) {
    assert.equal(checkQuantity(raw, { multiple: 50, perColor: false }).ok, false, raw);
  }
  assert.equal(checkQuantity('0').ok, false);
});

test('el mensaje incluye producto, SKU, cantidad, ciudad, fecha y pide confirmar sin prometer', () => {
  const msg = buildQuoteMessage(
    [{ slug: 'boligrafo-ballpop', sku: 'JJ-000001', name: 'Bolígrafo Ballpop', quantity: '100', notes: '50 azules y 50 rojos' }],
    { city: 'Bogotá', department: 'Cundinamarca', date: '2026-11-20', technique: '', needsAdvice: true }
  );
  assert.match(msg, /Bolígrafo Ballpop \(JJ-000001\): 100 unidades — 50 azules y 50 rojos/);
  assert.match(msg, /Ciudad de entrega: Bogotá, Cundinamarca\./);
  assert.match(msg, /Fecha requerida: 20\/11\/2026\./);
  assert.match(msg, /necesito asesoría/);
  assert.match(msg, /confirmen disponibilidad/);
  assert.doesNotMatch(msg, /recibid|confirmad/i);
});

test('sin fecha definida y varios productos', () => {
  const msg = buildQuoteMessage(
    [
      { slug: 'a', sku: 'JJ-1', name: 'A', quantity: '50' },
      { slug: 'b', sku: 'JJ-2', name: 'B', quantity: '' },
    ],
    { city: 'Cali', noDate: true, technique: 'láser' }
  );
  assert.match(msg, /• A \(JJ-1\): 50 unidades/);
  assert.match(msg, /• B \(JJ-2\): cantidad por definir/);
  assert.match(msg, /sin fecha definida/);
  assert.match(msg, /Personalización: láser\./);
});

test('el resumen solo está listo con ciudad, fecha (o sin fecha) y cantidades válidas', () => {
  const rules = { a: { multiple: 50, perColor: true } };
  const items = [{ slug: 'a', sku: 'JJ-1', name: 'A', quantity: '100' }];
  assert.equal(isQuoteReady(items, { city: 'Bogotá', noDate: true }, rules), true);
  assert.equal(isQuoteReady(items, { city: '', noDate: true }, rules), false);
  assert.equal(isQuoteReady(items, { city: 'Bogotá' }, rules), false);
  assert.equal(isQuoteReady([{ ...items[0], quantity: '120' }], { city: 'Bogotá', noDate: true }, rules), false);
  assert.equal(isQuoteReady([], { city: 'Bogotá', noDate: true }, rules), false);
});

test('con asesoría se puede dejar la cantidad por definir, pero una cantidad escrita se sigue validando', () => {
  const rules = { a: { multiple: 50, perColor: true } };
  const base = { city: 'Medellín', noDate: true, needsAdvice: true };
  assert.equal(isQuoteReady([{ slug: 'a', sku: 'JJ-1', name: 'A', quantity: '' }], base, rules), true);
  assert.equal(isQuoteReady([{ slug: 'a', sku: 'JJ-1', name: 'A', quantity: '70' }], base, rules), false);
});

test('happy path B: asesoría sin productos exige describir el uso y lo incluye en el mensaje', () => {
  const details = { city: 'Bogotá', noDate: true, needsAdvice: true, goal: 'regalos para 200 asistentes de una feria', budget: '' };
  assert.equal(isQuoteReady([], { ...details, goal: '' }, {}), false);
  assert.equal(isQuoteReady([], details, {}), true);
  const msg = buildQuoteMessage([], details);
  assert.match(msg, /necesito asesoría para elegir productos/);
  assert.match(msg, /Uso o evento: regalos para 200 asistentes/);
  assert.doesNotMatch(msg, /Presupuesto/);
});
