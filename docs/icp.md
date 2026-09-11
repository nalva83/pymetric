# ICP — Pymetric

> **Estado: Hipótesis (N=0)** · Última actualización: 2026-09-07
>
> Este documento es la versión v1 del ICP: una apuesta razonada a partir de la idea del
> producto, sin evidencia directa de clientes todavía. Toda afirmación marcada
> "Hipótesis" debe tratarse como una apuesta a validar, no como un hecho.

## 1. Snapshot

| Campo | Valor |
|---|---|
| **Código** | ICP-01 |
| **Nombre memorable** | "El dueño que paga con su tiempo" |
| **Perfil en una línea** | Dueño/a de PyME de hasta 20 empleados que absorbe tareas repetitivas (sobre todo presupuestos) cuyo costo real no ve, y que le sacan tiempo al crecimiento del negocio. |
| **Estado** | Hipótesis — a validar (N=0) |
| **Rol** | Dueño/a o gerente general, sin equipo de IT/datos propio |
| **Tamaño de empresa** | Hasta 20 empleados |
| **Nivel de conciencia (Schwartz)** | Problem-aware — Estimado: siente el dolor y probó soluciones genéricas (ChatGPT suelto, plantillas) que no le "pegaron"; no conoce todavía una solución específica para su caso |
| **Contexto comercial** | Sin datos — no se identificó competidor ni solución casera puntual donde ya gaste plata/tiempo hoy |

## 2. Perfil y contexto

Dueño/a o gerente de una PyME de hasta 20 empleados que además de dirigir el negocio
absorbe tareas operativas repetitivas y de bajo valor: redacción de
presupuestos/cotizaciones, conciliación de gastos, reportes manuales. No tiene equipo
de IT ni de datos.

**La trampa que lo define:** el tiempo que estas tareas insumen es, en el fondo, un
costo — no lo ve como "horas perdidas" sino como plata que podría estar destinada a
hacer crecer el negocio (vender más, mejorar producto, conseguir clientes) y en cambio
se va en tareas que no generan valor directo. La redacción de presupuestos es el
ejemplo más claro: consume mucho tiempo y el resultado es incierto (no sabe si esa
cotización va a convertir), así que es tiempo invertido con retorno dudoso — la peor
combinación de costo. *(Hipótesis — a validar)*

**Contexto que refuerza el problema:** presión de costos y márgenes ajustados típicos
de PyME, cultura de "lo hago yo porque contratar sale caro", y el estigma de que la
IA/automatización "es para empresas grandes". *(Hipótesis — a validar)*

## 3. Jobs To Be Done (JTBD)

| Tipo | JTBD |
|---|---|
| **Funcional** | Cuando tengo que armar un presupuesto o repetir una tarea administrativa (conciliar gastos, cotizar), quiero automatizarla o resolverla más rápido, para poder recuperar ese tiempo/costo y destinarlo a crecer el negocio. |
| **Emocional** | Quiero dejar de sentir que "pierdo plata" en tareas que no debería estar haciendo yo — sentir que cada hora del día suma al negocio, no que se diluye en trabajo administrativo. |
| **Social** | Quiero que mi negocio se vea (ante clientes, proveedores, familia/socios) tan prolijo y profesional como el de una empresa más grande, sin tener su estructura ni su costo. |

