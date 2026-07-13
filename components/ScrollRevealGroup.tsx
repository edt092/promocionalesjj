'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Aplica el patrón stagger-reveal de GSAP ScrollTrigger (lib/scrollReveal.ts) a los hijos
 * directos que matcheen `itemSelector` cuando el contenedor entra en viewport.
 */
export default function ScrollRevealGroup({
  children,
  className,
  itemSelector = ':scope > *',
  stagger,
}: {
  children: ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const { revealOnScroll } = await import('@/lib/scrollReveal');
      if (cancelled || !ref.current) return;
      cleanup = await revealOnScroll(ref.current, itemSelector, { stagger });
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [itemSelector, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
