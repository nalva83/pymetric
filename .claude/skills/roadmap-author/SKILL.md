---
name: roadmap-author
description: >-
  Convierte un braindump/texto crudo del owner en un ROADMAP sólido del proyecto,
  mediante un interrogatorio socrático: hace preguntas, marca puntos ciegos y ambigüedades, y
  ayuda a CONVERGER en alcance, no-objetivos, riesgos y una descomposición en SPECs. Se activa al
  correr /new-roadmap, cuando el usuario manda una idea/funcionalidad para "armar un plan", cuando hay
  que planear una feature grande antes de escribir specs, o al crear/editar un roadmap en
  docs/sdd/plans/active/. Produce un roadmap (índice + estado) con la plantilla docs/sdd/plans/TEMPLATE.md —
  NO escribe el detalle de cada spec (eso es spec-author vía /decompose). Hace cumplir:
  clarify antes de planear (no asumir), alcance + no-objetivos explícitos (WIP=1, "base primero"),
  gates a nivel feature (las reglas de docs/sdd/constitucion.md), descomposición en SPECs
  atómicas ancladas a los milestones del PRD que entran en contexto fresco (presupuesto de
  contexto, idea de GSD) respetando el build order, y el roadmap como única fuente de estado.
---

# roadmap-author

Skill de la **etapa 1** del flujo SDD: de una idea cruda a un **roadmap sólido**.
No escribe specs ni código: su trabajo es **pensar con el owner** —preguntar, dudar, marcar lo
que no se está viendo— hasta convertir un texto difuso en un plan accionable y descompuesto. Es
el modo **divergente → convergente** (explorar, luego cerrar).

**Dónde encaja:** `roadmap-author` estandariza la **autoría del plan**; `spec-author` (su par)
estandariza la **autoría de cada spec**. El puente es `/decompose`.

```
milestone del PRD  → [roadmap-author /new-roadmap] → roadmap en docs/sdd/plans/active/
(o un braindump)                          │
                              [/decompose] itera spec-author por slice
                                          ▼
                          docs/sdd/specs/<ID>-<slug>.md (una por SPEC)
```

La plantilla canónica del roadmap es **`docs/sdd/plans/TEMPLATE.md`**. La relación
roadmap (`docs/sdd/plans/`) ↔ spec (`docs/sdd/specs/`) está en **`docs/sdd/README.md`**. El alcance
y el orden de construcción maestro (los **milestones**) viven en **`docs/prd.md`**; el diseño, en
la documentación de arquitectura del proyecto; las **reglas innegociables** numeradas y citables, en
**`docs/sdd/constitucion.md`**. Si el plan identifica trabajo que ningún milestone del PRD declara,
**eso es un bug del PRD** — se dice y se arregla ahí, no se planifica desde otro lado.

---

## Cuándo se activa

- Detrás del command **`/new-roadmap`**, y en particular con **`/new-roadmap <n>`** (modo milestone: la
  entrada es el milestone `M<n>` del PRD, no un braindump). Es el uso normal.
- Cuando el usuario manda **una idea/funcionalidad** y pide "armame un plan", "ayudame a definir
  esto", "qué me estoy perdiendo".
- Al **planear una feature grande** antes de escribir specs.
- Al **crear o editar un roadmap** en `docs/sdd/plans/active/`.

---

## Doctrina que hace cumplir

