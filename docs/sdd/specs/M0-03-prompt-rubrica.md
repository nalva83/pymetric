---
id: M0-03
title: "Prompt/rúbrica de diagnóstico (el criterio, español neutro) — coherencia con el input de prueba fijo"
status: ready            # draft → ready → in-progress → done  (canónico = la fila del roadmap)
owner: Damián
milestone: M0
plan_row: docs/sdd/plans/active/m0-esqueleto-llm.md
depends_on: [M0-02]
created: 2026-08-11
---

# M0-03 · Prompt/rúbrica de diagnóstico — el criterio, en español neutro

## 1. Objetivo (qué + por qué)
Entregar el **criterio de diagnóstico** — el system prompt / rúbrica que convierte las 4 respuestas en un
veredicto **útil, honesto y accionable**: qué significa "encaja como *AI App*" y cómo se asigna el grado
(alto/medio/bajo), cómo se elige el **primer módulo a construir** y cómo se identifica el **principal
riesgo**. Es el **activo diferencial** del producto ([`prd.md §1`](../../prd.md)): sin un criterio que
produzca diagnósticos que valgan la pena, la cañería de M0-02 devuelve forma sin sustancia. Cierra la
**coherencia** de DoD·4 de M0 (la forma fija ya la garantiza M0-02).

## 2. Contexto (brownfield — qué existe hoy)
**Capas que toca:** **API/backend** — sólo el **contenido del prompt/rúbrica** dentro del Route Handler
`app/api/diagnostico/route.ts` (o su módulo de prompt hermano) que creó M0-02. **No** toca la cañería, el
esquema de salida, la validación de entrada ni el mapeo de errores (todo eso es M0-02, se conserva). No toca
frontend (M1/M2) ni base de datos (no existe, por diseño — [`modelo-de-datos.md`](../../arquitectura/modelo-de-datos.md)).

**Milestone del PRD y su DoD:** M0 — [`prd.md §4 · M0`](../../prd.md). Esta spec cubre la **parte de
coherencia de DoD·4** ("con un input de prueba fijo, el diagnóstico devuelto es coherente"). La parte de
**forma fija** de DoD·4 ya la cierra M0-02 (esquema `generateObject`).

**Archivo de arquitectura que la ancla:** [`integracion-llm.md §1`](../../arquitectura/integracion-llm.md) —
"El prompt/rúbrica **es el activo**": el system prompt que define el criterio vive en el código del endpoint,
versionado; idioma de salida **español neutro**; el contrato de salida estructurada (`{ encaje: {grado,
explicacion}, primer_modulo, principal_riesgo }`) es de M0-02. Forma fija del diagnóstico y su idioma:
[`prd.md §3.1`](../../prd.md). Principio "honesto antes que halagador": [`prd.md §2` (principio 4)](../../prd.md)
y riesgo #2 ([`prd.md §6`](../../prd.md)).

**Evidencia de lo que hay hoy:**
- M0-02 ([`M0-02-endpoint-diagnostico.md`](M0-02-endpoint-diagnostico.md)) deja explícito un **placeholder**:
  entregable "Prompt mínimo suficiente (placeholder, español neutro) para producir la forma fija — **nuevo**
  (lo reemplaza M0-03)" (§6) y frontera "el prompt de esta spec es un placeholder mínimo suficiente… no se
  evalúa su calidad acá" (§10). M0-02 **no verifica coherencia** (su §8 · Evals: "N/A — la calidad/coherencia
  del diagnóstico es M0-03").
- El esquema de salida, los errores tipados (`presupuesto_agotado` | `timeout` | `fallo_llm`), el timeout 20 s
  y la lectura de `OPENAI_API_KEY` de env ya existen y se dan por buenos (M0-02 §3, §6).
- No existe todavía ninguna suite de **evals** ni fixtures de ideas de prueba: son net-new de esta spec.

**Qué le pasa a lo construido:**
- Prompt/rúbrica de diagnóstico (el criterio real, español neutro) en el módulo de prompt del endpoint →
  **se renombra / cambia de eje**: reemplaza el contenido del placeholder mínimo de M0-02 (misma ubicación,
  contenido nuevo — no es una API nueva).
