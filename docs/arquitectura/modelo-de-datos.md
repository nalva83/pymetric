<!-- Documento de diseño — modelo de datos de AI App Fit. Dueño de la regla #1 de la constitución. -->

# Modelo de datos — diseño

> **Dueño de:** el modelo de datos de AI App Fit — que en este producto es, sobre todo, la **decisión de NO persistir** y el **contrato de datos en tránsito** (payload de entrada + forma de la respuesta). Dueño de la regla **#1** (aislamiento por usuario).
> **No cubre:** el prompt/rúbrica de diagnóstico ni el gate de presupuesto y manejo de la API key — eso vive en [`integracion-llm.md`](integracion-llm.md) (reglas #2, #3). La UI del formulario y los estados de carga/error viven en el diseño de front, no acá.
> **Última revisión:** 2026-08-11

---

## 1. Decisión de diseño

**AI App Fit no tiene base de datos y no persiste ningún dato de negocio.** El PRD lo fija como restricción de producto dura (§2.1, §3, §7): el loop es `form → IA → resultado`, 100% anónimo, pantalla→pantalla, en una sola sesión. Guardar diagnósticos/historial y capturar email están explícitamente fuera de alcance. Por lo tanto **no existe modelo relacional: no hay tablas, ni entidades persistidas, ni claves.** Lo que existe son **datos en tránsito** con un ciclo de vida efímero.

### 1.1 Dónde vive cada dato y su ciclo de vida

| Dato | Dónde vive | Nace | Muere |
|---|---|---|---|
| Respuestas del formulario (los 4 campos) | Estado en memoria del browser (React/JS state; opcionalmente `sessionStorage` mientras se navegan los 4 pasos) | Al tipear cada paso | Al enviar / al cerrar la pestaña |
| Payload de entrada (las 4 respuestas serializadas) | Cuerpo del request HTTP hacia el endpoint | Al presionar «enviar» | Cuando el servidor termina de procesar el request |
| Respuesta del LLM (el diagnóstico de 3 partes) | Memoria del proceso servidor durante el request → cuerpo de la respuesta HTTP → estado en memoria del browser | Cuando el LLM responde | Al mostrar y descartar / al cerrar la pestaña o «empezar de nuevo» |

**Ningún dato sobrevive al request.** El servidor es *stateless* respecto de los datos de negocio: procesa el payload, llama al LLM, devuelve el diagnóstico y no escribe nada a disco ni a ninguna store. No hay estado compartido entre dos requests de dos usuarios distintos.

### 1.2 Contrato de datos en tránsito

**Payload de entrada** (las 4 respuestas del formulario; forma lógica, no un esquema ejecutable):

| Campo | Tipo lógico | Origen (PRD) | Obligatorio |
|---|---|---|---|
| `que_hace` | texto libre | Paso 1 — qué hace la idea | sí |
| `para_quien` | texto libre | Paso 2 — para quién | sí |
| `problema` | texto libre | Paso 3 — qué problema resuelve | sí |
| `validacion` | enum: `no` \| `un_poco` \| `si_con_clientes` | Paso 4 — si ya la validó (No / Un poco / Sí, con clientes) | sí |

**Respuesta / diagnóstico** (forma fija del PRD §3.1; español neutro):

| Campo | Tipo lógico | Contenido |
|---|---|---|
| `encaje.grado` | enum: `alto` \| `medio` \| `bajo` | Grado de encaje como AI App |
| `encaje.explicacion` | texto | Párrafo que justifica el grado |
| `primer_modulo` | texto | El único componente por el que conviene empezar |
| `principal_riesgo` | texto | El riesgo #1 que puede hundir la idea |

Los nombres exactos de campos y el mecanismo de validación de forma (que las 3 partes vengan completas, riesgo #2 del PRD) los fija la spec de M0 junto con [`integracion-llm.md`](integracion-llm.md); acá se fija la **forma lógica** del contrato, no su serialización.

### 1.3 Cómo se satisface el aislamiento por usuario (#1) sin persistencia

La regla #1 exige que todo **dato de negocio** esté acotado a su usuario dueño y que ningún acceso cruce usuarios. **En este diseño se satisface por construcción, no por un mecanismo de scope/RLS**, y esa es la razón por la que se cumple de forma más fuerte que con una DB:

- **No hay dato de negocio almacenado** que pueda leerse desde otro usuario. Si nada persiste, no hay fila que aislar ni consulta que pueda devolver datos ajenos.
- **Cada request es efímero e independiente:** el servidor no comparte estado de negocio entre requests. El diagnóstico de un usuario existe solo en su propio request/respuesta y en su propio browser.
- **No hay identidad ni sesión persistida:** al ser anónimo y sin login, no hay «usuario dueño» que registrar — y por lo tanto tampoco un canal por el que los datos de A lleguen a B.

El invariante correspondiente (§2) declara que **mientras no exista persistencia, la ausencia de store de negocio es la garantía de #1**, y que el día que se agregue cualquier persistencia (historial, email, cuentas — todo hoy en PRD §7) esa feature **no puede shippear sin materializar #1 con una columna de dueño/tenant y scope/RLS**. Es decir: #1 hoy se cumple por la vía «no hay dato»; la puerta a la vía «hay dato, con scope» queda explícitamente abierta y bloqueada como precondición.

---

## 2. Invariantes (⛔ MUST / MUST NOT)

Lo que ninguna spec puede violar. Cada invariante se numera en [`../sdd/constitucion.md`](../sdd/constitucion.md).

- **⛔ `#1`** — Todo dato de negocio MUST estar acotado a su usuario dueño; ningún acceso cruza usuarios. **En AI App Fit esto se cumple por ausencia de persistencia:** ninguna spec del MVP puede introducir una store persistente de datos de negocio (DB, cache con datos de usuario, log del contenido del formulario, archivo). Si una feature futura introduce persistencia, MUST materializar #1 con una columna de dueño/tenant y política de scope/RLS **antes** de shippear. Modo de falla: un dato de un usuario queda accesible para otro (o se filtra por un log/cache no scopeado) — el aislamiento que hoy es gratis se rompe en silencio en cuanto algo empieza a guardarse.
- **⛔ `#6`** — El servidor MUST tratar el request como stateless: no escribe las respuestas del formulario ni el diagnóstico a ninguna store durable (disco, DB, cola, log de contenido). Refuerzo operativo de #1. Modo de falla: un logging descuidado o una cache "temporal" reintroduce persistencia y con ella la carga de aislamiento que hoy no existe.

> Nota para el loop principal (`architecture-author`): este archivo es el **dueño** propuesto de la fila #1 en `../sdd/constitucion.md` (hoy _pendiente_). No edité la constitución.

---

## 3. Contrato con otras capas

- **Con la UI (formulario, M1):** produce el **payload de entrada** de §1.2. La UI mantiene el estado de los 4 pasos en memoria del browser y no depende de ninguna store del servidor.
- **Con el endpoint / integración LLM (M0, [`integracion-llm.md`](integracion-llm.md)):** el endpoint recibe el payload de §1.2, lo pasa al LLM (tras el gate de presupuesto #3 y con la API key de entorno #2) y devuelve el **diagnóstico** de §1.2. **Garantía que este documento impone:** el endpoint no persiste ni el payload ni la respuesta.
- **Con observabilidad/logs:** cualquier logging MUST evitar volcar el contenido del formulario (PII potencial). Ver `## Abierto`.

## 4. Alternativas consideradas

- **DB mínima «solo para analítica/historial».** Descartada: el PRD la pone fuera de alcance (§7) y contradice el principio «sin fricción / sin DB» (§2.1). Además reintroduciría la carga de #1 (scope/RLS) que hoy es gratis. Decisión durable → registrar en [`../../DECISIONS.md`](../../DECISIONS.md).
- **`sessionStorage`/`localStorage` como «persistencia».** `sessionStorage` es aceptable solo como buffer de navegación entre los 4 pasos (vive en el browser del propio usuario, muere con la pestaña — no cruza usuarios, no viola #1). `localStorage` (persistente entre sesiones) se evita: acumularía datos de negocio en el dispositivo sin necesidad.
- **Identificador de sesión persistido en servidor.** Descartado para el MVP: introduce estado servidor y una noción de «dueño» que el producto no necesita. Ver `## Abierto` para la variante efímera solo-en-memoria para logs.

## Abierto

> **Diferido en M0 (2026-08-11).** El slice de observabilidad (los dos ítems de abajo) se difiere; **#6 sigue vigente** y M0-02 lo verifica (no se loguea el contenido del form ni el diagnóstico). ⚠️ Sin milestone destino declarado por el PRD — **gap del PRD** a resolver por el owner (PRD §7 o milestone futuro). Ver [`DECISIONS.md`](../../DECISIONS.md) y [`plans/active/m0-esqueleto-llm.md §5`](../sdd/plans/active/m0-esqueleto-llm.md).

- `[?]` **Identificador efímero de correlación de logs sin PII.** ¿Conviene un id de request generado en memoria (UUID por request, nunca persistido, sin vínculo a identidad) para correlacionar logs/errores de una misma llamada, sin volcar el contenido del formulario? Si se adopta, MUST ser efímero y no-identificante — no debe reintroducir estado de negocio ni una identidad de usuario. Lo decide la spec de M0/observabilidad.
- `[?]` **Política de no-logging del contenido del formulario.** ¿Dónde se fija y cómo se verifica que las 4 respuestas y el diagnóstico no terminen en logs de aplicación, de plataforma (hosting) o del proveedor LLM? Toca a [`integracion-llm.md`](integracion-llm.md) (qué manda el proveedor con el prompt) y a la config de deploy. Candidato a que el invariante de no-persistencia (§2) lo cubra explícitamente.
