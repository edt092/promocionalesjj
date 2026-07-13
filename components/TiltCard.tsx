'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Tarjeta con tilt 3D por posición del mouse (prompt.md secc. 3C: "cards must utilize
 * mouse-tracking 3D tilt effects simulating depth/glassmorphism"). Se desactiva en touch y con
 * prefers-reduced-motion.
 */
export default function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    let setRotX: (value: number) => void;
    let setRotY: (value: number) => void;
    let setGlowX: (value: number) => void;
    let setGlowY: (value: number) => void;
    let cancelled = false;

    (async () => {
      const gsapModule = await import('gsap');
      if (cancelled || !ref.current) return;
      const gsap = gsapModule.default;
      gsap.set(el, { transformPerspective: 900 });
      setRotX = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power3.out' });
      setRotY = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power3.out' });
      setGlowX = gsap.quickTo(el, '--glow-x', { duration: 0.3, ease: 'power2.out' });
      setGlowY = gsap.quickTo(el, '--glow-y', { duration: 0.3, ease: 'power2.out' });
    })();

    function onMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      setRotY?.((px - 0.5) * 14);
      setRotX?.(-(py - 0.5) * 14);
      setGlowX?.(px * 100);
      setGlowY?.(py * 100);
    }
    function onLeave() {
      setRotX?.(0);
      setRotY?.(0);
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelled = true;
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt-perspective [transform-style:preserve-3d] will-change-transform ${className ?? ''}`}>
      {children}
    </div>
  );
}
