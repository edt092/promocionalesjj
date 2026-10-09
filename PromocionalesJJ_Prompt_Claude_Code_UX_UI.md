# PROMPT PARA CLAUDE CODE: mejora UX/UI de promocionalesjj.co

## Instrucción principal

Actúa como ingeniero frontend senior y especialista UX/UI. Trabaja en el repositorio existente de Promocionales J&J e implementa el plan que se incluye a continuación. Lee este archivo completo antes de editar. El objetivo es facilitar que compradores B2B en Colombia encuentren productos, comprendan las restricciones y preparen una cotización con contexto.

Este archivo conserva el contenido de la auditoría de 23 páginas y añade instrucciones operativas para ejecutarla en Claude Code. Los hallazgos corresponden a una muestra pública observada el 8 de octubre de 2026; vuelve a comprobar cada uno en el código y en la versión local. No asumas que siguen presentes ni que la muestra cubre todo el sitio.

## 1. Inspección inicial del repositorio

1. Lee `AGENTS.md`, `CLAUDE.md` y la documentación pertinente, si existen.
2. Revisa el estado de Git. Conserva cambios previos del usuario y evita operaciones destructivas.
3. Identifica el stack real, scripts, router, componentes globales, estilos, fuentes del catálogo, pruebas e integración de analítica. No migres de framework ni añadas dependencias grandes sin una necesidad concreta.
4. Localiza cabecera, inicio, catálogo, categorías, ficha, promociones, modal de personalización, footer y enlaces de WhatsApp.
5. Ejecuta los controles existentes apropiados y registra problemas previos. Obtén una línea base visual local de las plantillas que vas a modificar.
6. Contrasta el backlog H01-H11 con la implementación actual. Marca cada punto como presente, ya resuelto o no verificable. Evita rehacer soluciones correctas.
7. Crea un plan de tareas y avanza por las prioridades indicadas. Completa el trabajo técnicamente posible; pregunta únicamente por información comercial indispensable que no pueda resolverse con el repositorio.

## 2. Restricciones de implementación

- Conserva la identidad visual de J&J y el contacto directo por WhatsApp. El formulario guiado será opcional.
- Mantén las URLs públicas, SKU, canonicals, metadatos, datos estructurados, sitemap y enlaces internos. Si una URL debe cambiar por una razón demostrada, documenta e implementa la redirección correspondiente con las capacidades del stack.
- Si existe un plan SEO en el repositorio, comprueba su compatibilidad con estos cambios. No supongas que este archivo incorpora una auditoría SEO ni datos de Search Console.
- No inventes stock, precios, descuentos, certificaciones, clientes, testimonios, razón social, NIT, tiempos de respuesta, entrega ni políticas. Usa datos existentes y aprobados. Registra los pendientes comerciales.
- El mínimo de 50 unidades por color observado pertenece a Ballpop. No lo conviertas en regla global. Modela mínimos y múltiplos por producto o variante cuando existan fuentes fiables.
- No muestres filtros sin atributos reales; no presentes disponibilidad como confirmada si depende de ventas.
- Un clic en WhatsApp significa apertura intentada. Nunca muestres “Solicitud recibida” ni registres una venta sin confirmación del canal o servidor.
- No envíes mensajes, no cargues archivos a terceros ni realices pedidos como parte de las pruebas. Usa mocks o entorno de prueba.
- No implementes un checkout, una cuenta obligatoria, CRM ni almacenamiento de logos sin necesidad validada. El objetivo inmediato es preparar una cotización.
- No publiques textos legales inventados. Si falta contenido aprobado, prepara integración y documenta el bloqueo sin presentar placeholders como políticas definitivas.
- No implementes urgencia artificial ni selección automática de opciones de pago.
- Implementa búsqueda, resumen, persistencia y errores según las capacidades reales del stack. Si se usa almacenamiento local, guarda solo los datos mínimos necesarios y permite borrarlos.
- Publicación o despliegue queda fuera de esta instrucción. Entrega cambios locales revisables y el procedimiento para desplegarlos.

## 3. Secuencia obligatoria de trabajo

### Entrega A: correcciones inmediatas

- H01: cabecera legible en fondos claros y oscuros, incluyendo estados sticky y responsive. Revisa logo, enlaces, estado activo, hover y foco.
- H05: recuperación contextual de la categoría Gorras; corregir el título y conservar la opción de volver al catálogo.
- H06-H09: corregir copy ambiguo y promociones no demostrables, normalizar nombres e integrar información de confianza disponible.
- H03: estructurar la ficha de muestra y crear un patrón reutilizable para atributos y restricciones.

### Entrega B: descubrimiento y elección

- H02: buscador por nombre y SKU; sinónimos relevantes; filtros basados en datos reales; estado sin resultados y limpieza de filtros.
- Reducir la carga visual de las categorías sin eliminar el acceso a ninguna.
- Mantener filtros y posición al volver desde una ficha.
- Verificar carga incremental, mensajes de estado y reintento. No confundir catálogo completo con el subconjunto cargado en pantalla.
- H07: normalizar nombres visibles sin romper identificadores ni rutas.

### Entrega C: preparación de cotización

- H04: flujo breve opcional de producto, cantidad, ciudad y fecha requerida; técnica opcional y opción de asesoría.
- Validar cantidades con reglas del producto; no redondear automáticamente.
- Resumen editable y mensaje precompletado de WhatsApp; alternativa para copiarlo si el canal no abre.
- Conservar el borrador al regresar. Añadir lista multiproducto si los datos y la arquitectura permiten implementarla de forma estable.
- No añadir carga real de logo hasta contar con requisitos de formatos, almacenamiento y manejo seguro. Aclarar el carácter ilustrativo del preview existente.

### Entrega D: refinamiento y verificación

- H08-H10-H11: claridad del preview, jerarquía del hero y lista/comparación cuando esté justificada. No añadas funciones complejas solo por ser una oportunidad del informe.
- Componentes y estados coherentes, accesibilidad, responsive y analítica sin datos sensibles.
- Resolver los errores introducidos por los cambios y documentar lo que requiere investigación humana o datos comerciales.

## 4. Verificación técnica requerida

Ejecuta los comandos adecuados del repositorio: build, lint, tipos y pruebas pertinentes. No declares que un control pasó si no se ejecutó. Diseña pruebas relevantes para reglas de cantidad, búsqueda, conservación de selección y construcción del mensaje. Evita pruebas triviales que solo repitan el código.

