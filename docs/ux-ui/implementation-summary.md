# Resumen de implementación UX/UI

**Fuente:** `PromocionalesJJ_Prompt_Claude_Code_UX_UI.md` (auditoría UX/UI del 8 de octubre de 2026).

**Estado:** cambios locales sin commit ni despliegue. Fecha: 9 de octubre de 2026.

**Leyenda de estados:**
- **Implementado:** el código está hecho.
- **Verificado:** comprobado en el build local con pruebas o Playwright (ver [qa-results.md](qa-results.md)).
- **Pendiente con usuarios:** necesita pruebas con compradores reales.
- **Pendiente de negocio:** necesita datos comerciales.

## 1. Inspección inicial

- **Repositorio:**
  - No hay `AGENTS.md` ni `CLAUDE.md`.
  - Stack: Next.js 14 App Router con `output: 'export'` (estático en Netlify), Tailwind, GSAP y pnpm.
  - No había pruebas automatizadas; se añadieron con `node:test`, sin dependencias nuevas.
- **Git:** árbol limpio sobre `main` (`88aafa0`, plan SEO ya fusionado). No se tocaron cambios ajenos.
- **Compatibilidad SEO:** se conservan URLs, SKU, canonicals, metadatos, JSON-LD, sitemap y enlaces internos.
  - `node scripts/seo-check.mjs out --strict` sigue en 0 incidencias, con 840/840 productos alcanzables.
  - Las nuevas `/cotizacion/` (noindex) y `/catalogo-busqueda.json` quedan fuera del sitemap.
