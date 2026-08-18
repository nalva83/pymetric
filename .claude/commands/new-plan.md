---
description: Etapa 3 — del milestone al plan con specs listas para construir. Invoca la skill planner (fusión de roadmap + specs), que pregunta una vez (un bloque), escribe el plan en docs/sdd/plans/active/ y el detalle de cada spec en docs/sdd/specs/. No implementa código.
argument-hint: "<M# o braindump de la feature>"
---

# /new-plan

Invocá la skill **`planner`** (Skill tool) y seguí su doctrina con esta entrada:

**$ARGUMENTS**

- Si la entrada viene vacía, preguntá qué milestone del PRD planear.
- Con 3 specs o menos, todo corre en el loop principal; con más, la skill delega la autoría en
  paralelo (Agent tool, todos a la vez).
- Al terminar, mostrá la tabla del plan en lenguaje llano y ofrecé el puente: *"construí `<ID>`"*.
