# Decisiones de categorías y reclasificación (SEO-03, SEO-15)

**Script reproducible:** `node scripts/taxonomy-apply.mjs`. Es idempotente; con `--dry` muestra los cambios sin escribirlos.

**Registro completo de asignaciones:** [inventario/taxonomia-cambios.txt](inventario/taxonomia-cambios.txt).

## Criterios

- **Reglas por prefijo del slug** del producto, que es el tipo que el proveedor pone primero en el nombre (`botilito-…`, `reloj-…`, `paraguas-…`). No se usan coincidencias sueltas dentro de la descripción.
- **Categoría primaria** (`categoria_slug`, la que alimenta la miga de pan): solo cambia si el producto está en la categoría comodín *Variedades* o en una categoría claramente equivocada (botilitos en *Mugs*, portavasos en *Vasos*).
- **Pertenencia múltiple** (`categorias_secundarias`): el producto aparece también en otra categoría sin duplicar su URL.
- **URLs:** ninguna URL de producto cambia, así que no hace falta mapa de redirecciones de productos.
- **Sin umbrales automáticos:** ninguna categoría se marca noindex por tener pocos productos, poco texto o cero clics.

## Las 13 categorías vacías de la auditoría

Para cada una se aplicó la secuencia del plan: datos reales → pertenencia → oferta visible → señales en GSC → decisión.

| Categoría | Datos reales encontrados | Señal en GSC | Decisión | Efecto previsto |
|---|---|---|---|---|
| **paraguas** | 3 paraguas reales repartidos en golf, variedades y reflectivos | «sombrillas personalizadas» (28 impr.) y «paraguas personalizados» (9 impr.) | **Poblar.** Primaria para `paraguas-lancelot-27` y secundaria para los otros 2. Texto propio sin inventar especificaciones. | Conserva la URL con impresiones y deja de ser una página vacía. |
| **tomatodos-y-botilitos-personalizados** | 19 botilitos (6 en *Mugs*, 11 en *Variedades*, 2 en otras) | — | **Poblar.** 17 como primaria y 2 como secundaria. Se corrige la asignación errónea en Mugs. | Mugs queda solo con mugs; los botilitos tienen su propia página. |
| **tecnologia** | 48 cargadores, speakers, puertos USB, mouse, cables y audífonos en *Variedades* | — | **Poblar** (48 primaria + 6 secundaria). | Categoría comercial real; Variedades se reduce. |
| **memorias-usb** | 3 memorias USB en Variedades + 1 bolígrafo USB | — | **Poblar** (3 primaria + 1 secundaria). | — |
| **relojes** | 8 relojes (6 en Variedades, 2 en Ecología) | — | **Poblar.** Se excluye `reloj-de-arena-skai-eco`, que es un temporizador de arena y no un reloj. | — |
| **juegos** | 16 juegos de mesa, de habilidad, dominó y cartas en Variedades | — | **Poblar.** Las raquetas de playa se incluyen porque el proveedor las llama «juego de raquetas». | — |
| **gorras** | 2 gorras (en *Reflectivos*) | — | **Poblar como secundaria.** Las gorras conservan Reflectivos como primaria. | Página pequeña pero real. **No** se aplica noindex por tamaño. |
| **produccion-nacional** | 12 referencias marcadas «producción nacional» en el nombre | — | **Poblar como secundaria.** La nota interna del proveedor se reescribe como «la disponibilidad se confirma al cotizar». | Agrupa la oferta local sin prometer inventario. |
| **confeccion** | 0 prendas en los datos | — | **Retirar.** La ruta deja de generarse (404 real) y se quita del grid del inicio. | No había productos ni URL en el sitemap. Si el negocio vende confección, se reactiva con productos reales. |
| **deportes** | Solo 2 raquetas, ya ubicadas en Juegos | — | **Retirar** (404). Sin equivalente propio, así que no se redirige al inicio. | Evita una página casi vacía duplicada con Juegos. |
| **econature** | 1 producto con «eco nature» en el slug; la pertenencia a la línea no es verificable | — | **Retirar** (404). | Se reactiva si el proveedor confirma la línea. |
| **medicos** | 2 bolígrafos con clip temático y 1 pastillero | — | **Retirar** (404). Los productos siguen en Escritura y Variedades. | No hay oferta sectorial diferenciada. |
| **productos-2023** («Productos nuevos») | Los datos no tienen fecha de alta | — | **Retirar** (404). | No se puede afirmar qué producto es nuevo. |

