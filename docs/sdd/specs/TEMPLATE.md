<!--
Plantilla canónica de SPEC. NO editar esta plantilla para una spec concreta:
copiala a docs/sdd/specs/<ID>-<slug>.md y rellenala.

Toda sección con «— rellenar» es obligatoria. No borres secciones: si una no aplica,
escribí «N/A — <por qué>». Un N/A sin justificación no es un N/A.

Fuente de las reglas de §5: docs/sdd/constitucion.md (numeración canónica).
El detalle de cada regla vive en su archivo de arquitectura del proyecto, linkeado desde ahí.
-->
---
id: <M#-## — el mismo ID que su fila en el roadmap, anclado al milestone del PRD (ej. M1-04)>
title: <imperativo y corto, ej. "Validación de permisos por rol en el endpoint X">
status: draft            # draft → ready → in-progress → done  (canónico = la fila del roadmap)
owner: <quién la ejecuta>
milestone: <M#>
plan_row: docs/sdd/plans/active/<roadmap>.md   # el roadmap donde vive su fila de estado (canónico)
depends_on: []           # [<ids de specs de las que depende>] — vacío = sin dependencias
created: <YYYY-MM-DD>
---

# <ID> · <título>

## 1. Objetivo (qué + por qué)
<1–2 frases. El «qué» observable y el «por qué». Sin solución técnica acá.>

## 2. Contexto (brownfield — qué existe hoy)
<El punto de partida es el estado actual del monorepo. Rellenar:

**Capas que toca:** las capas del monorepo que la spec modifica (frontend, API/backend, worker,
paquetes compartidos, base de datos/migraciones y policies). Ver la topología del proyecto en su
documentación de arquitectura.

**Milestone del PRD y su DoD relacionada:** link a la sección de `docs/prd.md`.

**Archivo de arquitectura que la ancla:** el archivo de arquitectura del proyecto, con la sección exacta.

**Evidencia de lo que hay hoy:** con `archivo:línea`. Sin evidencia no es contexto, es suposición.

**Qué le pasa a lo construido.** Por cada pieza que la spec toca, su categoría:
  · **se conserva** — no se toca
  · **se renombra / cambia de eje** — con su fila de la tabla de renombres
  · **se elimina** — concepto y schema
  · **net-new** — no existe nada equivalente
Marcá `N/A` solo si la spec no toca absolutamente nada de lo existente.>

## 3. Requisitos funcionales
<Lista numerada y verificable. Cada requisito mapea 1:1 a un criterio de aceptación (§7).>
1. …

## 4. No-objetivos (fuera de alcance)
<WIP=1 / sin "ya que estoy" / base primero: qué queda EXPLÍCITAMENTE afuera de esta spec.>
- …

## 5. Gates — las reglas innegociables
<OBLIGATORIO. Fuente: [`../constitucion.md`](../constitucion.md).

**Primero, aplicabilidad por familia.** Una línea por cada familia de reglas de tu constitución:
✅ si la spec toca alguna de sus reglas, o `N/A — <por qué>`. Una familia marcada N/A no se detalla;
una marcada ✅ detalla abajo **una fila por cada regla que toca**.>

| Familia | ¿Aplica? | Si N/A, por qué |
|---|---|---|
| **<Familia>** · <tema> (#<n>–#<n>) | ☐ | |
| … (una fila por cada familia de tu constitución) | ☐ | |

**Detalle — una fila por regla que la spec toca:**

| # | Regla | Cómo se cumple y cómo se verifica **en esta spec** |
|---|---|---|
| #<n> | <enunciado corto> | |

> **Obligatorias por condición** (de [`../constitucion.md`](../constitucion.md)): según lo que la spec
> toque, ciertas reglas son de cita obligatoria — p. ej. toca la DB → las reglas de aislamiento/permisos ·
> escribe con efectos hacia afuera → las reglas de aprobación/eventos · toca claves o credenciales →
> las reglas de secretos · agrega o cambia una entidad de la capa de producto → las reglas de esa capa ·
> agrega superficie de UI → las reglas de lenguaje/UI · siempre → la regla de las 3 capas en verde.
> Fijá el mapeo condición→regla contra tu constitución.
>
> **La regla de las 3 capas no se declara: se demuestra.** Es §8.

## 6. Entregables
<Archivos y artefactos concretos, con rutas reales: migraciones de base de datos, routers y servicios
del backend, grafos y nodos del worker, componentes del frontend, tests.
Si toca al cliente, incluir su superficie de UI. Marcá cada entregable como **nuevo**,
**modificado** o **eliminado**.>
- …

## 7. Criterios de aceptación (testables)
<Uno por línea, binario (pasa / no pasa), etiquetados AC1..ACn y referenciando el requisito de §3
que satisfacen. "El test es el contrato". Sin criterios vagos.
Incluir siempre, donde apliquen: un caso de **no-regresión** y un caso **negativo**
(el acceso que NO debe funcionar, el evento que NO debe emitirse).>
- [ ] **AC1** (R1) …

## 8. Plan de verificación — las 3 capas, en orden
<No se avanza si la capa anterior falla. Ver la disciplina de trabajo en la documentación del proyecto.>

- **1 · Unit + estático (gate):** tests unitarios (backend, worker, paquetes compartidos, frontend) +
  lint y typecheck.
- **2 · Integración y aislamiento (si aplica):** **la suite de aislamiento por tenant/alcance**, y según la
  spec: concurrencia del gate de presupuesto, exactly-once de los jobs, idempotencia de webhooks,
  integraciones reales (base de datos / credenciales / proveedor LLM).
  > **Primero el rojo** (la regla de test-first de la constitución). Se extiende la suite, se ve fallar el
  > test **sin** la policy, y recién después se da la policy por buena. Nunca al revés.
- **3 · Contrato y e2e (si cruza componentes):** script e2e atado a la DoD del milestone en `docs/prd.md`.
- **Evals (si toca calidad de un step LLM o de un agente):** asserts determinísticos primero (bloquean)
  + juez pinneado (alerta).
- **Fix-plan si una capa falla:** por cada AC que pueda fallar, el error típico y el arreglo mínimo,
  escrito **antes** de correr. Diagnosticar → causa raíz → arreglo mínimo → re-correr.

## 9. Definición de hecho (DoD)
- [ ] Entregables de §6 creados / modificados / eliminados.
- [ ] Todos los criterios de §7 en verde, como tests donde corresponda.
- [ ] Gates de §5 cumplidos y **verificados** — no solo declarados.
- [ ] Las 3 capas de §8 en verde, **en orden**.
- [ ] Cierra con su superficie real: el endpoint, el nodo o la vista existen y funcionan de punta a punta.
- [ ] `status` actualizado acá **y** en la fila del roadmap (`plan_row`).
- [ ] Decisión durable registrada en [`DECISIONS.md`](../../../DECISIONS.md), si la hubo.
- [ ] Si la spec cerró una pregunta abierta: marcada como cerrada en la sección `## Abierto` de su
      archivo dueño **sin borrar el texto** — se tacha y se fecha.
- [ ] Sin artefactos de debug; árbol de trabajo limpio.

## 10. Notas de ejecución / presupuesto de contexto
<¿Entra en un contexto fresco o conviene partirla? Si es grande, qué sub-tareas se delegan a
subagentes con contexto limpio manteniendo WIP=1 a nivel spec. Riesgos, dudas para el clarify,
y el link al archivo de arquitectura o al milestone del PRD que la ancla.>