- Esquema de salida, validación de entrada, errores tipados, timeout, lectura de la key → **se conserva** (M0-02).
- Fixtures de ideas de prueba (≥1 fuerte, ≥1 débil) → **net-new**.
- Suite de evals (asserts determinísticos + juez pinneado) → **net-new**.
- Ninguna store de datos de negocio → **N/A** (no se agrega; garantía de `#1`/`#6`).

## 3. Requisitos funcionales
1. Se entrega el **system prompt / rúbrica de diagnóstico** en **español neutro**, versionado en el código del
   endpoint (reemplaza el placeholder de M0-02). Codifica el **criterio**: (a) qué significa "encaja como AI
   App" y cómo se asigna el **grado** (alto/medio/bajo); (b) cómo se elige el **primer módulo a construir** (el
   único componente por el que conviene empezar); (c) cómo se identifica el **principal riesgo** (el riesgo #1
   que puede hundir la idea). No re-define la cañería, el esquema ni los errores (son de M0-02).
2. **Coherencia (DoD·4):** dado un input de prueba fijo válido, el diagnóstico es **coherente con lo
   ingresado** — cada una de las 3 partes **referencia/alinea con el contenido específico** del input (no es
   genérico ni intercambiable entre ideas distintas), `grado ∈ {alto, medio, bajo}`, las 3 partes no vacías,
   en español neutro.
3. **Honesto antes que halagador** ([`prd.md §2`](../../prd.md) principio 4): la rúbrica **puede** emitir
   "bajo" y justificarlo; una idea **débil** (bajo encaje real como AI App) **no** recibe grado "alto". Un
   criterio que siempre felicita se rechaza.
4. Se definen **1–3 fixtures** de ideas de prueba representativas (≥1 **fuerte** y ≥1 **débil**) como **input
   de prueba fijo** de la spec, con su expectativa de veredicto. Son **ejemplos ilustrativos** de la spec, no
   un requisito de producto ni un input canónico fijado por el owner.
5. El prompt/rúbrica **no** instruye al modelo a loguear, volcar ni persistir el contenido del formulario o del
   diagnóstico, y **no introduce ninguna persistencia** (`#6` sigue vigente, heredado de M0-02). No re-abre
   secretos ni el gate de presupuesto (son de M0-01/M0-02).

## 4. No-objetivos (fuera de alcance)
- **La cañería, el esquema de salida, la validación de entrada y los errores tipados** — son de **M0-02**; esta
  spec sólo provee el **contenido del criterio** y verifica coherencia/calidad. No los re-define.
- **UI** (formulario M1; pantalla de resultado + estados M2). M0 se dispara con el input de prueba fijo.
- **Tuning fino del modelo o de costos** más allá de **nombrar** el objetivo < USD 0,05 por diagnóstico
  ([`prd.md §5`](../../prd.md)); la elección/calibración del modelo es de implementación
  ([`integracion-llm.md ## Abierto`](../../arquitectura/integracion-llm.md)).
- **Multi-idioma** más allá de español neutro — fuera de alcance ([`prd.md §7`](../../prd.md)).
- **Gate de presupuesto in-app / secretos** — son de M0-01/M0-02; esta spec no los toca.
- **Persistencia y observabilidad** — fuera del MVP / diferida (roadmap §5); `#6` no se difiere.
- **A/B testing del prompt / panel de tuning** — fuera de alcance sin fecha ([`prd.md §7`](../../prd.md)).

## 5. Gates — las reglas innegociables
Fuente: [`../constitucion.md`](../constitucion.md).

**Aplicabilidad por familia:**

