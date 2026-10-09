# Validación antes / después

**Alcance:** validación **local** sobre el export estático (`out/`). No hay validación del hosting ni de la indexación de Google, porque nada se ha publicado (ver [publicacion-y-seguimiento.md](publicacion-y-seguimiento.md)).

**Fecha:** 8–9 de octubre de 2026.

**Versiones comparadas:**
- **Antes:** `HEAD` (`ba61050`), construido en un worktree aparte.
- **Después:** el árbol de trabajo actual.

## 1. Comandos

```bash
pnpm lint                      # ESLint (next lint)
pnpm exec tsc --noEmit         # tipos
pnpm build                     # export estático a out/
node scripts/seo-check.mjs out --strict --csv docs/seo/inventario/despues.csv --json docs/seo/inventario/despues.json
node scripts/preview-server.mjs 4180            # sirve out/ como Netlify (404 real, 301 de slash, gzip, /.netlify/images)
python scripts/visual-check.py http://localhost:4180 docs/seo/capturas/despues
pnpm dlx lighthouse@12.6.0 <url> --form-factor=mobile --only-categories=performance --output=json
node scripts/lighthouse-summary.mjs <carpeta-json> --md
```

- `scripts/seo-check.mjs` analiza el **HTML generado**. Los enlaces solo cuentan si están en `<a href>` fuera de `<script>`, de modo que el payload RSC y el sitemap no se cuentan como enlaces.
- Con `--strict` devuelve código de salida 1 si hay incidencias bloqueantes. Conviene ejecutarlo tras cada build.

## 2. Build, tipos y lint

| Comprobación | Antes | Después |
|---|---|---|
| `pnpm lint` | sin avisos | sin avisos |
| `tsc --noEmit` | 0 errores | 0 errores |
| `pnpm build` | correcto (892 HTML) | correcto (951 HTML) |
| `seo-check --strict` | — (ver incidencias) | **0 incidencias**, código de salida 0 |

## 3. Inventario SEO del HTML generado

Los inventarios completos por URL están en [inventario/antes.csv](inventario/antes.csv) y [inventario/despues.csv](inventario/despues.csv). Las incidencias detalladas, en los `.json` correspondientes.

| Métrica | Antes | Después | Cifra de la auditoría |
|---|---:|---:|---|
| Páginas HTML | 892 | 951 | — |
| URLs en sitemap | 877 (todas sin www, con 301) | 888 (todas con www, 200) | 877 ✔ reproducida |
| Productos | 840 | 840 | 840 ✔ |
| Productos alcanzables desde el inicio por enlaces HTML | **237** | **840** | 237 / 603 ✔ reproducida |
| Productos sin camino HTML | **603** | **0** | — |
| Páginas alcanzables desde el inicio | 287 | 949 (de 951; las 2 restantes son el 404) | — |
| Canonical incorrecto (host sin www o ausente) | 890 | 0 | — |
| `og:url` incorrecto (heredaba el inicio) | 48 | 0 | — |
| URLs del JSON-LD con host incorrecto | 6.081 | 0 | — |
| Títulos con la marca duplicada | **620** | 0 | 620 (617 productos + 3 artículos) ✔ |
| «Personalizados Personalizados» | 3 | 0 | 3 ✔ |
| Meta description sin cierre de frase | 823 | 0 | 707 cortadas (criterio distinto) |
| `Offer` sin precio (con `InStock`) | **840** | 0 | 840 ✔ |
| `Product.image` con placeholder | 104 | 0 | 104 ✔ |
| `LocalBusiness` sin sede | 5 | 0 | 5 ✔ |
| Canonical en el 404 (apuntaba al inicio) | 1 | 0 | — |
| hreflang artificial | 1 | 0 | — |
| Páginas sin `og:image` | 48 | 0 | — |
| Páginas con más de 2 precargas de imagen | 1 (inicio: 7) | 0 (inicio: 0) | — |
| `lastmod` uniforme en el sitemap | 874/877 = 2026-07-13 | solo los 3 artículos llevan fecha (la real) | ✔ |
| robots.txt con `Host:` | sí | no | — |
| Enlaces internos rotos | 0 | 0 | — |
| HTML de `/tienda/` | 950.596 B | 144.044 B | 950 KB ✔ |
| HTML del inicio | 89.979 B | 113.993 B (≈ +3 KB gzip, por `srcset`) | — |

Diferencias registradas:

