---
id: M0-02
title: "Route Handler POST /api/diagnostico: contrato de entrada, salida estructurada, errores tipados (#2, #3, #6)"
status: ready            # draft → ready → in-progress → done  (canónico = la fila del roadmap)
owner: Damián
milestone: M0
plan_row: docs/sdd/plans/active/m0-esqueleto-llm.md
depends_on: [M0-01]
created: 2026-08-11
---

# M0-02 · Route Handler `POST /api/diagnostico` — contrato de entrada, salida estructurada, errores tipados

## 1. Objetivo (qué + por qué)
Tender la **cañería del diagnóstico**: un Route Handler `POST /api/diagnostico` que recibe las 4 respuestas
validadas, llama al LLM con **salida estructurada** (`generateObject` + esquema que obliga la forma fija) y
devuelve el diagnóstico de 3 partes **o** un error tipado (`presupuesto_agotado` | `timeout` | `fallo_llm`).
Es la parte de mayor riesgo del PRD ([`prd.md §4 · M0`](../../prd.md)): sin una llamada al LLM que devuelva
la forma esperada y que no se caiga cuando la plata se corta, no hay producto. Esta spec fija el **contrato**
(entrada, salida, errores) y la cañería; la **coherencia** del diagnóstico con el input la cierra M0-03.

## 2. Contexto (brownfield — qué existe hoy)
**Capas que toca:** **API/backend** — un único Route Handler de Next.js (`app/api/diagnostico/route.ts`) en
runtime **Node.js (Fluid Compute)** ([`stack-y-deploy.md §1`](../../arquitectura/stack-y-deploy.md)). No toca
frontend de formulario (M1), ni pantalla de resultado / estados de UI (M2), ni base de datos (no existe, por
diseño — [`modelo-de-datos.md`](../../arquitectura/modelo-de-datos.md)).

**Milestone del PRD y su DoD:** M0 — [`prd.md §4 · M0`](../../prd.md). Esta spec cubre **DoD·2** (endpoint que
recibe las 4 respuestas → diagnóstico de 3 partes), la **parte de runtime de DoD·3** (lee `OPENAI_API_KEY` de
env `#2`; mapea el sobre-límite del proveedor a `presupuesto_agotado` `#3`) y la **parte de forma fija de
DoD·4** (el esquema hace la forma fija un invariante mecánico). La **coherencia** de DoD·4 es M0-03.

**Archivos de arquitectura que la anclan:**
- Dueño de la integración LLM: [`integracion-llm.md §1–§3`](../../arquitectura/integracion-llm.md) —
  `@ai-sdk/openai` + `generateObject` con esquema; invariantes `#2` (key de env) y `#3` (techo de gasto,
  materializado por el límite del proveedor — su `### Resuelto en M0`); contrato de salida y set de errores
  tipados (`presupuesto_agotado` | `timeout` | `fallo_llm`); frontera de latencia (timeout 20 s > p95 15 s).
- Contrato UI→endpoint→UI: [`stack-y-deploy.md §3`](../../arquitectura/stack-y-deploy.md).
- Contrato de datos en tránsito + no-persistencia: [`modelo-de-datos.md §1.2, §1.3, §2`](../../arquitectura/modelo-de-datos.md)
  — payload de entrada, forma del diagnóstico, `#1` por ausencia de persistencia y `#6` stateless/no-log.

**Evidencia de lo que hay hoy:**
- Prerequisito M0-01 ([`M0-01-esqueleto-deploy.md`](M0-01-esqueleto-deploy.md)): scaffold Next.js (App Router,
  TS) desplegado en Vercel con URL pública viva, y `OPENAI_API_KEY` cargada como env var de producción + tope
  USD 5/mes en la plataforma de OpenAI. M0-01 **no** lee la key en runtime ni hace llamadas pagas — eso es esta spec.
- `DECISIONS.md` — "LLM directo a OpenAI (`OPENAI_API_KEY`)" y "Tope de gasto (#3) vía límite del proveedor
  (USD 5/mes)" y timeout 20 s.
- No existe `app/api/diagnostico/route.ts` todavía (M0-01 es sólo shell + config). El endpoint es net-new.

