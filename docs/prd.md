<!-- PLANTILLA — PRD (el *qué*: alcance, orden y Definition of Done). Copiá y completá los placeholders <...>. Borrá esta línea y las notas «› guía:» al terminar. -->

# <Nombre del producto> — PRD

> **Este documento define el *qué*: alcance, orden y qué significa «terminado».**
> Manda cuando hay dudas sobre qué construir o en qué orden. El *cómo* vive en el diseño de arquitectura (por convención, `docs/arquitectura/`, que creás por proyecto); ese diseño no re-decide lo que está acá.
>
> **Última revisión:** `<AAAA-MM-DD>`

---

## 1. Qué es `<el producto>`

› guía: una o dos oraciones que dejen claro QUÉ es esto y cuál es la apuesta central. Si hay una distinción que gobierna toda la arquitectura (el «centro» del sistema, lo que lo diferencia de la alternativa obvia), decila acá y explicá por qué no es semántica.

**`<El producto>` es `<qué es, en una frase>`.**

- **Para quién:** `<segmento de usuarios / tipo de organización>`.
- **Qué promete:** `<el cambio concreto en la vida del usuario — antes/después>`.
- **El activo diferencial:** `<qué es difícil de copiar — no la feature obvia, sino lo que queda cuando otro clona la feature obvia>`.

› guía: si tenés una apuesta estratégica (que el MVP prueba un *motor* reutilizable y no un vertical), dicha en voz alta. Es lo que justifica aceptar el MVP por un loop cerrado y no por una lista de features.

## 2. Principios de diseño

› guía: 5–10 principios innegociables que resuelven discusiones antes de que ocurran. Cada uno es una frase citable, no un párrafo. Reemplazá los ejemplos por los tuyos.

1. **`<Principio 1>`** — `<una línea de por qué>`.
2. **`<Principio 2>`** — `<...>`.
3. **`<Principio 3>`** — `<...>`.
4. `<...>`

---

## 3. El MVP

› guía: qué prueba el MVP y qué NO. El objetivo del MVP no suele ser «tener muchas features» sino cerrar **un** ciclo de valor de punta a punta. Nombrá el criterio de construcción que se deriva de esa elección (p. ej. «las primitivas se construyen acotadas al primer caso real, no en abstracto»).

**El objetivo del MVP es `<probar X con un caso real>`, no `<la lista larga de features>`.**

### 3.1 Criterio de aceptación

**El MVP se acepta por `<un resultado observable de punta a punta>`, no por una lista de features.**

```
<paso 1 — el disparador / el objetivo>
  → <paso 2>
  → <paso 3 — el punto de decisión / control humano si aplica>
  → <paso 4 — el resultado medible>
  → <paso 5 — el aprendizaje / cierre del loop>
```

Si eso corre de punta a punta **una vez**, `<lo que quería probarse>` está probado. Este es el único criterio de aceptación del MVP; los DoD del resto de los milestones son condiciones necesarias.

> › guía: si algún tramo del criterio tiene una dependencia de calendario oculta (una ventana de medición real, una espera), declarála acá y decidí si se acepta con una versión comprimida + verificación diferida. Una ambigüedad con consecuencia de fecha no declarada es deuda escondida.

---

## 4. Milestones

› guía: `<N>` milestones, en orden. El orden no se negocia: cada uno existe porque el siguiente lo necesita. Un milestone está terminado cuando **todos** los ítems de su DoD son verdaderos y **demostrables** — alguien lo puede ver correr, no alguien que dice que está hecho. IDs `M#`, anclados desde los roadmaps (`docs/sdd/plans/`). Abajo van 1–2 filas de EJEMPLO; replicá el patrón por cada milestone real.

### M0 — `<nombre del milestone cero>`

**Objetivo:** `<qué cierra este milestone, en una línea>`.

**Por qué primero:** `<qué se rompería si empezaras por otro lado>`.

**Definition of Done**
- [ ] `<condición verificable 1 — testable, no interpretativa>`
- [ ] `<condición verificable 2>`
- [ ] `<las preguntas abiertas que vencen acá están cerradas o diferidas por §9.1, con su entrada en>` [`DECISIONS.md`](../DECISIONS.md)

**Qué construye / qué no toca:** `<una línea para dimensionar antes de la primera spec: cuánto es net-new vs. modificación de lo existente>`.

### M1 — `<nombre>`

**Objetivo:** `<...>`.

**Por qué acá:** `<la dependencia que lo pone en esta posición>`.

**Definition of Done**
- [ ] `<...>`
- [ ] `<...>`

**Qué construye / qué no toca:** `<...>`.

› guía: `M2 … M#` con la misma estructura. Un milestone que es todo net-new se planifica distinto a uno que es mayormente modificación: declaralo. Uno de los milestones suele ser **el que prueba el criterio de aceptación de §3.1** — marcalo.

---

## 5. NFRs y umbrales operativos

› guía: sin esta tabla no hay observabilidad posible — un sistema de alertas necesita un umbral, no una intención. Poner un número imperfecto ahora desbloquea a quien construye y da algo contra qué alertar; se calibra con datos reales y el ajuste se registra acá. Marcá con 🎯 los objetivos razonados-pero-no-medidos.

| Métrica | Objetivo inicial | Cómo se mide | Desde |
|---|---|---|---|
| `<latencia de la operación crítica>` | `<p95 < N ms 🎯>` | `<fuente de la medición>` | `<M# / ya medido>` |
| `<disponibilidad>` | `<99% mensual>` | `<healthcheck>` | `<...>` |
| `<límite de costo / consumo si aplica>` | `<umbral>` | `<gate / hook>` | `<...>` |
| `<...>` | `<...>` | `<...>` | `<...>` |

