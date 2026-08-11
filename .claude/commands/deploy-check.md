---
description: Etapa 7 del flujo — el gate "listo para producción" antes de publicar. Despacha el agente deploy-engineer para correr el checklist (3 capas #5, secretos #2, techo #3, HITL #4, env de prod, build, migraciones, URL), suma sub-chequeos de cost-guardian y ux-reviewer, y consolida un go/no-go. NO despliega si el checklist está en rojo; el deploy real al proveedor es un paso aparte.
argument-hint: "[entorno, ej: prod]"
---

# /deploy-check — Gate "listo para producción"

Etapa 7 del flujo SDD: antes de publicar, corrés el **checklist de deploy** y consolidás un
**go/no-go**. Cablea el agente **`deploy-engineer`**, que verifica el estado real del repo contra el
DoD de deploy. **No** despliega: produce el veredicto; el deploy real al proveedor es un paso aparte.

Entrada: **$ARGUMENTS** (el entorno; por defecto `prod`)

> Si `$ARGUMENTS` viene vacío, asumí **`prod`** y decilo explícito antes de correr el checklist.

Contexto obligatorio: `docs/prd.md` (el **DoD de deploy** del milestone), `CLAUDE.md` (el **gate** de
verificación del proyecto) y `docs/sdd/constitucion.md` (las reglas **#2/#3/#4/#5**, citadas por
`#<n>`, nunca transcritas).

---

## Paso 1 — Despachar el `deploy-engineer`
Delegá el checklist a un subagente con contexto fresco (Agent tool, `subagent_type: "deploy-engineer"`).
Pasale el **entorno** (`$ARGUMENTS` o `prod`). El subagente corre el checklist completo —gate de las 3
capas (#5), secretos fuera del repo (#2), techo de gasto (#3), HITL en efectos externos (#4), env de
prod, build de producción, migraciones aplicadas, URL accesible— y devuelve **✅/❌ por ítem** +
bloqueadores + veredicto. **Releé** su resumen; su texto no se le muestra al owner.

## Paso 2 — Sub-chequeos en paralelo
Sumá dos miradas especializadas (Agent tool, en el mismo mensaje para que corran concurrentes):
- **`cost-guardian`** — confirma API key en env y techo de gasto activo (**#2 / #3**).
- **`ux-reviewer`** — confirma que la app **no parezca un prototipo** (que se pueda publicar sin vergüenza).

Releé ambos resúmenes y quedate con los ❌ y las observaciones que suman al veredicto.

## Paso 3 — Consolidar el go/no-go
Juntá el checklist del `deploy-engineer` con los sub-chequeos y devolvé **un solo veredicto**:
- **GO** solo si **todo** está en ✅.
- **NO-GO** si hay al menos un ❌: listá los bloqueadores y qué falta para pasarlos.

> **Límites:** NO despliegues si el checklist está en rojo. Y aun con **GO**, el **deploy real** al
> proveedor (Vercel/Railway u otro) es un **paso aparte**, posterior a este gate.
