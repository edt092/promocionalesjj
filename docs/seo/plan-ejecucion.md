# Plan de ejecución SEO (SEO-01 a SEO-24)

**Fuente del mandato:** `Plan_SEO_Prompt_Claude_Code_PromocionalesJJ.md`.

**Base unificada no disponible:** la base `base-de-trabajo-seo-unificada-promocionalesjj.md`, que define los ID, **no está en el repositorio**. El significado de cada ID se deduce de cómo los agrupa el plan. SEO-05 no aparece en el plan y queda sin definir.

**Leyenda:**
- ✅ hecho y validado en local
- 🟡 parcial (estructura lista, falta un dato de negocio)
- ⏳ pendiente tras publicar
- ⛔ no ejecutado, con motivo

| ID | Tema | Estado | Cambios realizados | Depende de | Responsable |
|---|---|---|---|---|---|
| SEO-01 | Host primario www, URL única | ✅ | `lib/site.ts` es la fuente única (`SITE_URL`, `absoluteUrl`, política de slash). Las 6 copias de `SITE_URL` sin www se sustituyeron. Canonical, sitemap, `og:url`, migas de pan y JSON-LD usan www | — | Claude Code |
| SEO-02 | Paginación rastreable | ✅ | Rutas estáticas `/tienda/pagina/n/` y `/tienda/categoria/{slug}/pagina/n/` con `dynamicParams = false` (fuera de rango = 404), canonical propio, enlaces `<a>` y orden estable por SKU. Se eliminó `PaginatedProductGrid` («Ver más» solo con JS). `/tienda/` baja de 950 KB a 144 KB | SEO-01 | Claude Code |
| SEO-03 | Taxonomía y reclasificación | ✅ | `scripts/taxonomy-apply.mjs`: 158 productos con nueva categoría primaria y 35 con secundaria. Nuevas categorías `bolsas` y `libretas`. Botilitos fuera de Mugs y portavasos fuera de Vasos. Ver [decisiones-categorias.md](decisiones-categorias.md) | — | Claude Code (revisión: negocio) |
| SEO-04 | `Offer` sin precio e `InStock` | ✅ | `Product` sin `offers`. Se registra que no es elegible para fragmentos con precio | Precio público (negocio) | Claude Code |
| SEO-05 | (sin definición en el plan) | ⛔ | Sin descripción disponible; revisar la base unificada | Base unificada | — |
| SEO-06 | Títulos y H1 | ✅ | Marca duplicada corregida (620 → 0) mediante `title.absolute` en el inicio y el sufijo solo en la plantilla. Producto con el patrón «tipo + modelo + con logo personalizado» y tildes. «Personalizados Personalizados» corregido (3 → 0). La URL de producto no cambia | — | Claude Code |
| SEO-07 | Meta descriptions | ✅ | Se generan con frases completas a partir de atributos reales, sin cortes ni listas de ciudades repetidas (823 sin cierre → 0) | — | Claude Code |
| SEO-08 | `Organization` / `LocalBusiness` | 🟡 | `@graph` con `Organization` y `WebSite` enlazados por `@id`; teléfono E.164. Se eliminaron los 5 `LocalBusiness` ficticios y se sustituyeron por `Service` + `areaServed` | NIT, razón social, dirección, correo y redes (negocio) | Claude Code + negocio |
| SEO-09 | Confianza (Nosotros, Contacto, políticas) | 🟡 | `/contacto/` creada con los canales verificados. `/nosotros/` y las políticas **no se publicaron** porque faltan datos (hay una plantilla en datos pendientes) | Datos de identidad y textos legales | Negocio |
| SEO-10 | Schema factual de producto | ✅ | Sin `brand` (la marca del fabricante es desconocida); `image` solo con foto real; `description` limpia; `url` y `category` | — | Claude Code |
| SEO-11 | Velocidad: imágenes y precargas | ✅ | Se quitó `unoptimized`: las imágenes pasan por Netlify Image CDN con `srcset` y `sizes`. Se eliminaron las 6 precargas del inicio y la prioridad alta del logo, que ahora se sirve a 64/128 px. LCP de laboratorio del inicio: 12,6 s → 3,8 s | CDN de Netlify (verificado en producción) | Claude Code |
| SEO-12 | Móvil y UX | ✅ | Navbar sólido fuera del inicio (antes era invisible en páginas claras). Zonas táctiles de 44 px, menú con ARIA y gestión de foco, H1 del inicio sin recortes, CTA de producto sin solaparse con WhatsApp, imagen 4:3 en móvil | — | Claude Code |
| SEO-13 | Sitemap, robots y 404 | ✅ | El sitemap sale de las mismas fuentes que las rutas: 888 URLs, solo www, sin `lastmod` falso ni `priority`/`changefreq`. robots sin `Host`. El 404 ya no hereda canonical | SEO-01 | Claude Code |
| SEO-14 | Fichas principales | 🟡 | Tabla de especificaciones extraída del texto del proveedor (medidas, capacidad, marcación, venta mínima, empaque), técnicas, nota de producción nacional y placeholder honesto. **Falta** seleccionar los 50–100 productos prioritarios y añadir campos nuevos (MOQ propio, plazo, muestra, stock): requiere margen, stock y datos de producto. No se aplicó noindex por longitud | Datos del negocio | Negocio + Claude Code |
| SEO-15 | Categorías vacías | ✅ | 8 pobladas con productos reales, 5 retiradas (404 documentado). Paraguas conserva su URL y su señal en GSC | — | Claude Code |
| SEO-16 | Hubs | ✅ (evaluado) | Se evaluaron `/regalos-corporativos/` y `/articulos-publicitarios/` y **no se crearon**, por falta de oferta diferenciada. Ver [mapa-intenciones.md](mapa-intenciones.md) | Kits y presupuestos (negocio) | Negocio |
| SEO-17 | Blog | 🟡 | Marca duplicada en el título corregida; tiempo de lectura calculado (decía 7–9 min con ~150 palabras; ahora 1 min); fechas en formato es-CO; `BlogPosting` completo; enlaces a 4 categorías por artículo. **Falta** ampliar el contenido con ejemplos reales; no se cambió `dateModified` porque no hubo revisión sustancial. El artículo de fin de año 2026 **no** se declaró obsoleto | Ejemplos, casos y datos del negocio | Negocio / redacción |
| SEO-18 | Enlaces internos | ✅ | Productos similares por tipo, categoría y material (8, antes «los 4 primeros»). Enlaces ciudad → categorías, blog → categorías, tienda → todas las categorías, categoría → otras categorías. 0 enlaces a categorías vacías | SEO-03 | Claude Code |
| SEO-19 | Cotización | ✅ | CTA de producto con SKU, cantidad, ciudad y fecha en el mensaje de WhatsApp. `/contacto/` con formulario que compone el mensaje y lo abre en WhatsApp (sin simular envíos). CTA en la página de ciudad visible sin hacer scroll. No se muestran MOQ ni plazos sin datos | — | Claude Code |
| SEO-20 | Rendimiento y CLS | ✅ | Medición de laboratorio antes y después con el mismo método. Regresión de CLS en `/tienda/` (fuente) corregida. Pendiente confirmar el TBT y los datos de campo | — | Claude Code |
| SEO-21 | OG y complementos de schema | ✅ | Metadata OG y Twitter por ruta, `og-default.jpg` de marca 1200×630 (`scripts/og-image.py`), imagen real del producto cuando existe | — | Claude Code |
| SEO-22 | Cabeceras de seguridad y caché | 🟡 | `public/_headers`: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`; caché inmutable para `/_next/static`; 1 día + SWR para `/img/*`. **Sin CSP** (se introducirá de forma progresiva) | Publicación | Claude Code / dueño |
| SEO-23 | Google Business Profile, citaciones y reseñas | ⛔ | No se crean cuentas externas. Requiere confirmar la elegibilidad (dirección u operación real) y un proceso de reseñas auténticas | Negocio | Dueño |
| SEO-24 | `llms.txt`, IndexNow, `security.txt` | 🟡 | `public/llms.txt` publicado con información real. **No** se implementan IndexNow (beneficia solo a Bing y Yandex, y requiere clave y despliegue) ni `security.txt` (no hay un contacto que atienda reportes) | — | Dueño |

## Analítica (sección 9 del plan)

`lib/analytics.ts` y `components/AnalyticsListener.tsx`:

- **Eventos implementados:** `whatsapp_open_clicked` (antes `whatsapp_click`, renombrado en la entrega UX) (un único listener delegado, con `data-cta` para saber la ubicación) y `quote_start`.
- **Eventos no implementados:** `quote_submit_success` y `quote_submit_error`, porque no hay backend; el formulario abre WhatsApp y no «envía».
- **Sin ID de GA4:** los eventos solo salen si existen `gtag` o `dataLayer`.
- **Sin PII:** se envían el tipo de CTA y la ruta, nada más.

## Orden aplicado

Fase 0 (diagnóstico y línea base) → Fase 1 (SEO-01, 04, 06, 07, 08, 10, 13, 21; navbar) → Fase 2 (SEO-02, 03, 15, 18) → Fase 3 (Bogotá, vasos, Medellín, paraguas; SEO-09, 19) → Fase 4 (SEO-11, 12, 14, 17, 20, 22, 24) → validación.

## Nuevos scripts de mantenimiento

| Script | Uso |
|---|---|
| `scripts/seo-check.mjs` | Inventario y crawl SEO del HTML generado; `--strict` para CI |
| `scripts/taxonomy-apply.mjs` | Reclasificación reproducible del catálogo |
| `scripts/preview-server.mjs` | Sirve `out/` como Netlify para validar en local |
| `scripts/visual-check.py` | Capturas y mediciones de móvil y escritorio (Playwright) |
| `scripts/lighthouse-summary.mjs` | Medianas de las corridas de Lighthouse |
| `scripts/og-image.py` | Regenera `public/og-default.jpg` |
