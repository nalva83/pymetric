---
description: Etapa 1 — de la idea al PRD. Invoca la skill prd-author, que pregunta una vez (un bloque) y escribe docs/prd.md. No hace arquitectura, specs ni código.
argument-hint: "<idea del producto en lenguaje natural>"
---

# /new-prd

Invocá la skill **`prd-author`** (Skill tool) y seguí su doctrina con esta entrada:

**$ARGUMENTS**

- Si la entrada viene vacía, pedí la idea antes de arrancar.
- Corrés en el loop principal (sin subagentes).
- Al terminar, mostrá el resultado en lenguaje llano y ofrecé **`/new-architecture`**.
