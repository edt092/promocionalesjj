# Auditoría SEO completa: promocionalesjj.co

**Sitio:** https://www.promocionalesjj.co/ (Promocionales J&J)
**Fecha:** 8 de octubre de 2026
**Alcance:** 10 agentes especializados en paralelo (técnico, contenido, schema, sitemap, rendimiento, visual/móvil, búsqueda con IA, experiencia de búsqueda, e-commerce y SEO local)
**Código fuente auditado:** este repositorio (Next.js App Router, `output: 'export'`, desplegado en Netlify). El sitio en vivo corresponde a este código.

---

## 1. Resumen ejecutivo

**Puntuación de salud SEO: 47/100**

El sitio tiene una base técnica sólida:

- Todo el contenido está en el HTML estático, sin depender de JavaScript para el renderizado.
- Los rastreadores de IA tienen acceso.
- Los 404 son reales.
- No hay cambios de diseño durante la carga (CLS 0).
- No hay scripts de terceros.

La puntuación baja por tres razones:

1. **Un error de configuración crítico:** todos los canonicals y las URLs del sitemap apuntan al dominio sin `www`, que redirige con 301 a `www`.
2. **Contenido delgado a escala:** unas 840 fichas de producto con textos copiados del proveedor, categorías casi vacías, 5 páginas de ciudad de plantilla y 3 artículos de blog muy cortos.
3. **Falta de señales de confianza B2B:** no hay página Nosotros ni Contacto, ni NIT, dirección, correo o reseñas.

| Categoría | Peso | Puntuación | Aporte |
|---|---|---|---|
| SEO técnico | 22 % | 66 | 14,5 |
| Calidad de contenido | 23 % | 34 | 7,8 |
| SEO on-page | 20 % | ~45* | 9,0 |
| Schema / datos estructurados | 10 % | 38 | 3,8 |
| Rendimiento (Core Web Vitals) | 10 % | ~52* | 5,2 |
| Preparación para búsqueda con IA | 10 % | 41 | 4,1 |
| Imágenes | 5 % | ~50* | 2,5 |
| **Total** | | | **≈ 47** |

\*Estimaciones:
- **On-page e Imágenes:** ningún agente los evaluó por separado. Se derivaron de los hallazgos de los demás.
- **Rendimiento:** la API de PageSpeed devolvió 429 (cuota agotada), así que es una estimación de laboratorio basada en cabeceras, pesos de archivo y HTML.

**Puntuaciones complementarias (no entran en el total ponderado):**

| Agente | Puntuación |
|---|---|
| SEO local | 28 |
| Experiencia de búsqueda (SXO) | 46 |
| E-commerce / catálogo | 48 |
| Sitemap | 58 |
| Visual / móvil | 72 |

**Tipo de negocio detectado:** catálogo B2B de productos promocionales con cotización por WhatsApp, sin carrito. Atiende Bogotá, Medellín, Cali, Barranquilla y Bucaramanga, sin dirección física publicada.

---

## 2. Hallazgos consolidados por prioridad

Los hallazgos repetidos por varios agentes se fusionaron. Cada uno indica qué agentes lo detectaron.

### 🔴 Críticos (bloquean la indexación o generan riesgo de penalización)

#### C1. Canonicals, sitemap y schema apuntan a una redirección
*Agentes: técnico, sitemap, schema, búsqueda con IA, local, contenido*

- **Problema:** `https://promocionalesjj.co` redirige con 301 a `https://www.promocionalesjj.co`. Sin embargo, todos estos usan el dominio sin `www`:
  - las etiquetas canonical;
  - `og:url`;
  - las URLs dentro del JSON-LD;
  - las líneas `Host` y `Sitemap` de robots.txt;
  - las 877 `<loc>` del sitemap.
- **Verificación:** en una muestra de 46 URLs, todas las versiones sin www devolvieron 301 y todas las versiones con www devolvieron 200. El propio `sitemap.xml` sin www también redirige.
- **Causa:** la constante `SITE_URL = 'https://promocionalesjj.co'` está duplicada en:
  - `lib/contact.ts:1`
  - `app/layout.tsx:15` (`metadataBase`)
  - `app/sitemap.ts:6`
  - `app/robots.ts:3`
  - `app/tienda/[slug]/page.tsx:11`
  - `app/productos-promocionales-colombia/[ciudad]/page.tsx:7`
- **Solución:** definir `SITE_URL = 'https://www.promocionalesjj.co'` una sola vez en `lib/contact.ts` e importarla en todos los archivos. La alternativa es invertir la redirección en Netlify (www hacia el dominio sin www). No mezclar ambos enfoques.
- **Por qué va primero:** todas las demás correcciones dependen de que Google sepa cuál es la URL real.
- **Cómo saber que funcionó:** las URLs canonical responden 200, y Search Console no reporta «Página con redirección» para las URLs del sitemap.

#### C2. Las páginas de ciudad afirman oficinas que no existen
*Agentes: local, schema, contenido, búsqueda con IA*

