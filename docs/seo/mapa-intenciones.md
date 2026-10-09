# Mapa de intenciones (SEO-16, SEO-18)

Hay una intención principal por URL. Las consultas sinónimas se integran en la misma página en lugar de abrir páginas nuevas.

| URL | Estado | Intención | Cluster / consultas | Selección mostrada | Enlaces que recibe |
|---|---|---|---|---|---|
| `/` | existente | Marca y oferta general | «promocionales j&j», «productos promocionales colombia» (genérica) | 12 categorías destacadas y 8 productos con foto real (uno por categoría) | Todas las páginas (logo y navegación) |
| `/tienda/` + `/tienda/pagina/2…35/` | existente + **nuevas** | Explorar el catálogo completo | «catálogo productos promocionales» | Todos los productos activos (840) en páginas de 24, en orden estable por SKU | Navegación, inicio, migas de pan, 404 |
| `/tienda/categoria/{slug}/` + `/pagina/n/` | existente + **nuevas** (paginación) | Selección por tipo de producto | p. ej. «vasos personalizados», «paraguas personalizados», «bolsas ecológicas con logo» | Productos primarios y secundarios de la categoría, más un resumen factual (materiales, técnicas, venta mínima) | `/tienda/`, otras categorías, fichas (miga de pan y etiqueta), ciudades, blog, footer, inicio |
| `/tienda/categoria/bolsas/` | **nueva** | Bolsas y tulas con logo | «bolsas personalizadas», «bolsas ecológicas con logo», «tulas personalizadas» | 54 bolsas | Igual que el resto de categorías; destacada en inicio y footer |
| `/tienda/categoria/libretas/` | **nueva** | Libretas y cuadernos con logo | «libretas personalizadas», «cuadernos con logo» | 19 libretas y planeadores | Igual; destacada en inicio y footer |
| `/tienda/categoria/vasos-personalizados/` | existente (revisada) | Vasos con logo | «vasos personalizados», «vasos corporativos», «vasos corporativos personalizados» (GSC) | 2 vasos reales; remite a mugs, botilitos y termos para otros usos | Ciudad Bogotá, otras categorías |
| `/tienda/categoria/paraguas/` | existente (antes vacía) | Paraguas de mano con logo | «paraguas personalizados», «sombrillas personalizadas» (GSC) | 3 paraguas | Inicio, footer, ciudades Bogotá y Barranquilla, `llms.txt` |
| `/tienda/{producto}/` | existente | Modelo concreto | Cola larga: tipo + modelo («bolígrafo plástico trevon») | Ficha con especificaciones extraídas y 8 similares por atributos | Categorías y páginas de categoría, similares, inicio |
| `/productos-promocionales-colombia/` | existente | Cobertura nacional | «productos promocionales colombia», «merchandising empresarial» | Ciudades | Navegación, footer, migas de pan |
| `/productos-promocionales-colombia/bogota/` | existente (reforzada) | Servicio en Bogotá | «promocionales bogota», «merchandising bogota», «proveedores merchandising bogota», «artículos publicitarios bogotá», «material promocional bogota» | 8 categorías relevantes, pasos de cotización y CTA con la ciudad | Hub Colombia, footer, contacto |
| `/productos-promocionales-colombia/medellin/` | existente (reforzada) | Servicio en Medellín | «productos publicitarios medellin», «productos publicitarios en medellin» | 6 categorías, pasos y CTA | Hub, footer, contacto |
| `/productos-promocionales-colombia/{cali,barranquilla,bucaramanga}/` | existente | Servicio en esa ciudad | «productos promocionales {ciudad}» | 4 categorías, pasos y CTA | Hub, footer, contacto |
| `/contacto/` | **nueva** | Cotizar o contactar | «cotizar productos promocionales» | Formulario que compone el mensaje para WhatsApp | Navegación, footer |
| `/promociones/` | existente | Ofertas | «promociones productos promocionales» | Referencias «precio bomba» | Navegación, footer |
| `/blog/` y `/blog/{slug}/` | existente | Orientación de compra (informativa) | «cómo elegir proveedor», «regalos fin de año», «productos para ferias» | 3 artículos; cada uno enlaza a 4 categorías relacionadas | Navegación, footer |

## Hubs evaluados y no creados

| Propuesta | Decisión | Motivo |
|---|---|---|
| `/regalos-corporativos/` | **No creada** | La auditoría detectó la intención comercial, pero la consulta no aparece en GSC y no hay datos de kits, presupuestos u ocasiones que diferencien la página del catálogo. Sin esa oferta sería un listado duplicado de categorías. Crear cuando el negocio defina kits o rangos de presupuesto |
| `/articulos-publicitarios/` | **No creada** | Es un sinónimo de «productos promocionales». La intención está cubierta por el inicio, `/tienda/` y Bogotá (que integra «artículos publicitarios»). Un hub más competiría con esas páginas |
| Ferias, mayorista, técnicas de marcación | **No creadas** | El plan exige oferta real y utilidad diferenciada. Las técnicas se muestran por categoría desde los datos |

## Reglas de enlazado aplicadas

- **Inicio** → 12 categorías con productos, 8 productos, `/tienda/`.
- **Tienda** → las 34 categorías publicadas y la paginación con `<a href>` real hacia todos los productos.
- **Categoría** → sus productos (paginados), las otras categorías y CTA de cotización.
- **Producto** → su categoría (miga de pan y etiqueta) y 8 similares por tipo, categoría y material. Ya no son «los 4 primeros del archivo».
- **Ciudad** → categorías relevantes, catálogo completo, CTA y pasos de cotización.
- **Blog** → 4 categorías relacionadas por artículo.
- Ningún enlace apunta a categorías vacías o retiradas; el crawl lo verifica con 0 enlaces rotos.