---

## 6. Riesgos, con su techo aceptado

Un riesgo sin techo nombrado es una preocupación. Cada uno se acepta **hasta** un punto explícito; pasado ese punto, se actúa.

| # | Riesgo | Techo aceptado / disparador de acción |
|---|---|---|
| 1 | `<el riesgo, con su modo de falla — sobre todo si falla en silencio>` | `<hasta dónde se tolera; qué se hace al cruzarlo>` |
| 2 | `<...>` | `<...>` |
| 3 | `<...>` | `<...>` |

› guía: los riesgos técnicos con fecha de cierre (los que cambian el modelo de datos si se deciden tarde) no van acá: viven en la sección de preguntas abiertas de su archivo de diseño. Acá van los riesgos de producto y de ejecución.

---

## 7. Fuera de alcance

Lo de abajo **no se construye en el MVP**. No son milestones ni compromisos de fecha: son la lista explícita de lo que alguien va a pedir y hay que saber decir que no.

### Fuera del MVP, previsto para después
- `<feature que llega después — y, si el modelo debe dejarle la puerta abierta, qué garantiza el MVP para que sea agregable sin migración>`
- `<...>`

### Fuera de alcance, sin fecha
- `<lo que no se compromete a hacer; incluí acá la deuda que NO se paga con código — legal, comercial — con su disparador (p. ej. «el primer cliente real»)>`
- `<...>`

---

## 8. Preguntas abiertas de producto

› guía: las que no bloquean el arranque pero hay que responder antes de tener usuarios reales. Las preguntas abiertas **técnicas** viven en el archivo de diseño que corresponda, no acá. Cada una con su milestone de cierre.

1. **`<pregunta>`.** `<por qué importa>`. *Cerrar antes de `<M#>`.*
2. `<...>`

---

## 9. La regla de gestión

> **Los milestones no se acortan quitando Definition of Done. Se acortan quitando alcance.**

Un DoD recortado produce un milestone que parece cerrado y no lo está: la deuda queda escondida en un checkbox tildado. Un alcance recortado produce un milestone más chico y honesto, y lo que sacaste queda visible en §7 para decidirlo después.

Aplica igual hacia abajo: una spec no se cierra sin sus capas de verificación en verde (ver las reglas de [`sdd/constitucion.md`](sdd/constitucion.md), que definís por proyecto, y el plan de verificación de [`sdd/specs/TEMPLATE.md`](sdd/specs/TEMPLATE.md)).

### 9.1 Cómo se difiere algo — las cuatro condiciones

A veces la respuesta correcta no es «sacarlo del alcance» sino «hacerlo más tarde». Es legítimo. Lo que no es legítimo es **diferir sin dejar quién lo cobra**: una deuda escrita que no debe nadie reaparece a mitad de otra cosa.

**Una decisión de diferir es válida solo con las cuatro. Sin las cuatro, no se difiere: se arregla ahora.**

| | Condición | Por qué |
|---|---|---|
| **a** | **Milestone destino nombrado** | «Más adelante» no es una fecha. Sin milestone, lo estás sacando del alcance — y eso va a §7, que se escribe distinto |
| **b** | **Dueño** | Una deuda sin dueño la paga quien la tropieza |
| **c** | **Un ítem de DoD en ese milestone destino** | Es la única que **obliga mecánicamente** a que alguien vuelva. Las otras tres son memoria; esta bloquea un cierre |
| **d** | **Entrada en** [`DECISIONS.md`](../DECISIONS.md) **con el porqué y la alternativa descartada** | En seis meses la pregunta no es *qué* se difirió sino *por qué*, y esa es la parte que la compactación pierde |

> ### ⛔ La excepción que no existe
>
> **Nada que toque `<el invariante crítico de tu producto — p. ej. aislamiento entre tenants, integridad de datos, seguridad>` se difiere. Nunca, por ninguna de las cuatro vías.**
>
> › guía: reservá esta excepción para el riesgo con **techo cero**, el que falla en silencio (no tira excepción, simplemente hace lo incorrecto). Diferirlo «un milestone» no deja una deuda: deja un milestone entero construido encima de una verificación que nadie hizo. Cada milestone que estrena `<lo que sea sensible>` lleva su ítem de verificación propio, y ninguno es negociable contra la fecha.

**Deuda viva, aceptada con las cuatro condiciones:**

| Qué se difiere | Desde | Hasta | Dueño | Cobrado por |
|---|---|---|---|---|
| `<qué>` | `<M#>` | `<M#>` | `<quién>` | `<el ítem de DoD que lo reclama>` |

Esta tabla se mantiene: **diferir algo es agregarle una fila**. Si está vacía, no hay deuda viva — y si algo se difirió sin aparecer acá, se difirió mal.

### 9.2 Propuesta: un gate mecánico de «sin restos» (opcional)

› guía: aplica sobre todo a milestones de migración/renombre grandes, donde las eliminaciones se listan a mano. Eso es verificable **por lectura** pero no por CI, y la lectura falla justo cuando más importa: en la pasada 40 de un renombre, a las nueve de la noche. Si tu proyecto tiene una migración así, considerá un gate mecánico —una lista de identificadores muertos en un archivo, consumida por un verificador de código (falla si el identificador reaparece) y uno de esquema (falla si la tabla/columna sigue existiendo)—, decidido **antes** de la primera spec del milestone y con su ítem de DoD. Qué NO hace, para no venderlo de más: no detecta lo que no está en la lista; su valor es que una eliminación declarada no se pueda deshacer en silencio tres specs después.
