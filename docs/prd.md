# AI App Fit — PRD

> **Este documento define el *qué*: alcance, orden y qué significa «terminado».**
> Manda cuando hay dudas sobre qué construir o en qué orden. El *cómo* vive en el diseño de arquitectura (`docs/arquitectura/`); ese diseño no re-decide lo que está acá.
>
> **Última revisión:** `2026-08-11`

---

## 1. Qué es AI App Fit

**AI App Fit es una web pública de una sola sesión donde un emprendedor describe su idea en un formulario corto y una IA le devuelve un diagnóstico personalizado de si esa idea encaja como *AI App*.**

- **Para quién:** emprendedores y product people en etapa temprana, que tienen una idea de producto pero no saben si tiene sentido construirla apoyada en IA ni por dónde empezar.
- **Qué promete:** en menos de dos minutos y sin registrarse, pasar de «tengo una idea difusa» a «tengo una lectura externa concreta: qué tan bien encaja, qué construir primero y cuál es mi mayor riesgo».
- **El activo diferencial:** no es el formulario ni la llamada al LLM (eso lo clona cualquiera). Es **el criterio de diagnóstico** — el prompt/rúbrica que convierte cuatro respuestas en prosa en un veredicto útil, honesto y accionable. El MVP existe para probar que ese criterio produce diagnósticos que valen la pena.

Este MVP prueba un **motor de diagnóstico** (input estructurado → juicio del LLM → salida accionable), no un vertical. Por eso se acepta por un loop cerrado y no por una lista de features.

## 2. Principios de diseño

1. **Sin fricción de entrada** — nada de login, cuenta ni base de datos. El valor se entrega en una sola sesión anónima.
2. **El loop antes que las features** — primero un camino de punta a punta que funciona una vez; recién después, pulido.
3. **El diagnóstico es el producto** — el valor vive en la calidad del juicio de la IA, no en la UI. La UI sólo tiene que no estorbar.
4. **Honesto antes que halagador** — el veredicto puede decir «encaja bajo». Un diagnóstico que siempre felicita no sirve.
5. **Toda llamada paga pasa por un techo** — no hay llamada al LLM sin un gate de presupuesto antes (ver §6).
6. **Base primero** — nada se construye hasta que la demanda real lo llame; el alcance se acorta quitando features, nunca el DoD.

---

## 3. El MVP

**El objetivo del MVP es probar que el motor de diagnóstico produce un veredicto útil a partir de cuatro respuestas reales**, no tener un formulario lindo con muchas opciones.

### 3.1 Criterio de aceptación

**El MVP se acepta por un resultado observable de punta a punta, no por una lista de features.**

```
Un emprendedor entra a la URL pública
  → completa el formulario de 4 pasos (qué hace / para quién / qué problema / si validó)
  → envía y ve un estado de carga mientras la IA procesa
  → recibe en pantalla un diagnóstico con: grado de encaje + explicación, primer módulo a construir, principal riesgo
  → puede leerlo, entenderlo y (si quiere) volver a empezar con otra idea
```

Si eso corre de punta a punta **una vez** con una idea real y el diagnóstico es coherente con lo que se ingresó, el motor de diagnóstico está probado. Este es el único criterio de aceptación del MVP; los DoD del resto de los milestones son condiciones necesarias.

**Forma fija del diagnóstico** (contrato de salida de la IA):
- **Encaje como AI App:** un grado (**Alto / Medio / Bajo**) + un párrafo que lo justifica.
- **Primer módulo a construir:** el único componente por el que conviene empezar.
- **Principal riesgo:** el riesgo #1 que puede hundir la idea.

Idioma de la respuesta: **español neutro**.

---

## 4. Milestones

Tres milestones, en orden. El orden no se negocia: cada uno existe porque el siguiente lo necesita.

### M0 — Esqueleto desplegado + llamada al LLM verificada

**Objetivo:** una URL pública viva que, dado un input fijo de prueba, llama al LLM y devuelve el diagnóstico en las tres partes de §3.1.

