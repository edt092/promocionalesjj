# Publicación, comprobaciones externas y reversión

**Estado:** los cambios están en el árbol de trabajo local, **sin commit ni despliegue**. Nada de lo descrito aquí se ha ejecutado en producción, Search Console ni DNS.

## 1. Activación

1. **Revisar los datos de negocio** de [datos-pendientes-negocio.md](datos-pendientes-negocio.md). No bloquean la publicación, pero conviene confirmar las afirmaciones existentes marcadas.
2. **Hacer commit en una rama** y abrir un PR. Comprobar antes:
   ```bash
   pnpm lint && pnpm exec tsc --noEmit && pnpm build && node scripts/seo-check.mjs out --strict
   ```
3. **Desplegar en Netlify** (el sitio ya despliega `out/`). Archivos nuevos que viajan en `out/`:
   - `_headers`: cabeceras de seguridad y caché. Netlify lo lee automáticamente desde la carpeta publicada.
   - `og-default.jpg`: imagen social de marca.
   - `llms.txt`.
   - páginas `/tienda/pagina/n/`, `/tienda/categoria/*/pagina/n/` y `/contacto/`.
4. **No cambiar el DNS ni la configuración de dominios.** El dominio sin www ya redirige con 301 a www, que es el host primario elegido.
5. **No se añadió `netlify.toml`.** La configuración de build vive en la interfaz de Netlify, y un `netlify.toml` podría sobrescribirla. Si se quiere versionar, copiar primero los valores actuales de la interfaz.

### Redirecciones

- No hay cambios de URL que requieran redirecciones. Las 5 categorías retiradas responden 404 a propósito: no tenían contenido ni equivalente, y el plan prohíbe redirigirlas al inicio.
- `/index.html`: el canonical ya resuelve el duplicado. **No se añadió** la regla `/index.html → /` porque, en Netlify, `/` se sirve internamente desde `index.html` y una regla forzada podría generar un bucle. Si se quiere probar, hacerlo en un *deploy preview* con `/index.html  /  301` en `public/_redirects` y verificar con curl que `/` sigue respondiendo 200 antes de publicar.

## 2. Comprobaciones del día 0 al 7 (producción)

```bash
# Host final y redirecciones (esperado: 301 directo a https://www. y 200 final, sin cadenas)
curl -sI http://promocionalesjj.co/ | head -3
curl -sI https://promocionalesjj.co/tienda/ | head -3
curl -sI https://www.promocionalesjj.co/tienda/ | head -3
# Canonical y JSON-LD con www
curl -s https://www.promocionalesjj.co/tienda/trevon/ | grep -o '<link rel="canonical"[^>]*>'
# Sitemap y robots
curl -s https://www.promocionalesjj.co/robots.txt
curl -s https://www.promocionalesjj.co/sitemap.xml | grep -c '<loc>https://www.promocionalesjj.co'   # esperado: 888
# Paginación y 404 reales
curl -s -o /dev/null -w "%{http_code}\n" https://www.promocionalesjj.co/tienda/pagina/35/   # 200
curl -s -o /dev/null -w "%{http_code}\n" https://www.promocionalesjj.co/tienda/pagina/36/   # 404
curl -s -o /dev/null -w "%{http_code}\n" https://www.promocionalesjj.co/tienda/categoria/confeccion/   # 404
# Cabeceras (_headers)
curl -sI https://www.promocionalesjj.co/ | grep -iE "x-content-type|referrer-policy|x-frame|permissions-policy"
curl -sI https://www.promocionalesjj.co/img/productos/trevon.jpg | grep -i cache-control      # max-age=86400
# Imágenes optimizadas
curl -sI -H "Accept: image/webp" "https://www.promocionalesjj.co/.netlify/images?url=%2Fimg%2Fproductos%2Ftrevon.jpg&w=640&q=75" | grep -i content-type
```

Además:

