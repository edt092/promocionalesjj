const FAQS = [
  {
    question: '¿Cuál es el pedido mínimo para personalizar productos con mi logo?',
    answer:
      'Depende de cada producto. Cuando el proveedor publica una regla (por ejemplo, múltiplos de 50 unidades por color), la ves en la ficha; si no aparece, te la confirmamos al cotizar.',
  },
  {
    question: '¿A qué ciudades de Colombia hacen entregas?',
    answer:
      'Entregamos en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y el resto del territorio nacional mediante transportadora.',
  },
  {
    question: '¿Cuánto tarda la producción de un pedido personalizado?',
    answer:
      'Los tiempos varían según el producto, la cantidad y la técnica de marcación. Indica tu fecha requerida al cotizar y te confirmamos si es viable.',
  },
  {
    question: '¿Cómo se calcula el valor de un pedido?',
    answer:
      'Depende del producto, la cantidad, la técnica de marcación y la entrega. Prepara tu cotización con esos datos y te enviamos el valor y las condiciones por WhatsApp.',
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
                <span aria-hidden="true" className="flex-shrink-0 text-slate-600 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
