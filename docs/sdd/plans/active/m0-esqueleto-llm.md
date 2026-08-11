---
name: m0-esqueleto-llm
title: Esqueleto desplegado + llamada al LLM verificada
status: active
milestone: M0
owner: Damián
created: 2026-08-11
related:
  - "../../../prd.md#m0--esqueleto-desplegado--llamada-al-llm-verificada"
  - "../../../arquitectura/stack-y-deploy.md"
  - "../../../arquitectura/integracion-llm.md"
  - "../../../arquitectura/modelo-de-datos.md"
  - "../../../../DECISIONS.md"
---

# Esqueleto desplegado + llamada al LLM verificada — roadmap

## 1. Objetivo (qué + por qué)
Una URL pública viva en Vercel que, dado un **input fijo de prueba** (todavía sin formulario), pasa por el
tope de gasto, llama al LLM con **salida estructurada** y devuelve el diagnóstico en las 3 partes de
[`prd.md §3.1`](../../../prd.md). Es el milestone **M0** del PRD: la cañería de mayor riesgo antes de
decorarla — sin una llamada al LLM que devuelva la forma esperada, no hay producto.

## 2. Contexto / problema (brownfield)
Hoy el repo es el arnés SDD + un boilerplate limpio (commit `7836b49`): no hay app Next.js, ni endpoint,
ni deploy. **Todo M0 es net-new** — no hay nada que renombrar ni migrar. Capas que toca: **API/backend**
(el Route Handler que llama al LLM) e **infra/deploy** (proyecto Vercel + variables de entorno). **No** toca
frontend de formulario (eso es M1) ni base de datos (no existe, por diseño — [`modelo-de-datos.md`](../../../arquitectura/modelo-de-datos.md)).

DoD del milestone en [`prd.md`](../../../prd.md) que esta iteración satisface: los 5 ítems del DoD de M0.
El *cómo* ya está fijado por arquitectura ([`stack-y-deploy.md`](../../../arquitectura/stack-y-deploy.md),
[`integracion-llm.md`](../../../arquitectura/integracion-llm.md)); este roadmap sólo lo descompone en specs y
cierra las decisiones operativas que vencían en M0 (ver §5).

