const FAQS = [
  {
    question: '¿Cuál es el pedido mínimo para personalizar productos con mi logo?',
    answer:
      'Depende del producto y la técnica de marcación. La mayoría de artículos manejan mínimos accesibles para pymes; cotiza por WhatsApp indicando cantidad y producto para una respuesta exacta.',
  },
  {
    question: '¿A qué ciudades de Colombia hacen entregas?',
    answer:
      'Entregamos en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y el resto del territorio nacional mediante transportadora.',
  },
  {
    question: '¿Cuánto tarda la producción de un pedido personalizado?',
    answer:
      'Los tiempos varían según el producto y la técnica de marcación (serigrafía, grabado láser, bordado). Te confirmamos el tiempo exacto al cotizar.',
  },
  {
    question: '¿Manejan precios mayoristas para empresas?',
    answer:
      'Sí, ofrecemos descuentos por volumen para pedidos corporativos. Escríbenos por WhatsApp con la cantidad que necesitas para una cotización con precio mayorista.',
  },
];

/**
 * FAQ/contenido semántico (blueprint informe_promodirect_frontend_seo.md). Usa <details>
 * nativo: accesible, sin JS adicional, indexable por crawlers.
 */
export default function FAQSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink-700 mb-8 text-center">Preguntas frecuentes</h2>
        <div className="divide-y divide-slate-100 border-y border-slate-100">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink-700 marker:content-none">
                {faq.question}
                <span aria-hidden="true" className="flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
