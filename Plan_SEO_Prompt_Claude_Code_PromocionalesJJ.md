# Plan de acción SEO y prompt de implementación para Claude Code

**Proyecto:** Promocionales J&J · https://www.promocionalesjj.co/  
**Mercado:** Colombia, catálogo B2B de productos promocionales personalizados y cotización.  
**Fecha de planificación:** 8 de octubre de 2026.  
**Uso:** entrega este archivo a Claude Code dentro del repositorio de la web, junto con la base unificada y las exportaciones GSC disponibles. El documento es autocontenido para iniciar; las rutas de código deben comprobarse en el proyecto actual.  
**Estado:** plan e instrucciones; no acredita cambios implementados ni desplegados.

## 1. Prompt principal: mandato de ejecución

Actúa como especialista en SEO técnico, arquitectura ecommerce y desarrollo Next.js. Implementa en este repositorio las correcciones siguientes para promocionalesjj.co. No te limites a proponer un plan: inspecciona el código, realiza cambios, ejecuta validaciones y entrega evidencia revisable.

Lee primero las instrucciones del repositorio, su configuración, scripts y estado git. Respeta modificaciones existentes del usuario. Trabaja por fases y registra cada tarea con los ID SEO-01 a SEO-24 de la base unificada. Si una tarea requiere información comercial ausente, implementa la estructura reutilizable y completa las tareas independientes; documenta exactamente el dato faltante. No inventes contenido para marcarla como terminada.

La base `base-de-trabajo-seo-unificada-promocionalesjj.md`, secciones 2–12, prevalece sobre sus anexos históricos. Este prompt incorpora además los datos de Search Console aportados posteriormente. Si el código o datos actuales contradicen una cifra histórica, reproduce la comprobación y registra la diferencia antes de cambiar nada.

Prepara cambios locales y un resultado verificable. No publiques ni modifiques cuentas externas, DNS o configuración remota sin una instrucción adicional para hacerlo. Las configuraciones necesarias pueden quedar preparadas en el repositorio con pasos de activación claros. No solicites confirmación por cada corrección reversible ya descrita.

## 2. Evidencia disponible y límites del diagnóstico

### 2.1 Auditoría unificada: cifras históricas que debes reproducir

| Hallazgo | Evidencia histórica | Interpretación correcta |
|---|---|---|
| Sitemap | 877 URLs | No equivale al total indexado. |
| Productos | 840 | Reconciliar activos, retirados y variantes con los datos actuales. |
| Categorías | 37 generadas, 24 pobladas, 13 vacías | Revisar individualmente; no eliminar por umbral automático. |
| Descubrimiento HTML desde inicio | 237 productos alcanzables; 603 sin camino | Es un problema de enlaces; no prueba que 603 estén desindexados. |
| Títulos duplicando marca | 620: 617 productos y 3 artículos | Corregir composición global, no solo ejemplos. |
| Datos estructurados | 840 ofertas sin precio y con InStock | Retirar afirmaciones no sustentadas. |
| Descripciones repetidas | 30 grupos, 88 productos | Modelos distintos pueden compartir texto; no fusionarlos automáticamente. |
| Imágenes placeholder | 104 productos, cifra reportada | Verificar; no presentarlas como fotografía real. |
| Descripción media | 17,8 palabras, cifra reportada | No aplicar noindex por longitud. |
| Catálogo concentrado | Variedades 318; escritura 291 | Reclasificar con atributos reales y propósito comercial. |

La puntuación histórica aproximada de 47/100 es una valoración de auditoría con estimaciones. No es una métrica de Google, una penalización ni un objetivo de implementación.

### 2.2 Línea base GSC: búsqueda Web, sin filtro de país

Exportación titulada últimos tres meses; las filas diarias disponibles abarcan **13/07/2026–06/10/2026**, 86 días.