**Qué le pasa a lo construido:**
- Route Handler `app/api/diagnostico/route.ts` (validación de entrada + llamada LLM + mapeo de errores) → **net-new**.
- Esquema de salida estructurada (`generateObject`) → **net-new**.
- Esquema/validación del payload de entrada (4 campos + enum) → **net-new**.
- Prompt mínimo suficiente para producir la forma fija → **net-new** (placeholder; el prompt/rúbrica real es M0-03).
- Scaffold Next.js + env var `OPENAI_API_KEY` de M0-01 → **se conserva** (esta spec se apoya, no lo re-crea).
- Ninguna store de datos de negocio → **N/A** (no se agrega; es la garantía de `#1`/`#6`).

## 3. Requisitos funcionales
1. Existe un Route Handler `POST /api/diagnostico` (Node.js/Fluid Compute) que acepta un body JSON con los 4
   campos del contrato de entrada ([`modelo-de-datos.md §1.2`](../../arquitectura/modelo-de-datos.md)):
   `{ que_hace: string, para_quien: string, problema: string, validacion: "no" | "un_poco" | "si_con_clientes" }`.
2. El endpoint **valida forma/tipos** de la entrada y el **enum** de `validacion`. Un body malformado
   (campo faltante, tipo incorrecto, enum inválido, JSON inválido) → responde un **error tipado de validación**
   con status HTTP de error de cliente (400), **sin** llamar al LLM (caso negativo, sin gasto).
3. Con una entrada válida, el endpoint llama al LLM vía AI SDK **`generateObject`** (`@ai-sdk/openai`) con un
   esquema que **obliga** la forma fija de la salida
   (`{ encaje: { grado: "alto" | "medio" | "bajo", explicacion: string }, primer_modulo: string, principal_riesgo: string }`,
   español neutro) y devuelve ese objeto validado contra el esquema (la forma fija es un invariante mecánico).
4. El endpoint lee la credencial **`OPENAI_API_KEY` desde variables de entorno** (`#2`); nunca de código ni repo.
5. Cuando OpenAI **rechaza por límite/cuota** (el tope USD 5/mes vive en la plataforma del proveedor,
   out-of-band, `#3`), el endpoint **mapea** esa respuesta a un error tipado `presupuesto_agotado` (con status
   de error apropiado) en vez de crashear — el corte de plata produce un estado gracioso, no una pantalla rota.
6. El endpoint **aborta la llamada a los 20 s** y devuelve el error tipado `timeout` (no espera infinita;
   margen sobre el p95 objetivo de 15 s, [`prd.md §5`](../../prd.md)).
7. Cualquier otro fallo del proveedor (respuesta inválida contra el esquema, error de red/servidor del LLM, etc.)
   se mapea al error tipado `fallo_llm` (el endpoint no propaga una excepción cruda al cliente).
8. El endpoint es **stateless**: **no persiste ni loguea** el contenido del payload de entrada ni el diagnóstico
   (PII potencial) en ninguna store durable (disco, DB, cola, log de contenido) (`#6`). No se agrega ninguna
   store de datos de negocio (`#1` por ausencia de persistencia).

## 4. No-objetivos (fuera de alcance)
- **Prompt/rúbrica real** (el criterio de diagnóstico, la coherencia con el input) — es M0-03. Acá va sólo un
  prompt mínimo suficiente para producir la forma fija; **esta spec no verifica coherencia**.
- **UI de formulario de 4 pasos** — es M1. M0 se dispara con un **input de prueba fijo**, no con un form.
- **Pantalla de resultado / estados de carga y error en UI** — es M2. El endpoint devuelve JSON; el render y el
  mapeo error→estado visible es M2.
- **Gate de presupuesto in-app / contador de gasto en código** — resuelto por el tope del proveedor (out-of-band,
  M0-01). Esta spec sólo **mapea** el sobre-límite a `presupuesto_agotado`.
- **Observabilidad rica: id de correlación + logging estructurado** — diferida (roadmap §5). `#6` (no-logging
  del contenido) **sí** es obligatorio acá.
