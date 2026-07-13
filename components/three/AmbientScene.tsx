'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { HeroAmbientScene } from '@/lib/three/scene';

export interface AmbientSceneHandle {
  setScrollProgress: (progress: number) => void;
}

/**
 * Monta la escena Three.js del hero dentro de un <canvas>. Se desactiva en touch/reduced-motion
 * (mismo criterio de accesibilidad que el resto del sitio) y limpia el render loop en cleanup.
 */
const AmbientScene = forwardRef<AmbientSceneHandle, { className?: string }>(function AmbientScene(
  { className },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HeroAmbientScene | null>(null);

  useImperativeHandle(ref, () => ({
    setScrollProgress(progress: number) {
      sceneRef.current?.setScrollProgress(progress);
    },
  }));

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReduced || !isFinePointer || !canvasRef.current || !containerRef.current) return;

    let cancelled = false;
    (async () => {
      const { setupHeroAmbientScene } = await import('@/lib/three/scene');
      if (cancelled || !canvasRef.current || !containerRef.current) return;
      sceneRef.current = setupHeroAmbientScene({ canvas: canvasRef.current, container: containerRef.current });
    })();

    return () => {
      cancelled = true;
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className={className}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
});

export default AmbientScene;