Verifica visualmente las páginas afectadas a 320, 375, 440, 768, 834, 1194, 1280, 1440 y 1920 px cuando el entorno lo permita. Si no puedes probar una resolución o interacción, indícalo. Revisa teclado, foco, modal, textos largos, ausencia de resultados, fallo de carga y regreso desde ficha. Mide contraste de los componentes modificados; no atribuyas conformidad WCAG completa a una comprobación automática.

Prueba los dos happy paths y las rutas de error del informe usando datos de prueba. No abras una conversación real para verificar envío. Para analítica, comprueba disparadores y parámetros sin transmitir datos personales en la prueba.

## 5. Entregables en el repositorio

1. Cambios de código y contenido revisables, acordes con el stack.
2. `docs/ux-ui/implementation-summary.md`: hallazgo, solución, archivos modificados, evidencia y estado.
3. `docs/ux-ui/qa-results.md`: comandos y resultado real; revisión visual; casos probados; limitaciones.
4. `docs/ux-ui/pending-business-inputs.md`: datos necesarios, responsable sugerido y efecto de su ausencia. No inventes la información para cerrar tareas.
5. Actualización de documentación de componentes o contrato del catálogo cuando corresponda.

Al finalizar, informa qué implementaste, qué verificaste y qué quedó pendiente con motivo concreto. Distingue “implementado”, “verificado” y “pendiente de validación con usuarios”. No declares que entrevistaste usuarios, que mejoró la conversión o que el sitio cumple todo el roadmap sin evidencia.

---

# Auditoría y especificación de referencia completa

La numeración siguiente corresponde a las secciones del informe; la página PDF se obtiene sumando uno al número de sección.


## 00 — Promocionales J&J

Auditoría UX/UI y plan de acción

promocionalesjj.co · Mercado B2B · Colombia

Basado en el ROADMAP UX UI proporcionado. Evaluación experta del recorrido público de descubrimiento, selección y cotización, con propuestas listas para convertir en tareas de diseño y desarrollo.

### Decisión principal

Priorizar la navegación visible, la búsqueda del catálogo y la preparación de la cotización. El sitio comunica qué vende, pero deja decisiones importantes para la conversación comercial y presenta un defecto visual del menú en páginas internas.

| Lo observado | Lo propuesto |
| --- | --- |
| 840 productos y 37 categorías anunciados en la tienda | Facilitar encontrar, comparar y cotizar con contexto |
| Catálogo, ficha y salida a WhatsApp | Mantener contacto directo y añadir una ruta guiada opcional |
| Menú blanco sobre páginas blancas | Corregir primero la navegación global |

Fecha de revisión: 8 de octubre de 2026 (UTC-5). Versión 1.0. Auditoría de muestra, sin envío de formularios ni mensajes, sin compras ni cambios en el sitio.

Este documento distingue evidencia observada, interpretación experta y verificaciones pendientes. No certifica cumplimiento integral ni atribuye tasas de conversión al sitio.


## 01 — Resumen ejecutivo y orden de intervención

### Qué conviene conservar

Propuesta de valor visible, cobertura nacional explícita, fotografías de productos, categorías enlazadas, migas de pan en páginas internas y CTA de WhatsApp específico en la ficha. La vitrina ofrece una demostración visual y el sitio ya contiene preguntas frecuentes.

### Qué bloquea o dificulta la decisión

| Prioridad | Hallazgo observado | Decisión |
| --- | --- | --- |
| P0 | Menú en blanco sobre fondo blanco en tienda y ficha; estilos blancos confirmados también en promociones. | Corregir variantes de cabecera y medir contraste. |
| P1 | Tienda con 840 productos, 37 categorías y sin búsqueda/filtros visibles. | Buscador, filtros útiles y recuperación de resultados. |
| P1 | Ficha Ballpop concentra especificaciones y mínimo en un párrafo; el enlace no recoge cantidad, ciudad ni fecha. | Ficha estructurada y cotización guiada opcional. |
| P1 | Categoría Gorras sin productos ni CTA contextual en el cuerpo. | Estado vacío con alternativa explícita. |
| P1 | Promociones anuncia mejores precios sin condiciones de oferta visibles. | Mostrar beneficio verificable o cambiar la promesa. |
| P2 | Vista previa usa un logo de ejemplo sin carga de archivo visible. | Aclarar demostración; evaluar simulador después. |

P0: resolver antes de una campaña. P1: siguiente entrega del recorrido comercial. P2: refinamiento posterior. Las prioridades representan riesgo y oportunidad estimados; no demuestran pérdidas económicas.

### Resultado esperado

Un comprador debería reconocer qué ofrece J&J, encontrar una opción adecuada, entender sus restricciones y contactar con un resumen completo. La venta, la disponibilidad y la fecha final siguen sujetas a confirmación comercial.


## 02 — Alcance, evidencia y límites

| ID | Superficie revisada | Método / evidencia |
| --- | --- | --- |
| E01 | Inicio / | DOM y captura visual de escritorio; hero, categorías, destacados, FAQ y footer. |
| E02 | /tienda/ | DOM y captura; 840 productos, 37 categorías, 24 tarjetas iniciales y botón con 816 restantes. |
| E03 | /tienda/boligrafo-ballpop/ | DOM y captura; mínimo de 50 unidades por color, medidas, marcación y CTA. |
| E04 | /promociones/ | DOM; una tarjeta, promesa de mejores precios y estilos computados de enlaces blancos. |
| E05 | /tienda/categoria/gorras/ | DOM; título “Gorras Personalizados” y texto de ampliación del catálogo. |
| E06 | Modal de personalización en inicio | Apertura comprobada; diálogo, imagen de ejemplo, dos controles “Cerrar” y CTA a WhatsApp. |

Se navegó por enlaces visibles del sitio. Las capturas revisadas corresponden a escritorio, aproximadamente 1348 × 926 px. Se inspeccionó el contenido renderizado y el estilo computado del menú. No se recopilaron métricas de rendimiento.

### No comprobado en esta revisión

Mobile y tablet, funcionamiento completo con teclado y lector de pantalla, contraste de todos los componentes, carga incremental del catálogo, todas las fichas, blog, páginas por ciudad, errores 404, operación real de WhatsApp, respuesta comercial, CRM, consentimiento analítico e infraestructura.

### Regla de interpretación

**O = observado** en la muestra. **I = inferencia** sobre su efecto probable. **V = verificación pendiente**. Una ausencia observada se limita a las páginas revisadas. Los requisitos propuestos no prueban que la función falle actualmente.