- **Schema:** `app/productos-promocionales-colombia/[ciudad]/page.tsx:31-45` emite un `LocalBusiness` llamado «Promocionales J&J — {Ciudad}» con `addressLocality` de cada ciudad. No tiene dirección, teléfono ni horario. Son cinco «sucursales» que no existen, lo que constituye una tergiversación.
- **Contenido:** cada página tiene una introducción de unas 35 palabras y 4 viñetas de plantilla («Envíos a…», «Merchandising para ferias…», «Cotización rápida…»), unas 189 palabras contando la navegación. Si se cambia el nombre de la ciudad, la página queda casi igual, lo que crea un riesgo de doorway page. Cali y Bucaramanga son casi idénticas.
- **Solución:**
  - Eliminar el `LocalBusiness` por ciudad. Usar una sola `Organization` con `areaServed` (las 5 ciudades como `City`) y, en cada ciudad, un `Service` cuyo `provider` sea la organización.
  - Escribir 400 o más palabras únicas por ciudad (tiempos de entrega reales, transportadoras, industrias y clientes locales, productos destacados, preguntas frecuentes). Si no es posible, consolidar todo en el hub `/productos-promocionales-colombia/` y aplicar noindex a las cinco.
  - No crear más ciudades hasta que las existentes sean únicas.

#### C3. El schema de producto incluye una oferta sin precio
*Agentes: schema, e-commerce, SXO, contenido*

- **Problema:** `app/tienda/[slug]/page.tsx:51-57` emite un `Offer` con `priceCurrency` pero sin `price`, y declara `availability: InStock` sin datos de inventario. Esto es inválido tanto para fragmentos de producto como para fichas de comerciante.
- **Solución:** como el sitio solo cotiza, eliminar `offers` (un `Product` sin oferta es válido) y agregar `brand` y `url`. No inventar precios, y omitir `image` en los productos que usan el placeholder. Mostrar un precio «desde» solo si es real y está publicado.

### 🟠 Altos (afectan significativamente el posicionamiento; corregir en 1 semana)

#### A1. La marca aparece duplicada en los títulos y las meta descriptions están cortadas
*Agentes: contenido, técnico, visual (confirmado en vivo)*

- **Títulos duplicados:**
  - Ejemplo en vivo: `Trevon Personalizado con Logo | Promocionales J&J | Promocionales J&J`.
  - Afecta a 617 productos y también a las entradas del blog.
  - **Causa:** el `seo_title` en `data/products.json` y `data/blog-posts.json` ya termina con el sufijo, y la plantilla `%s | Promocionales J&J` de `app/layout.tsx:21` lo vuelve a añadir.
  - 429 de 840 títulos superan los 60 caracteres, y falta la tilde en «Boligrafo».
- **Meta descriptions:**
  - Solo hay 8 plantillas para 840 productos.
  - 453 superan los 160 caracteres.
  - 707 terminan a mitad de frase (por ejemplo, «…Barranquilla y») porque se cortaron a unos 165 caracteres.
- **Solución:**
  - Quitar el sufijo de los datos, o usar `title: { absolute: … }` en `app/tienda/[slug]/page.tsx:25` y `app/blog/[slug]/page.tsx:19`.
  - Regenerar las meta descriptions de 120 a 155 caracteres, con una frase completa y un dato propio del producto (material o uso).

#### A2. Las fichas de producto son delgadas y están copiadas del proveedor
*Agentes: contenido, e-commerce, SXO*

- **Textos:**
  - `descripcion_corta` tiene una media de 17,8 palabras.
  - 547 de 840 productos (65 %) tienen menos de 20 palabras, y el 97 % menos de 40.
  - 88 descripciones están duplicadas; por ejemplo, «Bolígrafo plástico. Mecanismo push.» aparece 15 veces.
  - No hay descripción larga, tabla de especificaciones, área de impresión, pedido mínimo (MOQ), tiempo de entrega ni precio.
- **Origen:** los datos provienen de catalogospromocionales.com (`providerUrl` en `data/categories.json`). Compiten como contenido duplicado con el proveedor y con otros distribuidores.
- **Nombres:** son códigos del proveedor («Trevon», «Ventura Frost», «Ecologik») con volumen de búsqueda prácticamente nulo. La demanda está en el sustantivo genérico («bolígrafo metálico personalizado»).
- **Imágenes:** 104 productos (12 %) usan `_placeholder-jj.svg` como imagen principal, `og:image` e imagen precargada.
- **Solución:**
  - Usar títulos y H1 con el patrón `{Tipo genérico} {Modelo} personalizado con logo`, con las tildes corregidas.
  - Escribir entre 80 y 250 palabras únicas para los ~100 productos principales (material, medidas, técnica de marcado, MOQ, empaque, tiempo de entrega) y mostrar una tabla de especificaciones.
  - Aplicar noindex a la cola de productos con descripción duplicada hasta enriquecerla.

#### A3. La mayoría de productos no se pueden rastrear desde las categorías
*Agente: e-commerce*

- **Problema:** `components/PaginatedProductGrid.tsx` renderiza 24 productos en el servidor y muestra el resto con un botón de JavaScript (`useState`). Googlebot no hace clic, así que unos 294 de los 318 productos de «variedades» no tienen ningún enlace rastreable desde su categoría y solo aparecen en el sitemap.
- **Solución:** crear URLs de paginación reales con enlaces `<a>` normales y canonical propio (por ejemplo, `/tienda/categoria/<slug>/pagina/2/`), o renderizar la grilla completa en el servidor.

#### A4. Las categorías son delgadas y la taxonomía está desequilibrada
*Agentes: e-commerce, contenido, sitemap, SXO*