| Métrica | Valor |
|---|---:|
| Clics totales | 2 |
| Impresiones totales | 349 |
| CTR calculado sobre totales | 0,57 % |
| Colombia: clics | 2 |
| Colombia: impresiones | 283 |
| Colombia: CTR | 0,71 % |
| Colombia: posición media | 35,16 |
| Impresiones de ordenador / móvil / tablet | 254 / 93 / 2 |

Evolución: julio parcial 24 impresiones; agosto 104; septiembre 185; octubre parcial 36. Agosto y septiembre muestran más apariciones, pero los periodos parciales no son comparables directamente. No atribuyas ese crecimiento a cambios que no se han documentado.

La tabla de consultas contiene 39 consultas visibles, 203 impresiones y cero clics; el gráfico sí registra dos clics. No atribuir esos clics a una consulta concreta. Las consultas ocultas y la agregación pueden generar discrepancias. La tabla de páginas suma 405 impresiones, no 349: no utilizar esa suma como total del sitio ni duplicar clics al unir dimensiones.

La tabla de Aparición en búsquedas está vacía: no acredita por sí sola un error de schema ni ausencia de indexación. Las mejores posiciones móviles no demuestran una mejor UX; pueden corresponder a consultas y países diferentes.

### 2.3 Consultas comerciales visibles

| Consulta | Impresiones | Posición media |
|---|---:|---:|
| promocionales bogota | 29 | 46,28 |
| sombrillas personalizadas | 28 | 77,00 |
| productos publicitarios medellin | 11 | 31,18 |
| vasos personalizados | 10 | 47,10 |
| productos publicitarios en medellin | 9 | 31,67 |
| paraguas personalizados | 9 | 35,22 |
| vasos corporativos | 8 | 43,75 |
| merchandising bogota | 7 | 28,43 |
| vasos corporativos personalizados | 3 | 9,67 |

Estas cifras son apariciones de J&J, no volúmenes totales de búsqueda. La consulta de vasos con tres impresiones es una señal débil, no posicionamiento estable.

### 2.4 Tabla adicional aportada por el usuario: Bogotá

El usuario la envió después de recibir instrucciones para filtrar Colombia + URL de Bogotá. No se adjuntaron sus metadatos: **segmentación probable, pendiente de confirmar**, no incorporarla al total global.

| Consulta | Impresiones | Posición |
|---|---:|---:|
| promocionales bogota | 13 | 49,3 |
| merchandising bogota | 6 | 28,3 |
| proveedores merchandising bogota | 5 | 33,6 |
| articulos publicitarios bogota | 5 | 44,4 |
| merchandising en bogota | 4 | 25,0 |
| empresas de merchandising en bogota | 3 | 32,0 |
| material promocional bogota | 3 | 32,0 |
| proveedores de merchandising bogota | 3 | 37,0 |
| artículos promocionales en bogotá | 3 | 60,0 |
| artículos promocionales bogotá | 2 | 51,5 |

Total visible: 47 impresiones y cero clics. Refuerza una sola landing útil de Bogotá; no crear diez páginas para variaciones de sinónimos.

### 2.5 Inspección del inicio y redirecciones

La inspección de `https://www.promocionalesjj.co/` mostró: indexada, rastreo e indexación permitidos, obtención correcta, Googlebot smartphone, último rastreo 16/09/2026 a las 16:20:08. Canónica declarada sin www; seleccionada por Google: URL inspeccionada con www. HTTPS correcto. Campo Sitemaps: error temporal de procesamiento.

Conclusión: el inicio sí está indexado. La contradicción de host existe, pero no demuestra bloqueo total. El error temporal requiere revisar el informe de Sitemaps, no atribuir automáticamente la falta de tráfico al XML.

Otra exportación de indexación muestra ocho URLs sin www clasificadas como página con redirección, al 03/10/2026. Es normal que una redirección intencional no se indexe como URL independiente. No perseguir que ese informe llegue a cero. Falta el resumen general de indexación para conocer la cobertura de categorías y productos.

## 3. Secuencia de acción y responsables

Los plazos representan orden de trabajo orientativo, no promesas de tráfico.

