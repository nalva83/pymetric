---
description: Red de seguridad con Git antes de un cambio grande — la disciplina de "siempre podés volver atrás" del método. Revisa el árbol, ofrece commitear (o stash/branch) los cambios sin guardar, confirma el hash como punto de retorno y explica cómo volver. NO es un agente. NO borra historia, NO hace force-push, NO toca ramas remotas.
argument-hint: "<etiqueta corta del punto, ej: antes-de-conectar-llm>"
---

# /save-point — Tu red de seguridad con Git

Antes de un cambio grande, dejás un **punto de retorno** en Git para poder volver sin miedo. Es la
disciplina de **"siempre podés volver atrás"** del método. **No** es un agente ni cablea un skill: es
una secuencia corta y segura de Git que corrés en el loop principal.

Entrada: **$ARGUMENTS** (la etiqueta del punto)

> Si `$ARGUMENTS` viene vacío, pedí una etiqueta corta (ej: `antes-de-conectar-llm`) antes de seguir:
> el punto de retorno se nombra para poder encontrarlo después.

Contexto obligatorio: el **estado del repo Git** (rama actual + árbol de trabajo).

---

## Paso 1 — Ver el árbol
Corré `git status` (y `git log --oneline -5` para ubicarte). Reportá al owner qué rama es y si hay
cambios sin commitear. Si el árbol está limpio, el punto de retorno ya es el `HEAD` actual: confirmá
su hash y saltá al Paso 3.

## Paso 2 — Guardar los cambios (si los hay)
Si hay cambios sin commitear, ofrecé al owner la opción por defecto:
- **Commit** (recomendado): `git add -A && git commit -m "save point: $ARGUMENTS"`.
- Alternativas si prefiere **no** commitear: `git stash push -u -m "save point: $ARGUMENTS"` (guarda y
  limpia el árbol) o crear una rama de respaldo (`git branch respaldo/$ARGUMENTS`).

Dejá que el owner elija; no asumas por él.

## Paso 3 — Confirmar el hash
Mostrá el **hash** del commit (o del `HEAD`/stash) que queda como punto de retorno. Ese hash es el
ancla: nombralo junto con la etiqueta `$ARGUMENTS`.

## Paso 4 — Explicar cómo volver
Dejá por escrito las dos formas de regresar a ese punto:
- **Mirar sin mover la rama:** `git checkout <hash>`.
- **Volver del todo (descarta lo posterior):** `git reset --hard <hash>`.
Aclará que `reset --hard` descarta el trabajo hecho después del punto.

> **Límites duros:** NO borra historia, NO hace `push --force`, NO toca ramas remotas. `/save-point`
> solo deja el ancla local; volver atrás es una decisión explícita del owner.