- **Contenido:**
  - Cada categoría tiene un H1 y una frase genérica de `categories.json` («Productos promocionales con los mejores precios del mercado»), que también se reutiliza como meta description (`app/tienda/categoria/[slug]/page.tsx:20-21`).
  - No tienen H2, guía de compra ni schema `ItemList`.
- **Categorías vacías:**
  - 13 categorías tienen 0 productos pero se generan y son indexables, y no están en el sitemap: confeccion, deportes, econature, gorras, juegos, medicos, memorias-usb, paraguas, produccion-nacional, productos-2023, relojes, tecnologia, tomatodos-y-botilitos-personalizados.
  - **Causa:** `generateStaticParams` usa `categories.json` (37 categorías), mientras que `app/sitemap.ts:28` usa las categorías presentes en `products.json` (24).
- **Desequilibrio:**
  - «variedades» (318) y «articulos-escritura» (291) concentran 609 de los 840 productos.
  - Seis categorías tienen 1 solo producto: automovil, calculadoras, golf, infantil, precio-bomba y termos-personalizados.
- **Solución:**
  - Eliminar las categorías vacías.
  - Dividir las dos categorías comodín en categorías con intención de búsqueda: bolígrafos metálicos, plásticos y ecológicos; sets de escritura; libretas; USB; termos; mugs; bolsas; maletines, entre otras.
  - Fusionar o aplicar noindex a las categorías con menos de unos 8 productos.
  - Escribir de 300 a 500 palabras por categoría (materiales, técnicas como tampografía, serigrafía o láser, MOQ, tiempos de entrega, ciudades).

#### A5. No hay página comercial para las palabras clave principales
*Agente: SXO*

- **Problema:** «regalos corporativos» y «artículos publicitarios» solo tienen entradas de blog, que son informativas. En Google posicionan páginas comerciales de proveedores (Markmelo, Promo Pop, Mar-K).
- **Solución:** crear los hubs comerciales `/regalos-corporativos/` y `/articulos-publicitarios/`, con kits, opciones por presupuesto y por ocasión, MOQ y botón de cotización. Enlazarlos desde el menú y la home, y usar los artículos del blog como apoyo.

#### A6. Faltan páginas y señales de confianza
*Agentes: contenido, local, búsqueda con IA, SXO*

- **Lo que falta:**
  - `/nosotros/` y `/contacto/` devuelven 404.
  - El footer solo tiene el copyright y el WhatsApp.
  - No hay NIT, razón social, dirección, correo, horario, política de privacidad, términos, reseñas, logos de clientes ni casos de éxito.
- **Impacto:** el comprador de compras/procurement obtuvo la peor puntuación de los cuatro perfiles (38/100).
- **Solución:** crear `/nosotros/` (historia, equipo, proceso de producción, NIT, fotos de trabajos reales), `/contacto/`, las páginas legales, al menos 3 casos de clientes y un bloque «cómo funciona» con el flujo de cotización en 4 pasos. Añadir correo y dirección al footer y al schema.

#### A7. El menú es invisible en las páginas de fondo claro
*Agente: visual (confirmado en captura)*

- **Problema:** en las páginas de producto y de ciudad, el texto de la marca, los enlaces de navegación y el botón de menú son blancos sobre una barra blanca. En móvil el menú no se ve; en escritorio solo se ven el logo y el botón rojo.
- **Solución:** que el color del `Navbar` dependa de la ruta o del scroll, o darle a la barra un fondo sólido u oscuro.

#### A8. El schema de `Organization` es pobre y falta `WebSite`
*Agentes: schema, búsqueda con IA, local*

- **Problema:**
  - `app/layout.tsx:44-61` no tiene `@id`, `sameAs`, `email`, `address`, `description`, `legalName` ni `taxID` (NIT).
  - El logo es `promocionalesjj_logo_first_version.png`.
  - El teléfono no está en formato E.164.
  - No existe un bloque `WebSite`.
  - Los bloques no se enlazan entre sí mediante `@id`.

### 🟡 Medios (oportunidades de optimización; corregir en 1 mes)

