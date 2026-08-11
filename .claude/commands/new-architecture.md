---
description: Etapa 2 del flujo — del PRD a la arquitectura. Cablea el skill architecture-author y hace fan-out a data-modeler para el modelo de datos con aislamiento por usuario. Toma decisiones técnicas escribiendo docs/arquitectura/<concepto>.md y reconcilia las filas #1–#4 de la constitución. No decide alcance (eso es el PRD) ni implementa.
argument-hint: "[tema, o vacío = derivar del PRD]"
---

# /new-architecture — Del PRD a la arquitectura

Etapa 2 del flujo SDD: tomás el **PRD** ya escrito y tomás las **decisiones técnicas** que lo
sostienen. Cablea el skill **`architecture-author`** y hace **fan-out a `data-modeler`** para el
modelo de datos. **No** decide alcance (eso lo manda el PRD) ni implementa código.

Entrada: **$ARGUMENTS**

> Si `$ARGUMENTS` viene vacío, **derivá los temas del PRD** (`docs/prd.md`): cada pieza del MVP que
> necesita una decisión técnica es un tema de arquitectura. Si no hay PRD todavía, primero `/new-prd`.

Contexto obligatorio: `docs/prd.md` (la fuente del alcance), `docs/arquitectura/README.md` +
`docs/arquitectura/TEMPLATE.md` (el mapa concepto→archivo y la plantilla por tema) y
`docs/sdd/constitucion.md` (las reglas numeradas y sus familias). Regla transversal: **WIP=1**.

---

## Paso 1 — Leer el PRD
Abrí `docs/prd.md` y tomá su **MVP**, sus **milestones** y su **fuera de alcance**. Las decisiones
técnicas sirven a ese *qué*; no lo reinterpretes ni lo amplíes.

## Paso 2 — Tomar las decisiones técnicas
Activá el skill **`architecture-author`**. Por cada concepto (de `$ARGUMENTS` o derivado del PRD),
escribí/actualizá `docs/arquitectura/<concepto>.md` copiando `docs/arquitectura/TEMPLATE.md`: la
decisión, su porqué, sus alternativas y su frontera. Un hecho, un archivo dueño.

## Paso 3 — Fan-out: el modelo de datos a `data-modeler`
Delegá el **modelo de datos** a un subagente con contexto fresco (Agent tool,
`subagent_type: "data-modeler"`). Pasale el PRD y los conceptos ya decididos, y pedile el esquema con
**aislamiento por usuario** (regla **#1** de `docs/sdd/constitucion.md`) como requisito de diseño, no
como agregado posterior. El subagente escribe el doc de datos y devuelve su resumen; **releélo** y
quedate con lo que importa (tablas, policies de aislamiento, huecos abiertos).

## Paso 4 — Consolidar y reconciliar la constitución
Consolidá las decisiones (las tuyas + las del `data-modeler`) en `docs/arquitectura/`. Después
**reconciliá las filas #1–#4** de `docs/sdd/constitucion.md`: donde digan "Dueño _pendiente_",
completá con el archivo de `docs/arquitectura/` que ahora es dueño de esa regla. Citá por `#<n>`;
nunca transcribas el enunciado.

## Paso 5 — Próximo paso
Devolvé los archivos de arquitectura escritos y las filas #1–#4 reconciliadas, y ofrecé el puente:
- **`/new-roadmap`** — descompone un milestone del PRD en un roadmap de SPECs.

> **No decidas alcance ni implementes acá.** El alcance es del PRD; la implementación es una pasada
> posterior (WIP=1). `/new-architecture` produce el *cómo*, no el código.
