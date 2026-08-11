<!-- Constitución del proyecto — sembrada con las 5 reglas piso del método. Agregá las tuyas siguiendo el patrón de familias/filas. Los dueños _pendiente_ los completa /new-architecture. -->

# La constitución — las reglas innegociables

> **Dueño de:** la lista canónica de reglas no negociables del sistema, numerada y citable. Nada más.
> **No cubre:** el enunciado completo de cada regla ni su razonamiento — eso vive en el archivo de diseño dueño, linkeado en cada fila. Este archivo **numera y linkea; no redefine**.
> **Última revisión:** `<fecha>`

---

## Qué es una constitución en este arnés

La constitución es el set de reglas **MUST / MUST NOT** del proyecto: los invariantes que ninguna spec puede violar. Cada regla vive junto al concepto que gobierna —en su documento de diseño dueño, con su razonamiento y su modo de falla—; lo que falta, y lo único que aporta este archivo, es **una lista con números estables** para poder decir "esta spec toca #3 y #12" sin transcribir la regla.

La regla vive en su archivo dueño; acá tiene un número. Cada fila linkea a su dueño.

Las reglas se agrupan en **familias temáticas** (letras: `A`, `B`, `C`, …), cada una con un nombre corto. La numeración de reglas es global y **estable**: un número no se reutiliza aunque su regla se retire.

## Cómo se agrega y cómo se cita una regla

- **Agregar una regla.** Se escribe primero en su documento de diseño dueño (marcada como invariante). Después se le da acá el **siguiente número libre**, dentro de la familia que le corresponde, con una fila que enuncia la regla en una línea y linkea al dueño. Si la familia no existe todavía, se crea con su letra y nombre.
- **Citar una regla.** Siempre por `#<n>` (ej.: `#7`, o `#3 y #12`). Nunca se transcribe el enunciado fuera de este archivo ni de su dueño: si estás re-explicando una regla, va un `#<n>` y un link. **Un hecho, un dueño.**
- **Cambiar una regla.** Se actualiza en el archivo dueño **y** se buscan todos los lugares que la mencionan (specs, otros docs). Esta lista es la herramienta para encontrarlos.

## Cómo se usa en las specs

Toda spec completa la tabla de gates de [`specs/TEMPLATE.md`](specs/TEMPLATE.md) §5 con una fila por regla que declara tocar: `¿Aplica?` (✅ / N/A) y **cómo se cumple y se verifica en esa spec**. Un `N/A` sin justificación no es un `N/A` — es una regla que nadie miró.

Podés declarar **reglas condicionales de aplicación** (qué reglas se vuelven obligatorias según lo que toca la spec) en una tabla como esta:

| Si la spec… | Entonces son obligatorias |
|---|---|
| toca datos de negocio / la base de datos | `#1` |
| maneja credenciales, API keys o secretos | `#2` |
| consume un LLM o cualquier servicio pago | `#3` |
| ejecuta un write con efecto hacia afuera (mail, pago, publicación) | `#4` |
| **cualquiera** | `#5` (hecho = las 3 capas en verde) |

---

> **Estado de siembra.** Estas cinco reglas son el piso del método. Sus **dueños** (el archivo de diseño donde vive el enunciado completo) los crea `/new-architecture` — hasta entonces figuran como _pendiente_ y `architecture-author` reconcilia el link cuando escribe el archivo. Ya se pueden **citar por `#<n>`** desde las specs.

## A · Aislamiento y datos

Gobierna cómo se guardan y se aíslan los datos de cada usuario.

| # | Regla | Dueño |
|---|---|---|
| **1** | Todo dato de negocio MUST estar acotado a su usuario dueño (scope/RLS); ningún acceso cruza usuarios. | [`docs/arquitectura/modelo-de-datos.md`](../arquitectura/modelo-de-datos.md) §2 |
| **6** | El servidor MUST tratar cada request como stateless: no persiste las respuestas del formulario ni el diagnóstico en ninguna store durable (disco, DB, cola, log de contenido). Refuerzo operativo de #1. | [`docs/arquitectura/modelo-de-datos.md`](../arquitectura/modelo-de-datos.md) §2 |

## B · Secretos y costo

Gobierna credenciales y gasto.

| # | Regla | Dueño |
|---|---|---|
| **2** | API keys y secretos MUST venir de variables de entorno / secret manager; NUNCA en el código ni en el repo. | [`docs/arquitectura/integracion-llm.md`](../arquitectura/integracion-llm.md) §2 |
| **3** | Todo consumo de LLM o servicio pago MUST tener un techo de gasto (gate de presupuesto) antes de ejecutar. | [`docs/arquitectura/integracion-llm.md`](../arquitectura/integracion-llm.md) §2 |

## C · Control humano (HITL)

Gobierna las acciones con efecto hacia afuera.

| # | Regla | Dueño |
|---|---|---|
| **4** | Toda acción con efecto hacia afuera (mail, pago, publicación) MUST pasar por aprobación humana explícita. | [`docs/arquitectura/stack-y-deploy.md`](../arquitectura/stack-y-deploy.md) §2 (N/A por diseño en el MVP: sin efectos externos) |

## D · Verificación

Gobierna qué significa "terminado".

| # | Regla | Dueño |
|---|---|---|
| **5** | Hecho = las 3 capas en verde, en orden (unit+linter → integración/aislamiento → contrato/e2e). Ninguna unidad se cierra sin esto. | [`../sdd/README.md` § Lifecycle](README.md#lifecycle) |

<!--
Agregá más familias y filas siguiendo el patrón. Cada regla: número global estable (nunca se
reutiliza) + enunciado de una línea + link a su documento de diseño dueño (docs/arquitectura/<archivo>.md).
-->

---

## Abierto

`<Reglas reservadas o sin archivo dueño todavía. Numeralas acá para que no se pierdan; el número queda vacante hasta que la regla tenga dónde vivir. Las reglas #1–#5 ya están sembradas arriba; su dueño se completa cuando /new-architecture crea el archivo de diseño.>`

```bash
grep -rn "#12\b" docs/sdd/specs/     # qué specs declararon tocar la regla 12
```