No se emite una nota global, SUS, NPS, CSAT ni un porcentaje de cumplimiento: requieren otras evidencias. Un clic en WhatsApp tampoco prueba un mensaje enviado o una venta.


## 03 — Cómo se aplica tu roadmap

| Etapa del roadmap | Aplicación y entregable | Condición para cerrar |
| --- | --- | --- |
| 1. Investigación / heurística | Hipótesis B2B, Nielsen, ruta del héroe y voces negocio/usuario/mercado. | Entrevistas y objetivos comerciales acordados. |
| 2. Centrado en usuario | Protopersonas, mapas de empatía y journey de cotización. | Validar con compradores reales. |
| 3. Usabilidad técnica | WCAG 2.2, ergonomía, patrones y recorridos de error. | QA automática y manual en procesos completos. |
| 4. Gráfica y psicológica | Peso visual, jerarquía y recorrido cognitivo; GOMS/KLM posterior. | Pruebas de tareas y revisión de diseño. |
| 5. Fundamental / teórica | Garrett, grafo de rutas, microcopy y estados. | Flujos sin callejones sin salida. |
| 6. Gaps y nudges | Reducir ambigüedad y sobrecarga; persuasión ética. | Usuarios comprenden condiciones y conservan control. |
| 7 y 7.1. Conducta / actualidad | Fogg, recompra útil y revisión temporal de categorías. | Valor real sin urgencia artificial. |
| 8. Evaluación humana | Pruebas formativas y sumativas; SUS/CSAT contextual. | Medición y corrección de problemas críticos. |
| 9. Diseño consciente | Accesibilidad, privacidad y decisiones reversibles. | Revisión ética y mantenimiento. |

El roadmap también pide foundations, átomos, moléculas, plantillas, dos happy paths, al menos un unhappy path y trazas de errores. Se concretan en las páginas 12 a 16 de este informe.

Se resuelve la superposición del límite del roadmap: móvil 320-767, tablet 768-1279 y escritorio desde 1280 px. Son rangos de trabajo para QA; la maquetación debe adaptarse al contenido.


## 04 — Usuarios, negocio y experiencia objetivo

Las siguientes son **protopersonas**, no segmentos demostrados. El sitio orienta su mensaje a empresas y compras al por mayor; el equipo debe comprobar quién decide, quién cotiza y quién aprueba.

| Perfil hipotético | Necesidad / miedo | Respuesta de diseño |
| --- | --- | --- |
| Responsable de marketing | Encontrar regalos para campaña; teme baja calidad o entrega tardía. | Fotos reales, técnica de marcación, muestra y fecha a confirmar. |
| Compras / administración | Comparar proveedores; necesita factura, condiciones y cotización interna. | Resumen descargable, datos empresariales y total desglosado cuando exista. |
| Dueño de pyme | Necesita guía, presupuesto acotado y contacto rápido. | Selección por uso y cantidad; asesoría sin obligación. |

### Trabajo que el usuario quiere completar

“Necesito elegir artículos que representen mi marca, confirmar que puedo pedir la cantidad necesaria y recibir una cotización que pueda aprobar antes del evento”.

### Voz del negocio

Hipótesis: aumentar solicitudes con producto, cantidad, destino y fecha; reducir preguntas repetidas; proteger márgenes y cumplir lo prometido. Confirmar capacidad comercial antes de publicar tiempos de respuesta o producción.

### Voz del usuario y mercado

Entrevistar a 6-8 compradores de distintos roles y revisar conversaciones anonimizadas autorizadas. Preguntar por la última compra real, restricciones, criterios y motivos de descarte. Comparar después 3-5 proveedores colombianos por las mismas tareas; no se realizó benchmark competitivo en esta muestra.

### Mapa de empatía provisional

Piensa: “¿Llegará a tiempo?”. Busca: fotos, cantidades y condiciones. Hace: compara opciones y comparte con otro aprobador. Necesita: certeza suficiente para avanzar, sin interpretar especificaciones dispersas. Validar estas hipótesis antes de diseñar automatizaciones.


## 05 — Nielsen: evaluación 1 a 5

Las heurísticas orientan una evaluación experta, no una certificación. Se valora cada principio sobre la muestra observada; los estados no probados quedan abiertos. Fuente conceptual: NN/g [R2].

| Heurística / estado | Evidencia y efecto probable | Cambio y verificación |
| --- | --- | --- |
| 1. Visibilidad del estado · Parcial | E02 informa restantes; E06 identifica producto. No se comprobó feedback al cargar más. | Anunciar cantidad cargada y estados de cotización. Probar carga, error y reintento. |
| 2. Mundo real · Parcial | E03 combina medidas, técnica y mínimo en un párrafo. E02 contiene Master Line y EcoNature. | Explicar términos y separar atributos; probar comprensión con compradores. |
| 3. Control y libertad · Parcial | Hay migas de pan y cierre de modal. No se probó retorno con posición preservada. | Conservar filtros, scroll y borrador; cerrar con Escape y devolver foco. |
| 4. Consistencia · Defecto observado | E02/E03 muestran menú blanco sobre blanco. E05 dice “Gorras Personalizados”. | Variantes clara/oscura coherentes y nombres corregidos; revisar todas las plantillas. |
| 5. Prevención de errores · Parcial | E03 informa múltiplos de 50 por color, pero no ayuda a construir cantidad válida. | Validar por variante con explicación; no redondear sin autorización. |

### Severidad y facilidad de arreglo

Para el backlog se usa severidad 0-5 inspirada en la escala pedida por tu roadmap: 0 sin problema, 1 cosmético, 2 fricción menor, 3 dificultad relevante, 4 obstáculo grave y 5 bloqueo total demostrado. No es la escala original de Nielsen (0-4).

Arreglabilidad 1-5: 1 requiere rediseño/operación extensa; 5 ajuste simple. Las estimaciones dependen del código y CMS, no inspeccionados. No se asigna severidad 5 porque el recorrido no quedó totalmente bloqueado.


## 06 — Nielsen: evaluación 6 a 10

