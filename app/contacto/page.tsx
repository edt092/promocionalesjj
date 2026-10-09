import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuoteSteps from '@/components/QuoteSteps';
import { colombia } from '@/data/geo-data';
import { WHATSAPP_DISPLAY, WHATSAPP_DEFAULT_MESSAGE, whatsappHref } from '@/lib/contact';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contacto y cotización de productos promocionales',
  description:
    'Cotiza productos promocionales con el logo de tu empresa: indica producto, cantidad, ciudad y fecha requerida y continúa la conversación por WhatsApp.',
  path: '/contacto/',
});

/**
 * Contacto con los canales verificados del negocio (hoy: WhatsApp). Razón social, NIT, dirección y
 * correo se añadirán cuando el negocio los confirme (docs/seo/datos-pendientes-negocio.md).
 */
export default function ContactoPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Contacto' }]} />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-700">Contacto y cotización</h1>
        <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed">
          Atendemos las cotizaciones de productos promocionales por WhatsApp. Prepara tu pedido con la cotización guiada o
          escríbenos directamente.
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <section className="lg:col-span-3 rounded-2xl border border-slate-100 p-6 sm:p-8" aria-labelledby="form-cotizacion">
            <h2 id="form-cotizacion" className="text-xl font-semibold text-ink-700">
              Solicitar cotización
            </h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Prepara un mensaje con productos, cantidades, ciudad y fecha requerida. Si aún no sabes qué elegir, puedes pedir
              asesoría y contarnos para qué es el pedido.
            </p>
            <a
              href="/cotizacion/"
              className="mt-5 inline-flex min-h-12 items-center rounded-full bg-danger-600 px-7 text-sm font-semibold text-white hover:bg-danger-700 transition-colors"
            >
              Preparar cotización
            </a>
          </section>

          <aside className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-ink-700">WhatsApp</h2>
              <p className="mt-2 text-2xl font-bold text-ink-700">{WHATSAPP_DISPLAY}</p>
              <a
                href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="contacto"
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#0F7A3E] px-6 text-sm font-semibold text-white hover:bg-[#0B6633] transition-colors"
              >
                Abrir chat
              </a>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-ink-700">Cobertura</h2>
              <p className="mt-2 text-sm text-slate-600">Atendemos empresas en toda Colombia, entre ellas:</p>
              <ul className="mt-2">
                {colombia.ciudades.map((ciudad) => (
                  <li key={ciudad.slug}>
                    <Link
                      href={`/productos-promocionales-colombia/${ciudad.slug}/`}
                      className="inline-flex min-h-11 items-center text-sm text-ink-700 hover:text-brand"
                    >
                      {ciudad.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-14">
          <QuoteSteps />
        </div>
      </div>
    </div>
  );
}
