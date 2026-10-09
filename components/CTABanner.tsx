import MagneticButton from './MagneticButton';
import { whatsappHref, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/contact';

/**
 * Banner CTA en Accent Red (prompt.md secc. 3C: "Focus Areas: highly visible CTA banner
 * sections featuring the Accent Red for immediate visual weight").
 */
export default function CTABanner() {
  return (
    <section className="bg-gradiente-acento py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Lleva tu marca a cada rincón de Colombia
        </h2>
        <p className="mt-4 text-white max-w-xl mx-auto">
          Cotiza tu próximo pedido de productos promocionales con atención personalizada y entrega
          en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y el resto del país.
        </p>
        <div className="mt-8 flex justify-center">
          <MagneticButton>
            <a
              href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="banner"
              className="inline-flex items-center gap-2 h-14 px-9 rounded-full bg-white text-danger-600 font-bold text-base transition-transform duration-200 hover:scale-[1.03]"
            >
              Cotizar por WhatsApp
              <span aria-hidden="true">→</span>
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
