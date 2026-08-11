# 00 — Fundamentos y diagnóstico

## Por qué un modelo fuerte no garantiza ejecución fiable

La capacidad del modelo y la fiabilidad de ejecución son dos cosas distintas. Los mejores agentes en SWE-bench Verified rondan un 50-60% de éxito, y eso es sobre tareas seleccionadas, con descripciones claras y tests listos. En tus requerimientos reales —specs vagas, sin tests, reglas de negocio implícitas— la tasa baja todavía más.

Cuando esto pasa, la reacción típica es "el modelo no alcanza, probemos uno más caro". **Casi siempre el problema no es el modelo, es el harness.**

### El experimento que lo prueba

Anthropic corrió la misma tarea ("construir un editor de juego retro 2D"), el mismo modelo (Opus 4.5), dos veces:

| Corrida | Setup | Tiempo | Costo | Resultado |
|---------|-------|--------|-------|-----------|
| 1 | Sin soporte (pelada) | 20 min | $9 | Las features del juego no funcionaban |
| 2 | Harness completo (planner + generator + evaluator) | 6 h | $200 | Juego completamente jugable |

No cambió el modelo. Cambió el entorno. OpenAI lo dice sin rodeos: Codex en un repo bien "harnessed" pasa de **no fiable** a **fiable** — un salto cualitativo, no una mejora marginal.

## Las cinco modos de falla (las cinco capas)

Casi todas las fallas caen en uno de estos cinco patrones. Aprendé a reconocerlos:

1. **Requerimientos vagos** → el agente adivina. "Agregá búsqueda" no dice nada: ¿búsqueda de qué? ¿paginada? ¿con highlights? Un acierto es suerte; un error cuesta varias veces más que haber sido específico.
2. **Convenciones implícitas no escritas** → el agente no puede cumplir lo que nunca vio. (Ej: el equipo usa SQLAlchemy 2.0 pero el agente escribe 1.x por defecto; el OAuth obligatorio solo vive en un Slack de hace 3 meses.)
3. **Entorno incompleto** → el agente gasta su ventana de contexto arreglando `pip install` y versiones de Node en vez de hacer la tarea.
4. **Sin métodos de verificación** → el agente declara "hecho" cuando *siente* que está hecho. Anthropic observó **"ansiedad de contexto"**: cuando el contexto se agota, el agente apura el cierre, salta verificaciones y elige lo simple sobre lo óptimo.
5. **Pérdida de estado entre sesiones** → cada sesión nueva re-explora todo. En tareas de más de 30 min sin estado persistente, la tasa de falla se dispara.

## Vocabulario clave

- **Capability Gap**: la brecha entre el rendimiento en benchmarks y en tareas reales.
- **Harness**: todo lo que está fuera de los pesos del modelo — instrucciones, herramientas, entorno, gestión de estado, feedback de verificación. Si no son pesos del modelo, es harness.
- **Harness-Induced Failure**: el modelo tiene capacidad suficiente, pero el entorno de ejecución tiene defectos estructurales.
- **Verification Gap**: la brecha entre la confianza del agente en su salida y la corrección real. "Estoy listo" cuando no lo está: el modo de falla más común.
- **Diagnostic Loop**: ejecutar → observar la falla → atribuirla a una capa específica → arreglar esa capa → re-ejecutar. Es la metodología núcleo.
- **Definition of Done (Definición de Hecho)**: condiciones verificables por comando (tests pasan, lint limpio, typecheck pasa). Sin una explícita, el agente inventa la suya.

## Qué es un harness, en concreto: cinco subsistemas

Un harness no es un archivo de prompt. Es un sistema de cinco subsistemas; **si falta uno, el harness está incompleto** y el agente "se siente incómodo de usar".

| Subsistema | Qué provee | Artefacto típico en Claude Code |
|------------|-----------|----------------------------------|
| **Instrucciones** | Overview, stack, comandos, constraints duros, links a docs | `CLAUDE.md` + `docs/` |
| **Herramientas** | Acceso suficiente (shell, archivos, tests). Mínimo privilegio, pero no castres el shell. | permisos / settings de Claude Code |
| **Entorno** | Estado auto-descriptivo y reproducible (deps lockeadas, versiones fijadas) | `package.json`, `pyproject.toml`, `.nvmrc`, Docker/devcontainer |
| **Estado** | Tracking de progreso entre sesiones | `PROGRESS.md`, `DECISIONS.md`, commits |
| **Feedback** | Comandos de verificación explícitos | `make check`, hooks, suite de tests |

> El subsistema de **feedback** suele ser el de **menor inversión y mayor retorno**. Si solo vas a hacer una cosa, hacé que los comandos de verificación sean correctos y estén en `CLAUDE.md`.

## El loop de diagnóstico en la práctica

Cuando algo falla, no lo trates como "el modelo es tonto de nuevo". Tratalo como una señal de que tu harness tiene un defecto estructural:

1. **Atribuí** la falla a una de las cinco capas (no a "el modelo").
2. **Arreglá** esa capa.
3. **Registrá**: por tarea, ¿éxito o falla? ¿qué capa la causó? Un log simple alcanza.
4. Tras unas rondas verás qué capa es el cuello de botella y dónde enfocar.

### Test de exclusión de variable controlada (ablation)

Para cuantificar el valor de cada subsistema: fijá el modelo y quitá los subsistemas **de a uno**, midiendo qué eliminación causa la mayor caída. Eso te dice qué componente aporta más *hoy*. Pero el ablation por sí solo no localiza el cuello de botella real: para eso necesitás registros de fallas y atribución de causa raíz. Conforme los modelos mejoran, algunos componentes dejan de ser críticos, pero siempre emergen nuevos.

## Conclusiones

- Capacidad ≠ fiabilidad. Hasta un purasangre necesita buen arnés.
- Cuando algo falla, **revisá el harness primero**. Cambiar de modelo es la opción más cara y rara vez es el problema.
- Cada falla es una señal de un defecto estructural: encontralo y arreglalo para no fallar igual dos veces.
- Trabajá las cinco capas sistemáticamente.
- **Un solo `CLAUDE.md` puede rendir más que upgradear a un modelo más caro.** No es chiste.

> Ver también: [01 — El repositorio como fuente de verdad](01-repositorio-como-fuente-de-verdad.md) y la plantilla [`plantillas/CLAUDE.md`](plantillas/CLAUDE.md).
