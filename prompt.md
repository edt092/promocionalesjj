Act as a Senior Creative Frontend Engineer and Expert UI/UX Architect specializing in immersive 3D web experiences. Your task is to develop the structural blueprint and high-fidelity boilerplate code for a premium promotional products website named "Promocionales J&J". 

The project must blend high-end corporate merchandise with a cutting-edge, tech-forward aesthetic using HTML5, Tailwind CSS, Three.js, and GSAP (including ScrollTrigger).

---

### 1. DESIGN SYSTEM & TOKENS (Based on Brand Guidelines)
Apply the following strict color palette and accessibility ratios:
- Background / Dark Headers: Deep Navy (`#0A1A2F`)
- Primary Interactive (Buttons/Nav): Royal Blue (`#1565FF`)
- Secondary Accents / Highlights: Light Cyan (`#00BFFF`)
- Critical Action / Attention / CTAs: Accent Red (`#FF2D2D`) [Inspired by the prominent red blade in the logo]
- Typography: Main text on dark (`#FFFFFF`), Main text on light (`#1E2229`), Secondary (`#6B7280`)
- Layout Base: Pure White (`#FFFFFF`) / Light Gray (`#E5E7EB`) for contrasting sections.

---

### 2. CORE TECH STACK & ARCHITECTURE
- Layout: CSS Grid and Flexbox via Tailwind CSS. Fluid typography and responsive design constraints.
- Animation Engine: GSAP 3.0 + ScrollTrigger for choreographed micro-interactions and sequencing.
- 3D Engine: Three.js handling a canvas overlay/underlay with low-poly floating abstract promotional shapes (e.g., stylized 3D pens, geometric gift boxes, tech gadgets) that react to scroll depth.

---

### 3. THE SKELETON OF MOVEMENT & SCROLL PATH
Design the visual hierarchy and page flow following these strict interaction principles:

#### A. Hero Section (The Hook)
- Layout: Split screen or overlapping layered depth.
- Visuals: A WebGL canvas featuring a floating, high-fidelity 3D metallic shield/blade asset mimicking the branding icon. 
- Effect: Multi-layered, strong scroll-based parallax. The foreground text and 3D object move faster than the abstract dark geometric background grid.
- Copy Overlay: Massive, high-contrast typography using `#FFFFFF` with a subtle backdrop-blur filter to maintain readability against shifting 3D elements.

#### B. The Eye Path & Content Grid (The Reveal)
- Below the hero, transition to a multi-column CSS Grid showcasing product categories.
- As the user scrolls, use GSAP ScrollTrigger to stagger-reveal elements (`y: 50`, `opacity: 0` to `opacity: 1`).
- The scrolling action should feel intentional: text triggers first, followed by high-res asset cards.

#### C. Decision Zones & Micro-Interactions (The Action)
- Focus Areas: Highly visible CTA banner sections featuring the Accent Red (`#FF2D2D`) for immediate visual weight.
- Hover States: 
  * Buttons must have magnetic draw effects using GSAP.
  * Cards must utilize mouse-tracking 3D tilt effects (simulating depth/glassmorphism).
- Sequencing: When an interactive card enters the viewport, its border gradients or 3D rotation should animate slightly to signal clickability.

---

### 4. CODE REQUIREMENTS
Provide a clean, modular component implementation (you can use Vanilla JS with CDN imports or a structured React/Next.js component format). 
- Separate the Three.js canvas setup, the GSAP ScrollTrigger timeline orchestration, and the Tailwind HTML layout.
- Ensure all animation performance is optimized (using `will-change`, debounced event listeners, and proper RequestAnimationFrame cleanup).
- Include comments explaining the math/logic behind the parallax depth calculations.
- WEB 100% ESPAÑOL 
- SEO PARA COLOMBIA
- USA ASTRO PARA EL FRONT Y EXLUSIVAMENTE UNSTALA PAQUETES CON PNPM NO USES NPM 