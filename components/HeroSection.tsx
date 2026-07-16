'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import MagneticButton from './MagneticButton';
import { whatsappHref, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/contact';

/**
 * Hero (prompt.md secc. 3A): split-screen con profundidad en capas — grid geométrico oscuro
 * de fondo (Z0) y texto masivo en primer plano (Z2) que se desplaza más rápido que el fondo
 * al hacer scroll (parallax multicapa).
 */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let revertGsap: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
        const targets = [gridRef.current, eyebrowRef.current, ...lines, copyRef.current, ctaRef.current, scrollIndicatorRef.current];

        if (prefersReduced) {
          gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
          return;
        }

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);
        intro.fromTo(eyebrowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3);
        intro.fromTo(
          lines,
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.1, transformOrigin: '50% 100%' },
          0.42
        );
        intro.fromTo([copyRef.current, ctaRef.current], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, 0.9);
        intro.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.2);

        // Profundidad de scroll: el fondo geométrico se mueve más lento que el texto en
        // primer plano (parallax multicapa pedido en prompt.md).
        // Se crea recién al terminar el intro para que no compita por las mismas
        // propiedades (opacity/transform) que la animación de entrada — esa pelea es
        // lo que hacía que el texto desapareciera de golpe en vez de ir apagándose al
        // ritmo del scroll, y que no volviera a aparecer al subir.
        const setupScrollParallax = () => {
          if (window.innerWidth < 1024) return;
          const scrub = { trigger: section, start: 'top top', end: '+=85%', scrub: 1 };
          gsap.fromTo(
            gridRef.current,
            { y: 0 },
            { y: '8vh', ease: 'none', immediateRender: false, scrollTrigger: scrub }
          );
          gsap.fromTo(
            lines,
            { y: 0, scale: 1, opacity: 1 },
            { y: '-16vh', scale: 0.96, opacity: 0.15, ease: 'none', immediateRender: false, scrollTrigger: scrub }
          );
          gsap.fromTo(
            ctaRef.current,
            { y: 0, opacity: 1 },
            { y: '-8vh', opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: scrub }
          );
        };
        intro.eventCallback('onComplete', setupScrollParallax);
      }, section);

      revertGsap = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revertGsap?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero relative overflow-clip bg-navy-900" style={{ minHeight: '100svh' }}>
      {/* Z0 — grid geométrico oscuro de fondo */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 60% 40%, black 10%, transparent 75%)',
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradiente-primario opacity-90" />

      <div aria-hidden="true" className="noise-overlay absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" />

      {/* Z2 — contenido, con backdrop-blur para legibilidad sobre el fondo (prompt.md secc. 3A) */}
      <div className="relative z-10 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 px-5 sm:px-8 lg:px-10 max-w-[1920px] mx-auto pt-28 lg:pt-32 w-full">
        <p
          ref={eyebrowRef}
          className="col-span-4 md:col-span-8 lg:col-span-12 text-white/90 text-[clamp(14px,1.05vw,18px)] tracking-[-0.01em] backdrop-blur-sm w-fit rounded-full px-1"
        >
          Productos promocionales para empresas en toda Colombia
        </p>

        <h1
          className="col-span-4 md:col-span-8 lg:col-span-10 mt-6 text-white font-extrabold leading-[0.98] tracking-tight text-[clamp(2.4rem,7vw,6.2rem)]"
          style={{ overflowWrap: 'break-word' }}
        >
          <span className="block overflow-hidden">
            <span ref={(el) => { lineRefs.current[0] = el; }} className="block backdrop-blur-sm">
              Merchandising que
            </span>
          </span>
          <span className="block overflow-hidden">
            <span ref={(el) => { lineRefs.current[1] = el; }} className="block text-sky-400 backdrop-blur-sm">
              deja marca en Colombia.
            </span>
          </span>
        </h1>

        <div ref={copyRef} className="col-span-4 md:col-span-6 lg:col-span-6 mt-8">
          <p className="text-white/80 text-[clamp(16px,1.1vw,20px)] leading-[1.55] max-w-[46ch] backdrop-blur-sm">
            Personalizamos artículos promocionales con tu logo para empresas en Bogotá, Medellín, Cali,
            Barranquilla y Bucaramanga: piezas útiles, memorables y a precio mayorista.
          </p>
        </div>

        <div ref={ctaRef} className="col-span-4 md:col-span-8 lg:col-span-6 mt-10 flex flex-col sm:flex-row gap-3">
          <MagneticButton>
            <Link
              href="/tienda/"
              className="group inline-flex items-center justify-center gap-2 h-[58px] px-8 rounded-full bg-white text-navy-900 text-[15px] font-semibold transition-colors duration-200 hover:bg-sky-100 w-full sm:w-auto"
            >
              Explorar catálogo
              <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a
              href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[58px] px-8 rounded-full bg-danger hover:bg-danger-600 text-white text-[15px] font-semibold transition-colors duration-200 shadow-danger-glow w-full sm:w-auto"
            >
              Cotiza con Nosotros
            </a>
          </MagneticButton>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-5 sm:left-8 lg:left-10 z-10">
        <a href="#categorias" className="group inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors">
          <span className="flex items-center justify-center w-11 h-11 rounded-full border border-white/30 group-hover:border-sky-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="animate-[scrollBounce_1.8s_ease-in-out_infinite]">
              <path d="M7 1v11M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-xs tracking-[0.14em] uppercase">Descubrir</span>
        </a>
      </div>
    </section>
  );
}
