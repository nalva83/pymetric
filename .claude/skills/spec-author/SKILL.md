---
name: spec-author
description: >-
  Autora una SPEC del proyecto con disciplina ESTÁNDAR y repetible, usando la plantilla
  canónica docs/sdd/specs/TEMPLATE.md. Se activa al crear o redactar una spec nueva,
  al correr /decompose (autoría en lote desde un roadmap, una spec por slice), al agregar una fila de
  SPEC a un roadmap de docs/sdd/plans/, al desambiguar requisitos antes de codear (clarify), al cruzar
  consistencia spec↔plan↔constitución (analyze), o cuando el usuario pregunta cómo escribir/estructurar
  una spec. Hace cumplir: misma plantilla siempre (objetivo + contexto brownfield + requisitos +
  no-objetivos + gates atados a las reglas de docs/sdd/constitucion.md + entregables + criterios
  de aceptación testables (el test es el contrato) + plan de verificación de 3 capas (unit+linter →
  integración/aislamiento → contrato/e2e) con fix-plan + DoD + presupuesto de contexto); el estado vive
  en el roadmap (sin doble fuente de verdad); WIP=1; nada se cierra sin las 3 capas en verde. Roba lo
  mejor de Spec Kit, OpenSpec y GSD.
---

# spec-author

Skill que estandariza **cómo se escribe una SPEC** en el proyecto. No construye producto:
produce el **contrato de trabajo** de una unidad atómica — con los mismos criterios de
aceptación (como tests), los mismos gates de seguridad y la misma definición de hecho **cada
vez**, anclada al milestone del PRD (IDs `M#-##`).

**Por qué existe:** tenías los *documentos* del proyecto (el diseño en `docs/arquitectura/`
y el PRD en `docs/prd.md`) pero **no un proceso estandarizado de autoría** de specs. Cada spec se
redactaría ad-hoc → criterios de aceptación y gates inconsistentes. Este skill cierra
ese gap robando:

- de **Spec Kit** → la constitución (reglas numeradas y citables) + los pasos `clarify` y `analyze`;
- de **OpenSpec** → liviano, brownfield-first, lifecycle propose→apply→archive;
- de **GSD** → presupuesto de contexto + fase Verify con **fix-plan** explícito.

La plantilla canónica es **`docs/sdd/specs/TEMPLATE.md`**. La convención y la relación
roadmap (`docs/sdd/plans/`) ↔ spec (`docs/sdd/specs/`) están en **`docs/sdd/README.md`**. La lista
canónica de las **reglas innegociables** vive en **`docs/sdd/constitucion.md`** (que las numera y
linkea, sin redefinirlas): el enunciado y el razonamiento de cada una están en su doc de diseño dueño
en **`docs/arquitectura/`** (uno por concepto, que creás por proyecto). El alcance y el orden (los
milestones del PRD, `M#`) los manda **`docs/prd.md`**.

---

## Cuándo se activa

- Al **crear una spec nueva** (vía `/decompose` o a mano).
- Al **correr `/decompose`** sobre un roadmap: este skill es el motor que `/decompose` itera
  una vez por slice de la tabla de SPECs (autoría en lote).
- Al **agregar/editar una fila de SPEC** en un roadmap de `docs/sdd/plans/` (`active/`, o uno nuevo de iteración).
- En el paso **clarify** (desambiguar requisitos vagos antes de codear).
- En el paso **analyze** (cruzar consistencia spec ↔ plan ↔ constitución antes de implementar).
- Cuando el usuario pregunta cómo escribir, estructurar o cerrar una spec.

---

## Doctrina que hace cumplir

1. **Una plantilla, siempre.** Toda spec se copia de `docs/sdd/specs/TEMPLATE.md`. No se omiten
   secciones; las que no aplican se marcan `N/A — <por qué>`, no se borran.
2. **El estado vive en el roadmap (sin doble fuente de verdad).** `docs/sdd/specs/<ID>-<slug>.md`
   es el **detalle/contrato**; el **estado canónico** es la fila del roadmap en `docs/sdd/plans/`
   (`plan_row`). El `status` del frontmatter es un espejo; al cerrar se actualizan **ambos**.
