import ScrollRevealGroup from './ScrollRevealGroup';

const ITEMS = [
  {
    title: 'Personalización con tu logo',
    description: 'Marcación por serigrafía, grabado láser, bordado o tampografía según el material.',
  },
  {
    title: 'Precio mayorista',
    description: 'Descuentos por volumen para pedidos corporativos y compras al por mayor.',
  },
  {
    title: 'Cobertura nacional',
    description: 'Entregas en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y el resto de Colombia.',
  },
  {
    title: 'Atención directa',
    description: 'Cotización y seguimiento por WhatsApp, sin intermediarios ni procesos largos.',
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollRevealGroup itemSelector=":scope > div" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 border border-slate-100">
              <span aria-hidden="true" className="block h-2 w-8 rounded-full bg-gradiente-secundario mb-4" />
              <h3 className="text-base font-semibold text-ink-700">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
