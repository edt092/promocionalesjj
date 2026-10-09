'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import MagneticButton from './MagneticButton';
import { whatsappHref, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/contact';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda/', label: 'Tienda' },
  { href: '/productos-promocionales-colombia/', label: 'Colombia' },
  { href: '/promociones/', label: 'Promociones' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contacto/', label: 'Contacto' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // Solo el inicio tiene un hero oscuro detrás del navbar; en el resto (fondos claros) la barra
  // debe ser sólida desde el primer render o el texto blanco queda invisible sobre blanco.
  const overDarkHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = isScrolled || isMenuOpen || !overDarkHero;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 transition-colors duration-300 ${
          solid ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-full flex items-center justify-between gap-4">
          <Link href="/" aria-label="Promocionales J&J — Inicio" className="flex-shrink-0 inline-flex min-h-11 items-center">
            <Logo className="h-8 sm:h-10" textClassName={solid ? 'text-ink-700' : 'text-white'} />
          </Link>

          <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex min-h-11 items-center text-sm font-medium relative group transition-colors duration-200 whitespace-nowrap ${
                  solid ? 'text-ink-700 hover:text-brand' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute bottom-1.5 left-0 w-0 h-0.5 bg-danger group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:block flex-shrink-0">
            <MagneticButton>
              <a
                href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="navbar"
                className="inline-flex items-center h-11 px-6 rounded-full bg-danger hover:bg-danger-600 text-white text-sm font-semibold transition-colors duration-200 shadow-danger-glow whitespace-nowrap"
              >
                Cotiza con Nosotros
              </a>
            </MagneticButton>
          </div>

          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-controls="menu-movil"
            aria-expanded={isMenuOpen}
            className={`md:hidden relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 ${
              solid ? 'text-ink-700' : 'text-white'
            }`}
          >
            <span
              className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span
              className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>

      <div
        id="menu-movil"
        aria-hidden={!isMenuOpen}
        className={`md:hidden fixed inset-0 z-40 bg-navy-900 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className="inline-flex min-h-12 items-center text-2xl font-bold text-white hover:text-sky-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={isMenuOpen ? 0 : -1}
            data-cta="menu_movil"
            className="mt-2 inline-flex items-center h-12 px-8 rounded-full bg-danger text-white text-lg font-semibold"
          >
            Cotiza con Nosotros
          </a>
        </div>
      </div>
    </>
  );
}
