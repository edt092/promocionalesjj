# Resultados de QA UX/UI

**Fecha:** 9 de octubre de 2026.

**Entorno:**
- build estático local (`pnpm build`) servido con `node scripts/preview-server.mjs 4190` (imita Netlify: 404 reales, slash y gzip; las imágenes pasan por el Image CDN de producción);
- Chromium de Playwright, en Windows 10.

**Límites:** no hubo despliegue ni se abrió ninguna conversación real de WhatsApp. Las URL `wa.me` se bloquearon en las pruebas y solo se inspeccionó el `href` generado.

## 1. Comandos y resultado real

| Comando | Resultado |
|---|---|
| `pnpm lint` | ✔ sin avisos ni errores |
| `pnpm exec tsc --noEmit` | ✔ 0 errores |
| `pnpm test` | ✔ **19/19** pruebas (`tests/quote-rules.test.ts`, `tests/search-core.test.ts`) |
| `pnpm build` | ✔ correcto (export estático) |
| `node scripts/seo-check.mjs out --strict` | ✔ 0 incidencias; 840/840 productos alcanzables por HTML; sitemap de 888 URLs sin cambios |
| `python scripts/ux-check.py http://localhost:4190 docs/ux-ui/qa` | ✔ **38/38** comprobaciones de flujo; resultados detallados en [qa/resultados.json](qa/resultados.json) |

### Cobertura de las pruebas unitarias

- **Reglas de cantidad:**
  - extracción de la regla de Ballpop;
  - variantes sin «por color» y sin tilde;
  - sin regla no se exige un mínimo;
  - múltiplo inválido explica la regla y sugiere 100/150 sin redondear;
  - por debajo del mínimo solo sugiere valores válidos;
  - se rechazan formatos ambiguos («1.000», «100 und», «-50», vacío).
- **Mensaje:**
  - incluye producto, SKU, cantidad, colores, ciudad, departamento y fecha formateada, y pide confirmación;
  - no contiene «recibida» ni «confirmada»;
  - multiproducto y «sin fecha definida».
- **Resumen listo:**
  - requiere ciudad, fecha o «sin fecha» y cantidades válidas;
  - con asesoría la cantidad puede quedar por definir;
  - la asesoría sin productos exige describir el uso.
- **Búsqueda:**
  - normalización de tildes;
  - búsqueda por nombre y por SKU (completo o solo el número);
  - sinónimos taza→mug, cachucha→gorra, esferos→bolígrafo;
  - todos los términos deben coincidir;
  - filtros con pertenencia secundaria;
  - orden estable;
  - las facetas solo muestran valores existentes.

## 2. Revisión responsive

**Anchos probados:** 320, 375, 440, 768, 834, 1194, 1280, 1440 y 1920 px.

**Páginas:** inicio, tienda, ficha Ballpop, categoría Gorras, promociones, contacto y cotización (63 combinaciones).

| Comprobación | Resultado |
|---|---|
| Desbordamiento horizontal de la página | 0 de 63 |
| Controles interactivos menores de 24×24 px (WCAG 2.5.8) | 0 de 63. Primero detectó el checkbox de asesoría encogido a 16 px y se corrigió |
| Acción principal tapada por el botón flotante de WhatsApp en la vista inicial | 0 de 63. Primero detectó «Preparar cotización» tapado a 320 px y se corrigió ocultando el botón flotante en la ficha y la cotización |
| Capturas | `qa/{página}-{320,768,1280}.png`, flujo completo `qa/flujo-a-cotizacion-390.png` y foco `qa/foco-cotizacion-1280.png` |

**Limitación aceptada:** a 320 px, el botón flotante cubre el borde derecho de la fila desplazable de categorías en `/tienda/`. Esas pastillas se alcanzan desplazando la fila o la página. No se trata como bloqueo.

## 3. Contraste

**Método:** se midió el contraste de todo el texto visible en las 7 plantillas a 375 y 1280 px, con el fondo efectivo y las transparencias compuestas. Umbrales: 4,5:1 para texto normal y 3:1 para texto grande.

| Elemento | Antes | Después |
|---|---|---|
| CTA rojo, texto blanco sobre #FF2D2D | 3,7:1 | 4,9:1 (#E01414) |
| «Abrir chat», blanco sobre #25D366 | 2,0:1 | 5,4:1 (#0F7A3E) |
| SKU de la vitrina, blanco al 40 % sobre navy | 3,8:1 | ≥ 4,5:1 (blanco al 70 %) |
| «…» de la paginación y «Imagen disponible al cotizar» (`slate-400`) | 2,5:1 | ≥ 4,5:1 (`slate-600`) |
| Errores de formulario (`text-danger`) | 3,7:1 | `danger-700` |
| **Resultado final de la medición automática** | — | **0 fallos** |