| Heurística / estado | Evidencia y efecto probable | Cambio y verificación |
| --- | --- | --- |
| 6. Reconocer antes que recordar · Parcial | E02 muestra categorías y SKU; no hay buscador ni comparación visible. | Buscar por nombre, uso y referencia; guardar lista y contexto entre fichas. |
| 7. Flexibilidad y eficiencia · Defecto observado | E02 exige explorar 37 categorías o cargar productos; sin filtros/orden visible. | Búsqueda y filtros con datos reales; ruta rápida para referencia conocida. |
| 8. Estética y minimalismo · Parcial | E01 hero de gran altura y tipografía dominante; E02 muestra 37 chips antes de tarjetas. | Reducir protagonismo decorativo y organizar categorías; validar el primer pantallazo. |
| 9. Recuperación de errores · No verificable en conjunto | E05 ofrece un texto de categoría vacía, sin acción contextual en el cuerpo. | CTA de asesoría de gorras, alternativas y recuperación de búsqueda; probar errores técnicos. |
| 10. Ayuda y documentación · Parcial | E01 tiene FAQ; E03 no desarrolla entrega, aprobación de arte ni condiciones comerciales. | Ayuda contextual, proceso del pedido y condiciones validadas por ventas. |

### Veredicto sobre Nielsen

La muestra incorpora buenas prácticas, pero presenta brechas observadas de consistencia, eficiencia y orientación. No es defendible afirmar cumplimiento pleno. Los estados técnicos, el teclado y los recorridos externos requieren evaluación adicional.

### Guion breve de revisión manual

Entrar desde Google directamente a una ficha; reconocer dónde está; localizar cantidad mínima; volver al catálogo; buscar una alternativa; añadirla al resumen; corregir cantidad; continuar a WhatsApp; regresar sin perder selección. Registrar errores, dudas y ayudas requeridas.


## 07 — Los cinco planos de Jesse James Garrett

El modelo conecta objetivos y necesidades con funciones, rutas y presentación [R3]. Las siguientes decisiones son aplicación específica a J&J; no una puntuación oficial del modelo.

| Plano | Diagnóstico de la muestra | Decisión / entregable |
| --- | --- | --- |
| Estrategia | Mensaje B2B claro; no conocemos objetivos ni necesidades validadas. | Brief de negocio y usuarios. Definir solicitud calificada y condiciones de servicio. |
| Alcance | Catálogo y WhatsApp visibles; faltan herramientas de selección en E02. | MVP: búsqueda, atributos, cotización guiada, ayuda y alternativa de contacto. |
| Estructura | 37 categorías; Gorras conduce a estado vacío. No hay lista multiproducto visible. | Taxonomía validada y rutas de recuperación; añadir flujo de selección sin romper URLs actuales. |
| Esqueleto | Migas útiles; menú invisible en páginas claras; atributos poco escaneables. | Wireframes con navegación visible, ficha estructurada y resumen editable. |
| Superficie | Fotografía y CTA consistentes, pero contraste del menú defectuoso y naming irregular. | Tokens, componentes y revisión de contraste y estados en todas las plantillas. |

### Orden de trabajo

Resolver primero qué solicitud puede atender ventas y qué información necesita el comprador. Después definir contenido y flujo; finalmente refinamiento visual. Corregir ya el defecto del menú, aunque la investigación continúe.

### Criterio de aceptación transversal

Cada campo, filtro y promesa debe tener una fuente de datos y un responsable. Si stock, precio o plazo no son fiables, usar “por confirmar” con explicación. Evitar datos inventados para completar una interfaz.


## 08 — La ruta del héroe aplicada al comprador B2B

Se usa como herramienta narrativa de journey, no como norma de usabilidad. El héroe es quien debe resolver su compra; J&J actúa como guía. No hace falta convertir el sitio en una historia extensa.

| Etapa narrativa | Situación del comprador | Diseño y contenido |
| --- | --- | --- |
| Llamado | Tiene una campaña, evento o necesidad de dotación. | Hero que diga qué resuelve: artículos personalizados para empresas. |
| Duda / rechazo | Desconoce costo, mínimos y tiempos. | Mostrar condiciones del producto y explicar cómo se cotiza. |
| Encuentro con la guía | Busca asesoría y confianza. | Identidad empresarial verificable, ejemplos reales y canal contextual. |
| Cruce del umbral | Decide explorar y seleccionar. | Catálogo con buscador y categorías comprensibles. |
| Pruebas | Compara material, marcación y cantidad. | Ficha escaneable y comparación opcional de alternativas. |
| Momento decisivo | Envía solicitud y debe conseguir aprobación. | Resumen editable, condiciones claras y confirmación real cuando exista. |
| Recompensa | Recibe propuesta, aprueba arte y obtiene pedido. | Proceso comercial trazable, responsables y fechas confirmadas. |
| Regreso | Necesita repetir o recomendar. | Reutilizar referencia de pedido con permiso, sin forzar una cuenta. |

Lo observado cubre descubrimiento y contacto. Cotización recibida, aprobación, entrega y recompra no se observaron; deben mapearse con el equipo comercial. No presentar una apertura de WhatsApp como “misión cumplida”.

### Contenido recomendado

Bloque de proceso: “Elige tus productos → Cuéntanos cantidad y ciudad → Recibe una propuesta → Aprueba el diseño → Coordinamos producción y entrega”. Publicarlo solo tras validar que refleja la operación real.


## 09 — PLOP EVENTS: momentos críticos y recuperación

**Aclaración metodológica:** el roadmap adjunto no define “PLOP EVENTS” y la búsqueda no permitió identificar una definición autoritativa inequívoca. Aquí se aborda como inventario operativo de momentos donde se rompe la continuidad o la expectativa del producto. No se inventa una expansión del acrónimo ni se atribuye a un autor. Ajustar la nomenclatura si tu curso usa otra definición.

| Evento / evidencia | Expectativa rota | Respuesta propuesta |
| --- | --- | --- |
| Entrar a una página interna · O | El menú debería seguir visible. | Cabecera clara con texto oscuro y controles accesibles. |
| Elegir Gorras · O | La categoría debería mostrar opciones o una salida útil. | Estado vacío con CTA contextual y alternativas. |
| Abrir personalización · O/I | “Tu logo” puede sugerir que puede usar su archivo; solo aparece ejemplo. | Decir “Ver ejemplo de marcación”; simulador real como fase posterior. |
| Elegir una promoción · O/I | Se espera un beneficio o condición de oferta. | Mostrar condición comprobada o retirar afirmación de oferta. |
| Continuar a WhatsApp · O/V | Se cambia de canal sin cantidad ni fecha precompletadas. | Resumen y aviso del canal; alternativa copiable si no abre. |
| Buscar sin resultados · V | Debe poder continuar aunque no exista coincidencia. | Sinónimos, quitar filtros y consulta asistida. |
| Fallar una carga / envío · V | Debe poder recuperar su progreso. | Reintento idempotente, conservación del borrador y soporte. |

