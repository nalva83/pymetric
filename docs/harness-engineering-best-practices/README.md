# Harness Engineering para proyectos con Claude Code

Esta carpeta condensa las mejores prácticas de **Harness Engineering** (ingeniería del entorno que rodea a un agente de código) extraídas del curso *Learn Harness Engineering* y de las fuentes de OpenAI y Anthropic. El objetivo es práctico: **aplicar estas prácticas en los proyectos que hago con Claude Code** para que el agente sea fiable, no solo capaz.

## La idea central en una frase

> Un harness no hace al modelo más inteligente: le construye un sistema de trabajo de circuito cerrado. Cuando algo falla, **revisá el harness antes que el modelo**.

El mismo modelo (mismo prompt, mismas capacidades) produce resultados radicalmente distintos según el entorno que lo rodea. Anthropic lo demostró: misma tarea y mismo Opus, una corrida "pelada" falló en 20 min/$9; con harness completo entregó un producto jugable en 6 h/$200. No cambió el modelo. Cambió el harness.

## El loop del harness

```
        Objetivo claro            Inicialización          Ejecuta la tarea
        (CLAUDE.md)        →      (init / setup)     →     (Claude Code)
                                                                │
                                                                ▼
   Limpieza y handoff   ←   Verificación y QA   ←   Feedback de runtime
   (PROGRESS.md)            (suite de tests)         (CLI / logs)
        │                         │
        └── si pasa: tarea hecha  └── si falla: auto-corrige y reintenta
```

## Las cinco capas de defensa (y dónde atacar cada falla)

Cada vez que el agente falla, atribuí la falla a **una** de estas capas y arreglá esa capa. No digas "el modelo no es suficiente".

| # | Capa | Pregunta que responde | Documento |
|---|------|------------------------|-----------|
| 1 | **Instrucciones / Especificación** | ¿La tarea estaba clara? | [01](01-repositorio-como-fuente-de-verdad.md), [02](02-instrucciones-en-capas.md), [06](06-feature-lists.md) |
| 2 | **Contexto** | ¿El agente tenía la información? | [01](01-repositorio-como-fuente-de-verdad.md), [03](03-estado-entre-sesiones.md) |
| 3 | **Entorno / Ejecución** | ¿El entorno era reproducible? | [04](04-inicializacion-del-proyecto.md) |
| 4 | **Feedback / Verificación** | ¿Había forma de verificar? | [07](07-verificacion-y-definicion-de-hecho.md), [08](08-observabilidad-y-evaluacion.md) |
| 5 | **Estado** | ¿Se perdió el estado entre sesiones? | [03](03-estado-entre-sesiones.md), [09](09-handoff-y-limpieza.md) |

## Mapa de la documentación

| Documento | De qué trata |
|-----------|--------------|
| [00 — Fundamentos y diagnóstico](00-fundamentos-y-diagnostico.md) | Por qué fallan los modelos fuertes, qué es un harness (5 subsistemas), el loop de diagnóstico. |
| [01 — El repositorio como fuente de verdad](01-repositorio-como-fuente-de-verdad.md) | "El repo ES la spec". Fresh session test, principios ACID, dónde vive el conocimiento. |
| [02 — Instrucciones en capas](02-instrucciones-en-capas.md) | CLAUDE.md como router, no enciclopedia. Evitar el archivo gigante. "Lost in the middle". |
| [03 — Estado entre sesiones](03-estado-entre-sesiones.md) | PROGRESS.md, DECISIONS.md, checkpoints de git, ansiedad de contexto, clock-in/clock-out. |
| [04 — Inicialización del proyecto](04-inicializacion-del-proyecto.md) | La inicialización como fase dedicada. Startup readiness checklist. Empezar desde plantilla. |
| [05 — Límites de tarea (WIP=1)](05-limites-de-tarea-wip1.md) | Una tarea a la vez. Evidencia de finalización ejecutable. No "ya que estoy, refactorizo". |
| [06 — Feature lists](06-feature-lists.md) | El feature list como primitiva del harness. Trío comportamiento + verificación + estado. |
| [07 — Verificación y definición de hecho](07-verificacion-y-definicion-de-hecho.md) | Evitar declarar victoria temprano. Tres capas de verificación. Solo el pipeline completo cuenta. |
| [08 — Observabilidad y evaluación](08-observabilidad-y-evaluacion.md) | Runtime observable. Separar quien hace de quien revisa. Sprint contracts, rúbricas, subagentes. |
| [09 — Handoff y limpieza](09-handoff-y-limpieza.md) | Estado limpio al cerrar cada sesión. Cleanup loop, quality document, simplificar el harness. |
| [plantillas/](plantillas/) | Archivos listos para copiar: CLAUDE.md, feature_list.json, PROGRESS.md, DECISIONS.md, checklists. |

## Cómo empezar a aplicar esto (orden recomendado de mayor ROI)

1. **Poné un `CLAUDE.md` en la raíz** con overview, comandos de ejecución y comandos de verificación. Es el paso de mayor retorno (doc [01](01-repositorio-como-fuente-de-verdad.md) y [02](02-instrucciones-en-capas.md)). Plantilla: [`plantillas/CLAUDE.md`](plantillas/CLAUDE.md).
2. **Definí los comandos de verificación** (tests, lint, typecheck, e2e) y la "Definición de Hecho" (doc [07](07-verificacion-y-definicion-de-hecho.md)). Es el subsistema de menor inversión y mayor retorno.
3. **Agregá un feature list** machine-readable (doc [06](06-feature-lists.md)). Plantilla: [`plantillas/feature_list.json`](plantillas/feature_list.json).
4. **Agregá persistencia de estado**: `PROGRESS.md` + `DECISIONS.md` (doc [03](03-estado-entre-sesiones.md)).
5. **Adoptá el ciclo de cierre limpio** al final de cada sesión (doc [09](09-handoff-y-limpieza.md)).

> Regla de oro: el harness se pudre como el código. Auditalo periódicamente y pagá la "deuda de harness" igual que la deuda técnica.
