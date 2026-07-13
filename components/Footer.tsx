import Link from 'next/link';
import { Logo } from './Logo';
import categoriesData from '@/data/categories.json';
import { colombia } from '@/data/geo-data';
import { whatsappHref, WHATSAPP_DEFAULT_MESSAGE, WHATSAPP_DISPLAY } from '@/lib/contact';

const FEATURED_CATEGORY_SLUGS = [
  'articulos-escritura',
  'mugs',
  'tecnologia',
  'llaveros',
  'gorras',
  'vasos-personalizados',
  'termos-personalizados',
  'maletines',
];

export default function Footer() {
  const featuredCategories = categoriesData.filter((c) => FEATURED_CATEGORY_SLUGS.includes(c.slug));
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white/70">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
        <div className="col-span-2 md:col-span-2">
          <Logo className="h-10 w-auto" />
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            Productos promocionales y merchandising corporativo personalizado con tu logo, con
            cobertura en toda Colombia.
          </p>
          <a
            href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-sky-400 transition-colors"
          >
            WhatsApp: {WHATSAPP_DISPLAY}
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Categorías</h3>
          <ul className="space-y-2.5">
            {featuredCategories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/tienda/categoria/${cat.slug}/`} className="text-sm hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Colombia</h3>
          <ul className="space-y-2.5">
            <li>
              <Link href="/productos-promocionales-colombia/" className="text-sm hover:text-white transition-colors">
                Todas las ciudades
              </Link>
            </li>
            {colombia.ciudades.map((ciudad) => (
              <li key={ciudad.slug}>
                <Link
                  href={`/productos-promocionales-colombia/${ciudad.slug}/`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {ciudad.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Empresa</h3>
          <ul className="space-y-2.5">
            <li>
              <Link href="/tienda/" className="text-sm hover:text-white transition-colors">Catálogo completo</Link>
            </li>
            <li>
              <Link href="/promociones/" className="text-sm hover:text-white transition-colors">Promociones</Link>
            </li>
            <li>
              <Link href="/blog/" className="text-sm hover:text-white transition-colors">Blog</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} Promocionales J&J. Todos los derechos reservados.</p>
          <p>Hecho en Colombia · promocionalesjj.co</p>
        </div>
      </div>
    </footer>
  );
}
