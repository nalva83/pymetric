---
id: M0-01
title: Esqueleto Next.js desplegado en Vercel + config de entorno (URL pública viva, key #2, tope #3)
status: done             # draft → ready → in-progress → done  (canónico = la fila del roadmap)
owner: Damián
milestone: M0
plan_row: docs/sdd/plans/active/m0-esqueleto-llm.md
depends_on: []
created: 2026-08-11
---

# M0-01 · Esqueleto Next.js desplegado en Vercel + config de entorno

## 1. Objetivo (qué + por qué)
Poner **una URL pública de producción viva** en Vercel (un shell mínimo de Next.js que responde 200) y dejar
**configurado el entorno** —la credencial del LLM como env var del proyecto (`#2`) y el techo de gasto USD 5/mes
en la plataforma del proveedor (`#3`)— para deriscar la infra antes de tender la cañería del LLM. Sin URL viva
ni entorno seguro, no hay dónde correr el endpoint de M0-02.

## 2. Contexto (brownfield — qué existe hoy)
**Capas que toca:** **infra/deploy** (proyecto Vercel + variables de entorno + tope del proveedor) y el
**scaffold de la app Next.js** (App Router, TypeScript). No toca frontend de formulario (M1), ni endpoint/LLM
(M0-02), ni base de datos (no existe, por diseño — [`modelo-de-datos.md`](../../arquitectura/modelo-de-datos.md)).

**Milestone del PRD y su DoD:** M0 — [`prd.md §4 · M0`](../../prd.md). Esta spec cubre **DoD·1** (URL pública
accesible) y la **parte de infra de DoD·3** (API key desde env var `#2` + tope de gasto del proveedor `#3`
configurado y documentado). El resto de DoD·3 (leer la key y mapear `presupuesto_agotado`) es M0-02.

**Archivos de arquitectura que la anclan:**
- Dueño: [`stack-y-deploy.md §1`](../../arquitectura/stack-y-deploy.md) (stack Next.js/App Router/TS, runtime
  Node.js Fluid Compute, deploy en Vercel, URL pública como entregable de M0; env vars del proyecto en Vercel).
- [`integracion-llm.md §2`](../../arquitectura/integracion-llm.md) — invariantes `#2` (secretos desde env) y
  `#3` (techo de gasto); el mecanismo del tope está resuelto en su `### Resuelto en M0` (límite del proveedor,
  USD 5/mes, out-of-band).

**Evidencia de lo que hay hoy:**
- `.gitignore:12-17` — `.env` y `.env.*` ya ignorados; sólo se re-admiten plantillas `*.example`. `.gitignore:56`
  refuerza `.env*`. → el riel para que la key **no** entre al repo ya existe.
- Repo = arnés SDD + boilerplate limpio (commit `7836b49`). No hay app Next.js, ni `package.json` de app, ni
  proyecto Vercel linkeado (`.vercel` ignorado en `.gitignore:51`).
- Decisiones ancladas: `DECISIONS.md` — "Stack — Next.js sobre Vercel" y "LLM directo a OpenAI (`OPENAI_API_KEY`)"
  y "Tope de gasto (#3) vía límite del proveedor (USD 5/mes)".

**Qué le pasa a lo construido:**
- Scaffold Next.js (App Router, TS) + página placeholder → **net-new**.
- Proyecto y deploy en Vercel + env var `OPENAI_API_KEY` de producción → **net-new**.
- Tope de gasto USD 5/mes en la plataforma de OpenAI → **net-new** (config out-of-band).
- `.gitignore` (reglas `.env*`) → **se conserva** (`.gitignore:12-17,56`); esta spec se apoya en él, no lo edita.

## 3. Requisitos funcionales
1. Existe un proyecto **Next.js (App Router) en TypeScript** con una **página placeholder** que responde HTTP 200
   (shell mínimo, sin UI de formulario), que buildea y pasa typecheck + lint.
2. La app está **desplegada en Vercel** con una **URL pública de producción accesible** (GET → 200).
3. La credencial del LLM se carga como **env var `OPENAI_API_KEY` del proyecto en Vercel** (entorno de
   producción), y **no** aparece en el repositorio (`#2`).
4. El **techo de gasto USD 5/mes** está configurado en la plataforma de OpenAI (out-of-band) y **documentado**
   en `DECISIONS.md` (`#3`).

## 4. No-objetivos (fuera de alcance)
- **UI de formulario de 4 pasos** — es M1 ([`prd.md §4 · M1`](../../prd.md)).
- **Route Handler `POST /api/diagnostico` / llamada al LLM / errores tipados** — es M0-02. Acá **no** se hace
  ninguna llamada paga ni se lee la key en runtime.
- **Pantalla de resultado / estados de carga y error** — es M2.
- **Gate de presupuesto in-app / contador de gasto en código** — resuelto por el tope del proveedor (out-of-band);
  el mapeo del sobre-límite a `presupuesto_agotado` es M0-02.
- **Healthcheck propio** — no; disponibilidad medida por Vercel ([`stack-y-deploy.md ### Resuelto en M0`](../../arquitectura/stack-y-deploy.md)).
- **Persistencia de cualquier tipo** — fuera del MVP por diseño ([`prd.md §7`](../../prd.md)).

## 5. Gates — las reglas innegociables
Fuente: [`../constitucion.md`](../constitucion.md).

**Aplicabilidad por familia:**

| Familia | ¿Aplica? | Si N/A, por qué |
|---|---|---|
| **A** · Aislamiento y datos (#1, #6) | N/A | Esta spec no introduce ninguna store ni maneja datos de negocio: es un shell placeholder + config de deploy. No hay request de contenido que aislar ni loguear. `#1`/`#6` se materializan por ausencia de persistencia y los declara/verifica M0-02. |
| **B** · Secretos y costo (#2, #3) | ✅ | Toca la credencial del LLM (`#2`) y configura el techo de gasto del proveedor (`#3`). Ver detalle. |
| **C** · Control humano / HITL (#4) | N/A | Sin efectos hacia afuera (mail, pago, publicación): el entregable es una página placeholder; no hay siquiera llamada al LLM en esta spec. `#4` es N/A por diseño en todo el MVP ([`stack-y-deploy.md §2`](../../arquitectura/stack-y-deploy.md)). |
| **D** · Verificación (#5) | ✅ | Hecho = las 3 capas en verde. Se demuestra en §8. |

**Detalle — una fila por regla que la spec toca:**

| # | Regla | Cómo se cumple y cómo se verifica **en esta spec** |
|---|---|---|
| [#2](../../arquitectura/integracion-llm.md) | Secretos desde env / secret manager; nunca en el código ni en el repo. | Se cumple: `OPENAI_API_KEY` se carga como env var del proyecto en Vercel (producción); `.env*` ya ignorado (`.gitignore:12-17,56`). Se verifica: (a) **caso negativo** — grep del repo por la key / patrón `sk-` da limpio (AC3); (b) la env var **está presente** en el entorno desplegado de Vercel (AC2). |
| [#3](../../arquitectura/integracion-llm.md) | Todo consumo de LLM/servicio pago con techo de gasto antes de ejecutar. | Se cumple: el techo USD 5/mes está configurado en la plataforma de OpenAI (out-of-band, [`integracion-llm.md ### Resuelto en M0`](../../arquitectura/integracion-llm.md)). Es el invariante de **techo cero** — no se difiere; esta spec cierra el lado "config existe y está documentada" y M0-02 mapea el sobre-límite a `presupuesto_agotado`. Se verifica: el límite existe en OpenAI y está registrado en `DECISIONS.md` (AC4). |
| [#5](../../README.md#lifecycle) | Hecho = las 3 capas en verde, en orden. | No se declara: se demuestra en §8 (unit+estático → smoke del deploy/entorno → e2e contra la URL pública). |

> **Obligatorias por condición:** la spec maneja credenciales → `#2` (declarada); configura un techo para un
> servicio pago → `#3` (declarada); siempre → `#5` (§8). No toca DB ni write con efecto externo → `#1`/`#6`/`#4`
> quedan N/A justificadas arriba.

## 6. Entregables
- `package.json`, `tsconfig.json`, config de Next.js (App Router) — **nuevo**.
- `app/page.tsx` — página placeholder que responde 200 (shell mínimo) — **nuevo**.
- `.env.local.example` con la clave `OPENAI_API_KEY=` (sin valor, sólo plantilla) — **nuevo**.
- Proyecto Vercel linkeado + env var `OPENAI_API_KEY` de producción cargada en Vercel — **nuevo** (config de infra,
  no archivo del repo).
- Tope de gasto USD 5/mes configurado en la plataforma de OpenAI — **nuevo** (config out-of-band).
- Entrada/confirmación en `DECISIONS.md` de que el tope quedó configurado (la decisión ya existe; se marca aplicada) — **modificado**.
- **Superficie real:** la **URL pública de producción en Vercel** (una página que responde 200). No hay endpoint
  ni UI de cliente en esta spec.

## 7. Criterios de aceptación (testables)
- [x] **AC1** (R1) `next build` completa sin error y `tsc --noEmit` + `eslint` pasan en limpio; existe `app/page.tsx`
  que renderiza el shell placeholder.
- [x] **AC2** (R2, R3) `GET` a la **URL pública de producción** de Vercel responde **200**; la env var
  `OPENAI_API_KEY` figura en el entorno de producción del proyecto (`vercel env ls production` la lista).
- [x] **AC3** (R3, #2) **Caso negativo:** un grep del árbol trackeado por el valor de la key y por el patrón
  `sk-[A-Za-z0-9]` da **cero** resultados; `git ls-files` no incluye ningún `.env` con secretos (sólo plantillas
  `*.example`). La key **no** debe estar en el repo.
- [x] **AC4** (R4, #3) El límite de gasto **USD 5/mes** existe en la cuenta de OpenAI (usage limits) y está
  documentado en `DECISIONS.md`. **Caso negativo:** si no hubiera límite configurado, el ítem no pasa (el techo
  cero no se da por bueno sin evidencia).
- [x] **No-regresión:** el deploy de producción sigue respondiendo 200 tras cargar la env var (la app arranca sin
  la key porque no la lee en runtime todavía — M0-02 la consume).

## 8. Plan de verificación — las 3 capas, en orden
- **1 · Unit + estático (gate):** `next build` + `tsc --noEmit` + `eslint`. **Linter de secretos:** grep del árbol
  trackeado por `sk-[A-Za-z0-9]` y por el valor de la key → debe dar limpio (AC3). Cubre AC1, AC3.
- **2 · Integración y aislamiento:** **suite de aislamiento por tenant → N/A** (no hay DB ni datos de negocio —
  familia A N/A). Integración de infra: (a) `vercel env ls production` confirma `OPENAI_API_KEY` presente (AC2);
  (b) verificación out-of-band de que el tope USD 5/mes existe en OpenAI (AC4). Sin policy de permisos que exija
  "primero el rojo" en esta spec.
- **3 · Contrato y e2e:** `curl -sS -o /dev/null -w "%{http_code}"` contra la **URL pública de producción** →
  `200`, atado a **DoD·1** de M0 ([`prd.md §4 · M0`](../../prd.md)). Cubre AC2 (lado URL viva) y no-regresión.
- **Evals:** N/A — esta spec no toca calidad de un step LLM (es M0-03).
- **Fix-plan si una capa falla:**
  - AC1 falla (build/typecheck) → leer el error de `next build`/`tsc`; causa típica: config de App Router o TS
    mal armada → arreglo mínimo en la config, re-correr.
  - AC2 falla (URL no responde 200) → revisar logs de deploy de Vercel; causa típica: build roto o proyecto no
    linkeado → re-deploy tras corregir. Si la env var no aparece → cargarla en Vercel (Settings → Environment
    Variables, scope production) y re-verificar.
  - AC3 falla (grep encuentra la key) → **stop**: es una fuga de secreto. Rotar la key en OpenAI, quitarla del
    archivo, confirmar que el archivo está cubierto por `.gitignore`, reescribir historia si ya se commiteó,
    re-correr el grep. No se avanza hasta grep limpio.
  - AC4 falla (sin tope) → configurar el usage limit USD 5/mes en OpenAI antes de cerrar; documentar en
    `DECISIONS.md`. `#3` es techo cero: no se difiere.

## 9. Definición de hecho (DoD)
- [x] Entregables de §6 creados / modificados.
- [x] Todos los criterios de §7 en verde, como tests/checks donde corresponda.
- [x] Gates de §5 cumplidos y **verificados** — no sólo declarados (grep limpio para `#2`; tope existente para `#3`).
- [x] Las 3 capas de §8 en verde, **en orden**.
- [x] Cierra con su superficie real: la **URL pública de producción** existe y responde 200 de punta a punta.
- [x] `status` actualizado acá **y** en la fila del roadmap ([`plan_row`](../plans/active/m0-esqueleto-llm.md) §8).
- [x] Decisión durable registrada en [`DECISIONS.md`](../../../DECISIONS.md) (las entradas de stack, tope y key ya
      existen; se confirma que quedaron aplicadas).
- [x] Sin artefactos de debug; árbol de trabajo limpio; ningún `.env` con secretos trackeado.

## 10. Notas de ejecución / presupuesto de contexto
- Entra cómoda en un contexto fresco: es infra + scaffold, sin lógica de dominio. No requiere partirse.
- **Dependencias:** ninguna (`depends_on: []`). Es la base de M0-02 y M0-03.
- **Verificación de la env var sin endpoint:** M0-02 todavía no existe, así que la presencia de `OPENAI_API_KEY`
  en producción se verifica con `vercel env ls production` (no con un endpoint de la app). Default razonable, no
  bloqueante.
- **Riesgo clave:** una key filtrada al repo (`#2`) — mitigado por el grep de AC3 y por `.gitignore:12-17,56`; y
  un tope ausente/mal ubicado (`#3`, techo cero) — mitigado por AC4 + `DECISIONS.md`.
- Anclas: [`stack-y-deploy.md §1`](../../arquitectura/stack-y-deploy.md) · [`integracion-llm.md §2`](../../arquitectura/integracion-llm.md) · [`prd.md §4 · M0`](../../prd.md).