- **Meta descriptions:** la auditoría contó 707 cortadas a mitad de frase. Este script usa un criterio más estricto (que la descripción termine en un signo de cierre) y cuenta 823 en la versión anterior. Ambas cifras llegan a 0.
- **Descripciones repetidas:** la auditoría cita 30 grupos y 88 productos. No se fusionaron: modelos distintos pueden compartir texto del proveedor, y el plan lo prohíbe. Las nuevas metas añaden el nombre del modelo, así que son únicas salvo un caso. Ese caso son 2 modelos llamados «Resaltador Jeringa», que ahora se distinguen por referencia del proveedor.

## 4. Rutas y códigos de estado (servidor local que imita a Netlify)

| Ruta | Esperado | Resultado |
|---|---|---|
| `/tienda/pagina/2/`, `/tienda/pagina/35/` | 200 | 200 |
| `/tienda/pagina/1/` (duplicado de la página 1) | 404 | 404 |
| `/tienda/pagina/36/` (fuera de rango) | 404 | 404 |
| `/tienda/categoria/articulos-escritura/pagina/13/` | 200 | 200 |
| `/tienda/categoria/articulos-escritura/pagina/14/` | 404 | 404 |
| `/tienda/categoria/confeccion/` (retirada) | 404 | 404 |
| `/tienda/categoria/paraguas/` (antes vacía) | 200 | 200 |
| `/tienda/trevon` (sin slash) | 301 → `/tienda/trevon/` | 301 |
| `/no-existe/` | 404 real (no soft 404) | 404 |
| `/robots.txt` | `Sitemap` con www, sin `Host` | correcto |

Cada página paginada tiene un canonical propio (no apunta a la página 1), enlaces «Anterior», «Siguiente» y numerados con `<a href>`, y orden estable por SKU. El crawl confirma que no hay omisiones ni duplicados: los 840 productos son alcanzables.

## 5. JSON-LD (muestra en `out/`)

- **Todas las páginas:** `@graph` con `Organization` (`@id` `/#organization`, logo, descripción, teléfono E.164 en `contactPoint`) y `WebSite` (`@id` `/#website`, `publisher` → organización).
- **Producto:** `Product` con `name`, `description`, `image` (solo si hay foto real), `sku`, `url` y `category`. **Sin `offers` ni `brand`.** Sin precio público no es elegible para fragmentos con precio; se registra como limitación, no como fallo corregido.
- **Ciudad:** `Service` con `provider` → `@id` de la organización y `areaServed` City. Sin `LocalBusiness`.
- **Artículo:** `BlogPosting` con `publisher`, `mainEntityOfPage`, `datePublished` y `dateModified` (igual a la publicación, porque no hubo revisión sustancial) y autor = organización (así figura en los datos).
- **`BreadcrumbList`** en todas las páginas con migas, con host www. El último elemento va sin URL.
- Todo el JSON-LD se parsea sin errores (comprobado por `seo-check`) y se serializa escapando `<`.

## 6. Visual y móvil (Playwright, 1366×768 y 390×844)

Las capturas están en [capturas/antes](capturas/antes) y [capturas/despues](capturas/despues), con las mediciones en `mediciones.json` dentro de cada carpeta.

| Comprobación | Antes | Después |
|---|---|---|
| Navbar en páginas claras (producto, ciudad, tienda) | Texto y menú **blancos sobre blanco**: menú móvil invisible (captura `antes/producto-movil.png`) | Barra sólida; contraste del wordmark y del botón de menú **15,96:1** |
| Desbordamiento horizontal | ninguno | ninguno |
| Zonas táctiles < 40 px por página | 19–26 | **0** |
| CTA de producto en móvil (posición y) | 708 (con imagen cuadrada) | 693 (imagen 4:3, máximo 50vh); sin solaparse con el botón de WhatsApp |
| CTA visible en la página de ciudad en móvil | primer CTA en y = 1070 | CTA «Cotizar para Bogotá» en y = 522 |
| H1 del inicio (escritorio) | descendentes («g», «q») recortados | completos (`capturas/despues/inicio-h1-detalle.png`) |
| Menú móvil con teclado | — | `aria-controls`, `aria-expanded`, enlaces fuera del orden de tabulación cuando está cerrado; primer foco al abrir: «Inicio» |

Limitaciones de la medición:

- **Contraste «antes»:** el script supuso fondo oscuro cuando la barra era transparente, así que en las páginas claras reportó 17,48. El contraste real era cercano a 1:1 (blanco sobre blanco), como muestran las capturas.
- **H1 del inicio:** la métrica automática sigue marcándolo como «recortado» porque compara `scrollHeight` y `clientHeight` de la máscara de animación. La captura de detalle confirma que los trazos se ven completos. Es un falso positivo de la métrica.

## 7. Rendimiento de laboratorio (Lighthouse 12.6, móvil simulado)