3. **ID anclado al milestone del roadmap.** El `<ID>` de la spec == su fila en el roadmap, con el
   patrón `M#-##` (milestone del PRD + orden). No se inventan IDs sueltos; para una spec fuera de
   milestone se admite `SPEC-##`.
4. **Gates obligatorios (la constitución).** La §5 de la plantilla se completa **siempre**, en sus
   dos partes: una línea por **familia** de la constitución (✅ o `N/A — <por qué>`) y, por cada
   familia ✅, **una fila por regla tocada** con cómo se cumple y cómo se verifica *en esa spec*. Un
   `N/A` sin justificación no es un `N/A` — es una regla que nadie miró. Las reglas que tu
   constitución marca como **obligatorias por condición** (según lo que la spec toca: la base de
   datos, un write con efectos hacia afuera, credenciales, una entidad de la capa de producto,
   superficie de UI, etc.) se declaran sí o sí cuando esa condición aplica; fuente:
   `docs/sdd/constitucion.md`.

   La regla **no se transcribe**: se cita por `#<n>` y se linkea a su doc de diseño dueño en
   `docs/arquitectura/`. Si `docs/sdd/constitucion.md` marca reglas como reservadas/vacantes, no se
   citan hasta que tengan dueño.
5. **Criterios de aceptación testables (el test es el contrato).** Binarios (pasa/no pasa),
   uno por requisito de §3, expresados como tests donde corresponda. Cero criterios vagos.
6. **WIP=1 + no-objetivos explícitos ("base primero").** La spec declara qué queda afuera (§4).
   Nada se codea/migra hasta que la demanda real lo llame (PRD §6). Sin "ya que estoy".
7. **Spec sin superficie ≈ promesa.** El plan de verificación (§8) cumple las
   **3 capas en orden** (unit+linter → integración/aislamiento → contrato/e2e) + un **fix-plan** si
   una capa falla. La regla de "las 3 capas en verde" de la constitución **no se declara: se
   demuestra** — es §8. Nada se marca `done` sin DoD completo (§9). Una spec que agrega capacidad
   cierra con su superficie real: el endpoint/servicio, el job o proceso, y/o la UI si toca al
   cliente, según las capas de tu monorepo.
   Y si toca una policy de aislamiento/permisos, rige **primero el rojo** — se extiende la suite de
   aislamiento, se ve fallar el test **sin** la policy, y recién después se la da por buena.
8. **Presupuesto de contexto (GSD).** Si la spec no entra cómoda en un contexto fresco, se parte:
   sub-tareas a subagentes con contexto limpio (Agent tool) manteniendo WIP=1 a nivel SPEC.
9. **Qué le pasa a lo construido — mirar antes de escribir de cero.** Si el punto de partida es un
   monorepo con milestones ya cerrados, **casi nada es greenfield**. La §2 de la spec declara, por
   cada pieza que toca, su categoría respecto de lo existente: **se conserva** · **se renombra o
   cambia de eje** · **se elimina** · **net-new** (lo que hay que construir de cero). Con evidencia
   `archivo:línea` — sin evidencia no es contexto, es suposición. `N/A` solo si la spec no toca
   absolutamente nada de lo existente (proyecto greenfield).
10. **Diseño y alcance NO van en la spec.** Si al escribir estás decidiendo *cómo funciona* algo del
   modelo, va a su doc de diseño dueño en `docs/arquitectura/` y la spec lo linkea. Si estás
   decidiendo *si entra* en el MVP, va a `docs/prd.md`. Rige **un hecho, un dueño**.

---

## El flujo de autoría (clarify → specify → analyze → ship)