### Cómo registrar un evento

Guardar pantalla, tarea, disparador, estado, reacción del usuario, salida disponible y resultado. Con analítica registrar solo parámetros no sensibles. Relacionar cada evento con una tarea del backlog y un caso de prueba.


## 10 — Registro de hallazgos: correcciones urgentes

| ID / S / A | Evidencia y problema | Acción y criterio de cierre |
| --- | --- | --- |
| H01 · S4 · A5<br>P0 / Frontend | O E02/E03: menú blanco sobre blanco; O E04: color blanco computado. I: dificulta navegar. | Definir variante por fondo y estado sticky. Cierre: menú legible en todas las rutas revisadas y contraste normal ≥4,5:1. |
| H02 · S3 · A2<br>P1 / UX + Dev | O E02: 840 productos, sin buscador ni filtros visibles. I: costo alto de exploración. | Búsqueda por nombre/SKU/sinónimos; filtros por atributos fiables. Cierre: tarea de encontrar referencia y alternativa sin ayuda. |
| H03 · S3 · A4<br>P1 / Contenido | O E03: mínimo, técnica y medidas en un párrafo; sin entrega/precio orientativo. | Separar atributos y restricciones; explicar qué define el valor. Cierre: usuario identifica mínimo y condición de entrega. |
| H04 · S3 · A2<br>P1 / Producto | O E03: WhatsApp solo incluye nombre y petición de logo. | Ruta opcional de cantidad, color, ciudad y fecha; resumen editable. Cierre: mensaje conserva campos; no promete envío. |
| H05 · S3 · A5<br>P1 / UX writing | O E05: categoría vacía; solo texto y enlaces globales para contacto. | CTA “Consultar gorras por WhatsApp”, categoría precompletada y salida al catálogo. Cierre: usuario puede continuar desde el estado vacío. |

S = severidad estimada 0-5. A = arreglabilidad estimada 1-5, donde 5 es más fácil. Esfuerzo sujeto a código y datos; no se inspeccionó el repositorio. La prioridad considera alcance del componente y relevancia comercial.


## 11 — Registro de hallazgos: claridad y confianza

| ID / S / A | Evidencia y problema | Acción y criterio de cierre |
| --- | --- | --- |
| H06 · S2 · A4<br>P1 / Comercial | O E04: “mejores precios del mercado” y “ofertas activas” sin beneficio/condiciones visibles. | Sustituir por afirmación demostrable; indicar vigencia, mínimos e inclusión de marcación cuando aplique. |
| H07 · S2 · A5<br>P2 / Contenido | O E02/E05: “Boligrafo”, nombres en inglés, “Gorras Personalizados”, categorías EcoNature/Ecología. | Normalizar tildes y nombres; añadir descriptor sin cambiar SKU. Validar agrupaciones con card sorting. |
| H08 · S2 · A5<br>P2 / UX writing | O E06: ejemplo de logo sin carga visible y copy de personalización. | Aclarar que es ilustrativo y que arte final se aprueba después; no insinuar vista real del archivo. |
| H09 · S3 · A3<br>P1 / Comercial | O footer de muestra: sin enlaces visibles de privacidad, condiciones o datos empresariales completos. | Añadir información empresarial verificable y políticas aplicables; revisión responsable antes de publicarlas. |
| H10 · S2 · A4<br>P2 / UX + UI | O E01: hero ocupa primer pantallazo; O E02: categorías dominan antes de tarjetas. | Prototipar hero más compacto y descubrimiento progresivo de categorías; validar por tareas. |
| H11 · S2 · A3<br>P2 / UX + Dev | O E03: sin lista/comparación visible. I: obliga a recordar alternativas. | Lista multiproducto; comparar 2-3 opciones si pruebas justifican su valor. Preservar selección al volver. |

No se afirma que J&J carezca de datos empresariales o políticas fuera de la muestra. El hallazgo describe la ausencia de acceso visible desde el footer revisado.


## 12 — Arquitectura y recorridos sin fugas

### Mapa de navegación propuesto

Inicio conecta con Catálogo, Cómo personalizamos, Ayuda y Contacto. Catálogo conecta con categorías, búsqueda y ficha. Cada ficha conecta con lista de cotización, productos relacionados y regreso al resultado. La lista conecta con resumen, WhatsApp y alternativa de contacto. Footer contiene empresa, condiciones y privacidad. Conservar blog y páginas geográficas como accesos secundarios útiles.

### Happy path A: referencia conocida

Buscar nombre o SKU → abrir ficha → verificar cantidad mínima y marcación → indicar cantidad/ciudad/fecha → revisar resumen → abrir WhatsApp. Si no tiene logo aún, puede avanzar sin archivo.

### Happy path B: necesita orientación

Entrar por categoría o uso → elegir opciones → revisar 2-3 productos → guardar selección → solicitar asesoría con objetivo, presupuesto opcional y fecha. No exigir elegir técnica si no la conoce.

### Unhappy paths obligatorios

| Situación | Salida y estado que se conserva |
| --- | --- |
| Categoría vacía o búsqueda sin resultados | Consulta contextual, alternativas y limpiar filtros. Conservar búsqueda. |
| Cantidad incompatible con caja por color | Explicar regla y ofrecer valores válidos; conservar datos y dejar decisión al usuario. |
| Fecha posiblemente inviable | Marcar “requiere confirmación”; ofrecer asesoría y alternativa, sin rechazar por una estimación no fiable. |
| WhatsApp no abre | Copiar resumen, mostrar número y canal alternativo real; conservar selección. |
| Producto retirado / carga fallida | Alternativas, reintento y regreso al catálogo con filtros. |

### Auditoría del grafo

Listar nodos, entradas, salidas y precondiciones; comprobar con rastreo de URLs y tareas manuales. E05 es un recorrido incompleto con recuperación global, no una página huérfana demostrada. Blog y ciudades deben revisarse antes de afirmar cobertura completa.


## 13 — Rediseño del catálogo y de la ficha

### Catálogo: especificación mínima

Buscador con etiqueta visible “Buscar productos”, búsqueda por nombre/SKU y sinónimos colombianos (mug/taza, gorra/cachucha). Mostrar número de coincidencias, filtros activos, “Limpiar filtros” y orden comprensible. Priorizar categoría, material y técnica solo si el catálogo dispone de esos datos. Añadir presupuesto únicamente si existe información comparable y confiable.

