import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Escena WebGL ambiental para el hero (prompt.md secc. 2-3): objetos flotantes que reaccionan
 * a la profundidad de scroll y al puntero. Los modelos son productos reales del catálogo
 * (organizador de bambú, parlante de madera, botella térmica) modelados y exportados a .glb
 * desde Blender — ver scripts en el historial del proyecto — en vez de geometría procedural
 * genérica, para que el hero muestre productos reconocibles del catálogo.
 */

const COLOR_SKY = 0x00bfff;
const COLOR_DANGER = 0xff2d2d;

const MODEL_SOURCES = ['/models/bamboo-stand.glb', '/models/wood-speaker.glb', '/models/vacuum-bottle.glb'];
const INSTANCES_PER_MODEL = 3;
const TARGET_SIZE = 1.7; // unidad de escena a la que se normaliza la dimensión mayor de cada modelo

interface FloatingObject {
  mesh: THREE.Object3D;
  spinSpeed: THREE.Vector2;
  bobFreq: number;
  bobAmp: number;
  bobPhase: number;
  baseY: number;
  depth: number; // 0 = cerca, 1 = lejos — controla cuánto responde al scroll/parallax
}

/** Carga los 3 modelos y normaliza cada uno a un tamaño y centro consistentes entre sí. */
async function loadModelTemplates(): Promise<THREE.Object3D[]> {
  const loader = new GLTFLoader();
  const scenes = await Promise.all(
    MODEL_SOURCES.map(
      (url) =>
        new Promise<THREE.Object3D>((resolve, reject) => {
          loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
        })
    )
  );

  return scenes.map((template) => {
    const box = new THREE.Box3().setFromObject(template);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDim;
    template.scale.setScalar(scale);
    template.position.copy(center).multiplyScalar(-scale);
    template.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return template;
  });
}

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

  const objects: FloatingObject[] = [];
  let disposed = false;

  loadModelTemplates()
    .then((templates) => {
      if (disposed) return;
      const slots = templates.flatMap((template) => Array(INSTANCES_PER_MODEL).fill(template));
      const total = slots.length;

      slots.forEach((template, i) => {
        const mesh = template.clone(true);
        const depth = i / (total - 1);
        const angle = (i / total) * Math.PI * 2;
        const radius = 2.6 + depth * 2.2;
        mesh.position.x += Math.cos(angle) * radius * 0.6;
        mesh.position.y += Math.sin(angle) * radius * 0.35;
        mesh.position.z += -depth * 5.5;
        mesh.rotation.y = angle;
        const scale = 0.85 + Math.random() * 0.4;
        mesh.scale.multiplyScalar(scale);
        group.add(mesh);
        objects.push({
          mesh,
          spinSpeed: new THREE.Vector2((Math.random() - 0.5) * 0.006, (Math.random() - 0.5) * 0.008),
          bobFreq: 0.4 + Math.random() * 0.5,
          bobAmp: 0.18 + Math.random() * 0.22,
          bobPhase: Math.random() * Math.PI * 2,
          baseY: mesh.position.y,
          depth,
        });
      });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('heroAmbientScene: no se pudieron cargar los modelos 3D', error);
    });

  let scrollProgress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let frameId = 0;
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