**Elementos excluidos de la medición automática** (no se pueden medir con este método):
- **Texto sobre degradados** (hero y banner): no se miden automáticamente. Por cálculo manual, el texto blanco pleno queda en ≥ 4,8:1 en el extremo más claro de cada degradado. Por eso el texto blanco al 80 % pasó a blanco pleno y el degradado del banner termina en #E01414.
- **Navbar transparente del inicio sobre el hero:** el fondo real es navy (17,5:1 medido en la entrega SEO).

Una medición automática no certifica conformidad WCAG completa.

## 4. Casos probados (`scripts/ux-check.py`, móvil 390×844 salvo indicación)

### Happy path A: referencia conocida

| Paso | Resultado |
|---|---|
| Buscar «ballpop» | 1 resultado; la búsqueda queda en la URL |
| Buscar «JJ-000001» | Encuentra Ballpop |
| Buscar «esfero» (sinónimo) | Devuelve bolígrafos |
| Filtro de material «metal» | Queda en la URL |
| Abrir el sexto resultado tras hacer scroll y volver | Conserva URL, texto, filtro y posición (diferencia < 200 px) |
| Ficha | Muestra «múltiplos de 50 unidades por color» |
| «Preparar cotización» | Lleva a `/cotizacion/` con el producto |
| Cantidad 120 | Error que explica la regla y sugiere 100 y 150; el campo sigue en 120 (no redondea) |
| Elegir la sugerencia 100 | Aplica 100 |
| Pulsar WhatsApp con datos faltantes | Muestra el resumen de errores, no abre |
| Completar ciudad y fecha | El mensaje contiene producto, SKU, 100 unidades, colores, Bogotá y 20/11/2026 |
| Enlace de WhatsApp | El `href` lleva exactamente el mismo mensaje, codificado, a `wa.me/573155595134` |
| Abrir WhatsApp | Se abre la pestaña (bloqueada en la prueba); el estado dice «Revisa el mensaje y envíalo», nunca «recibida» |
| «Copiar mensaje» | El portapapeles contiene el mensaje |
| Recargar la página | Se conservan cantidad y ciudad |

### Happy path B: necesita orientación

| Paso | Resultado |
|---|---|
| «Vaciar lista y borrar datos» con confirmación | `localStorage` queda vacío |
| Marcar «Necesito asesoría», escribir el uso, Medellín y «Sin fecha definida» | El mensaje incluye la asesoría, el uso y «sin fecha definida» |
| Estado del resumen | Listo sin productos |

### Rutas de error

| Caso | Resultado |
|---|---|
| Búsqueda sin resultados | Mensaje, «Limpiar búsqueda» y «Consultar por WhatsApp». Limpiar devuelve el listado paginado |
| Fallo de carga del índice (petición abortada, 1280 px) | Error visible y paginación aún accesible. «Reintentar» recupera los resultados y conserva el texto buscado |

### Teclado (1280 px)

| Caso | Resultado |
|---|---|
| Primer Tab | «Saltar al contenido»; Enter lleva el foco a `main` |
| Modal de la vitrina abierto con Enter | Foco dentro del diálogo; 6 Tab siguen dentro (foco atrapado); copy «Ejemplo ilustrativo» |
| Escape | Cierra el modal y devuelve el foco al disparador |

### Analítica (con un `dataLayer` de prueba)

- **Eventos emitidos:** `search_used`, `product_viewed`, `quote_item_added`, `quote_start`, `quote_summary_ready` y `whatsapp_open_clicked`.
- **Sin datos sensibles:** ningún evento contiene el texto buscado, la ciudad, las notas, el objetivo ni el número de teléfono.
- **Corrección hecha durante la QA:** si alguien abría un resultado antes de 1,2 s, `search_used` se perdía. Ahora se envía al salir del buscador.

## 5. Limitaciones y lo no verificado

| Área | Situación |
|---|---|
| Navegadores | Solo se probó Chromium. Faltan Safari iOS (sobre todo `type=date` y `navigator.clipboard`), Firefox y dispositivos reales |
| Lector de pantalla | Se revisaron semántica, etiquetas, `aria-live` y diálogo en el código, pero no se probó con NVDA, VoiceOver ni TalkBack |
| Zoom | No se probó al 200 %. El reflow a 320 px sí se comprobó |
| WhatsApp real | No se abrió. Queda pendiente probar en móvil que la app recibe el texto completo, incluidos los saltos de línea |
| Rendimiento | No se repitió Lighthouse en esta entrega. El índice de búsqueda (~48 KB gzip) se carga solo al usar el buscador. Conviene medir INP en la tienda con datos de campo tras publicar |
| Producción | Lo publicado en Netlify sigue siendo la versión anterior a esta entrega |
| Usuarios | **No se hicieron pruebas con usuarios ni entrevistas.** No se afirma mejora de conversión. Las tareas de la sección 20 de la auditoría siguen pendientes |
