# Datos pendientes del negocio

Todo lo siguiente bloquea tareas concretas, no la entrega completa. En cada caso se implementó la estructura y se omitió el dato en lugar de inventarlo. Las rutas indican dónde añadir cada dato.

## Identidad y confianza (SEO-08, SEO-09)

| Dato exacto | Página o elemento afectado | Por qué hace falta | Qué hay implementado mientras tanto |
|---|---|---|---|
| Razón social y NIT | `/contacto/`, footer, `Organization` (`legalName`, `taxID`) en `lib/seo.ts` | Confianza B2B y requisito de compras corporativas (facturación) | `Organization` solo con nombre comercial, logo, descripción y teléfono |
| Dirección física, si existe (oficina o bodega) | `/contacto/`, footer, `Organization.address`, Google Business Profile | Entidad verificable; requisito para GBP | Sin dirección. Las páginas de ciudad usan `Service` + `areaServed`, sin sedes |
| Correo de ventas que alguien atienda | `/contacto/`, `Organization.email` | Canal alternativo a WhatsApp para compras | Solo WhatsApp. No se añadió formulario por correo porque no hay un canal confirmado |
| Perfiles sociales oficiales (Instagram, LinkedIn, Facebook, YouTube) | `Organization.sameAs`, footer | Conecta la entidad con sus perfiles | `sameAs` omitido: `instagram.com/promocionalesjj/` responde 200 para cualquier ruta, así que no prueba que el perfil exista |
| Historia, equipo, años de operación, proceso de producción y fotos de trabajos reales | Futura `/nosotros/` | E-E-A-T; responde «¿quién es J&J?» | **No se creó `/nosotros/`**, porque con los datos actuales sería una página vacía. Abajo hay una plantilla |
| Clientes, logos, casos y reseñas **con permiso de uso** | Inicio, ciudades, `/nosotros/` | Prueba social. No se pueden inventar | Bloques omitidos; no hay placeholders visibles |
| Políticas: privacidad / tratamiento de datos (Ley 1581 de 2012), términos, cambios y garantías | Footer | Requisito legal y de confianza | **No se publicaron borradores legales**; debe redactarlos o revisarlos el negocio |

## Oferta comercial (SEO-14, SEO-19)

| Dato exacto | Afecta a | Qué hay implementado mientras tanto |
|---|---|---|
| Precio o rango «desde» por producto (con o sin IVA) | Ficha de producto, `Product.offers` | `Product` sin `offers`. No es elegible para fragmentos con precio, y se registra así (no como fallo corregido con datos falsos) |
| MOQ propio de J&J (si difiere del proveedor) y plazos de producción y entrega por técnica | Ficha, categoría, ciudades, preguntas frecuentes | Se muestra la «venta mínima» del proveedor solo cuando la ficha la trae (84 productos). No se publican plazos |
| Stock o disponibilidad fiable | `Product`, fichas | Se retiró `InStock`. Las referencias de producción nacional dicen «disponibilidad se confirma al cotizar» |
| Marca real de cada producto (fabricante) | `Product.brand` | `brand` omitido. J&J es distribuidor, no fabricante |
| Fotos de los 104 productos con placeholder | Fichas, tarjetas, `og:image`, `Product.image` | Aviso honesto («Fotografía no disponible / te enviamos imágenes al cotizar»); sin imagen en el schema; OG de marca |
| Descripciones ampliadas de los 50–100 productos prioritarios (material, área de marca, técnica, empaque, muestra) | Fichas | Se extraen y muestran en tabla los atributos que ya existen en el texto del proveedor (medidas, marcación, venta mínima, empaque, capacidad). Faltan los demás |
| Margen, ventas o stock por SKU | Selección de los 50–100 productos prioritarios | Sin estos datos se priorizará por completitud de atributos y categorías GSC; ver plan de ejecución SEO-14 |
| Más vasos en el catálogo | `/tienda/categoria/vasos-personalizados/` (prioridad 2 en GSC) | Solo existen **2 vasos reales**. La página explica su oferta y remite a mugs, botilitos y termos. Si el negocio vende más vasos (plásticos, metálicos, de vidrio), hay que cargarlos en `data/products.json` |
| Sombrillas de exterior (playa o terraza), si se venden | `/tienda/categoria/paraguas/` | La página aclara que hoy solo hay paraguas de mano |
| Ofertas vigentes y su vigencia | `/promociones/` | Solo se muestra la referencia que el proveedor marca como «precio bomba», con aviso de confirmar condiciones |

## Ciudades (Fase 3)

| Dato exacto | Página | Qué hay implementado mientras tanto |
|---|---|---|
| Cobertura y entregas verificadas en Bogotá (zonas, transportadora, recogida) | `/productos-promocionales-colombia/bogota/` | Contenido propio sin plazos ni sedes. Se conservan las 4 características que ya existían; **confirmar** «Producción para ferias en Corferias» y «Entrega en toda Bogotá y municipios de la sabana» |
| Lo mismo para Medellín | `/productos-promocionales-colombia/medellin/` | Contenido propio. **Confirmar** «Stock disponible para entregas rápidas» (afirmación de inventario) |
| Diferenciadores reales de Cali, Barranquilla y Bucaramanga | Esas 3 páginas | Siguen indexables con categorías enlazadas y pasos de cotización. Sin datos propios siguen siendo parecidas entre sí: decidir caso por caso, no desindexar en masa |

## Afirmaciones existentes por confirmar

Estas afirmaciones ya estaban en el sitio y no se crearon en este trabajo. Si no se pueden sostener, hay que retirarlas:

- «Precio mayorista» y «descuentos por volumen» (hero, `TrustSection`, `ProductRail`, preguntas frecuentes).
- «Bordado» como técnica general: solo 1 ficha la menciona («Bordado o screen»).
- «Entregamos … mediante transportadora» (preguntas frecuentes).
- Descripción de la categoría *Precio Bomba*: «con los mejores precios del mercado».

## Analítica

| Dato exacto | Afecta a | Qué hay implementado mientras tanto |
|---|---|---|
| ID de GA4 o contenedor de Google Tag Manager | `lib/analytics.ts` | El módulo envía `whatsapp_click` y `quote_start` solo si existen `gtag` o `dataLayer`. No se insertó ningún ID |
| CRM o registro de leads cualificados y ventas | Seguimiento de negocio | Los clics en WhatsApp son intención, no leads; hay que conciliarlos con ventas |

## Plantilla para `/nosotros/` (no publicada)

```
H1: Sobre Promocionales J&J
- Quiénes somos: razón social, NIT, ciudad base, año de inicio.
- Qué hacemos: proveedor de productos promocionales; si hay producción propia, decirlo; si es distribución, decirlo.
- Cómo trabajamos: técnicas que hacemos internamente y las que se tercerizan; control de calidad; muestras físicas o virtuales.
- Equipo de atención (nombres solo con consentimiento).
- Clientes y trabajos reales (con permiso), con fotos propias.
- Datos de contacto verificados.
```
