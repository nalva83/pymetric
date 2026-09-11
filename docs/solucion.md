# Solución — Pymetric

> Basado en: docs/icp.md | Tipo: producto (SaaS) | Supuestos abiertos: 4 | Fecha: 2026-09-10

## 1. Qué es

Pymetric es una plataforma SaaS de automatización y análisis de costos para PyMEs de
hasta 20 empleados, que reemplaza tareas administrativas repetitivas (presupuestos,
conciliación de gastos, actualización de listas de precios, reportes de costos)
mediante IA y features específicas, para que el dueño recupere el tiempo que hoy
pierde en ellas.

## 2. La promesa / resultado

**De** perder horas armando presupuestos, conciliando gastos, actualizando listas de
precios y sacando reportes a mano — tiempo que no vuelve y que no genera ingreso
directo — **a** automatizar esas tareas con Pymetric y **recuperar ese tiempo para lo
que realmente hace crecer el negocio**: vender más, mejorar el producto, atender
clientes.

No se trata solo de "ahorrar tiempo" como fin en sí mismo — se trata de qué hace el
dueño con las horas que recupera. Pymetric libera capacidad para que esa capacidad se
reinvierta en crecimiento, no en más tareas administrativas.

## 3. Para quién es (y para quién no)

**Es para:**
- Dueños/gerentes de PyME (hasta ~20 empleados) sin equipo de IT ni de datos.
- Negocios donde el dueño mismo arma presupuestos, gastos o reportes a mano.
- Quien busca recuperar tiempo/costo operativo, no "modernizarse" por moda.

**No es para:**
- Empresas grandes con sistemas ERP/contables ya integrados y equipo de IT propio
  (necesitan integraciones profundas que el MVP no cubre).
- Quien busca reemplazar su criterio de negocio por completo (la herramienta agiliza,
  no decide por él).
- Quien espera integración automática con su banco/contabilidad desde el día uno — el
  MVP arranca con carga manual de datos y archivos.

## 4. Qué hace / capacidades

**Presupuestos automatizados** — genera cotizaciones a partir de datos cargados
(costos, ítems, márgenes), reduciendo el tiempo de armado y el margen de error de
calcularlo a mano. Habilita: responder rápido, sin resignar precisión.

**Análisis de costos** — centraliza los costos del negocio (cargados por el usuario) y
los organiza para mostrar en qué se va la plata: por categoría, por proveedor, por
período. Habilita: ver el costo real de la operación, no solo intuirlo.

**Actualización de listas de precios** — el usuario sube el archivo original que le
manda un proveedor (en el formato que sea) y Pymetric devuelve un Excel listo para
importar en su propio sistema, con los precios actualizados. Habilita: eliminar la
re-tipeada manual de listas de precios de múltiples proveedores, una tarea repetitiva
y propensa a error que hoy consume horas cada vez que cambia una lista.

*(Hipótesis — a validar. Presupuestos y análisis de costos derivan directamente del
ICP; la actualización de listas de precios es una capacidad concreta aportada por el
owner, más específica y menos especulativa que una detección genérica de tareas
automatizables.)*

## 5. Cómo funciona

**Alta:** el dueño se registra solo (self-serve), sin intervención humana de nuestro
lado.

**Uso — presupuestos y costos:** carga sus datos a mano (sin integraciones externas en
esta versión).

**Uso — listas de precios:** sube el archivo del proveedor tal cual lo recibe →
Pymetric lo procesa → devuelve un xls listo para importar en el sistema del cliente.
No requiere que el cliente adapte el archivo a un formato específico de entrada.

**Valor:** se ve desde la primera carga — un presupuesto armado más rápido, una lista
de precios actualizada en minutos en vez de horas, o una primera foto de costos.

**Integración con lo que ya usa:** ninguna integración automática (ni banco, ni
sistema contable, ni ERP) en el MVP — el punto de entrada/salida es el archivo (sube
uno, descarga otro). Es una fricción conocida y declarada, no resuelta todavía.

## 6. Qué obtenés / entregables

- **Acceso a la plataforma** vía suscripción activa (self-serve, sin setup asistido).
- **Presupuestos generados**, listos para enviar al cliente.
- **Reportes de costos** organizados por categoría/proveedor/período.
- **Archivos xls de listas de precios actualizadas**, listos para importar al sistema
  propio del cliente.

No incluye (en esta versión): integraciones automáticas con banco, contabilidad o
ERP — todo entra y sale de la plataforma vía carga/descarga manual de archivos.

## 7. Formato y modelo de entrega

- **SaaS self-serve** — sin onboarding asistido ni intervención humana de nuestro lado
  para el alta o el uso diario.
- **Nivel de setup:** mínimo — cargar datos y/o subir el archivo de lista de precios es
  el único paso antes de obtener valor.
- **Soporte:** técnico, vía la plataforma (canal a definir — ej. email/chat) — sin SLA
  comercial en esta etapa.

## 8. Requisitos y costo de herramientas

- **Lo que necesita el cliente:** una computadora con navegador y conexión a
  internet; no requiere licencias, integraciones ni software adicional para usar
  Pymetric.
- **Costo de terceros:** ninguno que el cliente deba pagar aparte — Pymetric no
  depende de que el cliente tenga contratada otra herramienta.
- **Dato pendiente (Hipótesis — a validar):** si el procesamiento de listas de precios
  o presupuestos usa un proveedor de IA de pago (ej. API de un modelo de lenguaje), ese
  costo es interno de Pymetric (infraestructura), no un costo que el cliente vea o
  pague por separado — a confirmar cuando se defina la arquitectura técnica.

## 9. Precio base

**Suscripción mensual, plan único: entre USD 50 y USD 100/mes** (rango orientativo — a
definir el número exacto antes de publicar cualquier comunicación de precio). Sin
tiers, trials ni descuentos — eso es de la OFERTA.

*(Hipótesis — a validar con disposición a pagar real de PyMEs del ICP; el rango se
fijó como punto de partida, no como precio final testeado.)*

## Supuestos abiertos

- 🔴 **El precio base ($50-100/mes) no está validado contra disposición a pagar
  real.** Si el ICP no puede/quiere pagar ese rango, cambia el modelo de negocio
  entero.
- 🔴 **La ausencia de integraciones (banco, contabilidad, ERP) puede ser una barrera
  de adopción mayor a lo esperado** para el segmento alto de PyMEs de hasta 20
  empleados, que ya usa algún sistema — a confirmar si el flujo manual/archivo es
  suficiente o si bloquea la venta.
- 🔴 **El costo real de procesar listas de precios y presupuestos con IA** (si aplica
  un proveedor externo de pago) todavía no está estimado — puede afectar el margen del
  precio base propuesto.
- 🔴 **Que "listas de precios" y "presupuestos" sean ambas parte del MVP inicial**, o
  si conviene lanzar con una sola capacidad primero para validar más rápido — no se
  decidió el orden de construcción (eso lo resuelve el PRD).

## Próximo paso

Bajar esta solución a un PRD: qué capacidad entra en el recorrido de valor del MVP
(¿las tres desde el día uno, o se prioriza una?), y qué queda fuera de alcance
explícitamente.
