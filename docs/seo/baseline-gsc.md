# Línea base de Google Search Console

**Fuente:** datos aportados por el usuario e incorporados en `Plan_SEO_Prompt_Claude_Code_PromocionalesJJ.md` (sección 2).

**Archivos no disponibles en el repositorio:** las exportaciones CSV originales (Filtros, Gráfico, Países, Consultas, Páginas, Dispositivos, Aparición en búsquedas) y la base unificada `base-de-trabajo-seo-unificada-promocionalesjj.md` no están en el repositorio ni en la carpeta de descargas. Las cifras se transcriben del plan; no se han podido recalcular desde los CSV.

**Estado:** línea base **anterior** a cualquier cambio de este trabajo. Ningún cambio de este repositorio está publicado todavía.

## 1. Rendimiento: búsqueda web, sin filtro de país

- **Periodo:** exportación titulada «últimos 3 meses»; las filas diarias abarcan del **13/07/2026 al 06/10/2026** (86 días).
- **Tipo de búsqueda:** Web.

| Métrica | Valor |
|---|---:|
| Clics totales | 2 |
| Impresiones totales | 349 |
| CTR calculado sobre totales | 0,57 % |
| Colombia: clics | 2 |
| Colombia: impresiones | 283 |
| Colombia: CTR | 0,71 % |
| Colombia: posición media | 35,16 |
| Impresiones ordenador / móvil / tablet | 254 / 93 / 2 |

**Evolución mensual de impresiones:**

| Mes | Impresiones |
|---|---:|
| Julio (parcial) | 24 |
| Agosto | 104 |
| Septiembre | 185 |
| Octubre (parcial) | 36 |

Los meses parciales no son comparables entre sí. El crecimiento de agosto y septiembre es anterior a este trabajo y no se atribuye a ningún cambio.

### Límites de interpretación

- **Consultas:** la tabla de consultas muestra 39 consultas visibles, 203 impresiones y 0 clics. Los 2 clics del gráfico no se atribuyen a ninguna consulta concreta, porque existen consultas anonimizadas.
- **Páginas:** la tabla de páginas suma 405 impresiones, no 349. No sirve como total del sitio, y no deben duplicarse clics al cruzar dimensiones.
- **«Aparición en búsquedas» vacía:** no demuestra por sí sola un error de schema ni la ausencia de indexación.
- **Mejores posiciones en móvil:** no prueban una mejor UX, porque pueden corresponder a otras consultas y otros países.

## 2. Consultas comerciales visibles (sin filtro de país)

| Consulta | Impresiones | Posición media | Destino en el sitio |
|---|---:|---:|---|
| promocionales bogota | 29 | 46,28 | `/productos-promocionales-colombia/bogota/` |
| sombrillas personalizadas | 28 | 77,00 | `/tienda/categoria/paraguas/` |
| productos publicitarios medellin | 11 | 31,18 | `/productos-promocionales-colombia/medellin/` |
| vasos personalizados | 10 | 47,10 | `/tienda/categoria/vasos-personalizados/` |
| productos publicitarios en medellin | 9 | 31,67 | `/productos-promocionales-colombia/medellin/` |
| paraguas personalizados | 9 | 35,22 | `/tienda/categoria/paraguas/` |
| vasos corporativos | 8 | 43,75 | `/tienda/categoria/vasos-personalizados/` |
| merchandising bogota | 7 | 28,43 | `/productos-promocionales-colombia/bogota/` |
| vasos corporativos personalizados | 3 | 9,67 | `/tienda/categoria/vasos-personalizados/` (señal débil) |

Son apariciones de J&J, no volúmenes de búsqueda.

## 3. Tabla adicional de Bogotá (segmentación probable, sin confirmar)

El usuario la envió después de recibir instrucciones para filtrar por Colombia y la URL de Bogotá. **No se adjuntaron sus filtros**, así que no se suma al total global.

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

Total visible: 47 impresiones y 0 clics. La conclusión aplicada es reforzar **una** landing de Bogotá, sin crear páginas por cada sinónimo.

## 4. Inspección de URL e indexación

- **Inicio `https://www.promocionalesjj.co/`:**
  - Estado: indexada; rastreo e indexación permitidos; obtención correcta con Googlebot smartphone.
  - Último rastreo: 16/09/2026 a las 16:20:08.
  - Canónica declarada **sin www**; canónica seleccionada por Google: la URL **con www**.
  - Campo Sitemaps: error temporal de procesamiento.
- **Redirecciones al 03/10/2026:** 8 URLs sin www figuran como «Página con redirección». Es lo esperado en una redirección intencional; no se persigue que ese informe llegue a cero.
- **Dato faltante:** el resumen general de indexación (cobertura de categorías y productos). Hay que exportarlo para la comparación del día 28.

## 5. Cómo comparar después de publicar

Ver [publicacion-y-seguimiento.md](publicacion-y-seguimiento.md). Las comparaciones deben hacerse sobre periodos iguales de 28 días, con tipo Web, país Colombia y los mismos filtros, y siempre en valores absolutos. Con 2 clics de base, los porcentajes de crecimiento no son significativos.
