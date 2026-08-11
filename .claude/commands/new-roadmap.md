---
description: De un milestone del PRD (o de un braindump) arma un ROADMAP sólido — te interroga (preguntas + puntos ciegos), converge en objetivo/alcance/no-objetivos/riesgos/gates, y descompone en una tabla de SPECs atómicas (IDs M#-##, ancladas a los milestones del PRD) con la plantilla docs/sdd/plans/TEMPLATE.md. Activa el skill roadmap-author. Es la etapa de roadmap (no escribe specs ni código).
argument-hint: "<n> del milestone — el modo normal. O una idea/texto/link para un roadmap de feature"
---

# /new-roadmap — De un milestone del PRD a un roadmap sólido

Etapa 1 del flujo SDD. Tomás **un milestone del PRD** (o, excepcionalmente, una idea cruda) y,
mediante un **interrogatorio socrático**, lo convertís en un **roadmap** accionable y descompuesto en
SPECs. Cablea el skill **`roadmap-author`**.
**No** escribe el detalle de las specs (eso es `/decompose` → `spec-author`) ni código.

Entrada: **$ARGUMENTS**

Contexto a tener presente: `docs/prd.md` (**la fuente del alcance y del orden** — los milestones
con su Definition of Done), `docs/sdd/README.md` (proceso + relación roadmap↔spec),
`docs/sdd/constitucion.md` (las reglas numeradas y sus familias) y la documentación de arquitectura
del proyecto (el diseño, un archivo por tema). Si el plan identifica trabajo que ningún milestone del
PRD declara, **el bug es del PRD** — decilo y no planifiques desde otro lado.
Regla transversal: **WIP=1** y **"base primero"**.

---

## Paso 0 — Resolver la entrada

**Modo milestone (el normal).** Si `$ARGUMENTS` es un número, o `M<n>`, o el nombre de un
milestone: la entrada **es el milestone del PRD**. Leé `docs/prd.md` y tomá de ahí su **objetivo**,
su **"por qué acá"**, su **Definition of Done completa** (cada ítem es un requisito del roadmap, no
una sugerencia) y su **"qué le hace al proyecto"**. Sumá los umbrales y los riesgos que
lleven ese milestone. **No pidas braindump**: ya lo tenés.

**Modo braindump.** Si `$ARGUMENTS` es texto libre, es un roadmap de feature dentro de un milestone:
identificá a cuál pertenece antes de seguir. Si viene vacío, pedí el braindump o el número de
milestone antes de arrancar.

## Paso 1 — Ingerir y reflejar
Devolvé en 2–3 frases qué entendiste (objetivo + alcance tentativo). En modo milestone, reflejá **el
milestone tal como el PRD lo declara** — no lo reinterpretes ni lo recortes. Confirmá antes de
avanzar; no planees sobre una mala lectura.

## Paso 2 — Interrogar (lo que más valor agrega)
Hacé preguntas concretas, agrupadas, priorizando las **bloqueantes**. En modo milestone, preguntá
**solo lo que el PRD deja ambiguo** — lo que ya declara no se re-discute, se ejecuta. Cubrí mínimo:
- **Objetivo y éxito:** resultado observable + cómo lo testeamos + qué Definition of Done del milestone (PRD) satisface.
- **Alcance / no-objetivos:** qué NO entra (WIP=1, "base primero").
- **Capas/milestone:** qué capas/servicios de tu monorepo toca (frontend / API / worker / dominio compartido / datos / servicios externos); qué milestone del PRD.
- **Contrato/datos:** ¿un endpoint o callback nuevo? ¿migración y policies de datos? ¿un proceso/job nuevo? ¿una superficie de UI?
- **Qué le pasa a lo construido:** se conserva / se renombra o cambia de eje / se elimina / net-new. El milestone ya lo dice en su "qué le hace al proyecto".
- **Reglas en juego** (qué familias y qué reglas `#<n>` de la constitución toca) y **riesgos/puntos ciegos** (PRD).

Marcá activamente lo que el owner quizás **no está viendo**. Usá la herramienta de preguntas cuando
la decisión sea genuinamente suya. No sigas con ambigüedad bloqueante.

## Paso 3 — Converger
Fijá objetivo, alcance, no-objetivos, riesgos y gates a nivel feature (familias y reglas de la
constitución). Registrá las decisiones en el **clarify log** (§5 del roadmap). Si una decisión es de
*arquitectura*, va a la sección `## Abierto` de su archivo dueño y el roadmap deja el puntero; si es
durable, cierra con una entrada en `DECISIONS.md`.

## Paso 4 — Descomponer en SPECs
Partí en SPECs atómicas y testeables: ID anclado al milestone (`M#-##`), título por slice y orden
con `Depende de` (respetando el build order, repartidas por las capas/servicios reales de tu monorepo).
Feature grande → sub-numeración (`M3-05-1`, …) + opcional épica índice `<ID>-0`
(ver `docs/sdd/README.md`). Chequeá que cada slice **entre en un contexto fresco**
(presupuesto de contexto, idea de GSD).

## Paso 5 — Escribir el roadmap
Copiá `docs/sdd/plans/TEMPLATE.md` → `docs/sdd/plans/active/<slug>.md` y completá las 10 secciones, con la
**tabla de SPECs (§8)** como índice. `status: draft` (o `active` si arranca ya).
En modo milestone: el slug es **`m<n>-<tema>`**, el frontmatter
lleva `milestone: M<n>` y `related` empieza por el ancla del milestone en el PRD. El §10 (definición
de hecho) **referencia el DoD del milestone en vez de reescribirlo** —`prd.md` es su dueño— y le suma
lo propio de la iteración; y cada ítem del DoD tiene que estar cubierto por al menos una spec del §8.

## Paso 6 — Próximo paso
Devolvé el roadmap y ofrecé el puente:
- **`/decompose docs/sdd/plans/active/<slug>.md`** — autora todas las specs de la tabla.

> **No escribas las specs ni implementes acá.** `/new-roadmap` produce el plan; el detalle de cada spec
> y la implementación son pasadas posteriores (WIP=1).
