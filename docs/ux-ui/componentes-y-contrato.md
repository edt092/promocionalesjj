# Componentes y contrato de datos del catálogo

## Contrato de datos (fuente: `data/products.json` → `lib/catalog.ts`)

| Campo derivado | Origen | Regla |
|---|---|---|
| `displayName` | `nombre` + tipo genérico tomado de la descripción si el nombre es solo un código | Tildes y siglas normalizadas. El SKU y el `slug` (URL) no cambian |
| `quantityRule` `{multiple, perColor}` | Texto «múltiplos de caja de N unidades [por color]» | Solo si la ficha lo publica (84 productos). **No existe un mínimo global** |
| `specs` | Medidas, capacidad, área y técnica de marcación, venta mínima y empaque, extraídos del texto | Se omite lo que no aparece |
| `tecnicas` | Técnicas mencionadas en «Marca:» | Filtro «Técnica indicada en la ficha» |
| `materiales` | Palabras clave de material en nombre y descripción | Filtro «Material (según la ficha)». Es una detección textual, no un atributo validado por el proveedor |
| `categorias` | Primaria + `categorias_secundarias` (solo publicadas) | Filtro de categoría y listados |
| `hasRealImage` | `imagen_url` no es el placeholder | Sin foto: aviso honesto, nunca una imagen genérica como si fuera el modelo |

Precio, stock, plazos, colores y marca **no existen** en los datos y no se muestran. Para añadirlos, crear campos tipados en `products.json` y exponerlos en `lib/catalog.ts`; los componentes ya tienen el bloque «Se confirma al cotizar» para retirarlos de ahí cuando existan.

Índice de búsqueda: `app/catalogo-busqueda.json/route.ts` (estático, `SearchDoc` en `lib/search-core.ts`).

## Lógica pura (con pruebas en `tests/`)

| Módulo | Funciones |
|---|---|
| `lib/quote-rules.ts` | `parseQuantityRule`, `checkQuantity` (valida y sugiere sin redondear), `quantityNote`, `buildQuoteMessage`, `quoteProblems`, `isQuoteReady` |
| `lib/search-core.ts` | `normalize`, `expandQuery` (sinónimos), `searchProducts` (Y entre términos, O entre sinónimos, filtros), `facetCounts` |

Ejecutar con `pnpm test` (`node --test`, sin dependencias).

## Componentes

| Componente | Uso | Estados |
|---|---|---|
| `Navbar` | Cabecera global | Transparente solo sobre el hero del inicio; sólida en el resto y al hacer scroll; activo (`aria-current`); menú móvil hasta 1023 px (Escape, cierre al navegar); contador «Mi cotización (n)» |
| `CatalogSearch` | `/tienda/` y sus páginas | Inactivo (muestra la paginación del servidor), cargando, error con reintento, resultados, sin resultados, «mostrar más» |
| `CategoryLinks` | Tienda (`compact`) y categorías | Actual (`aria-current`), lista compacta con «Ver todas» |
| `ProductCard` | Grillas y rails | Con foto o aviso sin foto; regla de cantidad opcional |
| `ProductActions` | Ficha | «Preparar cotización», «Consultar por WhatsApp», agregar a la lista / ver la lista, estado anunciado |
| `QuoteBuilder` | `/cotizacion/` | Lista vacía, editando, error de cantidad con sugerencias, resumen con errores enlazados, listo, WhatsApp abierto (sin confirmar envío), copiado o fallo al copiar, borrado con confirmación, sin almacenamiento |
| `WhatsAppFab` | Global | Oculto en la ficha y en la cotización |
| `ProductShowcase` (modal) | Inicio | Diálogo con foco gestionado; ejemplo ilustrativo |

## Tokens usados

- **CTA principal:** `bg-danger-600` (#E01414) y hover `danger-700` (#BD0F0F). Blanco sobre el CTA: 4,9:1.
- **Textos de error:** `text-danger-700`.
- **WhatsApp:** botones con texto #0F7A3E (5,4:1 con blanco). Contorno en ficha #1a8f47 con texto #0f6b33.
- **Texto secundario:** `slate-600`/`slate-700` sobre blanco. `slate-400` ya no se usa para texto.
- **Foco:** contorno de 3 px #1565FF con separación de 2 px.
- **Táctil:** acciones con `min-h-11` (44 px). Mínimo absoluto verificado: 24×24 px.