**JTBD priorizado (confirmado por el owner):** el funcional — reducir el costo/tiempo
de tareas repetitivas, con la **redacción de presupuestos** como caso más agudo (alto
esfuerzo + resultado incierto = el peor ratio costo/beneficio). Es el que mejor
conecta con la promesa central del producto ("automatización" + "análisis de
costos").

## 4. Problema núcleo

**El dueño de una PyME chica financia el crecimiento de su negocio con su propio
tiempo, en vez de con sistemas — y confunde "estar ocupado todo el día" con "el
negocio está funcionando".** *(Hipótesis — a validar)*

El error de razonamiento que lo perpetúa: cree que automatizar/tercerizar estas tareas
es un gasto adicional que no puede pagar, cuando en realidad ya las está pagando — con
su tiempo, que es el recurso más caro y más escaso que tiene. No calcula el costo de
oportunidad de las horas que pasa armando presupuestos o conciliando gastos a mano;
solo ve el costo visible (contratar a alguien, pagar una herramienta) y no el costo
invisible (lo que deja de vender o mejorar mientras hace tareas repetitivas).

Es urgente porque cada presupuesto mal armado o tardío es una venta que se enfría, y
es importante porque escala mal: a medida que crece el negocio, este problema no se
resuelve solo — empeora.

## 5. Dolores

*(Hipótesis — a validar, sin evidencia directa todavía; confirmado por el owner como
razonables)*

**Económicos:**
- Pierde ventas por presupuestos que llegan tarde o mal calculados (a veces cotiza mal
  y pierde margen; a veces tarda tanto que el cliente ya eligió a otro).
- El "costo oculto" de horas propias en tareas administrativas que no generan ingreso
  directo.
- No puede invertir ese tiempo/plata en lo que sí hace crecer el negocio (ventas,
  producto, marketing).

**Emocionales:**
- Frustración de sentir que trabaja muchas horas pero el negocio "no avanza".
- Ansiedad al armar un presupuesto sin certeza de si el número es correcto o si va a
  convertir.
- Culpa/fatiga de saber que debería estar enfocado en crecer y en cambio está en
  tareas operativas.

**Sociales/identidad:**
- Se ve a sí mismo (y quiere que lo vean) como alguien que dirige un negocio serio y
  profesional, no como alguien "apagando incendios" administrativos todo el día.

## 6. Situación disparadora (evento desencadenante)

*(Hipótesis — a validar, sin evidencia real todavía; primera batería de preguntas
para las próximas conversaciones)*

- **Perdió una venta concreta** por un presupuesto tardío o mal calculado — puede
  señalar el cliente y el monto perdido.
- **Un pico de trabajo** (temporada alta, un cliente grande nuevo) lo desborda y ya no
  da abasto haciendo todo a mano — la tarea que antes "molestaba" ahora directamente
  no llega a tiempo.
- **Vio a un competidor o colega moverse más rápido** (cotiza al toque, se ve más
  profesional) y sintió que se está quedando atrás.
- **Alguien de confianza que hacía estas tareas se va** (se enferma, renuncia, está de
  vacaciones) y el dueño descubre que todo el proceso vivía en la cabeza de esa
  persona — o en la suya.

## 7. Barreras y creencias

**Barreras de entrada** *(Hipótesis — a validar)*:
- Desconfianza técnica: no sabe si va a poder "configurar" una herramienta de IA sin
  ayuda de alguien técnico.
- Miedo a que la automatización cometa un error caro (un presupuesto mal calculado por
  la herramienta es peor que uno tardío hecho a mano).
- Percepción de que esto es "un proyecto" (implementar, migrar datos, aprender) cuando
  lo que necesita es algo que funcione ya, sin fricción.

| Creencia errónea | Verdad que ofrecemos | Microacción |
|---|---|---|
| "La IA/automatización es para empresas grandes con presupuesto de IT" | Se puede automatizar una tarea puntual (como armar presupuestos) sin estructura técnica propia | Automatizar la primera tarea repetitiva sin tocar nada más del negocio |
| "Si contrato/pago una herramienta, es un gasto nuevo que no puedo sumar" | Ya está pagando ese costo con su tiempo — la herramienta lo hace visible y lo reduce | Calcular junto al dueño cuánto le cuesta hoy (en horas) la tarea que más le pesa |
| "Automatizar esto le va a quitar calidad/criterio a mis presupuestos" | La herramienta no reemplaza su criterio, elimina el trabajo mecánico alrededor de aplicarlo | Mostrar un presupuesto armado con la herramienta y dejar que él/ella lo ajuste antes de enviarlo |

## 8. Lenguaje que resuena

*(Hipótesis — lenguaje supuesto, a validar; todavía no son citas reales)*

**Frases supuestas:**
- "No doy abasto"
- "Se me va el día en esto"
- "Tengo que sentarme a armar el presupuesto" (como una tarea pesada, no rápida)
- "Estoy perdiendo plata en esto y ni me doy cuenta"

**Conceptos que conectan:** hablarle en términos de **tiempo = plata** y **costo
oculto**, no en términos de "tecnología" o "digitalización". La automatización se
vende como *recuperar horas para el negocio*, no como *modernizarse*.

**Registro/tono:** directo, concreto, sin jerga técnica ni de IA ("modelos",
"prompts", "agentes"). Hablarle en términos de negocio (costo, tiempo, margen, plata),
no de producto.

**Nunca usar con este ICP:** "transformación digital", "disrupción", "inteligencia
artificial de última generación" — suena a venta de humo y activa la desconfianza
descrita en las barreras. Tampoco "automatización" a secas sin anclarla a una tarea
concreta — es abstracto y no genera reconocimiento.

## Supuestos abiertos

Las hipótesis más riesgosas — si alguna de estas es falsa, el ICP necesita
corregirse antes de construir la oferta sobre él:

- 🔴 **El disparador real de compra.** No sabemos todavía cuál de los cuatro eventos
  listados en la sección 6 es el que efectivamente mueve a un dueño de PyME a buscar
  una solución — sin esto, el timing del mensaje es una apuesta a ciegas.
- 🔴 **Que el dolor de "presupuestos" sea realmente el más agudo.** Se priorizó por
  criterio del owner, no por evidencia de clientes; otra tarea repetitiva (facturación,
  conciliación bancaria) podría pesar más en la práctica.
- 🔴 **Que el costo de oportunidad del tiempo sea un argumento que el dueño de PyME
  "compre" mentalmente.** La lógica de "tu tiempo tiene un costo" es intuitiva para
  quien arma el ICP, pero puede no ser cómo el cliente real racionaliza su propio
  problema — falta confirmar con lenguaje real, no supuesto.

## Próximo paso

Validar estas hipótesis con 3-5 conversaciones reales con dueños de PyME antes de
construir mensajería o producto sobre ellas. Prioridad: confirmar el disparador
(sección 6) y la frase real con la que describen el problema (sección 8).
