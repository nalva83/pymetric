<!--
PLANTILLA — DECISIONS.md (registro de decisiones de diseño)
Captura el "POR QUÉ" que la compactación de contexto suele perder.
Formato mínimo por entrada: qué decisión, por qué, alternativa rechazada, constraint, fecha.
-->

# Decisiones de diseño

## 2026-09-10: PRD de Pymetric — MVP con las tres capacidades, orden listas→costos→presupuestos
- **Decisión:** `docs/prd.md` define el MVP como UN recorrido: registro self-serve →
  actualizar lista de precios → cargar y ver análisis de costos → generar presupuesto
  usando esos costos. Las tres capacidades de `docs/solucion.md` entran en el MVP (no
  se recortó alcance); se secuencian como M1 (listas de precios) → M2 (análisis de
  costos) → M3 (presupuestos).
- **Razón:** el owner eligió explícitamente que las tres capacidades vayan juntas
  desde el arranque. Se ordenaron así porque listas de precios es autocontenida (no
  depende de datos previos) y da el "probalo vos" más rápido; costos construye la base
  de datos que presupuestos reutiliza, evitando resolver la carga de costos dos veces.
- **Alternativa rechazada:** empezar por presupuestos (ataca el dolor más agudo del
  ICP, pero requiere más pantallas antes de mostrar resultado) — descartada por el
  owner a favor de listas de precios como entrada más rápida.
- **Constraint:** M2 y M3 dependen de M1 y de M2 respectivamente — no se puede
  paralelizar su construcción sin romper el orden "una cosa a la vez" de la
  constitución. El precio base y el costo de IA por uso quedan como riesgos con
  límite explícito en §4, a resolver antes de `/deploy`.

## 2026-09-10: Solución de Pymetric — producto SaaS, tres capacidades, precio $50-100/mes
- **Decisión:** `docs/solucion.md` define Pymetric como SaaS self-serve con tres
  capacidades núcleo: presupuestos automatizados, análisis de costos, y actualización
  de listas de precios (sube archivo de proveedor → devuelve xls listo para importar).
  MVP sin integraciones (banco/contable/ERP) — todo entra y sale vía carga/descarga
  manual de archivos. Precio base: suscripción mensual, plan único, rango orientativo
  USD 50-100/mes (sin tiers ni descuentos, eso es de la oferta).
- **Razón:** las tres capacidades derivan del ICP (`docs/icp.md`) — presupuestos y
  análisis de costos del dolor priorizado; listas de precios es una capacidad concreta
  aportada por el owner (re-tipeado manual de listas de proveedores como tarea
  repetitiva de alto costo). Self-serve sin integraciones reduce el alcance del MVP a
  lo que no requiere trabajo de implementación de nuestro lado.
- **Alternativa rechazada:** enfocar el producto solo en presupuestos (descartado —
  el owner prefirió un alcance de "análisis de costos amplio" con presupuestos como
  una de varias capacidades, no la única entrada) · onboarding asistido (descartado a
  favor de self-serve puro para esta etapa).
- **Constraint:** el orden de construcción (qué capacidad entra primero al MVP) queda
  sin decidir — es responsabilidad del PRD. El precio y la falta de integraciones son
  supuestos 🔴 en `docs/solucion.md` a validar antes de comprometer roadmap sobre
  ellos.

## 2026-09-07: ICP-01 de Pymetric — un solo perfil, hipótesis, sin módulos opcionales
- **Decisión:** `docs/icp.md` define un único ICP ("El dueño que paga con su tiempo"):
  dueño/a de PyME de hasta 20 empleados, sin IT propio, cuyo dolor priorizado es el
  costo/tiempo de redactar presupuestos (job funcional priorizado sobre el emocional y
  el social). Se construyó solo el núcleo (sin Marketing/Ventas/Social Listening) y
  queda marcado como Hipótesis (N=0) — no hay evidencia de clientes todavía.
- **Razón:** el owner confirmó presupuestos como la tarea repetitiva más pesada
  (alto esfuerzo + resultado incierto); no hay uso comercial inmediato que justifique
  cargar los módulos opcionales antes de validar el núcleo.
- **Alternativa rechazada:** abrir un segundo ICP para otro rubro o tamaño de
  empresa — se descartó por falta de evidencia de que haya más de un perfil
  coherente; se prioriza validar uno antes de multiplicar.
- **Constraint:** los tres supuestos más riesgosos (disparador real de compra, que
  "presupuestos" sea el dolor más agudo, que el argumento de costo de oportunidad
  resuene) quedan marcados 🔴 en `docs/icp.md` y deben validarse con clientes reales
  antes de construir mensajería u oferta sobre ellos.

