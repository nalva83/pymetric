---
name: architecture-author
description: >-
  Fija las decisiones técnicas del proyecto y delega el modelo de datos a data-modeler — el rol de
  Arquitecto de la etapa 2 del flujo. Se activa al correr /new-architecture, cuando el usuario dice
  "definí la arquitectura", "modelo de datos", "aislamiento por usuario", "dónde se guardan los
  datos", o cuando hay que bajar el PRD a decisiones de cómo funciona (stack, secretos, integración
  LLM, techo de gasto, deploy). Escribe un docs/arquitectura/<concepto>.md por tema con la plantilla
  docs/arquitectura/TEMPLATE.md ("un hecho un dueño": si re-explicás algo, va un link), marca los
  invariantes MUST/MUST NOT en su archivo y los NUMERA en docs/sdd/constitucion.md (#<n>), hace
  fan-out a data-modeler (Agent tool, subagent_type "data-modeler") para el schema con aislamiento
  por usuario, y cierra toda decisión durable en DECISIONS.md. No decide alcance (eso es docs/prd.md).
---

# architecture-author

Skill de la **etapa 2** del flujo: de un PRD (el *qué* y el orden) a las **decisiones técnicas**
(el *cómo*). El rol es **Arquitecto** — fija stack, aislamiento, secretos, integración del LLM,
techo de gasto y deploy, y **delega el modelo de datos** a `data-modeler`.

**Por qué existe:** sin un dueño del *cómo*, las decisiones técnicas quedan implícitas y se
re-litigan en cada spec; los invariantes de seguridad (aislamiento, secretos, costo, HITL) no
tienen archivo dueño ni número estable para citar. Este skill fuerza que **cada decisión durable
tenga un archivo dueño y una entrada en DECISIONS.md**, y que **cada invariante MUST tenga su
`#<n>`** en la constitución.

**Dónde encaja:** `prd-author` (etapa 1) fija el *qué*; `architecture-author` (etapa 2) fija el
*cómo* sobre ese PRD; `roadmap-author` (etapa 3) descompone. El índice de la arquitectura y su
plantilla viven en **`docs/arquitectura/README.md`** y **`docs/arquitectura/TEMPLATE.md`** (creás
un `<concepto>.md` por tema). Las reglas innegociables numeradas y citables, en
**`docs/sdd/constitucion.md`**. El alcance y el orden los manda **`docs/prd.md`** — no se deciden
acá.

---

## Cuándo se activa

- Detrás del command **`/new-architecture`**. Es el uso normal.
- Cuando el usuario dice **"definí la arquitectura"**, **"modelo de datos"**,
  **"aislamiento por usuario"**, **"dónde se guardan los datos"**.
- Cuando hay que bajar el PRD a decisiones de **cómo funciona** (stack, secretos, LLM, costo,
  deploy).
- Al **crear o editar** un archivo de `docs/arquitectura/`.

---

## Doctrina que hace cumplir

1. **Un archivo por concepto, "un hecho un dueño".** Cada tema es un
   `docs/arquitectura/<concepto>.md` propio, hecho con `docs/arquitectura/TEMPLATE.md`. Si estás
   re-explicando algo que ya vive en otro archivo, **va un link**, no una copia.
2. **Decisión durable → DECISIONS.md; ambigüedad de diseño → `## Abierto`.** Toda decisión que se
   sostiene en el tiempo cierra con una entrada en **`DECISIONS.md`** (el porqué que la
   compactación pierde). Toda ambigüedad de diseño sin resolver va a la sección **`## Abierto`**
   del archivo dueño del concepto — **no a una spec**.
3. **Los invariantes se marcan MUST/MUST NOT y se NUMERAN en la constitución.** Cada regla
   innegociable se enuncia como MUST/MUST NOT **en su archivo dueño** y se le da un número estable
   en **`docs/sdd/constitucion.md`** (se cita por `#<n>`, no se transcribe). En el curso:
   **aislamiento por usuario (#1)**, **secretos/API key fuera del código (#2)**, **techo de gasto
   (#3)**, **HITL en efectos externos (#4)**.
4. **El modelo de datos se DELEGA a data-modeler (fan-out).** El schema no se diseña a mano acá:
   se dispara **`data-modeler`** vía **Agent tool (`subagent_type: "data-modeler"`)**, con el
   requisito de **aislamiento por usuario** explícito. Se consolida su salida al volver.
5. **No decide alcance.** Si estás decidiendo *si entra* algo en el MVP o *cuándo*, eso es
   **`docs/prd.md`**, no la arquitectura. Rige **un hecho, un dueño**.

---

## El flujo (leer PRD → decidir → fan-out → consolidar → reconciliar)

### 1. Leer el PRD
Tomar de `docs/prd.md` el MVP, los milestones y su orden. La arquitectura sirve a ese *qué* — no
lo redefine ni lo recorta.

### 2. Tomar las decisiones técnicas (un archivo por tema)
Escribir un `docs/arquitectura/<concepto>.md` por tema, con `docs/arquitectura/TEMPLATE.md`,
cubriendo como mínimo: **stack**, **aislamiento por usuario**, **secretos/credenciales**,
**integración del LLM**, **techo de gasto** y **deploy**. En cada archivo, marcar los invariantes
como MUST/MUST NOT y dejar en `## Abierto` lo que quede ambiguo.

### 3. Fan-out a data-modeler
Disparar **`data-modeler`** (Agent tool, `subagent_type: "data-modeler"`) para el **modelo de
datos con aislamiento por usuario**. El schema es su entregable; este skill le pasa el contexto
y consolida el resultado.

### 4. Consolidar
Integrar el schema devuelto con el resto de los archivos de arquitectura, resolviendo links
cruzados ("un hecho un dueño") y evitando duplicar hechos entre archivos.

### 5. Reconciliar la constitución
Recorrer `docs/sdd/constitucion.md` y **completar el "Dueño _pendiente_"** de **#1–#4** con el
archivo real recién creado (el `<concepto>.md` dueño de cada invariante). Cada MUST tiene que
quedar con archivo dueño y número.

### 6. Entregar + próximo paso
Registrar las decisiones durables en `DECISIONS.md` y ofrecer el puente: **`/new-roadmap`**.

---

## Anti-patterns (rechazar)

- **Un archivo gigante** con todo mezclado, o re-explicar un hecho que ya tiene dueño en vez de
  linkear.
- **Transcribir el enunciado** de una regla en vez de citarla por `#<n>` y numerarla en la
  constitución.
- Dejar una decisión durable **sin entrada en DECISIONS.md**, o una ambigüedad de diseño metida
  en una spec en vez de en `## Abierto`.
- **Diseñar el modelo de datos a mano** en vez de delegarlo a `data-modeler`.
- Un schema que **no declara aislamiento por usuario**.
- **Decidir alcance** (si entra / cuándo) dentro de la arquitectura — eso es `docs/prd.md`.
- Dejar filas de la constitución (#1–#4) con **"Dueño _pendiente_"** después de crear los archivos.

---

## Outputs

- `docs/arquitectura/*.md` — un archivo por tema (stack, aislamiento, secretos, LLM, costo,
  deploy), cada uno con sus MUST/MUST NOT y su `## Abierto`.
- Modelo de datos con **aislamiento por usuario** (entregado por `data-modeler`), consolidado.
- Filas **#1–#4** de `docs/sdd/constitucion.md` con **dueño real** (ya no "pendiente").
- Decisiones durables en `DECISIONS.md`.

**Gate de cierre:** cada invariante MUST tiene archivo dueño y número en la constitución; el
modelo de datos declara aislamiento por usuario; las decisiones durables están en DECISIONS.md.
Próximo paso: **`/new-roadmap`**.