| # | Hallazgo | Agentes | Solución |
|---|---|---|---|
| M1 | **Imágenes sin optimizar:** la home precarga 6 JPG de producto en crudo (~1,9 MB; hero de 343 KB con `fetchPriority=high`) y 7 imágenes con carga inmediata. La imagen LCP de la ficha de producto también es un JPG en crudo de 274 KB. Hay 736 JPG de 1000×1000 (~230 KB, 206 MB en total), todos con `unoptimized`. | rendimiento, e-commerce | Servirlas por `/.netlify/images` en AVIF o WebP con `srcset` y `sizes` (objetivo: imagen LCP < 60 KB). Dejar una sola precarga y que el resto cargue en diferido. |
| M2 | **Logo con prioridad alta:** precargado a 640/1080 px para mostrarse a 32–40 px. El PNG pesa 289 KB y compite con la imagen LCP en todas las páginas. | rendimiento | Quitar la precarga y `fetchPriority`, y servir un SVG o un WebP de ~160 px. |
| M3 | **Caché:** `/img/*` y la salida de `/.netlify/images` tienen `Cache-Control: max-age=0, must-revalidate`. | rendimiento | Crear `netlify.toml` con `[[headers]] for = "/img/*"` y `public, max-age=31536000, immutable`. |
| M4 | **`/tienda/` pesa 950 KB de HTML** porque el catálogo completo se serializa en la página. | técnico | Paginar el listado o cargar los datos de filtrado desde un JSON aparte. |
| M5 | **Blog delgado:** 3 entradas de 147–166 palabras que anuncian lecturas de 7–9 minutos. No tienen enlaces internos ni autor con nombre, ni `dateModified`, y usan imágenes de Unsplash. La entrada «fin de año 2026» ya está desactualizada. | contenido, búsqueda con IA | Reescribirlas con 1.200 palabras o más, con datos reales, autor con biografía, H2 en forma de pregunta y enlaces a categorías y productos. |
| M6 | **`llms.txt` no existe (404)**. | búsqueda con IA | Publicar `public/llms.txt` (borrador en la sección 6). |
| M7 | **`Article` incompleto:** le faltan `dateModified`, `publisher` y `mainEntityOfPage`, el autor es la organización y la imagen es de Unsplash. | schema | Cambiar a `BlogPosting` (ver la sección 5). |
| M8 | **Enlazado interno pobre:** el blog no enlaza a nada, las páginas de ciudad no enlazan a productos ni categorías, y los 4 productos «relacionados» son los primeros de la categoría en el orden del archivo. | contenido, e-commerce, SXO | Mostrar de 8 a 12 productos relacionados por similitud, enlazar de cada ciudad a sus categorías principales, del blog a categorías y productos, y de Bogotá a mugs y termos. |
| M9 | **Cabeceras de seguridad:** solo existe HSTS (sin `includeSubDomains` ni `preload`). Faltan `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y CSP. | técnico | Añadir `public/_headers` o `netlify.toml`. |
| M10 | **`og:image` ausente** y `twitter:card` de tipo `summary`, lo que debilita las vistas previas en WhatsApp y LinkedIn. | varios | Crear una imagen OG de 1200×630. |
| M11 | **Configuración heredada del layout:** el `alternates.canonical` de `app/layout.tsx:25-31` se hereda en páginas sin canonical propio (el 404 apunta a la home). Además, el bloque `languages`/hreflang no tiene efecto y su URL `es-CO` no lleva barra final. | técnico | Eliminar el canonical del layout y el bloque `languages`, ya que el sitio tiene un solo idioma. |
| M12 | **Móvil, ficha de producto:** el H1 está en y=588 y el botón «Cotizar» en y=786–842, pegado al borde inferior y junto al botón flotante de WhatsApp. | visual | Reducir la altura de la imagen en móvil (4:3 o `max-h-[45vh]`) o añadir una barra fija con «Cotizar». |
| M13 | **Zonas táctiles pequeñas:** los enlaces de navegación, migas de pan y footer miden ~20 px; los del menú móvil, 32 px. | visual | Usar un mínimo de 44 px (`py-2`, `min-h-11`). |
| M14 | **El H1 de la home en escritorio** recorta las letras con trazo descendente («g», «q»). | visual | Ajustar `line-height`/`padding-bottom` o quitar `overflow-hidden` en el contenedor del efecto de desvanecido. |
| M15 | **El `lastmod` del sitemap no es real:** 874 de 877 URLs tienen el valor fijo 2026-07-13 (`STATIC_UPDATED`, `app/sitemap.ts:9`). | sitemap | Usar fechas reales por producto u omitir `lastmod`. |
| M16 | **JavaScript:** ~149 KB gzip, con un chunk de polyfills de 40 KB y uno compartido de 54 KB. Podrían quedar restos del hero 3D eliminado. | rendimiento | Revisar con un analizador de bundle y usar `browserslist` moderno. |
| M17 | **Cotización:** solo existe el enlace de WhatsApp. No hay formulario ni correo de respaldo, ni MOQ, tiempo de entrega o rango de precio junto al botón. | e-commerce, SXO | Añadir esos datos y un formulario alternativo. |

### 🟢 Bajos (pendientes)

- `changefreq` y `priority` del sitemap: Google los ignora (todos los productos tienen 0,7). Se pueden eliminar.
- La línea `Host:` de robots.txt está obsoleta (`app/robots.ts:12`).
- No hay IndexNow (archivo de clave más un script tras el despliegue); solo beneficia a Bing y Yandex.
- No existe `/.well-known/security.txt`.
- `/tienda/categoria/` devuelve 404, porque no hay página índice.
- `/index.html` responde 200 como duplicado de la home; el canonical lo resuelve.
- Las fechas se muestran en formato ISO (2026-06-02). Usar el formato es-CO.
- En móvil, la página de ciudad no tiene un botón de cotización en línea en la parte visible (el primero está en y=1070).
- El H1 de `/blog/` es solo «Blog», y `/promociones/` tiene 150 palabras con un H1 genérico.

### ✅ Lo que ya funciona bien

- Contenido completo en el HTML estático, sin riesgo de renderizado por JavaScript.
- robots.txt con `Allow: /`. GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot y Googlebot reciben 200 con HTML idéntico; Netlify no bloquea bots.
- 404 reales con `noindex`, y las URLs sin barra final redirigen con un solo 301.
- HTTPS más HSTS, y meta `viewport` presente.
- CLS 0 en las 6 capturas, sin desbordamiento horizontal, sin popups ni banners intrusivos.
- `/_next/static` con caché inmutable de 1 año.
- Sin scripts de terceros, así que el riesgo de INP es bajo.
- H1 único por página, URLs limpias e idioma `es-CO` correcto.
- `BreadcrumbList` válido en todas las páginas (`components/Breadcrumbs.tsx`).
- El sitemap cubre todos los productos, entradas de blog y ciudades, sin duplicados.
- Botón de WhatsApp claro, con el nombre del producto prellenado.

---

## 3. Informe de cada agente

### 3.1 SEO técnico — 66/100

- **Muestra (curl en www):** `/`, `/tienda/`, `/tienda/hamond-stylus/`, `/tienda/categoria/golf/`, `/productos-promocionales-colombia/bogota/`, `/blog/`, una entrada del blog, `/promociones/` y dos URLs inexistentes.
- **Pasa:**
  - HTML estático completo.
  - 404 reales.
  - Redirección de barra final en un solo salto.
  - HSTS y `viewport`.
  - Sin `noindex` indebidos.
  - Un H1 por página.
- **Problemas principales:**
  - Canonicals al dominio sin www (C1).
  - Imágenes placeholder en 104 productos.
  - Canonical heredado en el 404.
  - `/tienda/` de 950 KB.
  - Títulos con la marca duplicada.
  - hreflang sin efecto.
  - Faltan cabeceras de seguridad.
  - No hay IndexNow, `llms.txt` ni `security.txt`.
- **Recomendación adicional:** confirmar en `netlify.toml` la configuración de Netlify Image CDN, ya que el repositorio no tiene ese archivo.

### 3.2 Calidad de contenido y E-E-A-T — 34/100

- **E-E-A-T estimado:**

  | Dimensión | Puntuación |
  |---|---|
  | Experiencia | 25 |
  | Pericia | 35 |
  | Autoridad | 20 |
  | Confianza | 40 |

- **Preparación para citas de IA:** 30.
- **Medido sobre los datos:**
  - 840 productos, con una descripción media de 17,8 palabras (mediana 15).
  - 88 descripciones duplicadas.
  - 171 descripciones con especificaciones mezcladas sin formato («Medidas: … Marca: 3 cm / Tampografía»).
  - Entradas de blog de 166, 147 y 156 palabras.
  - Ciudades de ~189 palabras.
  - Categorías: mugs con 258 palabras y escritura con 276, sin H2.
  - Home de 538 palabras: cumple el mínimo de 500, pero es genérica.
- **H1 de la home:** «Merchandising que deja marca en Colombia» es atractivo pero no contiene palabra clave.
- **Preguntas frecuentes:** 4, sin pruebas (clientes, cifras, años).
- **Tarjetas de confianza:** son afirmaciones no verificables («precio mayorista», «cobertura nacional»).
- **Orden sugerido:**
  1. Nosotros, contacto y legales, con NIT y dirección.
  2. Reescribir los ~100 productos principales y eliminar los duplicados.
  3. Corregir títulos y meta descriptions de forma programática (barato y de alto retorno).
  4. Ampliar el blog con un autor real.
  5. Diferenciar o consolidar las ciudades.

### 3.3 Schema / datos estructurados — 38/100

| Página | Bloques actuales | Archivo |
|---|---|---|
| Todas | `Organization` | `app/layout.tsx:44-61` |
| Home | Solo `Organization` (sin `WebSite`) | layout |
| Producto | `Product` + `BreadcrumbList` | `app/tienda/[slug]/page.tsx:43-63`; `components/Breadcrumbs.tsx:15-28` |
| Categoría | Solo `BreadcrumbList` | `app/tienda/categoria/[slug]/page.tsx` |
| Ciudad | `LocalBusiness` + `BreadcrumbList` | `app/productos-promocionales-colombia/[ciudad]/page.tsx:31-49` |
| Blog | `Article` + `BreadcrumbList` | `app/blog/[slug]/page.tsx:30-42` |

- **Pasa:** `BreadcrumbList` válido, `@context` en https, fechas en ISO 8601, y sin `FAQPage` ni `HowTo`.
- **Nota:** Next.js repite el JSON en el payload RSC. Es inofensivo.
- **JSON-LD:** los bloques listos para pegar están en la sección 5.

### 3.4 Sitemap — 58/100

- **Estado general:** 877 URLs, 0 duplicados, XML válido y muy por debajo del límite de 50.000.
- **Muestra de 46 URLs:** todas las versiones sin www dan 301 y todas las versiones con www dan 200. No hay 404.
- **Problemas:**
  - Dominio sin www (C1).
  - 13 categorías vacías generadas pero fuera del sitemap (A4).
  - `lastmod` fijo en 874 URLs (M15).
  - `changefreq` y `priority` inútiles.
- **Cobertura:** 840 productos, 3 entradas de blog, 5 ciudades, el hub y `/promociones/`, todo generado y listado. Ninguna URL del sitemap deja de generarse.
- **Umbral de páginas de ubicación:** 5, por debajo de 30, así que no se activa ninguna alerta.

### 3.5 Rendimiento / Core Web Vitals — ~52/100 (estimado)

- **Estado:**

  | Métrica | Estado probable |
  |---|---|
  | LCP | En riesgo (probablemente pobre o mejorable en móvil) |
  | INP | Probablemente bueno (poco JavaScript) |
  | CLS | Probablemente bueno |

- **Datos medidos:**
  - HTML de la home: 90 KB, 13 KB comprimido.
  - JavaScript: ~149 KB gzip en 9 chunks.
  - CSS: 6,7 KB gzip.
  - Una fuente precargada de 24 KB.
  - TTFB del HTML: ~0,6 s, en una respuesta del edge sin caché.
- **Problemas:** M1, M2, M3 y M16. Además, convendría pregenerar AVIF/WebP durante el build con sharp, para que el CDN de imágenes no transforme en la primera visita.
- **Siguiente paso:** ejecutar `npx lighthouse https://www.promocionalesjj.co/ --form-factor=mobile`, o PageSpeed Insights con una clave de API, y confirmar con CrUX cuando haya tráfico suficiente.