**Método igual para ambas versiones:**
- mismo equipo y mismo servidor local, con gzip;
- `/.netlify/images` reenviado al Image CDN real de producción, con caché en memoria y una pasada de calentamiento;
- 3 corridas por página; se muestra la mediana.

Resumen: [inventario/lighthouse-resumen.md](inventario/lighthouse-resumen.md).

| Página | Versión | Score | LCP | FCP | TBT | CLS | Peso total | Imágenes |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Inicio | antes | 59 | 12,55 s | 1,36 s | 435 ms | 0,000 | 4.123 KB | 3.814 KB |
| Inicio | después | 74 | 3,75 s | 1,43 s | 596 ms | 0,000 | 371 KB | 133 KB |
| Producto (`/tienda/trevon/`) | antes | 74 | 5,86 s | 1,06 s | 222 ms | 0,000 | 1.438 KB | 1.087 KB |
| Producto | después | 84 | 3,00 s | 1,14 s | 323 ms | 0,000 | 337 KB | 79 KB |
| Tienda | antes | 70 | 3,75 s | 1,49 s | 756 ms | 0,000 | 4.617 KB | 4.108 KB |
| Tienda | después | 88 | 2,64 s | 1,14 s | 310 ms | 0,000 | 405 KB | 173 KB |

Lectura:

- **Peso y LCP:** el peso transferido baja entre 4 y 11 veces y el LCP mejora en las tres páginas. La causa es que las imágenes ahora pasan por el Image CDN (WebP con `srcset`), que ya no hay 7 precargas en el inicio y que el logo se pide a 64/128 px en lugar de 640/1080.
- **TBT del inicio y del producto:** sube ligeramente en la mediana (+100–160 ms). El JavaScript no cambió de tamaño (87,5 KB compartidos en ambas versiones), y el TBT de laboratorio varía mucho entre corridas, así que se registra como **pendiente de confirmar** con más corridas o con datos de campo. No se presenta como mejora.
- **CLS de `/tienda/`:** apareció una regresión (0,087), causada por el reajuste de las pastillas de categoría cuando carga la fuente. Se corrigió (fila desplazable en móvil) y se volvió a medir: 0,000.
- **Sin datos de campo:** el laboratorio no certifica INP ni CrUX. INP no se puede medir en laboratorio, y CrUX no tiene datos del sitio con el tráfico actual. Objetivos orientativos de campo (p75): LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- **Antes y después en local:** la medición se hizo en local para que las condiciones fueran iguales. Las cifras absolutas en Netlify serán distintas; repetir con PageSpeed Insights tras publicar.

## 8. Checklist de aceptación del plan (sección 10)

| Criterio | Estado |
|---|---|
| Build, tipos, lint y checks pasan | ✅ |
| Canonical coherente y único en todas las rutas; 404 sin canonical | ✅ (`seo-check`: 0 incidencias) |
| Sitemap parseable y reconciliado; sin redirecciones, noindex, 404 ni fechas falsas | ✅ (local). En producción, pendiente de verificar tras publicar |
| Paginación inicial, intermedia y final con productos correctos, enlaces reales, canonical propio y 404 fuera de rango | ✅ |
| Todos los productos activos con camino HTML desde el inicio | ✅ 840/840; no hay exclusiones |
| Las 13 categorías con decisión individual; paraguas conserva su señal | ✅ ([decisiones-categorias.md](decisiones-categorias.md)) |
| Títulos sin marca repetida, descripciones completas, etiquetas corregidas, OG propio | ✅ |
| JSON-LD parseable y factual, sin precio, stock, brand ni reseñas inventados | ✅ |
| Product sin elegibilidad para fragmentos registrado como tal | ✅ |
| Sin sedes ficticias ni placeholders públicos de datos pendientes | ✅. Las 3 ciudades menores siguen siendo parecidas; ver datos pendientes |
| Contacto y cotización funcionan; el formulario no simula envíos; WhatsApp con contexto | ✅ (local). El formulario abre WhatsApp con el mensaje compuesto |
| Navbar, menú, teclado, foco, CTA e imágenes probados en móvil y escritorio | ✅ con las limitaciones del apartado 6 |
| Rendimiento comparable registrado; caché y formatos compatibles con el hosting | ✅ laboratorio. ⏳ Las cabeceras de caché solo se verifican tras publicar |
| Cambios de ruta con mapa uno a uno; sin borrados masivos | ✅ No cambia ninguna URL existente de producto, categoría ni ciudad. Las únicas rutas que dejan de existir son las 5 categorías vacías retiradas (404 documentado) |
| Validación local, del hosting e indexación separadas | ✅ Local hecha; hosting e indexación pendientes |
