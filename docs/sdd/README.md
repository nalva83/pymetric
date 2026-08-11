# SDD — de un milestone a código

> **Dueño de:** el proceso de autoría y cierre de unidades de trabajo. Qué es un roadmap, qué es una spec, quién es canónico para el estado, y el lifecycle.
> **No cubre:** el alcance ni el orden de construcción → [`../prd.md`](../prd.md) · el diseño de cualquier cosa → el documento de diseño dueño del concepto · las reglas innegociables → [`constitucion.md`](constitucion.md).
> **Última revisión:** `<fecha>`

---

## El problema que resuelve

El PRD dice *qué* construir y *cuándo está terminado*. El diseño dice *cómo funciona*. Entre "el DoD de un milestone dice que tal suite pasa en verde" y alguien escribiendo código hay un salto, y ese salto es donde se pierde el rigor: se olvida un gate, se cierra sin la capa 2, se decide algo durable en un mensaje de commit.

Esta carpeta es ese puente. Una unidad de trabajo = una spec con contrato, criterios de aceptación que son tests, gates declarados y una definición de hecho que no se negocia.

## El flujo

El método es **Spec-Driven Development**, un recorrido de **idea → PRD → arquitectura → roadmap → specs → implementación → deploy**, con un equipo de agentes que protagoniza cada etapa. Los comandos encadenan las etapas de autoría; la implementación y las revisiones se dictan en lenguaje natural al agente que corresponde (ver `../../CLAUDE.md § El equipo de agentes`).

| Etapa | Comando / disparo | Produce |
|---|---|---|
| 1 · PRD (el *qué*) | **`/new-prd`** (`prd-author`) | `../prd.md`: MVP + milestones con DoD + no-objetivos |
| 2 · Arquitectura (el *cómo*) | **`/new-architecture`** (`architecture-author` → fan-out `data-modeler`) | `../arquitectura/*` + filas en `constitucion.md` |
| 3 · Roadmap | **`/new-roadmap`** (`roadmap-author`) | `plans/active/<slug>.md`: tabla de SPECs (§8) |
| 4 · Specs | **`/decompose`** (`spec-author`, fan-out) | `specs/<ID>-<slug>.md` (una por slice) |
| 5 · Implementación | *prosa* → `spec-implementer` · `spec-verifier` · `ux-reviewer` | código con las 3 capas en verde |
| 6 · Conexión IA / costo | *prosa* → `spec-implementer` · `cost-guardian` | integración con techo de gasto y secretos seguros |
| 7 · Deploy | **`/deploy-check`** (`deploy-engineer`) | checklist "listo para producción" |

Transversal: **`/save-point`** crea un punto de retorno con Git antes de un cambio grande (red de seguridad); `onboarding-guide` corre el ritual de inicio de sesión.

## Tres conceptos que conviene no mezclar

| Concepto | Qué es | Dónde vive |
|---|---|---|
| **Roadmap** | El **índice y el estado** de un milestone o feature: qué specs hay, en qué orden, qué falta. Transitorio. **Canónico para el estado** | `plans/active/` → `plans/archive/` al cerrar |
| **Spec** | El **contrato** de UNA unidad atómica: objetivo, requisitos, gates, criterios, DoD. Durable | `specs/<ID>-<slug>.md` |
| **Plan de implementación** | El *cómo* técnico de esa spec | **Adentro de la spec** (§2, §6, §8, §10). No es un archivo aparte |

> **Regla anti-drift.** El estado canónico es la fila del roadmap. El `status` del frontmatter de la spec es un **espejo**: al cerrar se actualizan los dos. La spec apunta a su roadmap con `plan_row`; el roadmap apunta al archivo de spec.

El **roadmap maestro** —alcance del MVP y orden de los milestones— es [`../prd.md`](../prd.md), no esta carpeta. Un roadmap de `plans/` descompone **un** milestone o **una** feature.

## Convención de archivos

```
docs/sdd/
├── README.md          ← este archivo
├── constitucion.md    ← las reglas innegociables, numeradas y citables
├── specs/
│   ├── TEMPLATE.md    ← plantilla canónica (copiar, no editar)
│   └── <ID>-<slug>.md
└── plans/
    ├── TEMPLATE.md
    ├── active/
    └── archive/
```

- **`<ID>`** anclado al milestone del PRD: `M#-##`. El número mayor es el milestone, el menor el orden dentro del milestone. Para una spec suelta se admite `SPEC-##`, pero la preferida es `M#-##`.
- **`<slug>`** kebab-case, corto y descriptivo.
- Una spec = un archivo. Si necesita diseño extenso, va un hermano `<ID>-<slug>.design.md`.
- Una feature grande se sub-numera (`M3-05-1`, `M3-05-2`, …) y **el orden se codifica con `depends_on`**, no con la posición en la tabla. El porqué de la feature entera vive en el roadmap que las agrupa.

## Lifecycle

1. **Crear** — copiar `specs/TEMPLATE.md` a `specs/<ID>-<slug>.md` y agregar su fila al roadmap activo (`status: draft`).
2. **Clarify** — resolver los requisitos vagos **antes** de codear. Las preguntas van al §5 del roadmap; si la pregunta es de diseño, se resuelve en el documento dueño del concepto y acá queda el puntero. `status: ready`.
3. **Implementar** — WIP=1, una spec a la vez. `status: in-progress`.
4. **Verify** — las 3 capas en orden: **unit + linter → integración y aislamiento → contrato y e2e**. Si una falla, **fix-plan antes de re-correr**. Nunca se salta una capa "porque la siguiente la cubre".
5. **Cerrar** — DoD completo → `status: done` en la spec **y** en el roadmap → decisión durable en [`DECISIONS.md`](../../DECISIONS.md) → al terminar la iteración, el roadmap se mueve a `plans/archive/`.

**Las specs cerradas no se borran.** Quedan como registro de por qué algo es como es.

## La constitución

Las reglas innegociables están numeradas en [`constitucion.md`](constitucion.md) y toda spec declara cuáles toca y **cómo las verifica**. La regla vive en su documento de diseño dueño; la constitución solo le da un número estable para poder citarla por `#<n>`.

Dos principios gobiernan este proceso:

> **Primero el rojo.** Ningún test se da por bueno sin ver fallar antes el caso que debe atrapar: se escribe el test, se lo ve en rojo sin la implementación, y recién después se da por bueno.

> **Hecho = las tres capas en verde**, en orden: unit + linter → integración y aislamiento → contrato y e2e. Ninguna unidad de trabajo se cierra sin esto.

Y un principio de orden que no es un gate: **base primero** — nada se construye hasta que la demanda real lo llame. Los milestones no se acortan quitando Definition of Done: se acortan quitando alcance.

## Qué NO va en una spec

- **Diseño.** Si al escribir una spec estás decidiendo *cómo* funciona algo del modelo, pará: eso va al documento de diseño dueño del concepto. La spec lo linkea.
- **Alcance.** Si estás decidiendo si algo entra o no en el MVP, va al [`../prd.md`](../prd.md).
- **Re-explicaciones.** Rige la misma regla que en el resto del corpus: **un hecho, un dueño**. Si sentís que estás transcribiendo una regla, va un `#<número>` y un link.