- **Contraste con la auditoría:** varios hallazgos ya estaban resueltos parcial o totalmente por la entrega SEO (PR #1).

| ID | Estado al empezar | Comprobación |
|---|---|---|
| H01 cabecera blanca sobre blanco | **Ya resuelto** en páginas interiores (barra sólida fuera del inicio) | Capturas del 8/10 de `docs/seo/capturas/despues`. Faltaban estado activo, foco y contraste de CTA |
| H02 sin buscador ni filtros | **Presente** | El catálogo solo tenía paginación y pastillas de categoría |
| H03 ficha en un párrafo | **Parcial**: ya existía una tabla de especificaciones | Faltaba separar cantidad y condiciones, y la acción guiada |
| H04 WhatsApp solo con el nombre | **Parcial**: el mensaje incluía SKU y huecos | Sin flujo guiado, validación, resumen ni lista |
| H05 Gorras vacía | **Ya resuelto**: Gorras tiene 2 productos y título «Gorras personalizables con tu logo» | Las categorías sin productos ya no se publican |
| H06 promesas no demostrables | **Presente** | «mejores precios del mercado» y «precio mayorista» en categoría, trust, hero, FAQ y rail |
| H07 nombres irregulares | **Mayormente resuelto** (tildes, «Personalizados Personalizados», EcoNature retirada) | Quedaba «Master Line» como nombre de línea |
| H08 preview «tu logo» | **Presente** | Copy «Vista previa de cómo se vería tu logo», alt «Tu logo aquí» y dos «Cerrar» en el orden de foco |
| H09 confianza en el footer | **Parcial**: existían Contacto y WhatsApp | Sin NIT, razón social ni políticas: es un dato de negocio |
| H10 hero y categorías dominantes | **Presente** | Hero de 100svh y 34 pastillas antes del catálogo |
| H11 lista o comparación | **Presente** | Sin lista multiproducto |

## 2. Hallazgos, solución y estado

### Entrega A: correcciones inmediatas

**H01 · Cabecera (P0)**
- **Solución:**
  - Barra sólida fuera del inicio (ya existía) y estado activo `aria-current="page"` con subrayado.
  - Hover y foco visibles; foco global de 3 px (`:focus-visible`).
  - Menú hamburguesa hasta 1023 px, para evitar una cabecera comprimida en tablet.
  - El menú se cierra con Escape y al navegar.
  - CTA «Cotizar por WhatsApp» con rojo `danger-600` (#E01414): blanco sobre él da 4,9:1, frente a 3,7:1 con #FF2D2D.
  - Enlace «Saltar al contenido».
- **Archivos:** `components/Navbar.tsx`, `app/globals.css`, `app/layout.tsx`, `tailwind.config.ts`.
- **Estado:** implementado y verificado (contraste medido en 7 plantillas a 375 y 1280 px; primer Tab = salto al contenido).

**H05 · Categoría Gorras**
- **Solución:** ya está poblada. La página tiene un CTA contextual («Cotizar gorras por WhatsApp»), enlaces a otras categorías y migas de pan hacia la tienda. Las búsquedas sin resultados, que son el estado vacío que sí puede ocurrir, tienen salida propia (ver H02).
- **Archivos:** `components/CategoryView.tsx` (de la entrega SEO).
- **Estado:** verificado.

**H06 · Promesas no demostrables**
- **Solución:** se sustituyen por afirmaciones de proceso:
  - «Precio mayorista» pasa a «Cotización por volumen».
  - La FAQ explica cómo se calcula el valor y no promete descuentos.
  - La descripción de *Precio Bomba* dice «marcadas por el proveedor como precio especial; condiciones y vigencia se confirman al cotizar».
  - El hero ya no promete «precio mayorista».
- **Archivos:** `components/TrustSection.tsx`, `ProductRail.tsx`, `FAQSection.tsx`, `HeroSection.tsx`, `data/categories.json`.
- **Estado:** implementado. Pendiente de negocio: si se confirman descuentos por volumen, se pueden restaurar con condiciones.

**H07 · Nombres**
- **Solución:** se mantiene la normalización de la entrega SEO (tildes, tipo + modelo, sin guiones residuales, SKU y URLs intactos). «Master Line» se conserva porque es la línea del proveedor.
- **Archivos:** `lib/catalog.ts`.
- **Estado:** implementado. Pendiente con usuarios: card sorting de la taxonomía.

**H08 · Preview ilustrativo**
- **Solución:**
  - Botón «Ver ejemplo de marcación» y copy «Ejemplo ilustrativo de marcación con un logo de muestra. El diseño final con tu logo se confirma antes de producir»; alt «Logo de ejemplo».
  - Foco al abrir, Tab atrapado, Escape cierra y devuelve el foco. El fondo ya no es un segundo «Cerrar» enfocable.
  - Instrucción neutral al dispositivo (antes «mueve el cursor»).
  - No se añadió carga de logo.
- **Archivos:** `components/ProductShowcase.tsx`.
- **Estado:** verificado (teclado y Escape probados con Playwright).

**H09 · Confianza**
- **Solución:** se mantienen `/contacto/` y el enlace del footer. No se publican datos empresariales ni políticas que no existen.
- **Estado:** pendiente de negocio (ver [pending-business-inputs.md](pending-business-inputs.md)).

**H03 · Ficha estructurada**
- **Solución:** patrón reutilizable de bloques:
  - **Identidad:** categoría, nombre y referencia.
  - **Cantidad:** regla de ese producto, por ejemplo «Pedido en múltiplos de 50 unidades por color (50, 100, 150…)». Si no hay regla: «La ficha no publica una cantidad mínima: te la confirmamos al cotizar».
  - **Acciones.**
  - **Características:** tabla de atributos.
  - **«Se confirma al cotizar»:** colores y disponibilidad, valor con marcación, técnica final, tiempos y entrega.

  La regla se extrae del texto del proveedor (`parseQuantityRule`): 84 productos la tienen, con cajas de 25 a 250. **No hay mínimo global.**
- **Archivos:** `app/tienda/[slug]/page.tsx`, `lib/quote-rules.ts`, `lib/catalog.ts`.
- **Estado:** verificado.

### Entrega B: descubrimiento y elección

**H02 · Buscador y filtros**
- **Funcionamiento:**
  - Campo con etiqueta visible «Buscar productos». Busca por nombre, tipo, descripción y SKU (completo o solo el número).
  - Sinónimos colombianos, solo con términos que existen en el catálogo: mug/taza/pocillo, gorra/cachucha, bolígrafo/esfero/lapicero, botilito/tomatodo/botella, paraguas/sombrilla, bolsa/tula, libreta/cuaderno, memoria/USB, speaker/parlante…
  - Filtros con datos reales: categoría (incluida la pertenencia secundaria), material detectado en la ficha y técnica indicada en la ficha. Solo se ofrecen valores con resultados, con su conteo.
  - Contador anunciado (`aria-live`), chips de filtro activo, «Limpiar búsqueda y filtros».
  - Sin resultados: mensaje, limpiar y «Consultar por WhatsApp» con la búsqueda en el mensaje.
- **Índice:** `/catalogo-busqueda.json`, generado en el build (~48 KB comprimido). Se descarga solo al usar el buscador; si falla, se muestra un error con «Reintentar» y la paginación sigue disponible.
- **Archivos:** `lib/search-core.ts`, `components/CatalogSearch.tsx`, `app/catalogo-busqueda.json/route.ts`.
- **Estado:** verificado (pruebas unitarias y E2E). Pendiente con usuarios: tarea «encontrar referencia y alternativa».

**Reducir la carga visual de categorías**
- **Solución:** en `/tienda/` se ven las 8 con más productos y el resto queda en «Ver todas las categorías (34)» (`<details>`). Los enlaces siguen en el HTML, así que el crawl SEO no cambia.
- **Archivos:** `components/CategoryLinks.tsx`.
- **Estado:** verificado.

**Conservar filtros y posición al volver**
- **Solución:** la búsqueda vive en la URL (`?q=&categoria=&material=&tecnica=`, con `replaceState`). Al abrir un resultado se guardan el scroll y la cantidad mostrada en `sessionStorage`, y se restauran al volver.
- **Estado:** verificado (vuelta desde una ficha con URL, campos y scroll conservados).

**Carga incremental y estados**
- **Solución:**
  - Resultados de 24 en 24 con «Mostrar N más (M restantes)» y el estado «X productos encontrados · mostrando Y».
  - Sin búsqueda activa sigue la paginación real del servidor. No se confunden el total del catálogo y el subconjunto en pantalla.
- **Estado:** verificado.

**Tarjetas**
- **Solución:** nombre normalizado, foto o aviso «Imagen disponible al cotizar», categoría, regla de cantidad cuando existe y SKU. No se inventan precios ni stock.
- **Archivos:** `components/ProductCard.tsx`.
- **Estado:** verificado.

### Entrega C: preparación de cotización (H04, H11)

| Elemento | Solución | Estado |
|---|---|---|
| Ruta guiada opcional | En la ficha, «Preparar cotización» agrega el producto y abre `/cotizacion/`. El acceso directo «Consultar por WhatsApp» se conserva. «+ Agregar a mi lista» permite varios productos | Verificado |
| Flujo `/cotizacion/` | Cuatro pasos: 1) pedido: cantidad por producto, colores o distribución y «Necesito asesoría» con uso o evento y presupuesto opcionales; 2) entrega: ciudad (obligatoria), departamento, fecha o «Sin fecha definida», empresa; 3) técnica opcional, por defecto «Recomiéndenme»; 4) resumen editable | Verificado |
| Validación de cantidad | Por producto, sin redondear: explica la regla y ofrece los dos valores válidos más cercanos como botones; la persona decide. Rechaza «1.000» o «100 und» en lugar de interpretarlos | Verificado (unitarias y E2E) |
| Fecha | «La fecha no es una promesa de entrega: confirmamos si es viable al cotizar». No hay estimaciones de plazo | Implementado |
| Mensaje | Producto, SKU, cantidad, colores, ciudad, fecha, técnica o asesoría y pedido de confirmación. Editable en un `textarea`, con «Volver al mensaje generado» | Verificado |
| Canal | «Abrir WhatsApp con este mensaje» explica que se abre un mensaje que la persona debe enviar. Si faltan datos, muestra el resumen de errores con enlaces a cada campo en lugar de abrir. «Copiar mensaje» como alternativa y número visible. **Nunca muestra «solicitud recibida»** | Verificado |
| Borrador | `localStorage` con solo producto, cantidad, notas, ciudad, fecha y técnica, sin datos de contacto ni logos. «Vaciar lista y borrar datos» con confirmación en la propia página. Aviso si el navegador no permite guardar | Verificado (persistencia tras recargar, borrado comprobado) |
| Lista multiproducto | Contador «Mi cotización (n)» en el navbar y en el menú móvil | Verificado |
| Logo | No se carga: «Tu logo lo envías por WhatsApp cuando lo tengas; no es necesario para cotizar» | Implementado (decisión del plan) |
| `/contacto/` | El formulario anterior, que duplicaba el flujo, se reemplaza por un enlace a `/cotizacion/` y el chat directo | Implementado |
| Comparación de productos (H11) | **No implementada.** No hay atributos homogéneos suficientes para comparar con sentido (solo 260 fichas tienen medidas y 171 técnica). La lista cubre el «recordar alternativas» | Pendiente de evidencia con usuarios |

