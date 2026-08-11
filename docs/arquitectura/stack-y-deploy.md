# Stack y deploy — diseño

> **Dueño de:** el stack técnico, el runtime, el deploy y la decisión de no persistir estado en el servidor.
> **No cubre:** la integración con el LLM → [`integracion-llm.md`](integracion-llm.md) · el modelo de datos / no-persistencia → [`modelo-de-datos.md`](modelo-de-datos.md).
> **Última revisión:** `2026-08-11`

---

## 1. Decisión de diseño

**Stack:** Next.js (App Router) en TypeScript, desplegado en **Vercel**. Una sola app que sirve tanto la UI del formulario como el endpoint que llama al LLM (Route Handler).

- **Frontend:** Next.js App Router. El formulario de 4 pasos es un client component que mantiene su estado en memoria del navegador (React state); la navegación entre pasos no toca red. Estilos con lo que traiga el arnés de UI (a decidir en implementación); no hay decisión de arquitectura acá.
- **Backend:** un **Route Handler** (`app/api/diagnostico/route.ts`) que recibe las 4 respuestas, aplica el gate de presupuesto y llama al LLM. Corre en el runtime **Node.js (Fluid Compute)** de Vercel — no Edge. Streaming/latencia no requieren Edge; Node.js da acceso completo a librerías y duración larga.
- **Sin servidor de estado:** no hay base de datos, ni caché con estado, ni sesión de servidor. Cada request es efímero e independiente (ver [`modelo-de-datos.md`](modelo-de-datos.md)).

**Deploy:** Vercel, con la URL pública de producción como entregable de M0. Las variables de entorno (la API key del LLM, el techo de gasto) se cargan como env vars del proyecto en Vercel — nunca en el repo (ver `#2` en [`integracion-llm.md`](integracion-llm.md)).

**Diagrama del flujo:**

```
navegador (form 4 pasos, estado en memoria)
  → POST /api/diagnostico  { queHace, paraQuien, queProblema, validacion }
      → gate de presupuesto (#3)
      → llamada al LLM (#2, #3)
      → { encaje: {grado, explicacion}, primerModulo, principalRiesgo }
  → render del diagnóstico en pantalla
```

## 2. Invariantes (⛔ MUST / MUST NOT)

Este archivo no numera invariantes propios nuevos. La regla de efectos externos **`#4`** (HITL) se evalúa acá:

- **`#4` (HITL) — no aplica por diseño en el MVP.** El único efecto del sistema es una **inferencia de lectura** (llamada al LLM) que devuelve texto a la misma sesión; no hay mail, pago ni publicación, ni ningún write con efecto hacia afuera. Al no existir una acción con efecto externo, no hay nada que aprobar. Si un milestone futuro agrega un efecto externo (p. ej. enviar el diagnóstico por email, §7 del PRD), `#4` deja de ser N/A y necesita su punto de aprobación humana. Modo de falla a vigilar: agregar un efecto externo sin volver a mirar `#4`.

## 3. Contrato con otras capas

- **UI → endpoint:** `POST /api/diagnostico` con body JSON `{ queHace: string, paraQuien: string, queProblema: string, validacion: "no" | "un_poco" | "si_clientes" }`. La forma exacta y su validación las fija [`modelo-de-datos.md`](modelo-de-datos.md) (contrato de datos en tránsito).
- **Endpoint → LLM:** ver [`integracion-llm.md`](integracion-llm.md) (modelo, gate de presupuesto, salida estructurada).
- **Endpoint → UI:** respuesta JSON con el diagnóstico de 3 partes, o un error tipado (presupuesto agotado / timeout / fallo del LLM) que la UI muestra como estado de error.

## 4. Alternativas consideradas

- **Backend separado (FastAPI / Express) + frontend aparte** — descartado: para un loop `form → IA → resultado` sin DB, dos servicios es sobre-ingeniería. Una sola app Next.js con un Route Handler cubre todo y despliega en un paso.
- **Runtime Edge** — descartado: no aporta (la latencia la domina el LLM, no el cold start) y limita librerías/duración. Node.js (Fluid Compute) es el default correcto.
- **Persistir en DB / KV** — descartado por alcance: el PRD lo pone fuera del MVP (§7). Ver [`modelo-de-datos.md`](modelo-de-datos.md).

## Abierto

- Región de deploy en Vercel (¿fijar una cercana al público objetivo para latencia?). No bloquea M0.

### Resuelto en M0 (2026-08-11)
- **Healthcheck para el NFR de disponibilidad → no se agrega uno propio.** Alcanza con el monitoreo de la plataforma (Vercel); la disponibilidad (99% mensual, PRD §5) se mide con el uptime del hosting. Ver [`plans/active/m0-esqueleto-llm.md §5`](../sdd/plans/active/m0-esqueleto-llm.md).
