'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TiltCard from './TiltCard';
import MagneticButton from './MagneticButton';
import { whatsappHref } from '@/lib/contact';

interface ShowcaseProduct {
  slug: string;
  nombre: string;
  categoria: string;
  imagen_url: string;
  sku: string;
  descripcion_corta: string;
}

// Selección curada de productos con fotografía nítida para la vitrina interactiva
// (header.md: "Header Interactivo de Productos Promocionales").
const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    slug: 'morral-backpack-nordic',
    nombre: 'Morral Backpack Nordic',
    categoria: 'Maletines',
    imagen_url: '/img/productos/morral-backpack-nordic.jpg',
    sku: 'JJ-000042',
    descripcion_corta: 'Poliéster 1680D con bolsillo acolchado para laptop de 15" y dos compartimentos organizadores.',
  },
  {
    slug: 'termo-bamboo-500ml',
    nombre: 'Termo Bamboo 500ml',
    categoria: 'Termos Personalizados',
    imagen_url: '/img/productos/termo-bamboo-500ml.jpg',
    sku: 'JJ-000468',
    descripcion_corta: 'Acero inoxidable con exterior en bambú natural, tapa rosca y cierre a presión.',
  },
  {
    slug: 'set-de-bar-martini',
    nombre: 'Set de Bar Martini',
    categoria: 'Bar y Vino',
    imagen_url: '/img/productos/set-de-bar-martini.jpg',
    sku: 'JJ-000408',
    descripcion_corta: 'Set para cócteles en acero inoxidable, mezclador de 750ml con base en madera.',
  },
  {
    slug: 'maletin-trolley-bag-norris',
    nombre: 'Maletín Trolley Bag Norris',
    categoria: 'Maletines',
    imagen_url: '/img/productos/maletin-trolley-bag-norris.jpg',
    sku: 'JJ-000043',
    descripcion_corta: 'Poliéster 600D con bolsillo exterior y cuerda elástica para sujetar objetos.',
  },
  {
    slug: 'set-de-portavasos-cork',
    nombre: 'Set de Portavasos Cork',
    categoria: 'Hogar',
    imagen_url: '/img/productos/set-de-portavasos-cork.jpg',
    sku: 'JJ-000572',
    descripcion_corta: 'Set de 5 portavasos con base en corcho natural, 12cm de diámetro.',
  },
  {
    slug: 'nevera-cooler-bag-ava',
    nombre: 'Nevera Cooler Bag Ava',
    categoria: 'Maletines',
    imagen_url: '/img/productos/nevera-cooler-bag-ava.jpg',
    sku: 'JJ-000046',
    descripcion_corta: 'Poliuretano metalizado con interior en aluminio para conservar la temperatura.',
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const active = SHOWCASE_PRODUCTS[activeIndex];

  // Spotlight que sigue al cursor por toda la sección (header.md: "focos de luz que siguen al
  // cursor"). Lerp manual con rAF: primer frame ya refleja el puntero (< 50ms, regla Doherty),
  // los siguientes suavizan el trayecto sin depender de GSAP para una simple variable CSS.
  useEffect(() => {
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    let targetX = 50;
    let targetY = 40;
    let currentX = 50;
    let currentY = 40;
    let raf = 0;

    function tick() {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      spotlight!.style.setProperty('--spot-x', `${currentX}%`);
      spotlight!.style.setProperty('--spot-y', `${currentY}%`);
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function onMove(event: PointerEvent) {
      const rect = section!.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 100;
      targetY = ((event.clientY - rect.top) / rect.height) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    section.addEventListener('pointermove', onMove);
    return () => {
      section.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Transición inercial suave al cambiar de producto en el dock flotante.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    let cancelled = false;
    (async () => {
      const gsapModule = await import('gsap');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.fromTo(
        stage,
        { opacity: 0, y: 14, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [activeIndex]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  // Diálogo accesible: foco dentro al abrir, Tab atrapado, Escape cierra y el foco vuelve al disparador.
  useEffect(() => {
    if (!modalOpen) return;
    const dialog = dialogRef.current;
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((el) => el.offsetParent !== null && el.tabIndex >= 0);
    focusables()[0]?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    const trigger = triggerRef.current;
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [modalOpen, closeModal]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy-950 py-20 lg:py-28"
    >
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 40%), rgba(0,191,255,0.14), transparent 70%)',
        }}
      />
      <div aria-hidden="true" className="noise-overlay absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sky-400 text-[13px] font-semibold tracking-[0.14em] uppercase">Vitrina interactiva</p>
          <h2 className="mt-3 text-white font-extrabold leading-[1.05] tracking-tight text-[clamp(1.8rem,3.6vw,3rem)]">
            Tus productos insignia, de cerca.
          </h2>
          <p className="mt-4 text-white/70 text-[15px] leading-relaxed">
            Elige un producto en la barra inferior para verlo de cerca y abre el ejemplo de marcación.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <TiltCard className="w-full">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setModalOpen(true)}
              className="group relative block w-full aspect-square rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden text-left"
              aria-label={`Ver ejemplo de marcación en ${active.nombre}`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(240px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.12), transparent 65%)',
                }}
              />
              <div ref={stageRef} className="relative w-full h-full">
                <Image
                  src={active.imagen_url}
                  alt={active.nombre}
                  fill
                  className="object-contain p-10 sm:p-14"
                  sizes="(min-width: 1024px) 560px, 90vw"
                />
              </div>
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-[12px] text-white/90 backdrop-blur-sm transition-colors duration-150 group-hover:bg-white/20">
                Ver ejemplo de marcación →
              </span>
            </button>
          </TiltCard>

          <div>
            <span className="inline-block rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[12px] text-sky-300 tracking-wide uppercase">
              {active.categoria}
            </span>
            <h3 className="mt-4 text-white font-bold text-[clamp(1.4rem,2.2vw,2rem)] leading-tight">{active.nombre}</h3>
            <p className="mt-3 text-white/70 text-[15px] leading-relaxed max-w-[46ch]">{active.descripcion_corta}</p>
            <p className="mt-2 text-white/70 text-[13px]">SKU {active.sku}</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <MagneticButton>
                <Link
                  href={`/tienda/${active.slug}/`}
                  className="group inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full bg-white text-navy-900 text-[14px] font-semibold transition-colors duration-150 hover:bg-sky-100 w-full sm:w-auto"
                >
                  Ver producto
                  <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={whatsappHref(`Hola, me interesa cotizar el producto "${active.nombre}" personalizado para mi empresa en Colombia.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="vitrina"
                  className="inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-danger-600 hover:bg-danger-700 text-white text-[14px] font-semibold transition-colors duration-150 w-full sm:w-auto"
                >
                  Cotiza este producto
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Dock flotante de miniaturas */}
        <div className="mt-14 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md px-2.5 py-2.5 overflow-x-auto max-w-full">
            {SHOWCASE_PRODUCTS.map((product, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Mostrar ${product.nombre}`}
                  aria-pressed={isActive}
                  className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border transition-all duration-150 active:scale-90 ${
                    isActive ? 'border-sky-400 ring-2 ring-sky-400/50 scale-105' : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={product.imagen_url}
                    alt=""
                    fill
                    className="object-contain bg-white/5 p-1.5"
                    sizes="64px"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Ejemplo de marcación: ${active.nombre}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Fondo: cierra con clic, pero no es un control de teclado (evita dos "Cerrar" en el orden de foco). */}
          <button
            type="button"
            onClick={closeModal}
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm animate-fadeIn"
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-navy-900 border border-white/10 p-6 sm:p-8 animate-fadeIn">
            <button
              type="button"
              onClick={closeModal}
              aria-label="Cerrar"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-150 flex items-center justify-center text-white"
            >
              ✕
            </button>
            <div className="relative w-full aspect-square rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
              <Image src={active.imagen_url} alt={active.nombre} fill sizes="(min-width: 640px) 512px, 90vw" className="object-contain p-10" />
              <div className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-white shadow-lift p-2 flex items-center justify-center">
                <Image src="/promocionalesjj_icon.png" alt="Logo de ejemplo" width={40} height={40} className="object-contain" />
              </div>
            </div>
            <h3 className="mt-5 text-white font-bold text-lg">{active.nombre}</h3>
            <p className="mt-1 text-white/60 text-sm">Ejemplo ilustrativo de marcación con un logo de muestra. El diseño final con tu logo se confirma antes de producir.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappHref(`Hola, quiero cotizar el producto "${active.nombre}" personalizado con mi logo.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[48px] px-6 rounded-full bg-danger-600 hover:bg-danger-700 text-white text-[14px] font-semibold transition-colors duration-150 w-full sm:w-auto"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