| Fase | Ventana | Alcance | Responsable / dependencia | Salida |
|---|---|---|---|---|
| 0 | Inicio | Reproducir problemas, baseline y decisiones | Claude Code; repo actual | Inventario y backlog con estado real |
| 1 | Semana 1 | Dominio, metadatos, schema, navbar, sitemap | Claude Code; hosting identificado | Build consistente y pruebas |
| 2 | Semanas 1–3 | Paginación, categorías y enlaces | Claude Code + catálogo | Catálogo activo alcanzable por HTML |
| 3 | Semanas 2–4 | Bogotá, vasos, Medellín, paraguas; confianza | Claude Code + negocio | Cuatro destinos útiles con datos reales |
| 4 | Semanas 3–8 | Fichas principales, hubs, blog, rendimiento y leads | Claude Code + ventas | Contenido diferenciado y medición |
| 5 | Días 7/28/56/90 tras publicar | Recrawl, indexación, rendimiento y ajustes | Dueño + SEO | Comparaciones consistentes y decisiones |

Priorizar Bogotá → vasos personalizados → Medellín → paraguas/sombrillas. El negocio puede ajustar el orden por margen, stock y capacidad. Revisa paraguas especialmente: aparece con impresiones en GSC y figura como categoría vacía en la auditoría. Esa combinación exige comprobar y corregir su oferta; no eliminarla a ciegas.

## 4. Fase 0: diagnóstico reproducible

1. Identifica gestor de paquetes, versión Next.js, App Router, export estático, Netlify y scripts existentes. No migres el framework ni el hosting como parte de este trabajo.
2. Inspecciona con búsquedas y lecturas dirigidas las referencias históricas: `lib/contact.ts`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/PaginatedProductGrid.tsx`, `components/Breadcrumbs.tsx`, `data/products.json`, `data/categories.json`, `data/blog-posts.json`, rutas de producto, categoría, ciudad y blog; configuración de imágenes, redirects y headers.
3. Ejecuta el build base y las comprobaciones disponibles. Distingue errores preexistentes de regresiones.
4. Genera inventario de URL, tipo de página, host, canonical, title, H1, robots, categoría, enlaces y schema desde el HTML generado; no uses solo JSON o RSC para acreditar enlaces HTML.
5. Registra categorías vacías, pertenencia incorrecta, ofertas, placeholders y datos comerciales faltantes.
6. Captura métricas de laboratorio reproducibles y pantallas móvil/escritorio en inicio, listado, producto y ciudad. No inventes Core Web Vitals de campo.

## 5. Fase 1: coherencia técnica y metadatos

### SEO-01 y SEO-13: dominio, robots, sitemap y 404

- Adoptar `https://www.promocionalesjj.co` como host primario, coherente con el destino histórico y la canónica seleccionada del inicio. Centralizar SITE_URL en una fuente única.
- Generar URLs con una función común y política uniforme de slash. Alinear canonical, sitemap, og:url, breadcrumbs, JSON-LD y URLs absolutas internas.
- Eliminar canonical global heredado hacia inicio. Cada página indexable debe declarar su propia URL; el 404 no debe heredar la del inicio.
- Mantener HTTP/host alternativo/alias con redirecciones permanentes al destino final, sin loops ni cadenas evitables. Verificar reglas concretas en Netlify; separar pruebas locales de la comprobación remota posterior.
- Sitemap generado desde la misma política de publicación que rutas y navegación: solo destinos canónicos indexables, sin redirects, noindex, 404 o facetas arbitrarias. Paginación puede descubrirse por enlaces; no es obligatorio añadir cada página paginada al sitemap.
- Usar lastmod real de cambio sustancial, o eliminarlo donde se desconozca. No usar fecha del build como actualización ficticia. priority/changefreq no aportan prioridad a Google.
- Robots debe permitir rastrear las páginas que deben indexarse y declarar el sitemap correcto. Retirar Host obsoleto. No bloquear una URL cuya directiva noindex se espera que Google lea.
- `/index.html`: si el alias existe, preparar redirección directa al inicio final y verificar precedencia de reglas.
- Mantener códigos 404 reales para rutas inválidas; no redirigirlas en masa al inicio ni servir soft 404 con 200.