Las 5 categorías retiradas se marcan con `publicada: false` en `data/categories.json`; sus datos no se borran. Ninguna figuraba en el sitemap ni tenía señales en GSC. Antes del cambio, `confeccion` y `deportes` sí estaban enlazadas desde el inicio, así que Google pudo haberlas rastreado: tras publicar, Search Console las mostrará como 404, lo que es correcto para páginas sin contenido.

## Otras correcciones de pertenencia

- **Vasos:** los 2 *sets de portavasos* pasan a *Hogar*, porque son posavasos y no vasos. El vaso de borosilicato (`taza-en-vidrio-cork-350ml`, descrito como «vaso» por el proveedor) pasa de Variedades a *Vasos*. Resultado: **2 vasos reales**. La oferta es corta; ver [datos-pendientes-negocio.md](datos-pendientes-negocio.md).
- **División de Variedades:** se crean dos categorías nuevas con intención de compra clara:
  - `/tienda/categoria/bolsas/`: 45 primarias + 9 secundarias.
  - `/tienda/categoria/libretas/`: 19.

  *Variedades* baja de 318 a 168 productos.
- **Artículos de escritura (291):** no se divide todavía. La división por material (metálicos, plásticos, ecológicos) requiere validar atributos fila por fila; queda como siguiente paso.

## Conteo por categoría

| Categoría | Antes (primaria) | Después (primaria) | Después (con secundarias) | Estado |
|---|---:|---:|---:|---|
| precio-bomba | 1 | 1 | 1 | publicada |
| antiestres | 26 | 26 | 26 | publicada |
| antimicrobianos | 7 | 7 | 7 | publicada |
| articulos-escritura | 291 | 291 | 291 | publicada |
| reflectivos | 12 | 12 | 12 | publicada |
| automovil | 1 | 1 | 1 | publicada |
| bar-y-vino | 27 | 27 | 27 | publicada |
| bicicleta | 9 | 9 | 9 | publicada |
| calculadoras | 1 | 1 | 1 | publicada |
| confeccion | 0 | 0 | 0 | retirada (404) |
| deportes | 0 | 0 | 0 | retirada (404) |
| econature | 0 | 0 | 0 | retirada (404) |
| ecologia | 9 | 9 | 9 | publicada |
| golf | 1 | 1 | 1 | publicada |
| gorras | 0 | 0 | 2 | publicada |
| herramientas | 54 | 54 | 54 | publicada |
| hogar | 4 | 6 | 6 | publicada |
| iluminacion | 2 | 2 | 2 | publicada |
| infantil | 1 | 1 | 1 | publicada |
| juegos | 0 | 16 | 16 | publicada |
| llaveros | 31 | 31 | 31 | publicada |
| maletines | 7 | 7 | 7 | publicada |
| master-line | 4 | 4 | 4 | publicada |
| medicos | 0 | 0 | 0 | retirada (404) |
| memorias-usb | 0 | 3 | 4 | publicada |
| mugs | 22 | 16 | 16 | publicada |
| productos-2023 | 0 | 0 | 0 | retirada (404) |
| oficina | 5 | 5 | 5 | publicada |
| paraguas | 0 | 1 | 3 | publicada |
| cuidado-personal | 3 | 3 | 3 | publicada |
| produccion-nacional | 0 | 0 | 12 | publicada |
| relojes | 0 | 6 | 8 | publicada |
| tecnologia | 0 | 48 | 54 | publicada |
| **bolsas** (nueva) | — | 45 | 54 | publicada |
| **libretas** (nueva) | — | 19 | 19 | publicada |
| variedades | 318 | 168 | 168 | publicada |
| vasos-personalizados | 3 | 2 | 2 | publicada |
| termos-personalizados | 1 | 1 | 1 | publicada |
| tomatodos-y-botilitos-personalizados | 0 | 17 | 19 | publicada |

**Total:** 158 productos cambian de categoría primaria y 35 tienen pertenencia secundaria. Se publican 34 categorías, todas con al menos un producto.

## Facetas

El sitio no tiene filtros ni parámetros, así que no existe riesgo de explosión de URLs. Si se añaden filtros:

- las combinaciones arbitrarias y la búsqueda interna deben quedar fuera del sitemap;
- solo deben indexarse colecciones con intención propia (por ejemplo, una futura «bolígrafos metálicos»).

## Reversión

`git checkout <commit-anterior> -- data/products.json data/categories.json` restaura la taxonomía anterior. El inventario previo de URLs se conserva en [inventario/antes.csv](inventario/antes.csv).