1. **Clarify antes de planear — no asumir.** El primer trabajo es **preguntar**, no redactar. Si
   un requisito es ambiguo, se pregunta; no se rellena con un default silencioso ("pregunta directa
   > asunción"). El plan se cierra cuando las preguntas **bloqueantes** están resueltas.
2. **Marcar los puntos ciegos.** Activamente traer lo que el owner quizás no está viendo: las reglas
   de la constitución que la iteración pueda tocar (aislamiento/permisos, secretos y costo, el loop
   de eventos/decisiones, integridad de datos, etc. — citadas por `#<n>`), además de costos,
   migraciones de datos, dependencias externas y los **riesgos con su techo aceptado del PRD**. Mejor
   incomodar ahora que descubrir en prod.
3. **Alcance + no-objetivos explícitos (WIP=1, "base primero").** Todo roadmap declara qué queda
   **afuera**. Nada se codea/migra hasta que la demanda real lo llame. Sin "ya que estoy".
   Acota para que la iteración sea cerrable.
4. **Gates a nivel feature (la constitución).** El §7 del roadmap lista qué **familias y reglas**
   toca la iteración en conjunto; el detalle por spec va en cada `docs/sdd/specs/<ID>.md §5`. Fuente:
   **`docs/sdd/constitucion.md`** (numera y linkea) + el archivo dueño de cada regla en la
   documentación de arquitectura. La regla se cita por `#<n>`, no se transcribe.
5. **Descomposición en SPECs atómicas, respetando el build order.** El §8 del roadmap parte el trabajo
   en SPECs **testeables, con `Depende de`**, ancladas al milestone del PRD (IDs `M#-##`) y en el orden
   de construcción, repartidas por las capas/servicios reales de tu monorepo, cada una que **entre
   cómoda en un contexto fresco** (presupuesto de contexto, idea de GSD). Si una slice es enorme, se
   vuelve a partir.
6. **El roadmap es el índice/estado (sin doble fuente de verdad).** El roadmap NO contiene el detalle
   de cada spec — lo **referencia**. El estado canónico vive acá; el `status` de cada spec es espejo.
   El roadmap maestro es el PRD; un roadmap de `docs/sdd/plans/` descompone un milestone o feature.
7. **No escribir specs ni código acá.** `roadmap-author` produce el roadmap. El detalle de cada spec es
   trabajo de `spec-author` (vía `/decompose`). La implementación es otra pasada (WIP=1).
8. **Qué le pasa a lo construido (brownfield).** Si el proyecto ya tiene código, **casi nada es
   greenfield**. Al descomponer, marcá a nivel épica qué SPECs son mayormente **renombre / cambio de
   eje** y cuáles **net-new** (se conserva / se renombra / se elimina / net-new). Ayuda a estimar y a
   ordenar. El delta fino por pieza, con evidencia `archivo:línea`, lo hace `spec-author` en §2.
9. **Diseño y alcance no se deciden acá.** Si el braindump obliga a decidir *cómo funciona* algo del
   modelo, eso va a la documentación de arquitectura (archivo dueño, sección `## Abierto`) y el roadmap
   linkea. Si obliga a decidir *si entra* en el alcance, va a `docs/prd.md`. Rige **un hecho, un dueño**.

---

## El flujo (explorar → preguntar → converger → descomponer)

### 1. Ingerir la entrada

**Modo milestone (el normal).** El owner pasa un número o `M<n>`: **la entrada es el
milestone del PRD**, no un braindump. Leer `docs/prd.md` y tomar de ahí objetivo, "por qué acá",
**Definition of Done completa** y "qué le hace al proyecto", más los umbrales y los riesgos
que lleven ese milestone. Cada ítem del DoD es un requisito del roadmap. **No pedir braindump.**

**Modo braindump.** Texto crudo del owner: es una feature dentro de un milestone; identificar cuál
antes de seguir.

En los dos casos, reflejar de vuelta lo entendido en 2–3 frases para confirmar que vamos al mismo
lugar — reflejando el milestone **tal como el PRD lo declara**, sin reinterpretarlo ni recortarlo.
No empezar a planear sobre una mala lectura.

### 2. Interrogatorio (la parte que más valor agrega)
Hacer preguntas concretas, agrupadas, priorizando las **bloqueantes**. En modo milestone, preguntar
**solo lo que el PRD deja ambiguo**: lo que ya declara no se re-discute, se ejecuta. Cubrir como
mínimo:
- **Objetivo y éxito:** ¿qué resultado observable? ¿cómo lo testeamos? ¿qué Definition of Done del
  milestone (PRD) satisface?
- **Alcance / no-objetivos:** ¿qué NO entra en esta iteración? ("base primero")
- **Capas y milestone:** ¿qué capas/servicios de tu monorepo toca (frontend / API / worker / dominio
  compartido / datos / servicios externos)? ¿qué milestone del PRD?
- **Datos y contrato:** ¿necesita un endpoint o callback nuevo? ¿migración y policies de datos? ¿un
  proceso/job nuevo? ¿una superficie de UI?
- **Reglas en juego:** ¿qué familias de la constitución toca, y qué reglas dentro de cada una?
- **Qué le pasa a lo construido:** ¿qué de esto se conserva, se renombra o cambia de eje, se elimina,
  o es net-new? El milestone ya lo resume en su "qué le hace al proyecto".
- **Riesgos / puntos ciegos:** dependencias externas, costos, CVEs, y los riesgos con techo aceptado
  del PRD.
> Usá la herramienta de preguntas cuando una decisión sea genuinamente del owner. No avances con
> ambigüedad bloqueante sin resolver.

### 3. Converger
Con las respuestas, fijar objetivo, alcance, no-objetivos, riesgos y los gates a nivel
feature (familias y reglas de la constitución). Registrar las decisiones en el **clarify log** (§5 del roadmap).

### 4. Descomponer en SPECs
Partir en SPECs atómicas: IDs anclados al milestone (`M#-##`), un título por slice, y el orden vía
`Depende de` (respetando el build order). Feature grande → sub-numeración (`M3-05-1`,
`M3-05-2`, …) + opcional épica índice `<ID>-0` (ver `docs/sdd/README.md`). Verificar que cada slice
entra en un contexto fresco.

### 5. Escribir el roadmap
Copiar `docs/sdd/plans/TEMPLATE.md` → `docs/sdd/plans/active/<slug>.md` y completar las 10 secciones, con la
**tabla de SPECs (§8)** como índice. `status: draft` (o `active` si arranca ya).
En modo milestone: slug **`m<n>-<tema>`**, `milestone: M<n>` en el frontmatter, y `related` empezando
por el ancla del milestone en el PRD. El **§10 referencia el DoD del milestone en vez de
reescribirlo** —`prd.md` es su dueño— y le suma lo propio de la iteración. **Antes de cerrar:
recorrer el DoD del milestone ítem por ítem y verificar que cada uno está cubierto por al menos una
spec del §8.** Un ítem sin spec es un agujero del roadmap, no del PRD.

### 6. Entregar + próximo paso
Devolver el roadmap y ofrecer el puente: **`/decompose`** para autorar todas las specs de la tabla.
No escribir las specs dentro de este skill.

---

## Anti-patterns (rechazar)

- Redactar el plan sin preguntar (asumir requisitos).
- Un roadmap sin no-objetivos, o sin la tabla de SPECs.
- Meter el detalle completo de cada spec dentro del roadmap (eso va en `docs/sdd/specs/`).
- SPECs no atómicas / no testeables, sin `Depende de`, o que ignoran el build order.
- Transcribir el enunciado de una regla en vez de citarla por `#<n>` y linkear su archivo dueño.
- Decidir diseño en el roadmap en vez de en el archivo dueño de la documentación de arquitectura.
- Escribir specs o código en esta etapa (es planear, no ejecutar).
- Cerrar el plan con preguntas **bloqueantes** abiertas.
- **Dejar un ítem del DoD del milestone sin ninguna spec que lo cubra**, o recortarlo: los milestones
  se acortan quitando alcance, nunca DoD.

---

## Outputs

- `docs/sdd/plans/active/<slug>.md` con las 10 secciones (clarify log + tabla de SPECs).
- (Opcional) disparar `/decompose` para autorar las specs de la tabla.

**Gate de cierre:** el roadmap tiene objetivo, alcance + no-objetivos, gates a nivel
feature (familias y reglas), riesgos, y una tabla de SPECs atómicas con `Depende de`; las preguntas bloqueantes están
resueltas en el clarify log.
