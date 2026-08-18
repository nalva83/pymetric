---
description: Etapa final — el control "listo para publicar". Despacha en paralelo a deploy-engineer (checklist técnico + costo) y ux-reviewer (que no parezca prototipo) y consolida un veredicto go/no-go. No despliega; el deploy real es un paso aparte.
argument-hint: "[entorno, ej: prod]"
---

# /deploy-check

Control previo a publicar. Entorno: **$ARGUMENTS** (vacío = `prod`, decilo explícito).

1. **Despachá dos subagentes en paralelo** (Agent tool, en el mismo mensaje):
   - **`deploy-engineer`** — el checklist "listo para publicar" completo, incluidos API key segura
     y techo de gasto. Pasale el entorno.
   - **`ux-reviewer`** — que la app se pueda publicar sin vergüenza. Saltealo si ya corrió sobre
     este mismo código en esta sesión (no repetir la pasada).
2. **Consolidá un solo veredicto** en lenguaje llano: **GO** solo si todo está ✅; **NO-GO** si hay
   al menos un ❌, listando qué falta para pasarlo.

> No despliegues si hay un ❌. Aun con GO, el deploy real (ej. `vercel --prod` o `git push`) es un
> paso aparte que confirma el owner.