Reducir las 37 categorías simultáneas: mostrar familias y acceso “Todas las categorías”, o panel de filtros. Un producto puede pertenecer a varias agrupaciones sin duplicar registros. “Productos nuevos” debe depender de una fecha real; la ruta observada contiene “productos-2023”, lo cual requiere revisión de vigencia, no demuestra por sí solo que el contenido esté desactualizado.

### Tarjetas

Nombre corregido + foto uniforme + atributo útil + mínimo cuando esté disponible + acción “Ver detalles”. Para datos variables, usar “Consulta disponibilidad”. No inventar precio desde ni stock. Preservar posición y filtros al volver; la carga incremental debe anunciar resultados y permitir recuperación.

### Ficha Ballpop: estructura propuesta

| Bloque | Contenido basado en E03 / por confirmar |
| --- | --- |
| Identidad | Bolígrafo Ballpop · Referencia JJ-000001 · Antiestrés. |
| Atributos | Silicona · 10,5 × 3 × 0,8 cm · Área de marcación: 3 cm · Tampografía. Confirmar términos con proveedor. |
| Cantidad | Venta en múltiplos de caja de 50 unidades por color. No generalizar este mínimo a todo el catálogo. |
| Condiciones | Colores y disponibilidad por confirmar; explicar marcación, producción, envío e impuestos según información comercial aprobada. |
| Acción | “Preparar cotización” y acceso directo “Consultar por WhatsApp”. Lista opcional para varios productos. |


## 14 — Cotización guiada y contacto

Proponer un formulario breve como alternativa al contacto directo. Su finalidad es preparar contexto; evitar convertirlo en un checkout si no existe compra online. La lista multiproducto puede ser una segunda entrega.

| Paso | Campos / comportamiento | Estado y aceptación |
| --- | --- | --- |
| 1. Tu pedido | Producto/SKU fijo; cantidad por color cuando aplique; opción “Necesito asesoría”. | Reglas por producto; error inline; selección conservada. |
| 2. Entrega | Ciudad/municipio y departamento; fecha requerida con opción “Sin fecha definida”. | No pedir dirección completa antes de necesitarla. Fecha no constituye promesa de entrega. |
| 3. Personalización | Técnica opcional o “Recomiéndenme”; logo opcional en fase posterior. | No bloquear por falta de archivo; definir formatos y manejo seguro antes de habilitar carga. |
| 4. Revisar | Resumen editable de productos, cantidades, destino y fecha. | Botón indica el canal; explicar que se abre un mensaje que el usuario debe enviar. |

### Mensaje precompletado recomendado

“Hola, quiero cotizar: Bolígrafo Ballpop (JJ-000001), 100 unidades [distribución por color]. Ciudad: Bogotá. Fecha requerida: [fecha o sin definir]. Personalización: necesito asesoría. Por favor confirmen disponibilidad, valor con marcación y opciones de entrega”.

### Estados que debe diseñar Figma

Inicial, editando, error de cantidad, fecha pendiente de confirmación, resumen listo, apertura de WhatsApp, alternativa al fallo y regreso al borrador. Solo mostrar “Solicitud recibida” si un canal propio confirma recepción en servidor; no usarlo tras abrir wa.me.

No se enviaron mensajes durante la auditoría. Los tiempos de atención, precios, medios de pago y condiciones deben ser definidos por el negocio antes de redactar promesas.


## 15 — Microcopy inspirado en Kinneret Yifrah

Propuesta original de textos para J&J, orientada a aclarar acciones, reducir incertidumbre y acompañar la recuperación. No son citas del libro [R4]. Voz: profesional, cercana y precisa; usar “tú” de forma coherente y evitar promesas absolutas.

| Ubicación / actual | Texto propuesto | Razón y condición |
| --- | --- | --- |
| CTA “Cotiza con Nosotros” | “Cotizar por WhatsApp” | Anticipa el canal y usa verbo directo. |
| Buscador nuevo | “Buscar por producto o referencia” | Explica qué puede introducir. Etiqueta persistente. |
| Ficha: mínimo disperso | “Pedido en múltiplos de 50 unidades por color” | Aplicar solo a Ballpop o productos con esa regla validada. |
| Cantidad inválida | “Para este color, elige 50, 100, 150 o más, en múltiplos de 50.” | Explica solución; adaptar a regla real de cada producto. |
| Categoría Gorras vacía | “Aún no mostramos gorras en el catálogo. Consulta las opciones disponibles con nuestro equipo.” | CTA: “Consultar gorras por WhatsApp”; no prometer respuesta inmediata. |
| Preview “tu logo” | “Ejemplo ilustrativo de marcación” | Añadir: “El diseño final se confirma antes de producir”. Validar operación. |
| Sin resultados | “No encontramos productos con esa búsqueda. Prueba otro nombre o quita algunos filtros.” | Acciones visibles para limpiar y pedir ayuda. |
| Salida a WhatsApp | “Se abrirá WhatsApp con el resumen. Revisa el mensaje y envíalo para consultar tu pedido.” | Distingue abrir de enviar. |
| Error técnico nuevo | “No pudimos cargar más productos. Intenta de nuevo; tu selección sigue guardada.” | Solo afirmar conservación si está implementada. |

Revisar naming: “Bolígrafo”, “Calculadora multifunción” sin guion residual y “Gorras personalizadas”. Mantener nombres de modelo cuando ayuden a identificar, acompañados de descriptor en español. Probar comprensión antes de introducir nuevos términos.


## 16 — Foundations, componentes y responsive

### Sistema de diseño recomendado

Mantener identidad de J&J y crear un sistema web propio de tokens y componentes accesibles. No adoptar MD3 o Carbon solo por estar en el roadmap: elegirlos únicamente si el stack y el equipo obtienen un beneficio claro. No copiar la estética de PagoAlerta a este negocio.

| Capa | Definición para el UI kit |
| --- | --- |
| Foundations | Colores por función y fondo; tipografía; espaciado 4/8/12/16/24/32; contenedores; radios; bordes; elevación y motion reducido. |
| Átomos | Botón/link, input, etiqueta, ayuda, error, chip, icono y badge. Estados default, hover, focus, active, disabled y loading. |
| Moléculas | Buscador, control cantidad por color, tarjeta producto, campo con error, filtro activo y elemento del resumen. |
| Organismos / plantillas | Cabecera clara/oscura, filtros, listado, ficha, modal, estado vacío y cotización. Componentes coherentes entre rutas. |

### Matriz responsive que debe verificarse