**Aceptación:** canonical único por página, URL correcta, destino 200 directo; sitemap coherente; 404 real; política de redirects documentada y prueba externa pendiente si no hay despliegue.

### SEO-06 y SEO-07: titles, H1 y descriptions

- Resolver doble sufijo desde la fuente de datos o plantilla de metadata, sin eliminar accidentalmente parte del nombre legítimo.
- Corregir tres labels duplicando Personalizados, tildes y concordancia. Mantener un encabezado principal claro por template.
- Producto: tipo genérico + modelo + personalización, solo si se ofrece. Mantener URL aunque mejore el nombre visible.
- Generar descriptions con atributos existentes y frases completas. No cortar cadenas por número fijo ni repetir listas de cinco ciudades en todas las fichas.
- 50–60 caracteres de título o 120–155 de descripción son guías editoriales, no límites de Google ni motivos automáticos para invalidar textos útiles.
- Metadata OG y Twitter específica por ruta; imagen real apropiada y fallback social de marca que no simule una foto del producto.
- Retirar hreflang artificial en un sitio monolingüe si no existen alternativas reales.

### SEO-04, SEO-08, SEO-10 y SEO-21: schema factual

- Retirar Offer si no existe precio real publicado y respaldado. Nunca usar cero para simular cotización; retirar InStock sin inventario fiable.
- Puede mantenerse Product semántico con nombre, descripción, SKU, URL e imagen real. Distinguir validez semántica de elegibilidad de Google: sin offers/review/aggregateRating requeridos no prometer fragmento enriquecido. No inventar reseñas para conseguirlo.
- brand debe ser la marca real del producto. No convertir automáticamente a J&J, distribuidor, en fabricante. No inventar GTIN/MPN.
- Excluir placeholder de image en Product. No sustituirlo por imagen genérica presentada como foto del modelo.
- Organization y WebSite enlazados por @id estable; teléfono E.164 si el número se verifica; redes, NIT, razón social y dirección solo confirmados.
- Si no hay oficinas acreditadas por ciudad, no emitir LocalBusiness como sucursal. Representar cobertura real con Organization y Service/areaServed cuando corresponda.
- BreadcrumbList debe seguir jerarquía real; último ítem sin URL es aceptable.
- BlogPosting: autoría real, publisher, mainEntityOfPage, fecha de publicación y modificación honestas. Organization puede ser autora si corresponde.
- ItemList/CollectionPage opcionales; reflejar productos visibles de esa página. ProductGroup solo cuando variantes reales y sus estados estén implementados.

## 6. Fase 2: catálogo rastreable y arquitectura

### SEO-02: paginación compatible con export estático

Crear rutas reales generadas en build, por ejemplo:

```text
/tienda/
/tienda/pagina/2/
/tienda/categoria/articulos-escritura/
/tienda/categoria/articulos-escritura/pagina/2/
```

- Mantener página 1 en la ruta existente; no crear duplicado indexable `/pagina/1/`.
- Cada ruta presenta HTML propio con tarjetas y enlaces de productos distintos, y canonical propio. No canonicalizar página 2 hacia página 1.
- Anterior/siguiente y números con `<a href>` rastreables. No depender de clic, scroll, hash o useState para descubrir el catálogo completo.
- Load more puede conservarse como mejora, con rutas accesibles en paralelo y navegación coherente.
- Generar parámetros estáticos para todos los subconjuntos. No confiar en `?page=2` si el hosting solo devuelve el mismo HTML exportado.
- Preservar búsqueda/filtros de usuario; reducir serialización de 840 registros en cada página. Verificar comportamiento tras volver atrás y enlaces directos.
- Página fuera de rango: 404; ordenar de manera estable para evitar duplicaciones/omisiones entre páginas.

**Aceptación:** crawl desde inicio sobre HTML sin JS alcanza todos los productos activos destinados a publicación. Comparar antes/después y reconciliar exclusiones legítimas. Sitemap y datos serializados no cuentan como enlaces del grafo.

