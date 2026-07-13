'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Envoltorio con efecto de atracción magnética (prompt.md secc. 3C: "buttons must have
 * magnetic draw effects using GSAP"). El elemento se desplaza hacia el puntero dentro de su
 * propio radio y vuelve a su posición al salir.
 */
export default function MagneticButton({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    let moveX: (value: number) => void;
    let moveY: (value: number) => void;
    let cancelled = false;

    (async () => {
      const gsapModule = await import('gsap');
      if (cancelled || !ref.current) return;
      const gsap = gsapModule.default;
      moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    })();

    function onMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      moveX?.(relX * strength);
      moveY?.(relY * strength);
    }
    function onLeave() {
      moveX?.(0);
      moveY?.(0);
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelled = true;
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