| Rango / pruebas | Reglas propuestas |
| --- | --- |
| Móvil 320-767<br>320, 375 y 440 px | Margen 16-24 px según espacio; una o dos columnas según legibilidad; filtros en panel; CTA sin tapar contenido ni foco. |
| Tablet 768-1279<br>768, 834 y 1194 px | Margen 24-40 px; adaptar ficha; controles alcanzables; evitar cabecera comprimida. |
| Escritorio ≥1280<br>1280, 1440 y 1920 px | Contenedor máximo aproximado 1200-1280 px; márgenes adaptables; ficha en dos columnas y filtros persistentes si conviene. |

Recomendación táctil interna: controles de 44-48 px de alto y área interactiva cómoda. No confundirla con un alto universal obligatorio: WCAG 2.2 AA establece tamaño objetivo mínimo de 24 × 24 CSS px con excepciones [R5]. No se probó el responsive actual.


## 17 — Accesibilidad y calidad técnica

Meta propuesta: WCAG 2.2 nivel AA en procesos completos. Una auditoría parcial o una herramienta automática no certifica conformidad. La navegación clara es la primera corrección observada; el resto requiere QA.

| Área / referencia | Prueba requerida y cierre |
| --- | --- |
| Contraste 1.4.3 / 1.4.11 | Medir todos los pares: texto normal ≥4,5:1; texto grande ≥3:1; componentes aplicables ≥3:1. Revisar texto blanco del CTA rojo y secundarios grises. |
| Teclado 2.1.1 / 2.1.2 | Completar catálogo, filtros, modal y cotización sin mouse; sin trampas. Escape y regreso del foco en modal. |
| Foco 2.4.7 / 2.4.11 | Indicador visible y sin ocultarse tras cabecera o WhatsApp flotante. Añadir enlace para saltar al contenido. |
| Reflow 1.4.10 / texto 1.4.4 | Probar 320 CSS px y ampliación al 200%; sin pérdida de contenido o acciones esenciales. |
| Semántica 1.3.1 / 4.1.2 | Headings coherentes, labels reales, nombre/rol/estado de filtros y FAQ; verificar diálogo y navegación con lector. |
| Mensajes 3.3.1 / 4.1.3 | Errores identificados en texto, asociados al campo; carga incremental anunciada sin exceso de interrupciones. |
| Targets 2.5.8 | Medir objetivos de interacción y separación; evaluar excepciones del criterio. |

### Performance y motion: pendiente

Medir Core Web Vitals con datos de campo cuando existan; LCP, INP y CLS por plantilla y dispositivo. Complementar con laboratorio, redes lentas y móvil real. Optimizar dimensiones de imagen, formatos modernos, carga bajo demanda y reservar espacio para evitar saltos. No asignar valores actuales sin medición.

La instrucción “mueve el cursor” de E01 exige alternativa táctil y por teclado. Respetar prefers-reduced-motion y conservar comprensión sin animación. Comprobar que las imágenes de catálogo no contienen texto esencial inaccesible.


## 18 — Psicología, nudges y conducta ética

| Marco del roadmap | Aplicación útil en J&J | Límite ético |
| --- | --- | --- |
| Sobrecarga / ley de Hick | Agrupar categorías y mostrar filtros relevantes de manera progresiva. | No ocultar alternativas para inducir una compra. |
| Reconocimiento / memoria | Conservar productos, filtros y cantidades; mostrar resumen editable. | No añadir productos por defecto ni marcar técnicas pagadas sin decisión. |
| Framing / anclaje | Explicar precio por cantidad y qué incluye cuando exista cotización. | No usar precios señuelo ni comparar importes con condiciones distintas. |
| Nudges de Thaler y Sunstein | Checklist de datos necesarios; sugerir cantidad válida y fecha a confirmar. | La sugerencia debe ser editable; no aumentar cantidad automáticamente. |
| Fogg: motivación, capacidad, señal | Relevancia del producto + tareas cortas + CTA contextual en ficha. | No aumentar presión ni perseguir al usuario con avisos. |
| Hooked / recompra | Referencia de pedido y lista reutilizable cuando aporten valor. | B2B es episódico: no necesita hábito diario, rachas o recompensas artificiales. |
| Diseño consciente | Datos mínimos, condiciones visibles y contacto accesible. | Sin urgencia falsa, testimonios inventados ni consentimiento forzado. |

### Peso visual y jerarquía

En el hero de escritorio observado domina el titular; el catálogo aparece después del primer pantallazo. Probar una composición con propuesta breve, CTA y productos representativos. No declarar que bajar altura por sí mismo aumentará conversiones. La regla 60/30/10 del roadmap puede guiar una paleta, pero no sustituye contraste ni jerarquía.

### GOMS / KLM

Comparar tareas concretas: encontrar Ballpop y preparar un pedido válido. Modelar búsqueda, lectura, selección y edición en prototipos equivalentes. No estimar segundos con un conteo inventado ni usar KLM como sustituto de pruebas con usuarios. Registrar primero tiempos y errores reales.


## 19 — Plan de acción por entregas

Calendario orientativo de seis semanas para un equipo pequeño, sujeto a revisión de stack, catálogo y disponibilidad. Las etapas pueden solaparse; corregir el menú no depende de terminar investigación.

| Entrega | Acciones / responsable | Dependencias y aceptación |
| --- | --- | --- |
| 0 · 1-2 días | H01: variante de cabecera y contraste. Frontend + QA. | Revisión de todas las plantillas claras/oscuras; enlaces legibles. |
| 1 · Semana 1 | Validar operación y protopersonas; H05-H09: vacío, copy, promociones y confianza. UX + Comercial. | Datos y promesas aprobados; ningún estado revisado termina sin salida. |
| 2 · Semanas 2-3 | H02-H03-H07: modelo de datos, búsqueda, filtros y ficha escaneable. UX + Catálogo + Dev. | Atributos fiables, reglas por producto y pruebas de búsqueda. |
| 3 · Semanas 3-4 | H04: cotización breve y resumen; alternativa a WhatsApp. Producto + Dev. | Reglas comerciales, conservación de datos y aviso correcto del canal. |
| 4 · Semana 5 | H08-H10-H11: preview claro, hero, lista y refinamiento UI. Diseño + Dev. | Prototipo validado; comparar opciones solo si aporta valor. |
| 5 · Semana 6 | QA WCAG/responsive; pruebas con usuarios; medición y ajustes. QA + UX + Analítica. | Sin problemas graves de tarea; eventos fiables y aprobación del negocio. |

