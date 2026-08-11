# Integración con el LLM — diseño

> **Dueño de:** cómo el sistema llama al LLM, de dónde salen los secretos, el techo de gasto y el contrato de salida estructurada del diagnóstico.
> **No cubre:** el stack/deploy → [`stack-y-deploy.md`](stack-y-deploy.md) · el contrato de datos en tránsito y la no-persistencia → [`modelo-de-datos.md`](modelo-de-datos.md).
> **Última revisión:** `2026-08-11`

---

## 1. Decisión de diseño

El endpoint `POST /api/diagnostico` convierte las 4 respuestas del formulario en un diagnóstico de forma fija usando un LLM.

- **SDK y proveedor:** **Vercel AI SDK con el proveedor OpenAI directo** (`@ai-sdk/openai`), usando `OPENAI_API_KEY`. **Decisión de M0 (2026-08-11): se pisó el AI Gateway** por simplicidad y para que el tope de gasto viva directamente en la plataforma de OpenAI (ver `#3` abajo y [`DECISIONS.md`](../../DECISIONS.md)). Se acepta perder la observabilidad/fallback que daba el Gateway. La elección exacta del modelo (`gpt-…`) es de implementación y se calibra por costo/calidad; la arquitectura fija el patrón, no el modelo.
- **Salida estructurada (contrato duro):** se usa `generateObject` (AI SDK) con un esquema que **obliga** la forma fija del diagnóstico. El LLM no devuelve prosa libre: devuelve un objeto validado. Esto hace del "diagnóstico bien formado" un invariante mecánico, no una esperanza (mitiga el riesgo #2 del PRD, "salida fuera de forma").
  ```ts
  // esquema conceptual de la salida (el "contrato de salida" del PRD §3.1)
  {
    encaje: { grado: "Alto" | "Medio" | "Bajo", explicacion: string },
    primerModulo: string,   // el único componente por el que conviene empezar
    principalRiesgo: string // el riesgo #1 que puede hundir la idea
  }
  ```
- **El prompt/rúbrica es el activo:** el system prompt que define el criterio de diagnóstico (qué es "encaja como AI App", cómo elegir el primer módulo y el riesgo) es el valor diferencial del producto (PRD §1). Vive en el código del endpoint, versionado. Idioma de salida: **español neutro**.
- **Secretos:** la credencial del AI Gateway sale de una **variable de entorno** del proyecto en Vercel; nunca del código ni del repo (ver `.env*` ya en `.gitignore`).
- **Techo de gasto:** un **gate de presupuesto se evalúa ANTES de cada llamada** al LLM. Si el gasto acumulado cruza el techo mensual configurado, el endpoint corta y responde un error tipado "no disponible por presupuesto" — no llama al LLM. El mecanismo concreto del contador de gasto es de implementación; el invariante (no hay llamada paga sin gate previo) es de arquitectura.

## 2. Invariantes (⛔ MUST / MUST NOT)

- **⛔ `#2`** — la API key / credencial del LLM MUST venir de una variable de entorno / secret del proyecto; NUNCA en el código ni en el repo. Modo de falla: una key hardcodeada se filtra en el repo público y se abusa la cuenta.
- **⛔ `#3`** — toda llamada al LLM MUST pasar por un gate de presupuesto **antes** de ejecutarse; al cruzar el techo, se corta sin llamar. Modo de falla: sin gate, un pico de tráfico anónimo (o abuso automatizado) dispara la factura **en silencio** — es el riesgo con techo cero del PRD (§9.1 ⛔), no se difiere nunca.

## 3. Contrato con otras capas

- **Entrada (desde el Route Handler):** las 4 respuestas ya validadas — ver el payload en [`stack-y-deploy.md`](stack-y-deploy.md) §3 y [`modelo-de-datos.md`](modelo-de-datos.md).
- **Salida (hacia la UI):** el objeto `{ encaje: { grado, explicacion }, primerModulo, principalRiesgo }` validado contra el esquema, o un error tipado: `presupuesto_agotado` | `timeout` | `fallo_llm`. La UI mapea cada error a un estado visible (PRD M2 DoD).
- **Frontera de latencia:** objetivo p95 < 15 s (PRD §5). Un timeout devuelve `timeout`, no una espera infinita.

## 4. Alternativas consideradas

- **AI Gateway con strings `"proveedor/modelo"`** — era el default de arquitectura (daba observabilidad y fallback). **Revertido en M0 (2026-08-11):** se eligió OpenAI directo (`@ai-sdk/openai`) para simplificar y anclar el tope de gasto en la plataforma de OpenAI. Ver [`DECISIONS.md`](../../DECISIONS.md). Se reconsideraría si se necesita fallback multi-proveedor u observabilidad centralizada.
- **Texto libre + parseo** en vez de salida estructurada — descartado: parsear prosa es frágil y rompe la forma fija. `generateObject` con esquema hace el contrato mecánico.
- **Gate de presupuesto como "monitoreo/alerta" en vez de corte previo** — descartado: una alerta avisa después de gastar; `#3` exige cortar **antes**. Alerta ≠ gate.

## Abierto

- Elección concreta del modelo OpenAI (`gpt-…`) y su calibración costo/calidad — de implementación, con su número de costo por diagnóstico (PRD §5, objetivo < USD 0,05).

### Resuelto en M0 (2026-08-11)
- **Mecanismo del contador de gasto sin DB → límite de la plataforma del proveedor.** El techo se configura en la plataforma del proveedor (OpenAI), out-of-band; no hay contador ni gate in-app. El endpoint mapea el sobre-límite a error tipado `presupuesto_agotado`. Ver [`DECISIONS.md`](../../DECISIONS.md) y [`plans/active/m0-esqueleto-llm.md §5`](../sdd/plans/active/m0-esqueleto-llm.md).
- **Techo mensual y timeout → USD 5/mes (proveedor) · 20 s (endpoint).** El timeout deja margen sobre el p95 objetivo de 15 s (PRD §5) antes de devolver `timeout`.