### 3.6 Visual / móvil — 72/100

- **Método:** Playwright con Chromium a 1366×768 y 390×844.
- **Páginas:** `/`, `/tienda/metro-retractil-kolors/` y `/productos-promocionales-colombia/bogota/`.
- **Pasa:**
  - Sin desbordamiento horizontal.
  - CLS 0.
  - Texto base de 16 px.
  - H1 y botones de la home visibles sin hacer scroll, en ambos tamaños.
  - Botón flotante de WhatsApp de 56 px en todas las páginas.
  - Sin interstitials.
- **Problemas:** A7 (menú invisible), M12, M13, M14, y la falta de un botón de cotización en línea en la ciudad en móvil.

### 3.7 Búsqueda con IA (GEO) — 41/100

| Plataforma | Puntuación |
|---|---|
| Google AI Overviews | 45 |
| ChatGPT | 35 |
| Perplexity | 40 |
| Bing Copilot | 40 |

- **Acceso de rastreadores:** excelente. Sin bloqueos, y todos los agentes de usuario reciben los mismos 90.300 bytes.
- **Problemas:**
  - No existe `llms.txt`.
  - Claridad de entidad débil: sin `sameAs`, NIT, dirección ni página Nosotros.
  - Huella de marca no verificable: DuckDuckGo mostró un desafío anti-bot y Bing no devolvió resultados útiles. El sitio no enlaza ningún perfil social.
  - Baja citabilidad: textos de marketing cortos, sin bloques autocontenidos de 134 a 167 palabras ni cifras concretas.
  - Encabezados en forma de afirmación en lugar de pregunta.
  - Autoría de la organización en lugar de una persona.
