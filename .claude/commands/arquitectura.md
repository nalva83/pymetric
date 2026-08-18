---
description: El CÓMO técnico — del PRD a las decisiones. Invoca la skill architecture-author, que escribe un documento por tema en docs/arquitectura/ y numera las reglas en la constitución. Sin subagentes. No decide alcance ni implementa.
argument-hint: "[indicaciones técnicas, o vacío = derivar del PRD]"
---

# /arquitectura

Invocá la skill **`architecture-author`** (Skill tool) y seguí su doctrina con esta entrada:

**$ARGUMENTS**

- Si la entrada viene vacía, derivá los temas de `docs/prd.md`. Si no hay PRD, primero `/prd`.
- Corrés en el loop principal (sin subagentes).
- Al terminar, mostrá las decisiones en lenguaje llano y ofrecé **`/roadmap`**.