- **Elección/calibración fina del modelo (`gpt-…`) por costo** — de implementación
  ([`integracion-llm.md ## Abierto`](../../arquitectura/integracion-llm.md)); se nombra uno representativo sin
  fijarlo como requisito duro.
- **Persistencia de cualquier tipo** — fuera del MVP por diseño ([`prd.md §7`](../../prd.md)).
- **Rate limiting / anti-abuso fino** — fuera del MVP mientras el techo de gasto sea el corte duro ([`prd.md §6`](../../prd.md)).

## 5. Gates — las reglas innegociables
Fuente: [`../constitucion.md`](../constitucion.md).

**Aplicabilidad por familia:**

| Familia | ¿Aplica? | Si N/A, por qué |
|---|---|---|
| **A** · Aislamiento y datos (#1, #6) | ✅ | El endpoint recibe contenido del usuario (payload) y produce un diagnóstico (PII potencial). Debe ser stateless y no-log (`#6`) y no introducir ninguna store (`#1` por ausencia de persistencia). Ver detalle. |
| **B** · Secretos y costo (#2, #3) | ✅ | Lee `OPENAI_API_KEY` de env (`#2`) y hace la primera **llamada paga** al LLM, mapeando el sobre-límite del proveedor a `presupuesto_agotado` (`#3`). Ver detalle. |
| **C** · Control humano / HITL (#4) | N/A | El único efecto del endpoint es una **inferencia de lectura** (llamada al LLM) que devuelve texto a la misma sesión: no hay mail, pago ni publicación, ni ningún write con efecto hacia afuera. `#4` es N/A por diseño en todo el MVP ([`stack-y-deploy.md §2`](../../arquitectura/stack-y-deploy.md)). |
| **D** · Verificación (#5) | ✅ | Hecho = las 3 capas en verde, en orden. Se demuestra en §8. |

**Detalle — una fila por regla que la spec toca:**

| # | Regla | Cómo se cumple y cómo se verifica **en esta spec** |
|---|---|---|
| [#1](../../arquitectura/modelo-de-datos.md) | Todo dato de negocio acotado a su usuario dueño; ningún acceso cruza usuarios. | Se cumple **por ausencia de persistencia**: esta spec no introduce ninguna store de datos de negocio (DB, cache, archivo). Cada request es efímero e independiente; no hay estado de negocio compartido entre requests. Se verifica: (a) el endpoint no escribe a ninguna store (revisión + test de que dos requests no comparten estado); (b) **caso negativo** — no se agrega ningún adaptador de persistencia (AC8, AC9). |
| [#6](../../arquitectura/modelo-de-datos.md) | Stateless: no persiste ni loguea el payload ni el diagnóstico en store durable. | Se cumple: el handler procesa en memoria y no escribe el contenido del form ni el diagnóstico a disco/DB/cola/log. Se verifica con un **caso** que ejecuta el endpoint con un marcador único en el payload y asegura que ese contenido **no aparece** en los logs de aplicación capturados (AC9, **primero el rojo**: el test falla si el handler loguea el payload). |
| [#2](../../arquitectura/integracion-llm.md) | Secretos desde env / secret manager; nunca en código ni repo. | Se cumple: el handler lee `OPENAI_API_KEY` de `process.env` (cargada en M0-01); ningún literal de key en el código. Se verifica: (a) integración real usa la env var (AC3); (b) **caso negativo** — grep del árbol trackeado por `sk-[A-Za-z0-9]` da limpio (AC10). |
| [#3](../../arquitectura/integracion-llm.md) | Todo consumo de LLM/servicio pago con techo de gasto antes de ejecutar. | El techo (USD 5/mes) vive en la plataforma del proveedor (out-of-band, M0-01 — [`integracion-llm.md ### Resuelto en M0`](../../arquitectura/integracion-llm.md)). Es el invariante de **techo cero** — no se difiere. Esta spec cierra el lado runtime: cuando OpenAI rechaza por límite/cuota, el handler **mapea** a `presupuesto_agotado` en vez de crashear. Se verifica con un test que simula la respuesta de sobre-límite del proveedor y asegura el error tipado `presupuesto_agotado` (AC5). |
| [#5](../../README.md#lifecycle) | Hecho = las 3 capas en verde, en orden. | No se declara: se demuestra en §8 (unit+estático → integración real con OpenAI + aserción de no-logging → contrato/e2e del input fijo). |

> **Obligatorias por condición:** consume un LLM / servicio pago → `#3` (declarada) y maneja credenciales →
> `#2` (declarada); recibe/produce datos de negocio efímeros → `#1`/`#6` (declaradas, por ausencia de
> persistencia + no-log); siempre → `#5` (§8). No ejecuta write con efecto externo → `#4` N/A justificada arriba.
>
> **La regla de las 3 capas no se declara: se demuestra.** Es §8.

## 6. Entregables
- `app/api/diagnostico/route.ts` — Route Handler `POST` (Node.js runtime), con validación de entrada, llamada
  `generateObject`, timeout 20 s y mapeo de errores tipados — **nuevo**.
- Esquema de salida (`generateObject`) que obliga `{ encaje: { grado, explicacion }, primer_modulo, principal_riesgo }`
  (p. ej. con Zod), en el módulo del endpoint o un archivo hermano — **nuevo**.
- Esquema/validador del payload de entrada (4 campos + enum `validacion`) — **nuevo**.
- Prompt mínimo suficiente (placeholder, español neutro) para producir la forma fija — **nuevo** (lo reemplaza M0-03).
- Tipos/unión de errores tipados (`presupuesto_agotado` | `timeout` | `fallo_llm` + error de validación) — **nuevo**.
- Tests: unit de validación de entrada (casos positivos/negativos) + unit de mapeo de errores; integración real
  con OpenAI (objeto válido contra el esquema, key de env, timeout) + aserción de no-logging `#6`; e2e del input
  fijo contra la URL pública — **nuevos**.
- **Superficie real:** el endpoint `POST /api/diagnostico` desplegado sobre la URL pública de M0-01, que dado el
  input fijo de prueba devuelve el diagnóstico de 3 partes en JSON (o un error tipado). No hay UI de cliente en esta spec.

## 7. Criterios de aceptación (testables)
- [ ] **AC1** (R1, R3) `POST /api/diagnostico` con un body válido de los 4 campos responde **200** con un JSON que
  valida contra el esquema de salida: `encaje.grado ∈ {alto, medio, bajo}`, `encaje.explicacion` no vacío,
  `primer_modulo` no vacío, `principal_riesgo` no vacío.
- [ ] **AC2** (R2) **Caso negativo (validación):** para cada body malformado —campo faltante, tipo incorrecto,
  `validacion` fuera del enum, JSON inválido— el endpoint responde **400** con un error tipado de validación y
  **no** llama al LLM (verificable porque el cliente LLM está mockeado y no se invoca → cero gasto).
- [ ] **AC3** (R4, #2) La llamada real usa `OPENAI_API_KEY` leída de `process.env`; sin la env var el endpoint no
  puede llamar y no hay ninguna key literal en el código (cubierto también por AC10). Con la env var presente
  (M0-01), la integración real produce un objeto válido contra el esquema.
- [ ] **AC4** (R3) **Forma fija (invariante mecánico):** el resultado de `generateObject` siempre respeta el
  esquema; una respuesta del modelo que no matchee el esquema **no** se devuelve como éxito — cae a `fallo_llm`
  (AC7), nunca a un 200 con forma rota.
- [ ] **AC5** (R5, #3) **Presupuesto:** simulando la respuesta de **sobre-límite/cuota** de OpenAI, el endpoint
  responde el error tipado **`presupuesto_agotado`** (no una excepción cruda, no un 500 genérico).
- [ ] **AC6** (R6) **Timeout:** cuando la llamada al LLM supera **20 s**, el endpoint aborta y responde el error
  tipado **`timeout`** (verificable con un cliente LLM que demora más que el umbral).
- [ ] **AC7** (R7) **Fallo genérico:** ante un error del proveedor distinto de límite/timeout (error de red/servidor
  o respuesta que no valida contra el esquema), el endpoint responde el error tipado **`fallo_llm`**.
- [ ] **AC8** (R8, #1) **Caso negativo (aislamiento):** el endpoint no introduce ninguna store de datos de negocio;
  dos requests distintos no comparten ni filtran estado (el diagnóstico de un request no aparece en otro).
- [ ] **AC9** (R8, #6) **No-logging (primero el rojo):** ejecutado el endpoint con un marcador único en el payload,
  ese contenido **no** aparece en los logs de aplicación capturados; el diagnóstico tampoco se loguea ni se
  escribe a ninguna store. El test se ve fallar si se agrega un log del payload, y pasa al removerlo.
- [ ] **AC10** (#2) **Caso negativo (secreto):** grep del árbol trackeado por `sk-[A-Za-z0-9]` y por el valor de
  la key da **cero** resultados; la key sólo vive en env.
- [ ] **No-regresión:** la URL pública de M0-01 sigue respondiendo 200 en su ruta base; agregar el endpoint no
  rompe el deploy existente.

## 8. Plan de verificación — las 3 capas, en orden
- **1 · Unit + estático (gate):** `next build` + `tsc --noEmit` + `eslint`. Tests unitarios: (a) validación de
  entrada — positivos y **negativos** (campo faltante / tipo malo / enum inválido / JSON inválido) → 400 sin
  invocar el cliente LLM (mock) (AC2); (b) mapeo de errores tipados con el cliente LLM **mockeado**:
  sobre-límite → `presupuesto_agotado` (AC5), demora > 20 s → `timeout` (AC6), error genérico / objeto que no
  valida contra el esquema → `fallo_llm` (AC4, AC7). **Linter de secretos:** grep `sk-[A-Za-z0-9]` limpio (AC10).
  Cubre AC1(forma)/AC2/AC4/AC5/AC6/AC7/AC10.
- **2 · Integración y aislamiento:**
  - **Integración real con OpenAI:** una llamada real (`generateObject`, key de env) que devuelve un objeto
    **válido contra el esquema** (AC1, AC3) — confirma que la cañería produce la forma fija de punta a punta.
  - **Comportamiento de timeout** contra el umbral de 20 s (con cliente que demora más que el umbral, o test de
    integración con abort) → `timeout` (AC6).
  - **Suite de aislamiento por tenant → N/A** (no hay DB ni datos de negocio persistidos — `#1` por ausencia de
    persistencia, AC8). Lo que sí se verifica acá es la **no-persistencia / no-logging**: con un marcador único
    en el payload, se captura la salida de logs y se asegura que el contenido **no** aparece (AC9).
    > **Primero el rojo (#6):** se agrega un log temporal del payload, se ve el test de no-logging en **rojo**,
    > se remueve el log y recién ahí se da por bueno. Nunca al revés.
  - Cubre AC1/AC3/AC6/AC8/AC9.
- **3 · Contrato y e2e:** con el endpoint desplegado sobre la **URL pública de M0-01**, disparar el **input de
  prueba fijo** (`POST /api/diagnostico`) y verificar que responde 200 con el JSON de 3 partes que valida contra
  el esquema (DoD·2 de M0, [`prd.md §4 · M0`](../../prd.md)); y un caso de error tipado observable desde afuera.
  No-regresión: la ruta base sigue 200. Cubre AC1(e2e)/no-regresión.
- **Evals:** N/A — la **calidad/coherencia** del diagnóstico es M0-03. Esta spec sólo verifica la **forma** (que
  el objeto valide contra el esquema), no el contenido.
- **Fix-plan si una capa falla:**
  - AC2 falla (malformado no da 400 o llama al LLM) → revisar el orden validación→llamada; mover la validación
    **antes** de cualquier invocación paga; re-correr.
  - AC4/AC7 falla (respuesta fuera de forma se devuelve como 200) → asegurar que sólo el resultado validado por
    `generateObject` se serializa como éxito; todo lo demás cae a `fallo_llm`; re-correr.
  - AC5 falla (sobre-límite crashea) → inspeccionar el error de OpenAI (código/tipo de rate/quota); mapear ese
    caso a `presupuesto_agotado` **antes** de propagar; re-correr. `#3` es techo cero — no se difiere.
  - AC6 falla (espera infinita) → agregar `AbortController`/timeout de 20 s alrededor de la llamada; mapear el
    abort a `timeout`; re-correr.
  - AC9 falla (el contenido aparece en logs) → **stop**: es una fuga de PII (`#6`). Quitar el log del contenido,
    dejar sólo logs sin PII, re-capturar y confirmar limpio. No se avanza hasta el log limpio.
  - AC3/AC10 falla (key en código / no lee env) → mover la key a `process.env`; grep limpio; rotar si se filtró.

## 9. Definición de hecho (DoD)
- [ ] Entregables de §6 creados / modificados.
- [ ] Todos los criterios de §7 en verde, como tests donde corresponda.
- [ ] Gates de §5 cumplidos y **verificados** — no sólo declarados (no-logging `#6` con el rojo primero; grep
      limpio `#2`; sobre-límite → `presupuesto_agotado` `#3`).
- [ ] Las 3 capas de §8 en verde, **en orden**.
- [ ] Cierra con su superficie real: `POST /api/diagnostico` existe y responde de punta a punta contra la URL
      pública con el input fijo (200 con la forma fija) y con errores tipados observables.
- [ ] `status` actualizado acá **y** en la fila del roadmap ([`plan_row`](../plans/active/m0-esqueleto-llm.md) §8).
- [ ] Decisión durable registrada en [`DECISIONS.md`](../../../DECISIONS.md), si la hubo (p. ej. si al llamar
      directo a OpenAI se reconfirma "AI Gateway pisado" — roadmap §5, ítem abierto de proveedor/modelo).
- [ ] Si cerró una pregunta abierta de un archivo de arquitectura, marcada como cerrada en su `## Abierto` sin
      borrar el texto (fechada).
- [ ] Sin artefactos de debug; árbol de trabajo limpio.

## 10. Notas de ejecución / presupuesto de contexto
- Entra cómoda en un contexto fresco: es un único Route Handler + su esquema + tests. No requiere partirse.
- **Dependencias:** `depends_on: [M0-01]` — necesita la URL pública viva y `OPENAI_API_KEY` en el entorno para la
  capa 2 (integración real) y la capa 3 (e2e). El unit + el mapeo de errores (capa 1) se pueden correr con el
  cliente LLM mockeado sin depender del deploy.
- **Frontera con M0-03:** esta spec entrega la cañería + la forma fija; el prompt/rúbrica real y la **coherencia**
  del diagnóstico con el input son M0-03. El prompt de esta spec es un placeholder mínimo suficiente para que
  `generateObject` produzca la forma fija — no se evalúa su calidad acá.
- **Discrepancia de nomenclatura resuelta por el clarify:** los nombres de campos del contrato de entrada/salida
  se toman de [`modelo-de-datos.md §1.2`](../../arquitectura/modelo-de-datos.md) en snake_case
  (`que_hace`, `para_quien`, `problema`, `validacion` con enum `no | un_poco | si_con_clientes`; salida
  `encaje.{grado,explicacion}`, `primer_modulo`, `principal_riesgo`, `grado ∈ {alto,medio,bajo}`). El diagrama
  de [`stack-y-deploy.md §3`](../../arquitectura/stack-y-deploy.md) usa camelCase ilustrativo (`queHace`,
  `si_clientes`, `primerModulo`); **manda el contrato de datos en tránsito** de `modelo-de-datos.md`. Default no
  bloqueante; si se quiere unificar el diagrama de `stack-y-deploy.md`, es un ajuste de doc de arquitectura, no de esta spec.
- **Riesgos clave:** (a) salida fuera de forma → mitigado por `generateObject` + esquema (AC4); (b) sobre-límite
  que crashea en vez de `presupuesto_agotado` (`#3`, techo cero) → AC5; (c) fuga de PII a logs (`#6`) → AC9 con
  el rojo primero; (d) espera infinita → timeout 20 s (AC6).
- Anclas: [`integracion-llm.md §1–§3`](../../arquitectura/integracion-llm.md) ·
  [`modelo-de-datos.md §1.2–§2`](../../arquitectura/modelo-de-datos.md) ·
  [`stack-y-deploy.md §3`](../../arquitectura/stack-y-deploy.md) · [`prd.md §4 · M0`](../../prd.md).