### SEO-03 y SEO-15: taxonomía y categorías vacías

Registrar una decisión para las trece: confeccion, deportes, econature, gorras, juegos, medicos, memorias-usb, paraguas, produccion-nacional, productos-2023, relojes, tecnologia, tomatodos-y-botilitos-personalizados.

Para cada una: datos reales → pertenencia → oferta visible → señales GSC → decisión justificada. Opciones:

1. Poblar con modelos existentes correctamente asignados y añadir guía útil.
2. Mantener temporalmente si ofrece valor real y condiciones claras, sin fingir inventario.
3. Consolidar hacia equivalente real con mapa de redirects si el contenido es sustituido.
4. Retirar o excluir individualmente si carece de propósito; documentar evidencia y efecto previsto.

No aplicar noindex por tener menos de ocho productos, poco texto o cero clics. No redirigir categorías sin equivalente a la home.

Corregir botilitos mal asignados a Mugs y estudiar divisiones de Variedades/Escritura por tipo, material y uso acreditados. Permitir pertenencia múltiple conservando una URL por modelo y una categoría primaria para breadcrumb.

Facetas: colecciones útiles pueden indexarse; búsqueda interna y combinaciones arbitrarias fuera del sitemap, con política explícita. Evitar generar explosión de URLs. Orden/vista equivalentes pueden consolidarse; no canonicalizar contenido materialmente diferente como si fuera duplicado.

### SEO-18: enlaces internos

Inicio → colecciones principales; tienda → categorías útiles; paginación → productos; producto → categoría y alternativas; blog → destinos comerciales; ciudad → catálogo relevante.

Relacionados por atributos compatibles: tipo, material, capacidad, uso y técnica. Evitar los primeros cuatro registros fijos. No crear enlaces a categorías vacías como destinos destacados.

## 7. Fase 3: páginas comerciales con señales GSC

### Bogotá

Conservar `/productos-promocionales-colombia/bogota/`. Propuesta editorial inicial:

- Title: `Productos promocionales en Bogotá | Promocionales J&J`.
- H1: `Productos promocionales y merchandising en Bogotá`.
- Intro: oferta real, comprador empresarial y mecanismo de cotización.
- Selección de productos/categorías reales, personalización compatible, pasos de cotización, cobertura y entregas verificadas, dudas frecuentes y evidencia comercial disponible.
- Integrar naturalmente artículos publicitarios, merchandising y proveedores donde ayuden a explicar el servicio; no repetir todas las consultas como H2 ni inventar oficinas, clientes o plazos.

### Vasos personalizados

Conservar la ruta de categoría actual y alinear host. Validar la selección. Explicar materiales, capacidad, usos, cuidados y técnicas solo desde fichas verificadas. No confundir vasos, mugs, termos y botilitos. Tratar vasos corporativos personalizados como intención compatible, no crear duplicado exacto de la categoría.

### Medellín

Conservar `/productos-promocionales-colombia/medellin/`. Enfocar productos publicitarios y merchandising con cobertura verificable. Usar datos propios de logística/atención local, no una copia de Bogotá cambiando el nombre. Si faltan datos diferenciadores, registrar la carencia y decidir individualmente sin desindexar en masa.

### Paraguas y sombrillas

Conservar `/tienda/categoria/paraguas/` si corresponde a oferta real. Resolver primero la contradicción categoría vacía + impresiones. Clasificar productos existentes mediante datos fiables; no asignar productos por coincidencias ambiguas del nombre. Diferenciar paraguas de mano de sombrillas de exterior si ambos existen. Describir tamaño, estructura y personalización solo cuando se conozcan. No abrir páginas nuevas por cada sinónimo o ciudad.

### SEO-09 y SEO-19: confianza y cotización

Crear Nosotros/Contacto usando identidad y canales verificados. Preparar políticas aplicables con revisión del negocio; no publicar borradores legales como definitivos ni promesas no confirmadas.

