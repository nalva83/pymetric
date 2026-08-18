<!--
PLANTILLA — CLAUDE.md (archivo de entrada / "landing page" del agente).
Este repo es un TEMPLATE del arnés SDD: completá los placeholders <...> con tu proyecto.
Objetivo: 50-200 líneas. Es un ROUTER, no una enciclopedia.
Si algo crece, movelo a docs/*.md y dejá solo el link.
-->

# <Nombre del proyecto>

## Overview
<Una o dos oraciones que dejen claro QUÉ es esto.>
Stack: <ej. Python 3.11 + FastAPI + PostgreSQL 15 + Next.js>.

## Quick Start
- Instalar: `<make setup | npm install | ...>`
- Levantar en dev: `<make dev | npm run dev | ...>`
- Test: `<make test | npm test | ...>`
- **Verificación completa (gate): `<make check>`**

## Comandos de verificación (Feedback)
- Tests: `<pytest tests/ -x>`
- Typecheck: `<mypy src/ --strict | tsc --noEmit>`
- Lint: `<ruff check src/ | eslint .>`
- End-to-end: `<playwright test | ...>`
- Todo junto: `<make check>`

## Constraints duros (máximo ~15, innegociables — MUST / MUST NOT)
> Las reglas numeradas y citables del proyecto viven en `docs/sdd/constitucion.md`. Acá solo un resumen.
- <Todas las APIs MUST usar autenticación OAuth 2.0>
- <Todo PR MUST pasar `make check`>

## Reglas de trabajo (WIP=1)
- Trabajar en UNA unidad de trabajo (SPEC) a la vez.
- Empezar la siguiente solo cuando la actual pase verificación end-to-end.
- NO "refactorizar también" otra cosa mientras se implementa una feature.
- Sin refactor hasta que la funcionalidad core esté verificada.
- Principio de build-order: **"base primero"** — nada se codea hasta que la demanda real lo llame; los milestones se acortan quitando alcance, nunca el DoD.

## Definición de Hecho
Feature completa = **las 3 capas en verde, en orden** (no avanzar si la anterior falla):
1. unit + linter
2. integración / aislamiento
3. contrato / e2e
"El código está escrito" **≠** hecho. Detalle: `docs/sdd/specs/TEMPLATE.md §8`.

## El equipo de agentes
El método lo protagoniza un equipo de agentes; cada etapa tiene el suyo. Nombralos al invocarlos.
| Rol | Agente | Cómo se invoca |
|---|---|---|
| Analista de Producto | `prd-author` | `/new-prd <idea>` |
| Arquitecto | `architecture-author` | `/new-architecture` |
| Arquitecto de Datos | `data-modeler` | dentro de `/new-architecture` (fan-out) |
| Planificador | `roadmap-author` | `/new-roadmap <M#>` |
| Autor de Specs | `spec-author` | `/decompose <roadmap>` |
| Programador | `spec-implementer` | prosa: "implementá `<ID>` con TDD" |
| QA | `spec-verifier` | prosa: "verificá `<ID>` (las 3 capas)" |
| Diseñador de Producto | `ux-reviewer` | prosa: "revisá que no parezca de IA" |
| Contador | `cost-guardian` | prosa: "revisá gasto y API key" |
| DevOps | `deploy-engineer` | `/deploy-check [entorno]` |
| Copiloto de arranque | `onboarding-guide` | prosa: "ayudame a arrancar" |
| *(red de seguridad)* | — | `/save-point <etiqueta>` (punto de retorno Git) |

## Flujo de trabajo (SDD) y estado entre sesiones
- **Método: Spec-Driven Development.** idea → `/new-prd` → `/new-architecture` → `/new-roadmap` → `/decompose` → implementación (prosa) → `/deploy-check`. Guía: `docs/sdd/README.md`.
- **Estado canónico de "qué falta":** los roadmaps en `docs/sdd/plans/active/` + los milestones del PRD (`docs/prd.md`).
- **Estado operativo entre sesiones:** `PROGRESS.md`.
- **Decisiones de diseño (el porqué):** `DECISIONS.md`.
- **Salud del codebase:** `QUALITY.md` (arreglar primero el módulo de menor score).

### Al iniciar la sesión (fichar entrada)
1. Leer `PROGRESS.md` (estado) y `DECISIONS.md` (porqués).
2. Correr `<make check>` para confirmar estado consistente.
3. Continuar desde "Próximos pasos" de `PROGRESS.md`, respetando WIP=1.

### Antes de cerrar la sesión (fichar salida)
1. Build + tests pasan (`<make check>`, gate completo).
2. Progreso registrado — `PROGRESS.md` y la fila del roadmap (`docs/sdd/plans/`) actualizados.
3. Sin artefactos obsoletos (debug, temporales, código comentado, TODOs sueltos).
4. Trabajo completado commiteado (qué + por qué); decisión durable → `DECISIONS.md`.

## Documentos temáticos (leer bajo demanda)
- **Alcance + milestones + Definition of Done:** `docs/prd.md`.
- **Pipeline SDD** (proceso, plantillas, qué NO va en una spec): `docs/sdd/README.md` + `docs/sdd/specs/TEMPLATE.md` + `docs/sdd/plans/TEMPLATE.md`.
- **Diseño/arquitectura del proyecto** (creás por proyecto): `docs/arquitectura/`.
- Skills y commands del arnés: `.claude/`.
