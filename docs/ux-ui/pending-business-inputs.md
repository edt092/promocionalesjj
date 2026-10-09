# Datos de negocio pendientes (UX/UI)

Complementa [docs/seo/datos-pendientes-negocio.md](../seo/datos-pendientes-negocio.md), que cubre NIT, dirección, correo, redes, políticas, precios y fotos. Aquí se listan solo los datos que afectan a la experiencia de cotización.

| Dato necesario | Responsable sugerido | Efecto de su ausencia hoy |
|---|---|---|
| Confirmación de que el **flujo real** es: elegir → cantidad y ciudad → propuesta → aprobación de diseño → producción y entrega | Comercial | No se publicó el bloque de proceso de 5 pasos de la auditoría. Solo se muestran los 4 pasos de cotización que el sitio ya hace |
| Reglas de cantidad **propias de J&J**, si difieren del proveedor (mínimos, múltiplos, combinación de colores) | Comercial y catálogo | Se valida solo con la regla del proveedor en 84 productos. En el resto, «te la confirmamos al cotizar» |
| Colores disponibles por producto | Catálogo | La cantidad «por color» se indica como texto libre («Colores o distribución»). No hay un selector por color |
| Tiempos de respuesta y de producción por técnica | Comercial y producción | No se promete ningún tiempo. La fecha requerida se marca como «a confirmar» |
| Valor orientativo o precio «desde», con IVA o sin él | Comercial | Sin precio. El bloque «Se confirma al cotizar» lo explica |
| Si existen **descuentos por volumen** y sus condiciones | Comercial | Se retiró «precio mayorista» y «descuentos por volumen» (H06). Se pueden restaurar con condiciones verificables |
| Vigencia y condiciones de las referencias «precio bomba» | Comercial | `/promociones/` dice que las condiciones se confirman al cotizar |
| Técnicas que J&J realmente ofrece | Producción | El selector de técnica muestra Tampografía, Láser, Serigrafía, Screen, Bordado y Sublimación, términos que aparecen en las fichas o en el copy existente. **Confirmar o ajustar la lista** en `components/QuoteBuilder.tsx` |
| Requisitos para recibir logos (formatos, tamaño, almacenamiento, privacidad) | Producción y legal | No hay carga de archivos; el logo se envía por WhatsApp |
| Canal alternativo real (correo atendido o formulario con backend) | Comercial | Solo WhatsApp, más «copiar mensaje» y el número visible. Si se habilita un backend, añadir `lead_received` con confirmación del servidor |
| Razón social, NIT, dirección y políticas (H09) | Gerencia y legal | Footer sin datos empresariales ni políticas. No se publicaron borradores |
| Definición de **solicitud calificada** y conciliación con ventas o CRM | Comercial y analítica | Los eventos miden intención (`whatsapp_open_clicked`), no leads ni ventas |
| ID de GA4 o GTM y base de consentimiento | Marketing y legal | Los eventos solo se envían si existe `gtag` o `dataLayer`. No se insertó ningún ID |
| Compradores para 5–8 pruebas de tareas (sección 20 de la auditoría) | UX y comercial | No hay validación con usuarios. Las decisiones de hero, taxonomía y comparación siguen siendo hipótesis |
| Validación de la taxonomía (card sorting): «Variedades», «Master Line», «Producción nacional» | Catálogo y UX | Los nombres se mantienen tal como están |