Cotización debe recoger producto/modelo, cantidad, destino y fecha requerida; técnica y logo según el flujo real. Mostrar MOQ/plazos junto al CTA solo si existen datos. WhatsApp con mensaje contextual codificado correctamente. Añadir correo o formulario alternativo únicamente si el canal funciona. Un formulario exportado requiere backend/servicio compatible: no fingir éxito con una animación sin envío.

Reseñas, logos, casos, fotos y nombres solo con evidencia y derechos. Si no están disponibles, omitir el bloque público y dejar plantilla editorial pendiente, sin placeholders visibles.

## 8. Fase 4: producto, hubs, blog y rendimiento

### SEO-14: fichas principales y cola de catálogo

Seleccionar inicialmente 50–100 productos con criterios explícitos: pertenencia a categorías prioritarias, stock fiable, margen aportado, atributos completos y diferenciación. Si faltan datos de margen/stock, usar completitud y relevancia como proxy, declararlo y no afirmar rentabilidad.

Separar SKU propio de referencia proveedor. Crear campos tipados para material, medidas/capacidad, colores, técnica/área, MOQ, múltiplos, empaque, muestra, plazo, stock y fecha de verificación. Valores ausentes deben ser null/omitidos, no inventados.

Mostrar especificaciones existentes y contenido explicativo factual. No reutilizar beneficios genéricos como si fueran propiedades de cada producto. No añadir 200 palabras de relleno. Dejar registro de fichas pendientes; no noindex masivo por longitud. No copiar todo el catálogo del benchmark ni raspar recursos protegidos.

### SEO-16 y SEO-17: hubs y blog

Construir mapa de intención antes de nuevas rutas: inicio = marca/oferta; hub Colombia = cobertura nacional; ciudades = servicio local; categorías = selección; producto = modelo; blog = orientación de compra.

Evaluar `/regalos-corporativos/` y `/articulos-publicitarios/` con selecciones y propuestas diferentes. Ferias, mayorista y técnicas solo si hay oferta real y utilidad diferenciada; si no, integrar secciones en destinos existentes. No publicar automáticamente cinco hubs casi iguales.

Revisar tres artículos existentes: ejemplos, comparativas útiles, enlaces, autoría real y tiempo de lectura calculado. No declarar obsoleto un artículo de fin de año 2026 por su slug al 08/10/2026. No cambiar fechas de modificación sin revisión sustancial.

### SEO-11, SEO-12 y SEO-20: velocidad y móvil

- Imágenes responsive con dimensiones, srcset/sizes y WebP/AVIF si hay ahorro real. Confirmar Netlify Image CDN en este despliegue o pregenerar variantes compatibles con output export.
- No precargar seis fotos del catálogo y logo sobredimensionado. Priorizar la imagen LCP real; diferir recursos fuera de pantalla.
- Resolver placeholders con fotos reales disponibles; mantener fallback honesto en la UI si no existen. No generar fotografías ficticias del modelo.
- Caché larga immutable solo para archivos versionados; recursos sobrescritos con el mismo nombre requieren política distinta.
- Reducir HTML/JS y datos serializados sin perder rastreabilidad ni filtros. Revisar restos de componentes no usados.
- Navbar legible en fondos claros/oscuros y scroll; H1 sin recortes; CTA sin choque con WhatsApp; controles cómodos, foco visible y teclado. Objetivo práctico 44 px para acciones principales sin presentarlo como requisito universal SEO.
- Comparar laboratorio antes/después con dispositivo, red y método iguales. Objetivos de campo orientativos: LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1 en percentil 75; laboratorio no certifica INP/CrUX. Si no hay datos de campo, declarar sin datos.

### SEO-21 a SEO-24: complementos

OG con imágenes reales. Headers compatibles y CSP progresiva probada; evitar políticas copiadas que rompan analytics, imágenes o formularios. Hub de categorías si añade navegación útil.

GBP y citaciones solo tras confirmar elegibilidad y operación real; no crear sucursales para cada ciudad. Solicitar reseñas auténticas mediante proceso del negocio, sin automatizar envíos externos aquí.

