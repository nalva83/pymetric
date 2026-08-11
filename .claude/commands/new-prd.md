---
description: Etapa 1 del flujo — baja una idea cruda a un PRD chico y accionable. Cablea el skill prd-author. Interroga antes de escribir (clarify > asunción) y converge en UN loop de valor de punta a punta con MVP + milestones (cada uno con DoD testeable) + fuera de alcance. No hace arquitectura ni specs ni código.
argument-hint: "<idea del producto en lenguaje natural, o link a un braindump>"
---

# /new-prd — De la idea al PRD

Etapa 1 del flujo SDD: tomás una **idea cruda** y la bajás a un **PRD** chico y accionable. Cablea el
skill **`prd-author`**, que interroga antes de escribir y converge en **un solo loop de valor de punta
a punta** —no una lista de features— con DoD demostrable y no-objetivos explícitos.
**No** hace arquitectura, ni specs, ni código.

Entrada: **$ARGUMENTS**

> Si `$ARGUMENTS` viene vacío, pedí la idea (o el link al braindump) antes de arrancar. Sin idea no hay PRD.

Contexto obligatorio: `docs/prd.md` (la **plantilla** que completás) y `docs/sdd/README.md` (el flujo
y dónde encaja el PRD). Regla transversal: **WIP=1** y **"base primero"** — el alcance se acorta
quitando features, nunca el DoD.

---

## Paso 1 — Ingerir la idea
Leé `$ARGUMENTS` (o el braindump linkeado) y devolvé en 2–3 frases qué entendiste: qué es el
producto y a quién sirve. Confirmá antes de avanzar; no planees sobre una mala lectura.

## Paso 2 — Interrogar (clarify > asunción)
Activá el skill **`prd-author`** y hacé preguntas concretas, agrupadas, priorizando las
**bloqueantes**. No rellenes ambigüedad bloqueante con un default silencioso. Cubrí mínimo:
- **Qué hace** — el loop de valor de punta a punta (para el demo: form multi-step de 4 pasos +
  llamada a LLM que devuelve un diagnóstico + URL pública).
- **Para quién** — el usuario y su contexto.
- **Qué problema** resuelve — el dolor concreto.
- **Éxito** — resultado observable y cómo se testea.
- **No-objetivos** — qué NO entra (WIP=1, "base primero").

## Paso 3 — Escribir el PRD
Completá la plantilla `docs/prd.md`: el **MVP** (el loop mínimo de valor), los **milestones** cada
uno con su **DoD testeable**, y el **fuera de alcance** explícito. Sumá riesgos con su techo aceptado.
El PRD es dueño del *qué* y del orden; el *cómo* no se decide acá.

## Paso 4 — Próximo paso
Devolvé el PRD y ofrecé el puente:
- **`/new-architecture`** — deriva la arquitectura desde este PRD.

> **No hagas arquitectura, specs ni código acá.** `/new-prd` produce el *qué*; el *cómo* es la etapa
> siguiente (WIP=1).