**Por qué primero:** es la parte de mayor riesgo y la base de todo. Sin una llamada al LLM que devuelva la salida en la forma esperada, no hay producto; construir el formulario antes sería decorar una cañería que no sabemos si funciona.

**Definition of Done**
- [ ] La app está desplegada en una URL pública accesible.
- [ ] Existe un endpoint que recibe las 4 respuestas y devuelve el diagnóstico con las 3 partes (grado+explicación, primer módulo, riesgo).
- [ ] La API key sale de una variable de entorno / secret, nunca del código, y hay un gate de presupuesto antes de la llamada paga.
- [ ] Con un input de prueba fijo, el diagnóstico devuelto es coherente y respeta la forma fija.
- [ ] Las preguntas abiertas que vencen acá están cerradas o diferidas por §9.1, con su entrada en [`DECISIONS.md`](../DECISIONS.md).

**Qué construye / qué no toca:** todo net-new (deploy, endpoint, integración LLM). Sin UI de formulario todavía.

### M1 — Formulario de 4 pasos

**Objetivo:** un formulario multi-step de 4 pasos que recoge las respuestas y las deja listas para enviar.

**Por qué acá:** necesita el endpoint de M0 como destino; sin él, el form no tendría a dónde enviar.

**Definition of Done**
- [ ] Los 4 pasos existen y se navegan hacia adelante y atrás sin perder lo ya cargado.
- [ ] Pasos 1–3 son texto libre (qué hace / para quién / qué problema resuelve); paso 4 es una selección estructurada de validación (**No / Un poco / Sí, con clientes**).
- [ ] No se puede enviar con los campos obligatorios vacíos (validación mínima).
- [ ] El envío arma el payload que el endpoint de M0 espera.

**Qué construye / qué no toca:** UI net-new. No toca el criterio de diagnóstico (vive en M0).

### M2 — El loop cerrado (prueba §3.1)

**Objetivo:** conectar formulario → IA → pantalla de resultado, con los estados de carga y error, de modo que el criterio de aceptación de §3.1 corra de punta a punta. **Este milestone prueba §3.1.**

**Por qué acá:** cierra el loop; sólo tiene sentido cuando M0 (motor) y M1 (entrada) existen.

**Definition of Done**
- [ ] Enviar el formulario dispara la llamada real y muestra un estado de carga mientras la IA procesa.
- [ ] El diagnóstico se muestra en pantalla legible, con sus 3 partes claramente separadas.
- [ ] Hay un estado de error visible si la IA falla o tarda de más (no una pantalla en blanco).
- [ ] Se puede empezar de nuevo con otra idea sin recargar a mano.
- [ ] El criterio de §3.1 corre de punta a punta al menos una vez con una idea real y el diagnóstico es coherente con lo ingresado.

**Qué construye / qué no toca:** cableado + pantalla de resultado + estados. No agrega features fuera del loop.

---

## 5. NFRs y umbrales operativos

| Métrica | Objetivo inicial | Cómo se mide | Desde |
|---|---|---|---|
| Latencia del diagnóstico (envío → resultado) | p95 < 15 s 🎯 | tiempo de respuesta del endpoint | M2 |
| Disponibilidad de la URL pública | 99% mensual 🎯 | healthcheck / uptime del hosting | M0 |
| Costo por diagnóstico | < USD 0,05 por llamada 🎯 | tokens × precio del modelo | M0 |
| Techo de gasto total | límite mensual con corte antes de la llamada | gate de presupuesto (ver §6) | M0 |

---

## 6. Riesgos, con su techo aceptado