### 0. Encuadrar
Identificar el milestone del PRD y el roadmap dueño. Chequear que no exista ya una spec/fila para
eso (evitar duplicar). Anclar el doc de diseño que la fundamenta (el archivo dueño del concepto en
`docs/arquitectura/`, con la sección exacta) y la Definition of Done del milestone (PRD). Listar qué
existe hoy con evidencia `archivo:línea`, y clasificar cada pieza tocada (se conserva / se renombra o
cambia de eje / se elimina / net-new) → se registra en §2 de la spec.

### 1. Clarify (antes de escribir criterios)
Resolver ambigüedad **antes** de redactar. Preguntas concretas al owner sobre requisitos vagos,
alcance, y **qué familias y reglas de la constitución aplican**. Si la pregunta es de *arquitectura*,
no se resuelve acá: se cierra en la sección `## Abierto` de su archivo dueño y la spec deja el
puntero. No arrancar con `[?]` sin resolver. (Inspirado en `/speckit.clarify`.)

### 2. Specify (rellenar la plantilla)
Copiar `docs/sdd/specs/TEMPLATE.md` → `docs/sdd/specs/<ID>-<slug>.md` y completar §1–§10. Cada requisito
(§3) ⇄ un criterio de aceptación (§7). Completar la tabla de gates (§5) en sus dos partes —familias y
filas por regla— sin dejar filas en blanco.

### 3. Analyze (auto-revisión antes de implementar)
Cruzar consistencia antes de codear (inspirado en `/speckit.analyze`):
- ¿Cada requisito de §3 tiene su criterio en §7? ¿y al revés?
- ¿§5 está completa: las familias declaradas, y una fila por cada regla tocada — incluidas las
  **obligatorias por condición**? ¿Ningún `N/A` sin justificación?
- ¿Los entregables (§6) cubren todos los criterios? ¿el cierre incluye su superficie real
  (endpoint/servicio, job o proceso, UI que toca al cliente)?
- ¿El `depends_on` está reflejado en el roadmap? ¿hay dependencias sin cerrar?
- ¿Entra en un contexto fresco, o hay que partirla (§10)?

### 4. Registrar en el roadmap
Agregar/actualizar la fila en el roadmap dueño (`docs/sdd/plans/active/`, o uno nuevo de iteración)
con `status: draft|ready` y link al archivo de spec. El roadmap es el índice; la spec es el detalle.

### 5. Ship (al cerrar)
DoD completo (§9) → `status: done` en el roadmap **y** en la spec; decisión durable registrada
en `DECISIONS.md`; commit que explique qué y por qué.

---

## Anti-patterns (rechazar)

- Escribir una spec sin la plantilla, o borrando secciones "porque no aplican" (marcar `N/A`).
- Dejar la tabla de gates (§5) vacía o a medias, o poner `N/A` en una familia sin justificarlo.
- **Transcribir el enunciado de una regla** en vez de citarla por `#<n>` y linkear su archivo dueño.
- Criterios de aceptación no testables (sin test que sea el contrato).
- Duplicar el estado: poner el estado canónico en la spec en vez del roadmap.
- Inventar un ID que no corresponde a un milestone del roadmap.
- Arrancar a implementar con requisitos ambiguos sin pasar por clarify.
- Marcar `done` sin las 3 capas en verde, o sin su superficie real.
- Dar una policy por buena sin haber visto el rojo primero.
- Migrar un roadmap entero a `docs/sdd/specs/` (el roadmap sigue siendo el índice/estado).
- **Decidir diseño dentro de la spec** en vez de en su archivo dueño de `docs/arquitectura/`.
- Escribir un entregable de cero sin haber mirado qué le pasa a lo construido.

---

## Outputs

- `docs/sdd/specs/<ID>-<slug>.md` completo (las 10 secciones de la plantilla).
- Fila creada/actualizada en el roadmap dueño de `docs/sdd/plans/`.
- (Al cerrar) `status: done` en ambos + DECISIONS.md si corresponde.

**Gate de cierre:** la spec tiene las 10 secciones; §5 completa (familias + una fila por regla
tocada); cada requisito ⇄ un criterio testable; estado reflejado en el roadmap; y —al implementarla—
las 3 capas en verde (unit+linter → integración/aislamiento → contrato/e2e).