| Familia | ¿Aplica? | Si N/A, por qué |
|---|---|---|
| **A** · Aislamiento y datos (#1, #6) | ✅ | Por `#6`: el prompt/rúbrica **no** debe instruir al modelo a loguear/volcar el contenido ni reintroducir persistencia. `#1` **no se toca** (esta spec no agrega ninguna store; el aislamiento-por-ausencia-de-persistencia lo hereda intacto de M0-02). Ver detalle. |
| **B** · Secretos y costo (#2, #3) | N/A | Esta spec cambia **contenido de prompt**, no lee secretos ni modifica el gate de presupuesto. `#2` (key de env) y `#3` (techo de gasto) los materializan M0-01 (env + tope del proveedor) y M0-02 (mapeo `presupuesto_agotado`); esta spec **no** estrena una llamada paga nueva ni un camino de gasto nuevo — usa el mismo call de M0-02, sin cambios en su gate. El objetivo de costo < USD 0,05 se **nombra** (no se tunea): el prompt se mantiene acotado, sin ser un requisito duro de esta spec (no-objetivo §4). |
| **C** · Control humano / HITL (#4) | N/A | El único efecto es una **inferencia de lectura** que devuelve texto a la misma sesión: sin mail, pago ni publicación, ni ningún write con efecto hacia afuera. `#4` es N/A por diseño en todo el MVP ([`stack-y-deploy.md §2`](../../arquitectura/stack-y-deploy.md)). |
| **D** · Verificación (#5) | ✅ | Hecho = las 3 capas en verde, con foco en la capa de **evals** (asserts determinísticos que bloquean + juez pinneado que alerta). Se demuestra en §8. |

**Detalle — una fila por regla que la spec toca:**

| # | Regla | Cómo se cumple y cómo se verifica **en esta spec** |
|---|---|---|
| [#6](../../arquitectura/modelo-de-datos.md) | Stateless: no persiste ni loguea el payload ni el diagnóstico en store durable. | El prompt/rúbrica es **texto de instrucción al modelo**: no puede introducir persistencia, pero **sí** podría instruir un volcado indebido del contenido. Se cumple: el prompt **no** pide loguear, guardar ni reenviar el contenido; no re-abre la cañería de M0-02. Se verifica: (a) **revisión del texto del prompt** — no contiene instrucciones de logging/volcado/persistencia (AC6); (b) **caso negativo** — el cambio no agrega ningún adaptador de store; los asserts de no-logging de M0-02 (su AC9) siguen en verde (no-regresión, AC7). |
| [#5](../../README.md#lifecycle) | Hecho = las 3 capas en verde, en orden. | No se declara: se demuestra en §8 — unit+estático → integración/**evals** (asserts determinísticos que **bloquean** sobre cada fixture: 3 partes, enum de grado, español, alineación con input, débil ≠ "alto"; **primero el rojo** con un prompt-halago de control) → contrato/e2e del input fijo contra la URL pública (DoD·4). El **juez pinneado** es **alerta**, no gate duro. |

> **Obligatorias por condición** (de [`../constitucion.md`](../constitucion.md)): recibe/produce datos de
> negocio efímeros y agrega texto de instrucción al modelo → `#6` (declarada, revisión del prompt + no-regresión
> de M0-02); siempre → `#5` (§8, capa de evals). **No** maneja secretos ni estrena una llamada paga nueva →
> `#2`/`#3` N/A (heredadas de M0-01/M0-02, sin cambios). **No** ejecuta write con efecto externo → `#4` N/A por
> diseño. **No** agrega store → `#1` no se toca (herencia intacta de M0-02).
>
> **La regla de las 3 capas no se declara: se demuestra.** Es §8.

## 6. Entregables
- **El system prompt / rúbrica de diagnóstico** (español neutro) en el módulo de prompt del endpoint
  (`app/api/diagnostico/` — el módulo que M0-02 dejó como placeholder) — **modificado** (reemplaza el contenido
  del placeholder; misma ubicación, criterio real).
- **Fixtures de ideas de prueba** (≥1 fuerte, ≥1 débil) con su veredicto esperado, como input de prueba fijo —
  **nuevo**.
- **Suite de evals** — asserts determinísticos (3 partes no vacías, `grado ∈ {alto,medio,bajo}`, español,
  alineación con el input / no-genericidad, débil ≠ "alto") **+ juez pinneado** (prompt+modelo fijados que
  puntúan coherencia/calidad y tono honesto → señal de **alerta**) — **nuevo**.
- Helper determinístico reutilizable para las aserciones de alineación/enum/idioma (unit-testeable) — **nuevo**.
- **Superficie real:** el endpoint `POST /api/diagnostico` de M0-02, con el criterio real, devuelve para el
  input de prueba fijo un diagnóstico **coherente** (3 partes alineadas con el input, honesto) — no un
  placeholder. No hay UI en esta spec.

## 7. Criterios de aceptación (testables)
- [ ] **AC1** (R1) Existe el system prompt/rúbrica en **español neutro** versionado en el módulo del endpoint,
  que codifica el criterio (grado alto/medio/bajo + primer módulo + principal riesgo) y **reemplaza** el
  placeholder mínimo de M0-02 (el módulo ya no contiene el prompt-placeholder).
- [ ] **AC2** (R2, #5) **Assert determinístico (bloquea):** para **cada fixture**, la salida trae las **3 partes
  no vacías**, `encaje.grado ∈ {alto, medio, bajo}`, y el texto está en **español**. (Corre en capa 1 con salida
  fijada/mockeada y en capa 2 contra el LLM real.)
- [ ] **AC3** (R2, #5) **Assert determinístico de coherencia/no-genericidad (bloquea):** cada parte **referencia
  elementos del input** (heurística de solapamiento léxico con los campos del payload) **y** dos fixtures
  claramente distintos **no** producen diagnósticos intercambiables (el texto diverge entre inputs distintos —
  no es una respuesta genérica pegada). Un diagnóstico que ignora el input o es idéntico entre fixtures **falla**.
- [ ] **AC4** (R3, #5) **Honesto — assert determinístico (bloquea):** el **fixture débil** recibe
  `grado ∈ {medio, bajo}` (**nunca `alto`**), y la explicación justifica el bajo encaje. **Primero el rojo:**
  un **prompt-halago de control** (que siempre felicita / siempre "alto") hace **fallar** este assert sobre el
  fixture débil; el prompt real lo pasa.
- [ ] **AC5** (R2, R3) **Juez pinneado (alerta, no bloquea):** un juez con prompt+modelo **fijados** puntúa
  coherencia/calidad y **tono honesto** de cada diagnóstico; un puntaje bajo **emite alerta** (no corta el
  build). Sirve de señal de deriva de calidad entre corridas.
- [ ] **AC6** (R5, #6) **Caso negativo (no-logging):** el texto del prompt/rúbrica **no** contiene instrucciones
  de loguear, guardar, reenviar ni persistir el contenido del formulario o del diagnóstico (revisión + chequeo
  automatizable por patrón); el cambio no agrega ninguna store.
- [ ] **AC7** (R1, R5) **No-regresión:** la **forma fija** de M0-02 sigue válida (el objeto valida contra el
  esquema; grado dentro del enum) y los asserts de M0-02 (no-logging AC9, errores tipados) siguen en verde:
  reemplazar el prompt no rompe la cañería ni reintroduce persistencia.

## 8. Plan de verificación — las 3 capas, en orden
- **1 · Unit + estático (gate):** `next build` + `tsc --noEmit` + `eslint`. Unit: (a) el módulo de prompt
  exporta el criterio real, no vacío, en español, y **no** es el placeholder de M0-02 (AC1); (b) los **helpers
  de aserción** (enum de grado, no-vacío, idioma, solapamiento léxico input↔salida, divergencia entre fixtures)
  se testean con salidas **fijadas** (positivas y negativas) — un diagnóstico genérico/vacío/“alto”-para-débil
  hace fallar el helper correspondiente (AC2/AC3/AC4 a nivel unit, sin LLM); (c) chequeo por patrón de que el
  texto del prompt no contiene verbos de logging/persistencia (AC6). Cubre AC1/AC2(fijado)/AC3(fijado)/AC4(fijado)/AC6.
- **2 · Integración y evals:** correr el **LLM real** (`generateObject` con el prompt real, key de env) contra
  **cada fixture**. **Asserts determinísticos que BLOQUEAN:** 3 partes no vacías + enum de grado + español
  (AC2); alineación/no-genericidad (AC3); **fixture débil ≠ "alto"** (AC4). **Primero el rojo (AC4/#5):** se
  corre primero un **prompt-halago de control** que siempre felicita → el assert del fixture débil se ve en
  **rojo**; se restaura el prompt real → verde. Nunca al revés. **Juez pinneado (ALERTA, no gate):** puntúa
  coherencia/calidad y tono honesto (AC5) — un puntaje bajo alerta, no corta. **Aislamiento por tenant → N/A**
  (no hay DB ni datos persistidos; herencia de M0-02); lo que se re-verifica acá es que el prompt **no**
  reintroduce logging del contenido (AC6, no-regresión del AC9 de M0-02). Cubre AC2/AC3/AC4/AC5/AC6.
- **3 · Contrato y e2e:** con el endpoint desplegado sobre la **URL pública de M0-01/M0-02**, disparar el
  **input de prueba fijo** (`POST /api/diagnostico`) y verificar que responde 200 con un diagnóstico **coherente**
  (3 partes alineadas con el input, en forma fija, español) — cierra la **coherencia de DoD·4** de M0
  ([`prd.md §4 · M0`](../../prd.md)). Confirmar que la forma fija de M0-02 sigue intacta (AC7). Cubre AC2/AC3/AC7(e2e).
- **Evals (resumen):** asserts determinísticos **primero y bloquean** (AC2/AC3/AC4, capas 1 y 2); **juez
  pinneado** como señal de **alerta** (AC5). El juez no es gate duro — el veredicto flojo se tolera en el MVP
  (riesgo #2, [`prd.md §6`](../../prd.md)); lo que **no** se tolera es romper la forma fija ni felicitar a una
  idea débil.
- **Fix-plan si una capa falla:**
  - AC2 falla (falta una parte / grado fuera del enum / no-español) → el criterio no está guiando la forma; la
    forma la garantiza el esquema de M0-02, así que revisar que el prompt no pelee con el esquema (p. ej. pide
    prosa libre) y que instruya español neutro explícito; re-correr. Si es la forma en sí → es M0-02, no acá.
  - AC3 falla (diagnóstico genérico / idéntico entre fixtures) → reforzar en la rúbrica el anclaje al input
    (citar qué_hace/para_quién/problema/validación en cada parte); re-correr contra los fixtures divergentes.
  - AC4 falla (fixture débil recibe "alto" / siempre felicita) → **stop**: el criterio no es honesto (contradice
    [`prd.md §2` principio 4](../../prd.md)). Ajustar la rúbrica de asignación de grado para castigar el bajo
    encaje real; re-verificar el rojo del prompt-halago primero. No se cierra hasta que el débil no reciba "alto".
  - AC5 alerta (juez marca baja calidad) → **no bloquea**: registrar la alerta; decidir si se itera el prompt
    antes de M2 (riesgo #2 tiene techo aceptado en el MVP). Anotar en `DECISIONS.md` si se ajusta el criterio.
  - AC6 falla (el prompt instruye volcar/loguear contenido) → **stop** (`#6`): quitar esa instrucción; el
    contenido no se loguea ni persiste. No se avanza hasta el prompt limpio.
  - AC7 falla (reemplazar el prompt rompe la forma / reintroduce persistencia) → revertir al contrato de M0-02;
    el prompt sólo cambia contenido, no cañería; re-correr la suite de M0-02.

## 9. Definición de hecho (DoD)
- [ ] Entregables de §6 creados / modificados.
- [ ] Todos los criterios de §7 en verde, como tests donde corresponda (asserts determinísticos AC2–AC4/AC6/AC7;
      el juez AC5 corre y su alerta queda registrada).
- [ ] Gates de §5 cumplidos y **verificados** — `#6` (prompt sin instrucción de logging + no-regresión del
      no-logging de M0-02); `#5` (las 3 capas, con el rojo del prompt-halago visto primero en AC4).
- [ ] Las 3 capas de §8 en verde, **en orden** (los asserts determinísticos bloquean; el juez alerta).
- [ ] Cierra con su superficie real: `POST /api/diagnostico` devuelve, para el input de prueba fijo, un
      diagnóstico **coherente** (no placeholder) de punta a punta contra la URL pública — coherencia de DoD·4.
- [ ] `status` actualizado acá **y** en la fila del roadmap ([`plan_row`](../plans/active/m0-esqueleto-llm.md) §8).
- [ ] Decisión durable registrada en [`DECISIONS.md`](../../../DECISIONS.md), si la hubo (p. ej. el criterio de
      asignación de grado adoptado, o la elección del modelo del juez pinneado).
- [ ] Si cerró una pregunta abierta de un archivo de arquitectura, marcada como cerrada en su `## Abierto` sin
      borrar el texto (fechada).
- [ ] Sin artefactos de debug (incluido el prompt-halago de control usado para ver el rojo); árbol limpio.

## 10. Notas de ejecución / presupuesto de contexto
- Entra cómoda en un contexto fresco: es contenido de prompt + fixtures + suite de evals sobre el endpoint ya
  construido en M0-02. No requiere partirse.
- **Dependencias:** `depends_on: [M0-02]` — necesita la cañería, el esquema, los errores tipados y la URL
  pública ya vivos. La capa 1 (helpers + revisión del prompt) corre sin LLM; las capas 2 (evals reales) y 3
  (e2e) requieren `OPENAI_API_KEY` en el entorno y el endpoint desplegado.
- **Fixtures propuestos (ilustrativos, no requisito de producto):**
  - **FUERTE** — `que_hace`: "asistente que lee contratos legales y responde preguntas en lenguaje simple,
    señalando cláusulas riesgosas"; `para_quien`: "PyMEs sin abogado in-house"; `problema`: "revisar un
    contrato lleva horas y un abogado es caro; terminan firmando sin entender el riesgo"; `validacion`:
    `un_poco`. *Esperado:* grado alto/medio (núcleo AI-native: comprensión de lenguaje + extracción).
  - **DÉBIL** — `que_hace`: "app para reservar y pagar canchas de fútbol 5 por hora"; `para_quien`: "gente que
    juega los fines de semana"; `problema`: "coordinar por WhatsApp quién reserva es un lío"; `validacion`:
    `no`. *Esperado:* grado **bajo** (marketplace/CRUD de reservas; el núcleo no es IA) — **nunca `alto`** (AC4).
  - *(opcional MEDIO)* — una idea con IA accesoria pero no central, para calibrar el nivel intermedio.
- **[?] no bloqueante (default aplicado):** el owner no fijó **LA** idea canónica de prueba. **Default:** se usan
  los fixtures de arriba como input de prueba fijo de la spec. Si el owner quiere fijar una idea canónica única,
  reemplaza estos fixtures sin cambiar el resto de la spec.
- **Riesgos clave:** (a) **no-determinismo del LLM** — mitigado apoyando los asserts que bloquean en propiedades
  robustas (enum, no-vacío, idioma, débil≠alto) y dejando la coherencia/calidad fina al **juez pinneado como
  alerta**, no como gate; (b) **criterio halagador** (contradice [`prd.md §2` principio 4](../../prd.md)) →
  AC4 con el rojo del prompt-halago primero; (c) **costo por tokens** — el prompt se mantiene acotado; el
  objetivo < USD 0,05 se nombra, no se tunea (no-objetivo §4).
- **Frontera con M0-02:** M0-02 es la cañería + la forma fija (esquema, errores, timeout, key de env); esta spec
  es sólo el **contenido del criterio** y su **coherencia**. Si un fallo es de forma/errores → es M0-02.
- Anclas: [`integracion-llm.md §1`](../../arquitectura/integracion-llm.md) · [`prd.md §1, §2, §3.1, §4·M0, §6`](../../prd.md) ·
  [`modelo-de-datos.md §1.2`](../../arquitectura/modelo-de-datos.md) · [`M0-02-endpoint-diagnostico.md`](M0-02-endpoint-diagnostico.md).
