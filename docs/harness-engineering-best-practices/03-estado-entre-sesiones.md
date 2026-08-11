# 03 — Estado entre sesiones

## El problema

Le pedís a Claude Code que implemente una feature completa. Trabaja 30 min, hace la mayor parte, pero el contexto se agota. Abrís una sesión nueva para continuar y descubrís que no recuerda qué decisiones se tomaron, por qué se eligió la opción A sobre la B, qué archivos ya se modificaron ni en qué estado están los tests. Gasta 15 min re-explorando y puede tomar un enfoque inconsistente con el de antes.

## Las ventanas de contexto no son infinitas

Esto no lo resuelve un upgrade de modelo: aunque la ventana crezca a 1M tokens, las tareas complejas la agotan igual. El agente no solo genera código: entiende codebases, rastrea su historial de decisiones, procesa salida de herramientas y mantiene contexto de conversación. Todo eso crece más rápido que la ventana.

Problema más profundo: la información que produce el agente **no es uniformemente importante**. Los pasos de razonamiento intermedio contienen el **"por qué"** (por qué A en vez de B, por qué esta librería). La salida final solo tiene el **"qué"** (el código). Las estrategias de compactación suelen preservar el "qué" y perder el "por qué": la sesión siguiente ve el código pero no sabe por qué está así, y puede "optimizar" hacia afuera una decisión de diseño deliberada.

### Ansiedad de contexto

Anthropic observó que cuando el agente siente que el contexto se agota, exhibe un **"cierre apurado"**: corre a terminar, salta verificaciones, elige lo simple sobre lo óptimo. Es ansiedad irracional de recursos.

## Conceptos clave

- **State persistence files**: archivos de estado persistido que permiten a una sesión nueva retomar sin ambigüedad. Forma básica: log de progreso, registro de verificación, próximas acciones.
- **Rebuild cost**: el tiempo que una sesión nueva necesita para llegar a un estado ejecutable. Un buen harness lo comprime de 15 min a 3 min.
- **Drift**: la brecha entre lo que el agente entiende y el estado real del repo. Cada borde de sesión introduce drift; sin control, se acumula.
- **Compaction vs. reset**: la compactación resume contexto dentro de la misma sesión (mantiene el "qué", puede perder el "por qué"); el reset abre una sesión nueva reconstruyendo desde el estado persistido (limpio, pero depende de la completitud de los artefactos).

## Herramientas de persistencia de estado

> Tratá al agente como un ingeniero cuya memoria de corto plazo se borra en cada sesión. Antes de "fichar salida", debe anotar lo crítico para que el siguiente turno retome rápido.

### 1. Archivo de progreso (`PROGRESS.md`)

```markdown
# Progreso del proyecto

## Estado actual
- Último commit: abc1234 (feat: add user preferences endpoint)
- Estado de tests: 42/43 pasando (falla test_pagination_edge_case)
- Lint: pasando

## Completado
- [x] Modelo User y migración de DB
- [x] Endpoints CRUD básicos
- [x] Integración del middleware de auth

## En curso
- [ ] Feature de paginación (90% — falla un edge case)

## Problemas conocidos
- test_pagination_edge_case devuelve 500 en resultados vacíos
- Confirmar si los usuarios borrados deben aparecer en listados

## Próximos pasos
1. Arreglar el bug del edge case de paginación
2. Agregar el query param "include deleted users"
3. Actualizar la documentación de la API
```

### 2. Registro de decisiones (`DECISIONS.md`)

No hace falta un documento de diseño detallado, solo "qué decisión, por qué, cuándo":

```markdown
# Decisiones de diseño

## 2026-01-15: Usar Redis para cachear preferencias de usuario
- Razón: alta frecuencia de lectura (cada llamada de API), datos chicos
- Alternativa rechazada: vista materializada en PostgreSQL (la alta frecuencia de cambio no justifica el costo de mantenimiento)
- Constraint: TTL de cache de 5 minutos, invalidación activa al escribir
```

### 3. Commits de git como checkpoints

Commiteá tras completar cada unidad atómica de trabajo. El mensaje explica qué se hizo y por qué. Son snapshots de estado gratis y versionados.

### 4. Rutina de clock-in / clock-out en `CLAUDE.md`

```markdown
## Al iniciar la sesión (fichar entrada)
1. Leer PROGRESS.md para el estado actual
2. Leer DECISIONS.md para las decisiones importantes
3. Correr `make check` para confirmar estado consistente del repo
4. Continuar desde la sección "Próximos pasos" de PROGRESS.md

## Antes de cerrar la sesión (fichar salida)
1. Actualizar PROGRESS.md
2. Correr `make check` para confirmar estado consistente
3. Commitear todo el trabajo completado
```

(El cierre limpio se cubre en profundidad en [09 — Handoff y limpieza](09-handoff-y-limpieza.md).)

## Estrategia mixta: ¿cuándo persistir estado?

No toda tarea necesita reset de contexto:
- **Tareas cortas** (menos de 30 min): se completan en una sesión.
- **Tareas largas** (multi-sesión): requieren archivos de progreso y registro de decisiones.
- **Criterio de decisión:** si una tarea necesita más del **60% de la ventana**, empezá a preparar el handoff.

## Compaction vs. reset, y la dependencia del modelo

- **Compaction**: mantiene continuidad y el agente ve el "qué", pero el "por qué" suele perderse en el resumen. No elimina la ansiedad de contexto: el agente sabe que el contexto fue grande y psicológicamente sigue apurando.
- **Reset**: estado mental limpio, sin ansiedad de "me estoy quedando sin tiempo". Depende de la completitud de los artefactos de handoff.

> Dato clave: el comportamiento varía según el modelo. En modelos donde la ansiedad de contexto es severa, el **reset** es crítico. En modelos más fuertes, la compactación sola alcanza. **El diseño del harness necesita entender el modelo objetivo, no un template único.**

## Aplicación en Claude Code

- Usá `/clear` para hacer reset de contexto limpio entre tareas largas, apoyándote en `PROGRESS.md` + `DECISIONS.md` para reconstruir.
- La compactación automática de Claude Code preserva el "qué"; por eso el "por qué" debe vivir en `DECISIONS.md`, no solo en la conversación.
- Commits frecuentes y descriptivos = checkpoints recuperables incluso tras un reset total.

## Conclusiones

- Las ventanas de contexto son finitas: las tareas largas cruzarán sesiones y perderán información. Es realidad objetiva.
- La solución no es una ventana más grande, es mejor persistencia de estado.
- El rebuild cost es la métrica clave: apuntá a llevar una sesión nueva a estado ejecutable en menos de 3 min.
- Estrategia mixta: tareas cortas en sesión, tareas largas con artefactos estructurados.