- **Crawl completo de producción:** descargar el sitio publicado y ejecutar `node scripts/seo-check.mjs <carpeta>`, o como mínimo repetir el crawl de enlaces sobre producción con una herramienta externa (Screaming Frog o similar).
- **Formulario de `/contacto/`:** comprobar que abre WhatsApp con el mensaje compuesto, en móvil y en escritorio.
- **Imagen social:** probar la vista previa con el depurador de Facebook o LinkedIn y un mensaje de WhatsApp.
- **Search Console:**
  - Enviar (o reenviar) `https://www.promocionalesjj.co/sitemap.xml` y anotar el resultado. Si persiste el «error temporal de procesamiento», revisar el informe de Sitemaps; no atribuir automáticamente a él la falta de tráfico.
  - Inspeccionar el inicio, Bogotá, Medellín, `/tienda/categoria/vasos-personalizados/`, `/tienda/categoria/paraguas/` y 5 productos de muestra. Solicitar indexación **una vez** en las páginas principales modificadas, sin repetir solicitudes masivas a diario.
  - Exportar y guardar el **resumen completo de indexación** (es el dato que falta en la línea base) y anotar las fechas de rastreo.
  - No perseguir que «Página con redirección» llegue a cero: son las URLs sin www, y es lo esperado.

## 3. Medición en los días 28, 56 y 90

Comparar periodos **iguales de 28 días** con tipo Web, país Colombia y los mismos filtros que la [línea base](baseline-gsc.md):

- Impresiones, clics y CTR en contexto de la posición, **en valores absolutos**. Con 2 clics de base, los porcentajes no son significativos.
- **Marca frente a no marca:** usar una clasificación revisada a mano. «jj» o «j&j» sueltos son ambiguos.
- **Consultas prioritarias:** Bogotá, vasos, Medellín y paraguas/sombrillas, cada una con su página (ver [mapa-intenciones.md](mapa-intenciones.md)).
- **Indexación:** número de productos y categorías indexados, canonical seleccionada por Google (debe ser la de www) y estado de las páginas paginadas.
- **Negocio:** clics en WhatsApp (`whatsapp_click`, una vez exista GA4), solicitudes válidas y leads cualificados conciliados con ventas.
- **Contexto:** registrar la fecha de publicación y la estacionalidad de fin de año.

| Meta operativa verificable | Objetivo |
|---|---|
| Coherencia técnica | 100 % de páginas publicadas sin contradicción de host (con `seo-check` sobre producción) |
| Descubrimiento | 100 % de productos activos alcanzables por enlaces HTML |
| Schema | Cero afirmaciones no respaldadas |
| Prioridades GSC | 4 destinos revisados con contenido y oferta factual |
| Indexación | Estado registrado de las páginas importantes tras el nuevo rastreo |
| Negocio | Seguimiento de contactos sin duplicados (un solo listener) |

Cómo leer los resultados:

- **Suben las impresiones pero las posiciones siguen bajas:** seguir mejorando el contenido útil y los enlaces.
- **Mejoran las posiciones pero el CTR sigue bajo:** revisar el snippet y la intención de la página.
- **Hay clics pero no leads:** revisar la oferta y el flujo de cotización.

No se fijan promesas de top 3, fechas de indexación ni cifras de tráfico.

## 4. Reversión

| Qué revertir | Cómo |
|---|---|
| Todo el trabajo | Revertir el commit o el PR en git y redesplegar. Netlify permite además «Publish deploy» de un despliegue anterior desde la interfaz, sin recompilar |
| Solo la taxonomía | `git checkout <commit-anterior> -- data/products.json data/categories.json`, y después build |
| Solo las cabeceras | Borrar `public/_headers` y redesplegar |
| Una categoría retirada | Poner `"publicada": true` en `data/categories.json` (solo se genera si tiene productos) |
| Referencia del estado anterior | [inventario/antes.csv](inventario/antes.csv) (URL, title, H1, canonical y schema de las 892 páginas previas) |