llms.txt, IndexNow y security.txt son complementos posteriores: no condicionan la corrección del SEO principal ni garantizan rankings/citas IA. Si se implementan, reflejar información real; no declarar endpoints de seguridad que nadie atiende.

## 9. Analítica y seguimiento de negocio

Preparar medición desacoplada y compatible con la implementación existente. Si hay GA4, reutilizarlo; si falta ID, no insertar uno inventado. No enviar datos personales, logo, email, teléfono ni texto libre de cotización como parámetros analíticos.

| Evento propuesto | Disparador | Significado |
|---|---|---|
| whatsapp_click | Clic real al canal | Intención de contacto, no lead confirmado |
| quote_start | Inicio real del formulario | Inicio del flujo |
| quote_submit_success | Confirmación del backend | Solicitud recibida, no venta |
| quote_submit_error | Fallo real de envío | Diagnóstico funcional sin PII |

Unificar listeners para evitar doble conteo. Distinguir evento simulado en prueba de evento enviado. Leads cualificados y ventas requieren conciliación con ventas/CRM; no se deducen de clics GSC.

## 10. Pruebas y criterios de aceptación

Usa scripts existentes y añade comprobaciones de integración SEO que detecten regresiones reales. Analiza HTML generado y haz crawl de enlaces. No declares aprobación solo por inspeccionar el código.

- [ ] Build, tipos, lint y checks aplicables pasan, o fallos previos quedan documentados.
- [ ] Todas las rutas publicadas usan un canonical coherente y único; 404 sin canonical hacia inicio.
- [ ] Sitemap XML parseable y reconciliado con inventario; sin redirects/noindex/404 ni fechas falsas.
- [ ] Paginación inicial/intermedia/final tiene productos correctos, enlaces reales y canonical propio; rango inválido 404.
- [ ] Todos los productos activos publicables tienen camino HTML desde inicio; diferencias documentadas por SKU.
- [ ] Las trece categorías tienen decisión individual; paraguas conserva señales existentes cuando ofrece valor real.
- [ ] Títulos sin marca repetida, descriptions completas, labels corregidos y OG propio.
- [ ] JSON-LD parseable y factual; sin precio/stock/brand/reviews inventados.
- [ ] Product sin elegibilidad para rich results se registra como tal, no como fallo corregido con datos falsos.
- [ ] No quedan locales ficticios, páginas repetidas por ciudad ni placeholders públicos de datos pendientes.
- [ ] Contacto y cotización funcionan; formularios no simulan envío; WhatsApp conserva contexto correcto.
- [ ] Navbar, menú, teclado, foco, CTA e imágenes probados en móvil y escritorio.
- [ ] Rendimiento comparable registrado; caché y formatos compatibles con el hosting.
- [ ] Cambios de ruta cuentan con mapa uno a uno y verificación de equivalencia; no hay borrados masivos.
- [ ] Separadas validación local, validación del hosting e indexación externa de Google.

Los campos desconocidos del negocio impiden completar esas tareas concretas, no toda la entrega. No marcar checklist pendiente como aprobado.

## 11. Entregables de Claude Code

Dejar cambios de implementación y estos documentos en el repositorio, ajustando ubicaciones a sus convenciones:

1. `docs/seo/plan-ejecucion.md`: SEO-01…24 con estado, cambios, dependencias y responsable.
2. `docs/seo/baseline-gsc.md`: línea base de esta sección, fechas, filtros y límites.
3. `docs/seo/mapa-intenciones.md`: URL existente/nueva, intención, cluster, selección y enlaces.
4. `docs/seo/decisiones-categorias.md`: trece casos y reclasificación justificada.
5. `docs/seo/datos-pendientes-negocio.md`: dato exacto, página afectada, motivo y alternativa implementada.
6. `docs/seo/validacion-antes-despues.md`: comandos, resultados, inventarios, capturas y limitaciones.
7. `docs/seo/publicacion-y-seguimiento.md`: activación, comprobaciones externas y rollback.
8. Mapa de redirects solo si hay cambios de rutas; inventario anterior preservado para reversión.

