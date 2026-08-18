# Arnés SDD — punto de partida

Repositorio limpio con el **arnés de Spec-Driven Development**: el equipo de agentes, skills y comandos del método, más las plantillas de documentos. Sin código de aplicación — el proyecto arranca desde acá.

## Qué hay

- **`.claude/`** — agentes, skills, comandos y hooks del método.
- **`CLAUDE.md`** — plantilla del archivo de entrada del agente (completá los placeholders `<...>`).
- **`docs/prd.md`** — plantilla del PRD (la completa `/new-prd`).
- **`docs/arquitectura/`** — plantilla + README para los docs de diseño (los crea `/new-architecture`).
- **`docs/sdd/`** — pipeline SDD: constitución, plantillas de roadmaps (`plans/`) y specs (`specs/`).
- **`PROGRESS.md` / `DECISIONS.md` / `QUALITY.md`** — plantillas de estado entre sesiones.

## Cómo arrancar

1. Contale la idea al agente y corré **`/new-prd <idea>`**.
2. Seguí el flujo: `/new-architecture` → `/new-roadmap <M#>` → `/decompose` → implementación por prosa (`spec-implementer` / `spec-verifier`) → `/deploy-check`.
3. Guía completa del método: `CLAUDE.md` y `docs/sdd/README.md`.
