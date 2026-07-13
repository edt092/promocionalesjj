/**
 * Helper GSAP ScrollTrigger reutilizable: patrón "stagger-reveal" (y:50, opacity:0 -> 1) que
 * prompt.md pide para el grid de categorías/productos (secc. 3B). Se registra el plugin una
 * sola vez por import dinámico para no inflar el bundle inicial.
 */
export async function revealOnScroll(
  container: HTMLElement,
  itemsSelector: string,
  options: { stagger?: number; start?: string } = {}
) {
  const gsapModule = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  const gsap = gsapModule.default;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = container.querySelectorAll<HTMLElement>(itemsSelector);
  if (items.length === 0) return () => {};

  if (prefersReduced) {
    gsap.set(items, { opacity: 1, y: 0 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      items,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: options.stagger ?? 0.08,
        scrollTrigger: {
          trigger: container,
          start: options.start ?? 'top 82%',
        },
      }
    );
  }, container);

  return () => ctx.revert();
}
