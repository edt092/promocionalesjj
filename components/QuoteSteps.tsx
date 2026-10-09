/** Flujo real de cotización (por WhatsApp). No promete plazos ni precios que el negocio no ha publicado. */
const STEPS = [
  { title: 'Elige los productos', text: 'Explora el catálogo y anota el nombre o SKU de los modelos que te interesan.' },
  { title: 'Escríbenos por WhatsApp', text: 'Indica cantidad, ciudad de entrega y fecha requerida para cada producto.' },
  { title: 'Envía tu logo', text: 'Con tu logo confirmamos la técnica de marcación y el área disponible en cada modelo.' },
  { title: 'Recibe la cotización', text: 'Te enviamos precio, condiciones y disponibilidad para aprobar el pedido.' },
];

export default function QuoteSteps({ heading = 'Cómo cotizar' }: { heading?: string }) {
  return (
    <section aria-labelledby="como-cotizar">
      <h2 id="como-cotizar" className="text-2xl font-bold text-ink-700">
        {heading}
      </h2>
      <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-slate-100 bg-white p-5">
            <span className="text-xs font-semibold text-sky-700">Paso {index + 1}</span>
            <h3 className="mt-1 text-base font-semibold text-ink-700">{step.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