| # | Riesgo | Techo aceptado / disparador de acción |
|---|---|---|
| 1 | **Costo del LLM sin control** — al ser público y anónimo, un pico de uso (o abuso) dispara la factura en silencio. | Gate de presupuesto ANTES de cada llamada paga; al cruzar el techo mensual, se corta la llamada y se muestra «no disponible» en vez de seguir gastando. |
| 2 | **Diagnóstico de baja calidad o fuera de forma** — la IA responde algo genérico, incoherente o sin las 3 partes. | Se tolera algún diagnóstico flojo en el MVP; si la forma fija se rompe (faltan partes), se ajusta el prompt/rúbrica antes de M2 cerrar. |
| 3 | **Latencia alta** — la respuesta tarda tanto que el usuario abandona. | Hasta ~15 s (p95). Pasado eso, se muestra estado de error/timeout claro y opción de reintentar. |
| 4 | **Abuso del endpoint público** — al no haber login, cualquiera puede automatizar envíos. | Se acepta sin rate limit fino en el MVP mientras el gate de presupuesto (#1) siga siendo el corte duro; si el gasto por abuso se vuelve el modo de falla dominante, se agrega rate limiting (fuera del MVP, §7). |

---

## 7. Fuera de alcance

### Fuera del MVP, previsto para después
- **Guardar diagnósticos / historial** — requiere base de datos; explícitamente fuera («form → IA → resultado», sin DB).
- **Captura de email / enviar el diagnóstico por correo** — decidido como 100% anónimo pantalla→pantalla en el MVP.
- **Rate limiting / anti-abuso fino** — mientras el gate de presupuesto sea el corte duro (§6 #1).
- **Compartir el resultado (link, PDF, export)** — sin persistencia no hay qué compartir.

### Fuera de alcance, sin fecha
- **Cuentas de usuario / autenticación.**
- **Panel de administración, analítica de producto, A/B testing del prompt.**
- **Monetización / pagos.**
- **Diagnóstico multi-idioma más allá de español neutro.**

---

## 8. Preguntas abiertas de producto

1. **¿El grado de encaje debe ser 3 niveles (Alto/Medio/Bajo) o conviene un score numérico?** Empezamos con 3 niveles por legibilidad; revisar si al ver diagnósticos reales el nivel resulta demasiado grueso. *Cerrar antes de M2.*
2. **¿Hace falta un disclaimer de que es una lectura orientativa de una IA, no una consultoría?** Importa por expectativa del usuario y cobertura básica. *Cerrar antes de M2.*

---

## 9. La regla de gestión

> **Los milestones no se acortan quitando Definition of Done. Se acortan quitando alcance.**

Un DoD recortado produce un milestone que parece cerrado y no lo está: la deuda queda escondida en un checkbox tildado. Un alcance recortado produce un milestone más chico y honesto, y lo que sacaste queda visible en §7.

Aplica igual hacia abajo: una spec no se cierra sin sus capas de verificación en verde (ver [`sdd/constitucion.md`](sdd/constitucion.md) y el plan de verificación de [`sdd/specs/TEMPLATE.md`](sdd/specs/TEMPLATE.md)).

### 9.1 Cómo se difiere algo — las cuatro condiciones

**Una decisión de diferir es válida solo con las cuatro. Sin las cuatro, no se difiere: se arregla ahora.**

| | Condición | Por qué |
|---|---|---|
| **a** | **Milestone destino nombrado** | «Más adelante» no es una fecha. Sin milestone, va a §7 |
| **b** | **Dueño** | Una deuda sin dueño la paga quien la tropieza |
| **c** | **Un ítem de DoD en ese milestone destino** | Es la única que obliga mecánicamente a volver |
| **d** | **Entrada en** [`DECISIONS.md`](../DECISIONS.md) **con el porqué y la alternativa descartada** | En seis meses la pregunta es *por qué*, no *qué* |

> ### ⛔ La excepción que no existe
>
> **Nada que toque el techo de gasto del LLM (§6 #1) se difiere. Nunca, por ninguna de las cuatro vías.** Es el riesgo con techo cero que falla en silencio: sin el gate de presupuesto, cada llamada gasta dinero real sin tirar excepción. Cada milestone que estrena una llamada paga lleva su verificación del gate, y ninguna es negociable contra la fecha.

**Deuda viva, aceptada con las cuatro condiciones:**

| Qué se difiere | Desde | Hasta | Dueño | Cobrado por |
|---|---|---|---|---|
| _(vacío — sin deuda viva)_ | — | — | — | — |

Diferir algo es agregarle una fila. Si está vacía, no hay deuda viva.