## 2026-08-18: Arquitectura multi-documento + el PRD como mapa
- **Decisión:** `/arquitectura` vuelve a escribir un documento por tema en `docs/arquitectura/` — siempre: `stack.md` (incluye deploy y costo mensual), `modelo-de-datos.md` (#1), `secretos.md` (#2), `user-flow.md`, `marca.md`; condicionales (si no aplican, no se crean y el índice lo marca): `integraciones-ia.md` (#3), `integraciones.md` (#4), `auth-y-permisos.md`. Al terminar, el Arquitecto completa la sección §7 "El cómo técnico" de `docs/prd.md` con los links. Sigue sin subagentes (todo en la misma pasada).
- **Razón:** un archivo único mezclaba temas de peso muy distinto; documentos separados permiten linkear con precisión desde specs y constitución, y el PRD como mapa le da al owner un solo punto de entrada. La lista se alineó con la slide 20 de la masterclass (stack · modelo de datos · user flow · marca · IA · autenticación · deploy), sumando marca y auth que faltaban en la lista inicial.
- **Alternativa rechazada:** mantener `decisiones.md` único (mezclaba todo) · un doc por tema con fan-out a subagentes (lento, ya descartado en v2).
- **Constraint:** los condicionales no se rellenan con "N/A" largos — no se crean; el índice de `docs/arquitectura/README.md` y el §7 del PRD son quienes registran el descarte en una línea.

## 2026-08-18: Alinear los comandos al workflow de la masterclass
- **Decisión:** el harness adopta los 8 comandos del mapa público de la masterclass (slide 18): `/icp` · `/solucion` · `/prd` · `/arquitectura` · `/roadmap` · `/specs` · `/implementar` · `/deploy`. Renombres: `/new-prd`→`/prd`, `/new-architecture`→`/arquitectura`, `/deploy-check`→`/deploy` (ahora con GO + confirmación ejecuta el deploy real). `/new-plan` se parte en `/roadmap` (el plan) y `/specs` (las fichas), ambos orquestando la misma skill `planner`. Nuevo `/implementar <ID>` como wrapper del despacho a `builder`. `/empezar` y `/save-point` siguen como transversales.
- **Razón:** un solo vocabulario entre la charla, el curso y el harness — lo que el alumno ve en las slides es exactamente lo que tipea en el repo.
- **Alternativa rechazada:** mantener `/new-plan` fusionado y ajustar las slides — el material público manda; la fusión se conserva a nivel doctrina (una skill), solo se parte la orquestación.
- **Constraint:** la skill `planner` sigue siendo la única dueña de la doctrina de plan+specs; los dos comandos solo ejecutan fases distintas de ella.

## 2026-08-17: Harness v2.1 — optimización 80/20 para founders no técnicos
- **Decisión:** cuatro mejoras a la interfaz con el founder: (1) `/empezar` como puerta de entrada humana (dónde está el proyecto + el único paso siguiente); (2) "probalo vos" al cerrar cada milestone — el agente levanta la app, sirve el link y el milestone no se archiva sin la confirmación del owner (nunca a nivel spec: sería mucho); (3) toda pregunta técnica se sirve digerida — qué significa en llano, pros/contras y una opción sugerida; (4) borrar `QUALITY.md`.
- **Razón:** análisis de primeros principios + Pareto: el núcleo del método ya estaba; los gaps eran de interfaz humana — el founder no puede leer código, solo puede juzgar usando la app y con explicaciones en llano, y no sabe levantar servers.
- **Alternativa rechazada:** ritual de "cuando algo se rompe" (descartado por el owner) · renombrar los comandos a verbos de founder (se mantienen los nombres actuales por el material del curso) · "probalo vos" por spec (demasiada fricción).
- **Constraint:** la regla de trade-offs vive en las skills (doctrina); el "probalo vos" en CLAUDE.md y las plantillas (flujo) — sin duplicar entre capas.

## 2026-08-17: Simplificar el harness (v2 — rápido y en llano)
- **Decisión:** reducir el equipo de 11 a 6 roles (el Programador `builder` implementa Y verifica; el Planificador `planner` hace plan + specs en un comando `/new-plan`; DevOps absorbe el chequeo de costo), dejar 2 rondas de preguntas en todo el flujo, un solo archivo de arquitectura (`decisiones.md`), estado en un solo lugar (la tabla del plan), plantillas cortas cuyas secciones no aplicables se borran, y todos los documentos visibles en lenguaje llano con anexos técnicos para los agentes. Tres capas con responsabilidad única: skill = CÓMO, agente = QUIÉN, command = ejecución — sin duplicar contenido entre capas.
- **Razón:** en la demo en vivo el harness v1 era lentísimo: ~22.500 palabras de instrucciones, ~18 subagentes mayormente en serie, hasta 11 rondas de preguntas y estado por triplicado. Y el usuario final no es técnico.
- **Alternativa rechazada:** mantener el harness completo y agregar un modo `--fast` aparte — doble mantenimiento; y eliminar las skills moviendo la doctrina a los commands — rompía la separación CÓMO/QUIÉN/ejecución.
- **Constraint:** toda doctrina vive en su skill y se referencia (no se copia) desde commands y agentes; el punto de retorno pre-cambio es el commit `42eb607`.

## <AAAA-MM-DD>: <Título corto de la decisión>
- **Decisión:** <qué se decidió>
- **Razón:** <por qué>
- **Alternativa rechazada:** <qué se descartó y por qué>
- **Constraint / consecuencia:** <restricción que esto impone hacia adelante>

## 2026-01-15: Usar Redis para cachear preferencias de usuario
- **Decisión:** cachear las preferencias de usuario en Redis.
- **Razón:** alta frecuencia de lectura (cada llamada de API), datos chicos.
- **Alternativa rechazada:** vista materializada en PostgreSQL — la alta frecuencia de cambio no justifica el costo de mantenimiento.
- **Constraint:** TTL de cache de 5 minutos, invalidación activa al escribir.
