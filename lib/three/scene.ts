import * as THREE from 'three';

/**
 * Escena WebGL ambiental para el hero (prompt.md secc. 2-3): objetos low-poly flotantes
 * (bolígrafo, caja de regalo, "blade" metálico inspirado en el logo) que reaccionan a la
 * profundidad de scroll y al puntero. Geometría procedural (sin .glb externos) para que el
 * bundle no dependa de assets binarios pesados.
 */

const COLOR_BRAND = 0x1565ff;
const COLOR_SKY = 0x00bfff;
const COLOR_DANGER = 0xff2d2d;
const COLOR_NAVY = 0x0a1a2f;

interface FloatingObject {
  mesh: THREE.Object3D;
  spinSpeed: THREE.Vector2;
  bobFreq: number;
  bobAmp: number;
  bobPhase: number;
  baseY: number;
  depth: number; // 0 = cerca, 1 = lejos — controla cuánto responde al scroll/parallax
}

function metallic(color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.72,
    roughness: 0.28,
    envMapIntensity: 1.1,
    ...extra,
  });
}

function createPen(): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.1, 12), metallic(COLOR_BRAND));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 12), metallic(COLOR_SKY, { metalness: 0.9, roughness: 0.15 }));
  tip.position.y = 1.26;
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.06), metallic(COLOR_NAVY, { metalness: 0.85 }));
  clip.position.set(0.18, 0.2, 0);
  group.add(body, tip, clip);
  group.rotation.z = Math.PI * 0.18;
  return group;
}

function createGiftBox(): THREE.Group {
  const group = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.0, 1.15), metallic(0xffffff, { metalness: 0.15, roughness: 0.55 }));
  const ribbonX = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.06, 0.16), metallic(COLOR_DANGER, { metalness: 0.5, roughness: 0.3 }));
  const ribbonZ = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.06, 1.22), metallic(COLOR_DANGER, { metalness: 0.5, roughness: 0.3 }));
  const bow = new THREE.Mesh(new THREE.TorusKnotGeometry(0.12, 0.045, 64, 8, 2, 3), metallic(COLOR_DANGER, { metalness: 0.6, roughness: 0.25 }));
  bow.position.y = 0.62;
  group.add(box, ribbonX, ribbonZ, bow);
  return group;
}

function createBlade(): THREE.Mesh {
  // Forma inspirada en el ícono de marca: prisma delgado y alargado, "torcido" con escala no
  // uniforme para sugerir una hoja/blade metálica en vez de un bloque genérico.
  const geometry = new THREE.BoxGeometry(0.22, 1.9, 0.06, 1, 4, 1);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i);
    const twist = (y / 1.9) * 0.35;
    const x = position.getX(i);
    const z = position.getZ(i);
    position.setX(i, x * Math.cos(twist) - z * Math.sin(twist));
    position.setZ(i, x * Math.sin(twist) + z * Math.cos(twist));
  }
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, metallic(COLOR_DANGER, { metalness: 0.85, roughness: 0.18 }));
  mesh.rotation.z = Math.PI * 0.12;
  return mesh;
}

function createGadget(): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 0),
    metallic(COLOR_SKY, { metalness: 0.8, roughness: 0.2, flatShading: true })
  );
}

const FACTORIES = [createPen, createGiftBox, createBlade, createGadget, createPen, createGiftBox, createGadget];

export interface HeroAmbientScene {
  setScrollProgress: (progress: number) => void;
  destroy: () => void;
}

export function setupHeroAmbientScene({
  canvas,
  container,
}: {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
}): HeroAmbientScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(COLOR_SKY, 6, 20);
  rim.position.set(-5, -2, 4);
  scene.add(rim);
  const accent = new THREE.PointLight(COLOR_DANGER, 4, 16);
  accent.position.set(3, -3, 3);
  scene.add(accent);

  const group = new THREE.Group();
  scene.add(group);

  const objects: FloatingObject[] = FACTORIES.map((factory, i) => {
    const mesh = factory();
    const depth = i / (FACTORIES.length - 1);
    const angle = (i / FACTORIES.length) * Math.PI * 2;
    const radius = 2.6 + depth * 2.2;
    mesh.position.set(Math.cos(angle) * radius * 0.6, Math.sin(angle) * radius * 0.35, -depth * 5.5);
    const scale = 0.75 + Math.random() * 0.5;
    mesh.scale.setScalar(scale);
    group.add(mesh);
    return {
      mesh,
      spinSpeed: new THREE.Vector2((Math.random() - 0.5) * 0.006, (Math.random() - 0.5) * 0.008),
      bobFreq: 0.4 + Math.random() * 0.5,
      bobAmp: 0.18 + Math.random() * 0.22,
      bobPhase: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
      depth,
    };
  });

  let scrollProgress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let frameId = 0;
  let disposed = false;
  const clock = new THREE.Clock();

  function resize() {
    const { clientWidth, clientHeight } = container;
    if (clientWidth === 0 || clientHeight === 0) return;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight, false);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  function onPointerMove(event: PointerEvent) {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  function tick() {
    if (disposed) return;
    const t = clock.getElapsedTime();

    for (const obj of objects) {
      obj.mesh.rotation.x += obj.spinSpeed.x;
      obj.mesh.rotation.y += obj.spinSpeed.y;
      obj.mesh.position.y = obj.baseY + Math.sin(t * obj.bobFreq + obj.bobPhase) * obj.bobAmp;
    }

    // Profundidad de scroll: la cámara avanza hacia la escena y el grupo rota levemente,
    // dando sensación de atravesar el campo de objetos flotantes al hacer scroll.
    camera.position.z = 9 - scrollProgress * 4.5;
    group.rotation.y = scrollProgress * 0.5 + pointerX * 0.25;
    group.rotation.x = pointerY * 0.15;

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  }
  frameId = requestAnimationFrame(tick);

  return {
    setScrollProgress(progress: number) {
      scrollProgress = progress;
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      renderer.dispose();
    },
  };
}
