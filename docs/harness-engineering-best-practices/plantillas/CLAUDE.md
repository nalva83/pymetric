<!--
PLANTILLA — CLAUDE.md (archivo de entrada / "landing page" del agente)
Copiá este archivo a la RAÍZ de tu proyecto y completá los placeholders <...>.
Objetivo: 50-200 líneas. Es un ROUTER, no una enciclopedia.
Si algo crece, movelo a docs/*.md y dejá solo el link.
Ver: docs/02-instrucciones-en-capas.md
-->

# <Nombre del proyecto>

## Overview
<Una o dos oraciones que dejen claro QUÉ es esto.>
Stack: <ej. Python 3.11 + FastAPI + PostgreSQL 15 + Redis>.

## Quick Start
- Instalar: `<make setup | npm install | ...>`
- Levantar en dev: `<make dev | npm run dev | ...>`
- Test: `<make test | npm test | ...>`
- Verificación completa: `<make check>`

## Comandos de verificación (Feedback)
- Tests: `<pytest tests/ -x>`
- Typecheck: `<mypy src/ --strict | tsc --noEmit>`
- Lint: `<ruff check src/ | eslint .>`
- End-to-end: `<playwright test | ...>`
- Todo junto: `<make check>`

## Constraints duros (máximo ~15, innegociables — MUST / MUST NOT)
- <Todas las APIs MUST usar autenticación OAuth 2.0>
- <Todas las queries MUST usar sintaxis SQLAlchemy 2.0>
- <El proceso renderer MUST NOT acceder al filesystem directamente; usar el bridge de preload>
- <Todo PR MUST pasar `make check`>

## Reglas de trabajo (WIP=1)
- Trabajar en UNA feature a la vez.
- Empezar la siguiente solo cuando la actual pase verificación end-to-end.
- NO "refactorizar también" otra cosa mientras se implementa una feature.
- Sin refactor hasta que la funcionalidad core esté verificada.

## Definición de Hecho
- Feature completa = verificación end-to-end pasada, NO "el código está escrito".
- Niveles requeridos (no avanzar si el anterior falla):
  1. Unit tests pasan
  2. Tests de integración pasan
  3. Flujo end-to-end pasa (obligatorio si hay cambios cross-componente)

## Estado y sesiones
- Estado actual: ver `PROGRESS.md`.
- Decisiones de diseño: ver `DECISIONS.md`.
- Feature list (single source of truth de "qué hacer"): ver `docs/features.md` o `feature_list.json`.

### Al iniciar la sesión (fichar entrada)
1. Leer `PROGRESS.md` y `DECISIONS.md`.
2. Correr `<make check>` para confirmar estado consistente.
3. Continuar desde "Próximos pasos" de `PROGRESS.md`.

### Antes de cerrar la sesión (fichar salida) — ver checklist completo
1. Actualizar `PROGRESS.md` y el feature list.
2. Correr `<make check>`; build + tests en verde.
3. Eliminar artefactos temporales / código de debug.
4. Commitear todo el trabajo completado.

## Documentos temáticos (leer bajo demanda)
- <Patrones de API (`docs/api-patterns.md`) — al agregar endpoints>
- <Reglas de base de datos (`docs/database-rules.md`) — al modificar operaciones de DB>
- <Estándares de testing (`docs/testing-standards.md`) — al escribir tests>
- Checklist de cierre de sesión: `docs/plantillas/checklist-cierre-sesion.md`
