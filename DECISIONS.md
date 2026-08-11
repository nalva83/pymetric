<!--
PLANTILLA — DECISIONS.md (registro de decisiones de diseño)
Captura el "POR QUÉ" que la compactación de contexto suele perder.
Formato mínimo por entrada: qué decisión, por qué, alternativa rechazada, constraint, fecha.
Ver: docs/03-estado-entre-sesiones.md
-->

# Decisiones de diseño

## 2026-08-11: M0-01 aplicado — esqueleto desplegado, key #2 y tope #3 confirmados
- **Decisión:** las decisiones de stack, tope de gasto y credencial (abajo) quedaron **aplicadas** al cerrar `M0-01`.
- **Evidencia:**
  - URL pública de producción viva: **`https://curso-ai-app-demo.vercel.app`** (GET → 200, sirve el shell `app/page.tsx`).
  - **`#2`** — `OPENAI_API_KEY` cargada como env var del proyecto en Vercel (entornos Production + Preview); **no** está en el repo (grep del árbol trackeado por `sk-…` y por el valor de la key → limpio; ningún `.env` con secretos trackeado; `.gitignore:12-17,56`).
  - **`#3`** — techo de gasto **USD 5/mes** configurado en la plataforma de OpenAI (usage limits, out-of-band), confirmado por el owner el 2026-08-11.
  - Runtime aún **no** lee la key (M0-02 la consume): la app arranca y responde 200 sin ella.
- **Constraint / consecuencia:** M0-02 consume la key desde env y mapea el sobre-límite del proveedor a `presupuesto_agotado`. Dueño de la spec: [`docs/sdd/specs/M0-01-esqueleto-deploy.md`](docs/sdd/specs/M0-01-esqueleto-deploy.md).

## 2026-08-11: Stack — Next.js (App Router) sobre Vercel, app única
- **Decisión:** una sola app Next.js en TypeScript (App Router) desplegada en Vercel; la UI y el endpoint del LLM (Route Handler en runtime Node.js/Fluid Compute) viven juntos.
- **Razón:** el loop `form → IA → resultado` sin DB no justifica dos servicios; una app despliega en un paso y da la URL pública que pide M0.
- **Alternativa rechazada:** backend separado (FastAPI/Express) + frontend aparte — sobre-ingeniería para este alcance. Runtime Edge — no aporta (la latencia la domina el LLM) y limita librerías/duración.
- **Constraint / consecuencia:** todo corre en Vercel; sin estado de servidor. Dueño: [`docs/arquitectura/stack-y-deploy.md`](docs/arquitectura/stack-y-deploy.md).

## 2026-08-11: LLM directo a OpenAI (sin AI Gateway) — override de M0
- **Decisión:** el endpoint llama a **OpenAI directo** con el AI SDK (`@ai-sdk/openai`) y `OPENAI_API_KEY`; el tope de gasto vive en la plataforma de OpenAI (ver decisión del tope, arriba). **Pisa** la decisión "AI SDK vía AI Gateway" de más abajo para el MVP.
- **Razón:** simplicidad y consistencia con el tope de gasto configurado out-of-band en OpenAI; una sola credencial y un solo lugar donde vive el corte de plata. Para un MVP de demo no se necesita fallback multi-proveedor ni observabilidad centralizada del Gateway.
- **Alternativa rechazada:** AI Gateway con BYOK de OpenAI (conserva observabilidad/fallback pero agrega piezas de config); AI Gateway con Anthropic y tope en el Gateway (contradice dónde el owner puso el tope).
- **Constraint / consecuencia:** se pierde la observabilidad/fallback que daba el Gateway; se mantiene `generateObject` + esquema (salida estructurada) y las reglas #2 (key de env `OPENAI_API_KEY`) y #3 (tope en la plataforma). La entrada "AI SDK vía AI Gateway" de abajo queda **superada** por ésta. Dueño: [`docs/arquitectura/integracion-llm.md`](docs/arquitectura/integracion-llm.md).