La lista es documentación de entrega, no obligación de mantener ocho archivos si las convenciones del repo permiten consolidar sin perder contenido. Finaliza con resumen de cambios, pruebas ejecutadas, pendientes reales y próximos pasos. No afirmar que el SEO está recuperado ni que Google ya indexó cambios locales.

## 12. Después de publicar: trabajo externo y medición

### Día 0–7

- Verificar producción: finales 200, alternativos redirigen al destino correcto, sitemap accesible, 404 real, recursos y formulario funcionales.
- Enviar/revisar sitemap en GSC y registrar resultado; investigar el error temporal si persiste.
- Inspeccionar inicio, Bogotá, vasos, Medellín, paraguas y muestra de productos. Solicitar indexación de páginas principales modificadas cuando corresponda, sin repetir solicitudes masivas diariamente.
- Guardar resumen completo de indexación y fechas de recrawl. No esperar que desaparezcan redirecciones intencionales del informe.

### Días 28, 56 y 90

Comparar periodos iguales de 28 días, tipo Web, país Colombia, con mismos filtros. Separar marca/no marca mediante clasificación revisada; jj o j&j aislados pueden ser ambiguos. Comparar páginas y consultas específicas; no promediar posiciones sin ponderación ni confundir cambios de mezcla de consultas con mejoras generales.

Medir impresiones, clics, CTR contextualizado por posición, consultas comerciales visibles, destinos indexados, canónicas seleccionadas, solicitudes válidas y leads cualificados. Registrar fecha de publicación y estacionalidad de fin de año. Con dos clics de base, los porcentajes de crecimiento son inestables: informar también valores absolutos.

| Meta operativa verificable | Objetivo |
|---|---|
| Coherencia técnica | 100 % de páginas publicadas revisadas sin contradicción conocida de host |
| Descubrimiento | 100 % de productos activos publicables alcanzables mediante enlaces HTML |
| Schema | Cero afirmaciones conocidas no respaldadas |
| Prioridades GSC | Cuatro destinos revisados con contenido y oferta factual |
| Indexación | Estado registrado de páginas importantes después del recrawl |
| Negocio | Seguimiento de contactos y solicitudes funcionando sin duplicados |

No fijar promesas de top 3, fechas de indexación ni cifras de tráfico sin validación de demanda y competencia. Si crecen impresiones con posiciones bajas, seguir mejorando utilidad y enlaces; si las posiciones mejoran pero CTR sigue bajo, revisar snippet e intención; si hay clics sin leads, revisar oferta y flujo comercial.

## 13. Fuentes y precedencia

Fuentes del usuario: base unificada adjunta; auditoría SEO original; Filtros.csv, Gráfico(1).csv, Países.csv, Consultas.csv, Páginas.csv, Dispositivos.csv, Aparición en búsquedas.csv; exportación de redirecciones; capturas 1281–1284; tabla adicional de Bogotá pegada en conversación.

La base unificada fue creada antes de incorporar GSC y afirma no conocer posiciones/indexación. Esa limitación queda actualizada por los datos anteriores, solo para las URLs, consultas y periodos que realmente cubren. No extender la inspección del inicio a todos los productos.

Referencias primarias para comprobar decisiones en la versión vigente:

- Search Console: https://support.google.com/webmasters/answer/7576553?hl=es
- Indexación: https://support.google.com/webmasters/answer/7440203?hl=es
- Canonical: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Paginación: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- Arquitectura: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- Product: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Facetas: https://developers.google.com/search/blog/2024/12/crawling-december-faceted-nav

**Instrucción final para Claude Code:** comienza por la fase 0, implementa en orden y continúa con las tareas independientes hasta completar el alcance ejecutable. Entrega trabajo verificable, no solo recomendaciones. Mantén explícitos los datos que el dueño debe aportar y las comprobaciones que solo pueden hacerse después de publicar.