**Archivos de la entrega C:** `lib/quote-rules.ts`, `lib/quote-store.ts`, `components/QuoteBuilder.tsx`, `components/ProductActions.tsx`, `app/cotizacion/page.tsx`, `app/contacto/page.tsx`, `components/Navbar.tsx`. Se eliminó `components/QuoteForm.tsx`.

### Entrega D: refinamiento

- **H10 · Hero:**
  - Altura `min(100svh, 820px)`, titular `clamp(2.2rem, 6vw, 5.2rem)` y copy con llamada a cotizar.
  - En la tienda, categorías compactas y el buscador antes de la grilla.
  - Estado: implementado; pendiente con usuarios (validar el primer pantallazo).
- **Contraste:** se midió y corrigió:
  - texto SKU de la vitrina, de 3,8 a ≥4,5;
  - puntos suspensivos de la paginación y aviso de foto, de 2,5 a ≥4,5;
  - botón «Abrir chat», de 2,0 (#25D366) a 5,4 (#0F7A3E);
  - texto al 80 % de blanco sobre el degradado del hero y el banner, ahora blanco;
  - final rojo del degradado del banner, ahora #E01414.
- **Botón flotante de WhatsApp:** a 320 px tapaba «Preparar cotización». Ahora se oculta en la ficha y en la cotización, que ya tienen WhatsApp junto a la acción (`components/WhatsAppFab.tsx`).
- **Zonas táctiles:** ningún control interactivo mide menos de 24×24 px en los 9 anchos (WCAG 2.5.8). El checkbox de asesoría encogía a 16 px y se corrigió.
- **Analítica sin datos sensibles** (`lib/analytics.ts`):
  - Eventos: `search_used` (conteo, categoría, `has_query`, nunca el texto), `product_viewed`, `quote_item_added`, `quote_start`, `quote_summary_ready` (conteo y booleanos) y `whatsapp_open_clicked`.
  - `whatsapp_open_clicked` sustituye a `whatsapp_click` y no se cuenta si el resumen está incompleto.
  - Sin ID de GA4: solo se envía si existen `gtag` o `dataLayer`.
  - `lead_received`, `proposal_sent` y `sale_closed` **no** se implementan: requieren un canal propio o CRM.

## 3. Documentación de componentes y contrato del catálogo

Ver [componentes-y-contrato.md](componentes-y-contrato.md).