- **Cinco cambios con más impacto:**
  1. Publicar `llms.txt` (15 minutos).
  2. Enriquecer `Organization` y crear `/nosotros/` (necesita datos reales del dueño).
  3. Reescribir el blog y las ciudades en secciones autocontenidas, con H2 en forma de pregunta y cifras de MOQ, plazos y técnicas.
  4. Crear y enlazar perfiles sociales, Google Business Profile y un canal de YouTube. YouTube es la señal más correlacionada con las citas en IA.
  5. Corregir el canonical y añadir `og:image`.

### 3.8 Experiencia de búsqueda (SXO) — 46/100

- **Desglose:**

  | Dimensión | Puntuación |
  |---|---|
  | Tipo de página | 7/15 |
  | Profundidad | 6/15 |
  | UX | 8/15 |
  | Schema | 5/15 |
  | Medios | 8/15 |
  | Autoridad | 4/15 |
  | Frescura | 8/10 |

- **Desajustes de intención:**

  | Palabra clave | Página asignada | Nivel |
  |---|---|---|
  | regalos corporativos | ninguna (solo blog) | CRÍTICO |
  | artículos publicitarios | ninguna (solo blog) | ALTO |
  | mugs personalizados | `/tienda/categoria/mugs/` | MEDIO (tipo correcto, contenido delgado) |
  | termos personalizados | `/tienda/categoria/termos-personalizados/` | MEDIO; hay una oportunidad abierta porque no apareció ningún resultado colombiano |
  | productos promocionales | home | MEDIO |
  | productos promocionales bogota | `/productos-promocionales-colombia/bogota/` | ALINEADO a MEDIO |

- **Competidores:**
  - **Colombianos:** Markmelo, EM2C, Publiink, Zoom Publicidad, My Brand Promocionales, Publicidad Creativa, Imprinco, Kojak Graphic, Grafipro, Promo Pop SAS y Mar-K.
  - **Otros:** Vistaprint ES, Cosmos.com.mx, Chilat, Logo.ee y el directorio Empresite.
  - **Lo que muestran y J&J no:** MOQ visible («mínimo 20 unidades»), promesa de cotización en 2 horas, entrega el mismo día en Bogotá, precio con IVA (EM2C: $50.990 + IVA), técnicas de impresión, mockup digital y más de 1.900 referencias.
- **Perfiles de comprador (sobre 100):**

  | Perfil | Puntuación |
  |---|---|
  | Procurement | 38 (el más débil) |
  | Comprador de regalos de RR. HH. o eventos | 37 |
  | Coordinador de marketing | 52 |
  | Dueño de pyme | 53 |

  Priorizar lo que necesita procurement: precio o rango, MOQ, NIT, facturación electrónica y referencias.

### 3.9 E-commerce / catálogo — 48/100

| Dimensión | Puntuación |
|---|---|
| Schema | 40 |
| Imágenes | 55 |
| Contenido | 35 |
| Enlazado interno | 60 |

- **Problemas:** C3, A2, A3 y A4, M1, M8 y M17.
- **No perseguir las fichas de comerciante:** requieren un precio público y un checkout.
- **Estrategia para que las categorías sean el activo principal:**
  - **Taxonomía:** consolidar en unas 25–30 categorías orientadas a la intención de búsqueda.
  - **Contenido:** escribir de 300 a 500 palabras únicas por categoría, más una guía de compra.
  - **Schema:** añadir `ItemList` y `BreadcrumbList`.
  - **Títulos:** usar el patrón `{Producto plural} personalizados con logo en Colombia | Promocionales J&J`.
  - **Rastreo:** paginación rastreable.
  - **Fichas de producto:** quedan como apoyo de cola larga, con un enlace de anclaje con palabra clave hacia su categoría.