### Estimación preliminar de esfuerzo

Cabecera y copy: S, 0,5-2 días por grupo de cambios. Ficha/taxonomía: M, 3-5 días más depuración de catálogo. Buscador y cotizador: L, 1-2 semanas cada uno según datos y stack. Son rangos de implementación, no cotización ni compromiso contractual; no sumarlos como cronograma exacto.

### Primer sprint recomendado

Corregir menú, crear CTA contextual en Gorras, corregir títulos y ofertas, estructurar la ficha de muestra y acordar contrato de datos del cotizador. En paralelo, entrevistar compradores y levantar línea base comercial.


## 20 — Pruebas con usuarios y métricas

### Evaluación formativa

Realizar una ronda con 5-8 compradores reales de roles distintos; probar escritorio y móvil. Es una muestra cualitativa para descubrir problemas, no una estimación estadística de toda la audiencia. Usar pedidos plausibles y entorno de prueba para evitar contactos comerciales involuntarios.

| Tarea | Qué registrar |
| --- | --- |
| Encontrar una referencia conocida | Éxito sin ayuda, tiempo, consultas usadas y confusiones. |
| Elegir regalos para evento con cantidad y fecha | Criterios de decisión, información faltante y comprensión de condiciones. |
| Cotizar Ballpop con cantidad no válida | Detección y recuperación; comprensión del mínimo por color. |
| Continuar desde Gorras sin productos | Encuentra salida contextual y entiende disponibilidad no confirmada. |
| Revisar y corregir un resumen multiproducto | Cambios sin pérdida de datos; comprensión de apertura de WhatsApp. |

### Criterios internos propuestos, no resultados actuales

Cero bloqueos graves sin salida. Al menos 80% de éxito sin ayuda en tareas principales de la ronda, interpretado como señal exploratoria. Comprobar que cada participante entiende que precio, stock y entrega requieren confirmación. SUS al final de una experiencia completa; CSAT tras atención comercial; NPS solo si tiene sentido relacional.

### Métricas de negocio

Solicitud calificada = conversación efectivamente recibida que incluye producto/categoría, cantidad y destino, con fecha definida o explícitamente abierta. Medir tasa de solicitudes calificadas, tiempo de primera respuesta, propuesta enviada y venta cerrada. Definir fuente y deduplicación con ventas.

Antes/después: usar periodos comparables y segmentar por fuente/dispositivo; no atribuir cambios a UX si cambian campañas o precios. A/B requiere volumen y cálculo de muestra. ANOVA no se justifica automáticamente por aparecer en el roadmap.


## 21 — Instrumentación y mantenimiento

| Evento propuesto | Disparador / parámetros no sensibles | Interpretación |
| --- | --- | --- |
| search_used | Búsqueda realizada; cantidad de resultados y categoría. Evitar texto libre sensible. | Interés y capacidad de encontrar, no compra. |
| product_viewed | Ficha mostrada; product_id y category_id. | Exploración de producto. |
| quote_item_added | Selección añadida; product_id y tramo de cantidad. | Intención de preparar solicitud. |
| quote_summary_ready | Resumen válido; item_count y campos completos como booleanos. | Preparación finalizada. |
| whatsapp_open_clicked | Clic de salida; origen y product_id. | Solo apertura intentada, nunca mensaje confirmado. |
| lead_received | CRM/canal propio confirma recepción; ID interno pseudónimo. | Solicitud recibida, con acceso restringido. |
| proposal_sent / sale_closed | Cambio comercial confirmado y deduplicado. | Resultado real para negocio. |

No enviar logo, teléfono, nombre, correo, dirección ni texto completo del mensaje a herramientas de analítica. Revisar consentimiento y base de tratamiento con el responsable correspondiente; este informe no sustituye una revisión jurídica.

### Gobierno del producto

Comercial valida mínimos, oferta y plazos. Catálogo mantiene atributos y fechas de novedades. Diseño mantiene tokens y copy. Desarrollo asegura estados y persistencia. QA comprueba rutas/dispositivos. Analítica verifica eventos. Revisar mensualmente vacíos, enlaces, categorías y reglas; revisar métricas sin asumir causalidad.

### Definición de terminado

Cambios implementados, textos aprobados, datos validados, estados de error diseñados, responsive y teclado comprobados, contraste medido, eventos revisados y pruebas de tareas completadas. Documentar riesgos pendientes con responsable y fecha; no cerrar solo porque Figma se vea bien.


## 22 — Fuentes, trazabilidad y entrega al equipo

### Fuentes utilizadas

[R1] ROADMAP UX UI.pdf, archivo aportado por el usuario. Extracción textual completa: investigación, usabilidad técnica, gráfica y teórica, Garrett, microcopy, gaps, conducta, evaluación humana, foundations y responsive.

[R2] Nielsen Norman Group. “10 Usability Heuristics for User Interface Design”. https://www.nngroup.com/articles/ten-usability-heuristics/ · Consultado el 08/10/2026.

[R3] Jesse James Garrett. The Elements of User Experience, extracto publicado por Pearson/New Riders. https://ptgmedia.pearsoncmg.com/images/0735712026/samplechapter/0735712026C.pdf · Consulta de fuente editorial el 08/10/2026.

[R4] Kinneret Yifrah / Nemala. Microcopy: The Complete Guide, sitio oficial. https://www.microcopybook.com/ · Consultado el 08/10/2026. Los textos propuestos en este informe son originales.

[R5] W3C. Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/ · Consultado el 08/10/2026. Los umbrales citados son criterios puntuales, no una certificación.

### Evidencia del sitio

Observación directa en navegador de las rutas E01-E06 listadas en la página 3. Las afirmaciones del sitio (“840 productos”, “37 categorías”, “mejores precios”) se reportan como contenido visible, no como hechos verificados de inventario o mercado. El buscador externo no pudo recuperar la portada; la inspección directa sí permitió revisar el sitio.

### Paquete de trabajo que debe salir de esta auditoría

1. Brief y mapa del servicio con ventas. 2. Backlog H01-H11 con evidencia y criterios. 3. Wireframes de catálogo, ficha y cotización. 4. UI kit y matriz de estados. 5. Dos happy paths y rutas de recuperación. 6. Plan de QA y guion de usuarios. 7. Contrato de eventos y tablero comercial.

Próxima decisión concreta: aprobar el primer sprint de correcciones y confirmar quién mantiene datos del catálogo y condiciones comerciales. Un rediseño completo de la marca no es necesario para resolver las fricciones prioritarias observadas.

