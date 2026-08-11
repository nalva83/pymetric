---
description: Puente plan→specs. Toma un roadmap de docs/sdd/plans/active/ y autora el detalle de cada SPEC de su tabla (§8) haciendo fan-out — un subagente spec-author de contexto fresco por SPEC (Agent tool), en capas por dependencia, con el clarify resuelto en bloque antes de disparar. Cada spec sale de la plantilla docs/sdd/specs/TEMPLATE.md. No implementa código.
argument-hint: "[ruta del roadmap]  (ej: docs/sdd/plans/active/m1-gate-presupuesto.md)"
---

# /decompose — Del roadmap a las specs detalladas

Etapa 2 del flujo SDD: tomás un **roadmap** ya armado (de `/new-roadmap`) y generás el **detalle de
cada SPEC** de su tabla. Itera el skill **`spec-author`** una vez por slice. **No** implementa
código (eso es una pasada posterior, WIP=1).

Roadmap: **$ARGUMENTS**

> Si `$ARGUMENTS` viene vacío, pedí la ruta del roadmap en `docs/sdd/plans/active/`. Si todavía no hay
> roadmap, primero `/new-roadmap`.

---

## Paso 1 — Leer el roadmap
Abrí el roadmap y leé su **tabla de SPECs (§8)** + el clarify log (§5) + los no-objetivos (§4) + los
gates de seguridad a nivel feature (§7). Esa es la fuente de qué specs autorar y en qué orden.

## Paso 2 — Confirmar el lote
Listá al owner las SPECs que vas a autorar (ID + título + `Depende de`) y confirmá:
- ¿alguna ya tiene archivo en `docs/sdd/specs/` (evitar duplicar)? (el `archive/` es de un producto anterior: no cuenta)
- ¿se autoran **todas** o un subconjunto (p. ej. solo las sin dependencias)?

## Paso 2.5 — Clarify batcheado (ANTES del fan-out) — gate duro
Los subagentes autoran en paralelo con **contexto fresco** y **no te pueden preguntar en vivo**.
Por eso el clarify se resuelve **una sola vez, acá, en el loop principal**, antes de disparar nada:
- Recorré las filas del lote y juntá **todas** las preguntas **bloqueantes** que el roadmap (§5 clarify
  log / §4 no-objetivos / §7 gates) no dejó fijadas — lo específico de cada slice (qué familias y
  reglas de la constitución aplican, forma del endpoint/migración/policy, superficie real, criterios de
  éxito ambiguos, y qué le pasa a lo construido si es brownfield).
- Hacé esas preguntas al owner **en bloque** (herramienta de preguntas). No dispares el fan-out con
  ambigüedad bloqueante abierta.
- Consolidá las respuestas en un **bloque de clarify resuelto por SPEC**: eso es lo que le pasás a cada
  subagente en su prompt (además de: ruta del roadmap, su fila ID+título, `depends_on`).

> Lo **no-bloqueante** no frena el fan-out: el subagente toma el default razonable y lo anota; si le
> aparece un bloqueante nuevo, lo deja como `[?]` en la spec y lo reporta (no lo rellena a ciegas).

## Paso 3 — Fan-out: un subagente `spec-author` por SPEC, en capas de dependencia
La mecánica por defecto es **delegar cada SPEC a un subagente con contexto fresco** (Agent tool,
`subagent_type: "spec-author"`) — idea de GSD, presupuesto de contexto. Autorar specs **no** es
implementar, así que el fan-out **no rompe WIP=1** (WIP=1 aplica a la implementación).

**Ordená el lote en capas por `Depende de`** (topológico, respetando el build order de los milestones del PRD):
- **Capa 0** = specs sin dependencias dentro del lote; **capa N** = specs cuyas dependencias están
  todas en capas < N.
- **Dentro de una capa**: disparar **todos** los subagentes **en paralelo** (un `Agent` por fila, en
  un solo mensaje con múltiples tool-calls para que corran concurrentes).
- **Entre capas**: esperar a que la capa anterior termine antes de disparar la siguiente (así una spec
  con `Depende de` ve su prerequisito ya escrito).

A cada subagente le pasás en el prompt: **ruta del roadmap**, **su fila** (ID + título + `depends_on`),
y el **bloque de clarify resuelto** de esa slice (Paso 2.5). El subagente:
- escribe **solo** su `docs/sdd/specs/<ID>-<slug>.md` (10 secciones, §5 completa —familias + una fila
  por regla tocada—, criterios testables, §8 con las 3 capas + fix-plan) siguiendo
  `.claude/agents/spec-author.md`,
- **no toca el roadmap** ni otras specs,
- devuelve un **resumen estructurado** (ID + ruta, status draft/ready, depends_on, familias y reglas
  tocadas, preguntas `[?]` abiertas, superficie real).

> El texto final del subagente NO se le muestra al owner — **releé** cada resumen y quedate con lo que
> importa (specs escritas, `[?]` a resolver, superficies agregadas) para el reporte y la reconciliación.

## Paso 4 — Reconciliar el roadmap (solo el loop principal escribe acá)
Los subagentes **no** tocaron el roadmap; la reconciliación la hacés vos, una vez, al final de cada
capa (o al terminar todo el lote):
- Actualizá la tabla de SPECs (§8): cada fila ahora apunta a su archivo `docs/sdd/specs/<ID>-<slug>.md`
  y queda en `status: draft|ready` (usá el status que devolvió cada subagente — `ready` solo si no dejó
  `[?]` abiertos).
- **Preguntas `[?]` abiertas**: juntá las que reportaron los subagentes y resolvelas con el owner; luego
  cerrá los `[?]` en las specs afectadas (o re-disparás ese subagente con la respuesta). Una spec con
  `[?]` no pasa a `ready`.
- El roadmap sigue siendo el índice/estado canónico; las specs son el detalle. **Sin doble fuente de verdad.**

## Paso 5 — Salida
- N archivos `docs/sdd/specs/<ID>-<slug>.md` (uno por SPEC del lote), cada uno con sus 10 secciones.
- Roadmap con su tabla §8 enlazada a los archivos y `status` actualizado.
- Reporte al owner: qué specs quedaron `ready` vs `draft`, y las `[?]` que faltan resolver.

> **No implementes acá.** `/decompose` produce los contratos; la implementación es la pasada
> siguiente, **una SPEC a la vez** (WIP=1), cada una cerrando con las 3 capas en verde (unit+linter
> → integración/aislamiento → contrato/e2e).