### 3.10 SEO local — 28/100

| Dimensión | Puntuación |
|---|---|
| Google Business Profile | 3/25 |
| Reseñas | 0/20 |
| On-page | 9/20 |
| NAP y citaciones | 5/15 |
| Schema | 4/10 |
| Enlaces | 7/10 (estimado) |

- **Tipo:** negocio B2B que atiende por zona de servicio, sin dirección física.
- **Problemas:** sin dirección ni evidencia de Google Business Profile (C2), `LocalBusiness` falso en las ciudades, riesgo de doorway pages, `Organization` sin NAP, y sin reseñas.
- **Google Business Profile:**
  - Si existe una oficina o bodega, crear y verificar el perfil en la categoría «Proveedor de artículos promocionales».
  - Si no existe, crearlo como negocio de zona de servicio solo si la verificación lo permite; si no, centrarse en el SEO orgánico.
- **Citaciones recomendadas en Colombia:** Google Business Profile, Páginas Amarillas, Cámara de Comercio/RUES, Facebook, Instagram, LinkedIn, Cylex, Foursquare, Bing Places y Apple Business Connect. Yelp y BBB no son relevantes en Colombia.
- **Reseñas:** no inventarlas. Recoger reseñas reales en Google una vez exista el perfil.
- **Factor local más importante a su alcance:** páginas de servicio dedicadas («impresión de logos», «regalos corporativos», «textiles», «kits de bienvenida»).

---

## 4. Plan de acción secuenciado

| Paso | Qué hacer | Hallazgos | Plazo | Depende de | Cómo saber que funcionó |
|---|---|---|---|---|---|
| 1 | Una sola `SITE_URL` con www en todo el código | C1 | Inmediato | — | Los canonicals responden 200 y Search Console cuenta las URLs con www como indexadas |
| 2 | Quitar la marca duplicada en títulos, regenerar las meta descriptions, eliminar `offers` y reemplazar el `LocalBusiness` de las ciudades | A1, C3, C2 (schema) | Semana 1 | 1 | Rich Results Test sin errores y títulos correctos en los resultados de Google |
| 3 | Contraste del `Navbar`; optimizar imágenes, precargas y caché | A7, M1–M3 | Semana 1 | — | LCP en móvil < 2,5 s en Lighthouse |
| 4 | Paginación rastreable y eliminar las categorías vacías | A3, A4 | Semanas 2–3 | 1 | Baja «Descubierta: actualmente sin indexar» en Search Console |
| 5 | `/nosotros/`, `/contacto/` y legales; `Organization` y `WebSite` completos; Google Business Profile si aplica; `llms.txt` | A6, A8, M6 | Semanas 2–4 | Datos reales del dueño (NIT, dirección, correo, redes) | La búsqueda de la marca muestra un panel o el perfil de Google |
| 6 | Hubs `/regalos-corporativos/` y `/articulos-publicitarios/`; textos de categorías; ciudades únicas o consolidadas | A5, A4, C2 (contenido) | Mes 1–2 | 1, 4 | Impresiones para esas consultas en Search Console |
| 7 | Enriquecer los 50–100 productos principales; reescribir el blog con un autor real | A2, M5 | Continuo | 2 | Número de URLs de producto con impresiones |

Los pasos 1 y 2 son cambios de código pequeños dentro de este repositorio.

---

## 5. JSON-LD listo para usar

> Los campos `TODO` requieren datos reales del negocio. No publicar placeholders.

### Organization (`app/layout.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.promocionalesjj.co/#organization",
  "name": "Promocionales J&J",
  "url": "https://www.promocionalesjj.co/",
  "logo": {"@type": "ImageObject", "url": "https://www.promocionalesjj.co/promocionalesjj_icon.png", "width": 512, "height": 512},
  "description": "Proveedor de productos promocionales y merchandising corporativo personalizado con logo en Colombia.",
  "email": "TODO correo real",
  "address": {"@type": "PostalAddress", "addressLocality": "TODO ciudad", "addressCountry": "CO"},
  "sameAs": ["TODO Instagram", "TODO Facebook", "TODO LinkedIn"],
  "areaServed": {"@type": "Country", "name": "Colombia"},
  "contactPoint": {"@type": "ContactPoint", "contactType": "sales", "telephone": "+573155595134", "areaServed": "CO", "availableLanguage": ["es"]}
}
```

### WebSite (solo en la home, `app/page.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.promocionalesjj.co/#website",
  "url": "https://www.promocionalesjj.co/",
  "name": "Promocionales J&J",
  "inLanguage": "es-CO",
  "publisher": {"@id": "https://www.promocionalesjj.co/#organization"}
}
```

### Product sin precio (`app/tienda/[slug]/page.tsx`: eliminar las líneas 51–57)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Bolígrafo Ballpop",
  "description": "Bolígrafo antiestrés de silicona con carabinero. Personalizable con tu logo por tampografía.",
  "image": "https://www.promocionalesjj.co/img/productos/boligrafo-ballpop.jpg",
  "sku": "JJ-000001",
  "category": "Antiestrés",
  "brand": {"@id": "https://www.promocionalesjj.co/#organization"},
  "url": "https://www.promocionalesjj.co/tienda/boligrafo-ballpop/"
}
```

