instala https://github.com/heygen-com/hyperframes.git y 
Actúa como un Desarrollador Frontend Senior especializado en WebGL, Canvas y Diseñador UX/UI Hyper-Premium.

Quiero construir un Header Interactivo de Productos Promocionales utilizando la librería Hyperframes (https://github.com/heygen-com/hyperframes.git).

REQUISITOS TÉCNICOS Y UX/UI:
1. CUMPLIMIENTO DE LA REGLA DE LOS 400 MS (Doherty Threshold):
   - Cualquier interacción (hover, clic, swipe) debe dar un feedback visual/háptico inmediato (< 50ms) mediante capas CSS/Canvas ligeras.
   - Aplica precarga inteligente (eager prefetching) de los frames clave de Hyperframes para evitar "blank frames" o tirones.

2. ESTÉTICA Y DIRECCIÓN DE ARTE (Hyper-Premium):
   - Estilo minimalista, limpio, lujo moderno (Apple / Porsche Design).
   - Paleta de colores: Oscuros profundos (#0D0D0D), acentos metálicos o neón sutil, tipografía sans-serif elegante (Inter/Plus Jakarta Sans).
   - Efectos: Glassmorphism refinado, sombras proyectadas dinámicas y focos de luz (Spotlights) que siguen al cursor.

3. FUNCIONALIDADES DE LA GALERÍA HYPERFRAMES:
   - Scrubbing 360°: Permitir al usuario rotar el producto promocional arrastrando el ratón/finger (drag to rotate) sincronizado con Hyperframes.
   - Selector de Productos Flotante: Un dock inferior con miniaturas que cambian el set de Hyperframes activando una transición inercial suave.
   - Modal/Panel de Personalización Rápida: Al hacer clic en el producto, mostrar de forma fluida una vista previa del logo del cliente sobre el producto 3D.

Dame el código de la arquitectura en React / Next.js con Tailwind CSS y la integración de Hyperframes (o la abstracción en HTML5 Canvas con requestAnimationFrame) optimizada para 60fps constantes sin lag.