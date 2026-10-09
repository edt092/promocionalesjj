'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import MagneticButton from './MagneticButton';
import { whatsappHref, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/contact';
import { useQuote } from '@/lib/quote-store';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda/', label: 'Tienda' },
  { href: '/productos-promocionales-colombia/', label: 'Colombia' },
  { href: '/promociones/', label: 'Promociones' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contacto/', label: 'Contacto' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useQuote();
  // Solo el inicio tiene un hero oscuro detrás del navbar; en el resto (fondos claros) la barra
  // debe ser sólida desde el primer render o el texto blanco queda invisible sobre blanco (H01).
  const overDarkHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar el menú al navegar y con Escape.
  useEffect(() => setIsMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const solid = isScrolled || isMenuOpen || !overDarkHero;
  const quoteLabel = `Mi cotización${items.length ? ` (${items.length})` : ''}`;

  return (
    <>
      <nav
        aria-label="Principal"
        className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 transition-colors duration-300 ${
          solid ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-full flex items-center justify-between gap-4">
          <Link href="/" aria-label="Promocionales J&J — Inicio" className="flex-shrink-0 inline-flex min-h-11 items-center">
            <Logo className="h-8 sm:h-10" textClassName={solid ? 'text-ink-700' : 'text-white'} />
          </Link>

          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center text-sm font-medium relative group transition-colors duration-200 whitespace-nowrap ${
                    solid ? 'text-ink-700 hover:text-brand-600' : 'text-white hover:text-sky-300'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-1.5 left-0 h-0.5 rounded-full bg-danger-600 transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex flex-shrink-0 items-center gap-4">
            {items.length > 0 && (
              <Link
                href="/cotizacion/"
                aria-current={pathname.startsWith('/cotizacion') ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center text-sm font-semibold whitespace-nowrap ${solid ? 'text-brand-600' : 'text-white'}`}
              >
                {quoteLabel}
              </Link>
            )}
            <MagneticButton>
              <a
                href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="navbar"
                className="inline-flex items-center h-11 px-6 rounded-full bg-danger-600 hover:bg-danger-700 text-white text-sm font-semibold transition-colors duration-200 shadow-danger-glow whitespace-nowrap"
              >
                Cotizar por WhatsApp
              </a>
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-controls="menu-movil"
            aria-expanded={isMenuOpen}
            className={`lg:hidden relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 ${
              solid ? 'text-ink-700' : 'text-white'
            }`}
          >
            <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        id="menu-movil"
        aria-hidden={!isMenuOpen}
        className={`lg:hidden fixed inset-0 z-40 overflow-y-auto bg-navy-900 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex min-h-full flex-col items-center justify-center gap-3 px-8 pt-20 pb-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              aria-current={isActive(pathname, link.href) ? 'page' : undefined}
              className="inline-flex min-h-12 items-center text-2xl font-bold text-white hover:text-sky-300 aria-[current=page]:text-sky-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {items.length > 0 && (
            <Link
              href="/cotizacion/"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className="inline-flex min-h-12 items-center text-xl font-semibold text-sky-300"
            >
              {quoteLabel}
            </Link>
          )}
          <a
            href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={isMenuOpen ? 0 : -1}
            data-cta="menu_movil"
            className="mt-4 inline-flex items-center h-12 px-8 rounded-full bg-danger-600 text-white text-lg font-semibold"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