### Service por ciudad (reemplaza a LocalBusiness)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Productos promocionales personalizados en Bogotá",
  "serviceType": "Merchandising y regalos corporativos personalizados",
  "provider": {"@id": "https://www.promocionalesjj.co/#organization"},
  "areaServed": {"@type": "City", "name": "Bogotá"},
  "url": "https://www.promocionalesjj.co/productos-promocionales-colombia/bogota/"
}
```

### BlogPosting (`app/blog/[slug]/page.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Regalos Corporativos de Fin de Año en Colombia: Guía para Elegir sin Improvisar",
  "description": "post.seo_description",
  "image": ["https://www.promocionalesjj.co/img/blog/TODO-imagen-propia.jpg"],
  "datePublished": "2026-06-02",
  "dateModified": "2026-06-02",
  "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.promocionalesjj.co/blog/regalos-corporativos-fin-de-ano-colombia-2026/"},
  "author": {"@type": "Person", "name": "TODO autor real"},
  "publisher": {"@id": "https://www.promocionalesjj.co/#organization"},
  "inLanguage": "es-CO"
}
```

### CollectionPage para categorías (opcional)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Antiestrés promocionales",
  "url": "https://www.promocionalesjj.co/tienda/categoria/antiestres/",
  "isPartOf": {"@id": "https://www.promocionalesjj.co/#website"}
}
```

---

## 6. Borrador de `public/llms.txt`

> Usar las URLs con www solo después de resolver C1. Verificar los slugs de las ciudades contra el sitemap antes de publicar.

```
# Promocionales J&J

> Promocionales J&J es un proveedor colombiano de productos promocionales y merchandising corporativo personalizado con logo (termos, mugs, vasos, gorras, llaveros, maletines, artículos de escritura y tecnología) para empresas. Cotización por WhatsApp (+57 315 5595134) y entrega en todo Colombia: Bogotá, Medellín, Cali, Barranquilla y Bucaramanga.

Sitio: https://www.promocionalesjj.co/ | Idioma: es-CO | Público: empresas (B2B)

## Catálogo
- [Tienda (catálogo completo, ~840 productos)](https://www.promocionalesjj.co/tienda/): productos por categoría, cotización sin carrito
- [Promociones](https://www.promocionalesjj.co/promociones/): ofertas vigentes

## Cobertura por ciudad
- [Colombia - todas las ciudades](https://www.promocionalesjj.co/productos-promocionales-colombia/)
- [Bogotá](https://www.promocionalesjj.co/productos-promocionales-colombia/bogota/)
- [Medellín](https://www.promocionalesjj.co/productos-promocionales-colombia/medellin/)
- [Cali](https://www.promocionalesjj.co/productos-promocionales-colombia/cali/)
- [Barranquilla](https://www.promocionalesjj.co/productos-promocionales-colombia/barranquilla/)
- [Bucaramanga](https://www.promocionalesjj.co/productos-promocionales-colombia/bucaramanga/)

## Guías
- [Cómo elegir un proveedor de artículos publicitarios en Colombia](https://www.promocionalesjj.co/blog/como-elegir-proveedor-articulos-publicitarios-colombia/)
- [Productos promocionales para ferias empresariales en Colombia](https://www.promocionalesjj.co/blog/productos-promocionales-para-ferias-empresariales-colombia/)
- [Regalos corporativos de fin de año en Colombia 2026](https://www.promocionalesjj.co/blog/regalos-corporativos-fin-de-ano-colombia-2026/)

## Contacto
- WhatsApp: +57 315 5595134
- [Sitemap](https://www.promocionalesjj.co/sitemap.xml)
```

---

## 7. Limitaciones de esta auditoría

- **Sin datos de Google Search Console, GA4 ni CrUX:** no hay credenciales de API configuradas. No se conocen las impresiones, los clics ni los Core Web Vitals reales de usuarios.
- **PageSpeed Insights devolvió 429:** el rendimiento es una estimación de laboratorio.
- **Sin APIs de backlinks (Moz, Bing) ni DataForSEO:** no hay datos de autoridad de dominio, posiciones reales, volúmenes de búsqueda ni geo-grid local.
- **Sin línea base de seguimiento de cambios:** no se pudo comparar con un estado anterior.
- **Huella de marca y Google Business Profile no verificados:** DuckDuckGo mostró un desafío anti-bot y Bing no devolvió resultados útiles.
- **Resultados de búsqueda resumidos:** el análisis SXO se basó en resúmenes de WebSearch, sin un SERP de Google en vivo con posiciones, PAA o AI Overviews. Las consultas «artículos publicitarios» y «productos promocionales bogota» dieron resultados ruidosos.
- **Muestras parciales:**
  - Algunas métricas de contenido (descripciones, títulos, meta descriptions) se midieron sobre los archivos de datos del repositorio, no página por página en vivo.
  - Solo se comprobó la ausencia de `noindex` en una de las categorías vacías.

**Siguientes pasos para completar el panorama:** configurar una clave de API de Google y ejecutar `/seo google`, correr Lighthouse en local, y crear una línea base con `/seo drift baseline https://www.promocionalesjj.co` para medir el antes y el después de las correcciones.
