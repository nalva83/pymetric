<!--
Plantilla canónica de ROADMAP. NO editar esta plantilla para un roadmap concreto:
copiala a docs/sdd/plans/active/<slug>.md.

Un roadmap es el ÍNDICE + ESTADO de un conjunto de specs — no su detalle, que vive en
docs/sdd/specs/<ID>-<slug>.md. El alcance del MVP y el orden maestro de milestones viven en docs/prd.md;
un roadmap descompone UN milestone o UNA feature en specs.

Toda sección con «— rellenar» es obligatoria.
-->
---
name: <slug-de-la-iteracion-o-feature>   # ej. m1-auth, m2-billing
title: <título corto y descriptivo>
status: draft            # draft → active → done  (cuando done → mover a docs/sdd/plans/archive/)
milestone: <M# | varios>
owner: <quién lidera>
created: <YYYY-MM-DD>
related: []              # links a la arquitectura del proyecto, docs/prd.md, ../../../DECISIONS.md
---

# <título> — roadmap

## 1. Objetivo (qué + por qué)
<1–3 frases. El resultado de esta iteración y por qué ahora. Atarlo al milestone del PRD.>

## 2. Contexto / problema (brownfield)
<Qué hay hoy en el monorepo, qué duele, qué dispara este trabajo.
Capas que toca: frontend · API/backend · worker · paquetes compartidos · base de datos.
La Definition of Done del milestone en `docs/prd.md` que esta iteración satisface.
A alto nivel, qué specs son mayormente **renombre / cambio de eje** y cuáles **net-new**.
El detalle por pieza lo hace cada spec en su §2.>

## 3. Alcance
<Qué entra, a alto nivel. No el detalle de cada spec.>
- …

## 4. No-objetivos (fuera de alcance)
<Qué NO entra, para no desbordar la iteración. Base primero; WIP=1 a nivel spec.
Si algo de acá está en `docs/prd.md` §5 "Fuera de alcance", linkealo en vez de re-argumentarlo.>
- …

## 5. Preguntas abiertas / decisiones (clarify log)
<Dudas resueltas con el owner durante el clarify, y las que quedan abiertas, marcando cuáles
bloquean. Una pregunta sin responder no debería bloquear una spec que ya depende de ella.
Si la pregunta ya vive en la sección `## Abierto` de un archivo de arquitectura, linkeala —
no la dupliques: resolvela allá y dejá acá el puntero.>
- [x] <pregunta resuelta> → <decisión> → registrada en `DECISIONS.md` el <fecha>
- [ ] <pregunta abierta> → <quién la resuelve / cuándo> → ¿bloquea? sí/no

## 6. Riesgos / puntos ciegos
<Lo que puede salir mal o lo fácil de no ver. Cada riesgo con su **techo aceptado** o su mitigación.
Fuentes: `docs/prd.md` §riesgos · la documentación de arquitectura del proyecto.
Candidatos habituales: migraciones destructivas, **RLS sobre el eje nuevo (falla silenciosa)**,
dependencia de servicios externos, costos de tokens y gate de presupuesto, indexado que falla en silencio.>
- …

## 7. Gates a nivel feature
<Qué reglas de `docs/sdd/constitucion.md` toca esta iteración **en conjunto**. El detalle por spec
va en el §5 de cada una. Acá alcanza con los números y una línea de por qué.>
- **#<n>** — <por qué la toca esta iteración>

## 8. SPECs — el índice (fuente canónica del estado)
<Una fila por spec atómica. IDs anclados al milestone: `M#-##`. Una feature grande se sub-numera
(`M2-05-1`, `M2-05-2`, …) y el orden se codifica con `Depende de`, no con la posición en la tabla.
Si el roadmap cubre un milestone entero: **cada ítem de su DoD en `docs/prd.md` tiene que estar
cubierto por al menos una fila de esta tabla.** Un ítem sin spec es un agujero del roadmap.>

| ID | SPEC | Estado | Depende de | Archivo |
|---|---|---|---|---|
| <M#-##> | <título corto> | ⬜ draft | — | `docs/sdd/specs/<ID>-<slug>.md` |

> Estados: ⬜ draft · 🟡 ready · 🔵 in-progress · ✅ done.
> **Esta tabla es el estado canónico.** El `status` del frontmatter de cada spec es un espejo.

## 9. Orden de ejecución sugerido (WIP=1)
<La secuencia respetando dependencias y el orden del PRD. Una spec a la vez.>
1. …

## 10. Definición de hecho de la iteración
- [ ] Todas las specs del §8 en ✅, cada una con su DoD y sus 3 capas en verde.
- [ ] La Definition of Done del milestone en `docs/prd.md` está satisfecha para lo que cubre esta iteración.
- [ ] Toda pregunta del §5 está resuelta, o explícitamente diferida con fecha y dueño.
- [ ] Decisiones durables registradas en `../../../DECISIONS.md`.
- [ ] Este roadmap movido a `docs/sdd/plans/archive/`.