## 2026-08-11: Integración LLM — AI SDK vía AI Gateway con salida estructurada  ⟶ SUPERADA por la decisión "LLM directo a OpenAI" (2026-08-11)
- **Decisión:** Vercel AI SDK con string `"proveedor/modelo"` a través del AI Gateway (default `anthropic/claude-sonnet-5`), usando `generateObject` con un esquema que obliga la forma fija del diagnóstico (grado+explicación, primer módulo, riesgo).
- **Razón:** el Gateway da observabilidad, fallback y una sola credencial sin acoplar a un SDK de proveedor; la salida estructurada convierte "diagnóstico bien formado" en un invariante mecánico y no en una esperanza (mitiga el riesgo de salida fuera de forma).
- **Alternativa rechazada:** SDK de proveedor directo (`@ai-sdk/anthropic`) — acopla sin necesidad. Texto libre + parseo — frágil, rompe la forma fija.
- **Constraint / consecuencia:** la API key sale de env (#2) y hay gate de presupuesto antes de cada llamada (#3). Dueño: [`docs/arquitectura/integracion-llm.md`](docs/arquitectura/integracion-llm.md).

## 2026-08-11: Tope de gasto (#3) vía límite del proveedor, no gate in-app (M0)
- **Decisión:** el techo de gasto del LLM se materializa con el **límite de gasto configurado en la plataforma del proveedor** (OpenAI), **USD 5/mes**, fuera de la aplicación — no hay contador ni gate in-app. El endpoint MUST mapear la respuesta de sobre-límite del proveedor a un error tipado `presupuesto_agotado`. Timeout del endpoint: **20 s** (aborta → error tipado `timeout`, con margen sobre el p95 objetivo de 15 s).
- **Razón:** "límite de la plataforma" ya figuraba como mecanismo candidato en `integracion-llm.md ## Abierto`; sin DB, es el corte de plata más simple y suficiente para el MVP de demo. El mapeo a `presupuesto_agotado` preserva el espíritu de #3 (el cruce del techo produce un estado gracioso, no una pantalla rota).
- **Alternativa rechazada:** contador in-app en KV externo (agrega infra a M0); contador en memoria del serverless (frágil, se resetea en cold start, no comparte entre instancias Fluid — no es un corte duro real).
- **Constraint / consecuencia:** #3 se cumple **sin** gate previo in-app, apoyándose en el tope del proveedor; su config es out-of-band y se verifica como parte del DoD de M0-01. **Ojo:** configurar el tope "en OpenAI" implica OpenAI como proveedor con su key — si se llama a OpenAI **directo** (sin AI Gateway), se reabre la decisión "AI SDK vía AI Gateway" de más abajo. Dueño: [`docs/arquitectura/integracion-llm.md`](docs/arquitectura/integracion-llm.md).

## 2026-08-11: Observabilidad diferida en M0 — #6 sigue vigente (gap del PRD)
- **Decisión:** M0 **difiere** el slice de observabilidad (id de correlación de logs + spec formal de no-logging del contenido del form). La invariante **#6** (stateless / no-log del contenido) **NO** se difiere: sigue vigente y M0-02 la declara y verifica.
- **Razón:** base primero — el id de correlación y la observabilidad rica no los llama la demanda real en M0; el corte barato es no loguear el contenido (que #6 ya obliga).
- **Alternativa rechazada:** incluir un id de correlación efímero + spec de no-logging en M0 (una spec más sin demanda real todavía).
- **Constraint / consecuencia:** ⚠️ **gap del PRD** — ningún milestone declara trabajo de observabilidad, así que las condiciones (a)/(c) de `prd.md §9.1` no se pueden cumplir tal cual. El owner debe ubicar este trabajo en PRD §7 (fuera del MVP, previsto) o en un milestone futuro con su ítem de DoD. Dueño: [`docs/arquitectura/modelo-de-datos.md`](docs/arquitectura/modelo-de-datos.md).

## 2026-08-11: Sin base de datos — servidor stateless (regla #6)
- **Decisión:** no se persiste ningún dato de negocio; las 4 respuestas y el diagnóstico son datos en tránsito (memoria del browser → request → respuesta) que mueren con el request/pestaña. Se numera el invariante #6 (stateless) como refuerzo operativo de #1.
- **Razón:** el PRD lo fija como restricción dura (§7). Sin store de negocio, el aislamiento por usuario (#1) se cumple por construcción —no hay fila que aislar— una garantía más fuerte que scope/RLS.
- **Alternativa rechazada:** DB mínima "solo para historial/analítica" — fuera de alcance del PRD y reintroduce la carga de #1. `localStorage` como persistencia — acumula datos de negocio en el dispositivo sin necesidad (`sessionStorage` sí, solo como buffer entre pasos).
- **Constraint / consecuencia:** cualquier feature futura con persistencia (historial, email, cuentas) NO puede shippear sin materializar #1 con columna de dueño/tenant + scope/RLS. Dueño: [`docs/arquitectura/modelo-de-datos.md`](docs/arquitectura/modelo-de-datos.md).