## 3. Alcance
- Proyecto **Next.js (App Router) en TypeScript** desplegado en **Vercel**, con una **URL pública accesible**.
- Variables de entorno del proyecto: la credencial del LLM sale de env (**#2**), nunca del repo.
- **Tope de gasto (#3) configurado en la plataforma del proveedor** (out-of-band, USD 5/mes) — ver §5.
- Route Handler **`POST /api/diagnostico`**: recibe las 4 respuestas, llama al LLM vía AI SDK con
  `generateObject` + esquema que **obliga** la forma fija, y devuelve el diagnóstico de 3 partes **o** un
  error tipado (`presupuesto_agotado` | `timeout` | `fallo_llm`).
- El **prompt/rúbrica de diagnóstico** (el criterio — el activo diferencial del PRD §1), en español neutro,
  que hace que el diagnóstico sea **coherente** con el input de prueba fijo.

## 4. No-objetivos (fuera de alcance)
- **UI de formulario** — es M1 ([`prd.md M1`](../../../prd.md)). M0 se dispara con un input fijo de prueba.
- **Pantalla de resultado / estados de carga y error en UI** — es M2. M0 devuelve JSON; el render es M2.
- **Gate de presupuesto in-app / contador de gasto en código** — se resuelve con el tope del proveedor (§5).
- **Observabilidad (id de correlación + spec formal de no-logging)** — diferida (§5). #6 sigue vigente igual (§7).
- **Healthcheck propio** — no; disponibilidad medida por la plataforma (§5).
- **Persistencia de cualquier tipo** — fuera del MVP por diseño ([`prd.md §7`](../../../prd.md)).

## 5. Preguntas abiertas / decisiones (clarify log)
- [x] **Mecanismo del tope de gasto (#3)** → **límite configurado en la plataforma del proveedor** (OpenAI),
  **USD 5/mes**, fuera de la app. Es un mecanismo candidato ya listado en
  [`integracion-llm.md ## Abierto`](../../../arquitectura/integracion-llm.md). **Consecuencia:** no hay gate
  in-app previo; **M0-02 MUST mapear la respuesta de sobre-límite del proveedor a un error tipado
  `presupuesto_agotado`** para que el corte de plata produzca un estado gracioso, no una pantalla rota.
  Registrado en [`DECISIONS.md`](../../../../DECISIONS.md) el 2026-08-11.
- [x] **Techo mensual y timeout** → **USD 5/mes** (proveedor) · **timeout 20 s** en el endpoint (aborta →
  error tipado `timeout`, con margen sobre el p95 objetivo de 15 s, [`prd.md §5`](../../../prd.md)).
  Registrado en [`DECISIONS.md`](../../../../DECISIONS.md).
- [x] **Healthcheck para el NFR de disponibilidad** → **no**; alcanza con el monitoreo de Vercel. Cierra el
  ítem homónimo de [`stack-y-deploy.md ## Abierto`](../../../arquitectura/stack-y-deploy.md).
- [x] **Observabilidad (id de correlación + política formal de no-logging)** → **diferida**. **#6 sigue
  vigente en M0-02** (no se loguea el contenido del form ni el diagnóstico). ⚠️ **Gap del PRD:** ningún
  milestone declara trabajo de observabilidad, así que la condición (a)/(c) de
  [`prd.md §9.1`](../../../prd.md) no se puede cumplir tal cual — el owner debe ubicarlo en PRD §7 o en un
  milestone futuro. Registrado en [`DECISIONS.md`](../../../../DECISIONS.md).
- [ ] **Proveedor/modelo concreto y Gateway-vs-directo** → de implementación
  ([`integracion-llm.md ## Abierto`](../../../arquitectura/integracion-llm.md)). Ojo: configurar el tope "en
  OpenAI" implica OpenAI como proveedor con su key; si se llama **directo** (sin AI Gateway), se **reabre** la
  decisión "AI Gateway" de [`DECISIONS.md`](../../../../DECISIONS.md). Lo fija la spec **M0-02**. ¿bloquea? **no**.

## 6. Riesgos / puntos ciegos
- **Tope del proveedor mal ubicado o ausente** → el corte de plata (#3, riesgo de techo cero
  [`prd.md §6 #1`](../../../prd.md)) no es efectivo. *Mitigación:* config verificada como parte del DoD de
  M0-01 y documentada en `DECISIONS.md`; M0-02 mapea el sobre-límite a `presupuesto_agotado`.
- **Env var de la key ausente/mal cargada en prod** → el endpoint cae en runtime. *Mitigación:* M0-01
  verifica la presencia de la env var en el entorno desplegado; la key nunca en el repo (**#2**).
- **Salida fuera de forma** (riesgo #2 del PRD — faltan partes / genérico). *Mitigación:* `generateObject` +
  esquema hace la forma fija un invariante mecánico (M0-02).
- **Latencia > 15 s** ([`prd.md §5`](../../../prd.md)). *Techo aceptado:* timeout 20 s → error tipado
  `timeout`, no espera infinita (M0-02).
- **Observabilidad diferida** → sin id de correlación, depurar errores en prod es más difícil. *Techo
  aceptado:* se difiere sólo el slice de observabilidad; **#6 no** se difiere (M0-02 no loguea contenido).

## 7. Gates a nivel feature
- **#2** — la credencial del LLM sale de env / secret, nunca del repo. La configura M0-01, la consume M0-02.
- **#3** — tope de gasto: materializado por el **límite del proveedor** (out-of-band, §5); M0-02 mapea el
  sobre-límite a `presupuesto_agotado`. Es el invariante de techo cero — no se difiere
  ([`prd.md §9.1 ⛔`](../../../prd.md)).
- **#6** — stateless / no-logging: M0-02 no persiste ni loguea el payload ni el diagnóstico.
- **#1** — aislamiento por usuario, satisfecho **por ausencia de persistencia**
  ([`modelo-de-datos.md`](../../../arquitectura/modelo-de-datos.md)); M0-02 no introduce ninguna store.
- **#4** — HITL: **N/A por diseño** (sin efectos externos, sólo una inferencia de lectura —
  [`stack-y-deploy.md §2`](../../../arquitectura/stack-y-deploy.md)).
- **#5** — hecho = las 3 capas en verde, en orden. Aplica a las 3 specs.

## 8. SPECs — el índice (fuente canónica del estado)

| ID | SPEC | Estado | Depende de | Archivo |
|---|---|---|---|---|
| M0-01 | Esqueleto Next.js desplegado en Vercel + config de entorno (URL pública viva, key #2, tope #3) | ✅ done | — | `docs/sdd/specs/M0-01-esqueleto-deploy.md` |
| M0-02 | Route Handler `POST /api/diagnostico`: contrato de entrada, salida estructurada, errores tipados (#2, #3, #6) | 🟡 ready | M0-01 | `docs/sdd/specs/M0-02-endpoint-diagnostico.md` |
| M0-03 | Prompt/rúbrica de diagnóstico (el criterio, español neutro) — coherencia con el input de prueba fijo | 🟡 ready | M0-02 | `docs/sdd/specs/M0-03-prompt-rubrica.md` |

> Estados: ⬜ draft · 🟡 ready · 🔵 in-progress · ✅ done.
> **Esta tabla es el estado canónico.** El `status` del frontmatter de cada spec es un espejo.

**Cobertura del DoD de M0** (cada ítem del PRD, cubierto por ≥1 spec):
- DoD·1 (URL pública accesible) → **M0-01**.
- DoD·2 (endpoint 4 respuestas → 3 partes) → **M0-02**.
- DoD·3 (key de env #2 + tope de gasto #3) → **M0-01** (env var + tope del proveedor) + **M0-02** (lee la key de env, mapea `presupuesto_agotado`).
- DoD·4 (input fijo → coherente + forma fija) → **M0-02** (forma fija por esquema) + **M0-03** (coherencia por el criterio).
- DoD·5 (preguntas abiertas cerradas/diferidas + `DECISIONS.md`) → este roadmap **§5** + entradas en `DECISIONS.md` (ítem de proceso, no una spec de build).

## 9. Orden de ejecución sugerido (WIP=1)
1. **M0-01** — parar la app y el pipeline de deploy primero: URL pública viva + env vars + tope del proveedor. Derisca la infra antes de la cañería.
2. **M0-02** — el Route Handler y su contrato (entrada + salida estructurada + errores tipados), redeploy sobre M0-01.
3. **M0-03** — el prompt/rúbrica que hace el diagnóstico coherente con el input fijo; cierra DoD·4.

## 10. Definición de hecho de la iteración
- [ ] Todas las specs del §8 en ✅, cada una con su DoD y sus 3 capas en verde (**#5**).
- [ ] El DoD de **M0** en [`prd.md`](../../../prd.md) está satisfecho (los 5 ítems; ver mapa de cobertura en §8). El §10 no reescribe ese DoD — `prd.md` es su dueño.
- [ ] El input de prueba fijo corre de punta a punta contra la **URL pública** y el diagnóstico respeta la forma fija y es coherente con lo ingresado.
- [ ] Toda pregunta del §5 resuelta o explícitamente diferida con dueño y destino (el gap del PRD sobre observabilidad, escalado al owner).
- [ ] Decisiones durables registradas en [`DECISIONS.md`](../../../../DECISIONS.md).
- [ ] Este roadmap movido a `docs/sdd/plans/archive/`.
