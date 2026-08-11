# Curso "AI App" — boilerplate del demo (CP0)

Este repo es el **boilerplate del curso**: el arnés de agentes SDD **+** una AI App de ejemplo lista para deployar. Es el punto de partida (CP0) del demo en vivo — "un proyecto con los agentes ya adentro" que además publica en internet.

## Qué hay acá

- **El arnés** (`.claude/` + `docs/`): el equipo de agentes, skills y comandos del método, y los docs (PRD, constitución, plantillas SDD). Ver `CLAUDE.md` y `docs/sdd/README.md`.
- **La AI App** (`app/`): *"¿Tu idea es una AI App viable?"* — un formulario multi-step de 4 pasos que llama a un LLM (OpenAI) y devuelve un diagnóstico personalizado (encaje como AI App + primer módulo a construir + riesgo principal). Sin base de datos: form → API route → LLM → pantalla de resultado.

## Correr en local

```bash
npm install
cp .env.local.example .env.local   # y cargá tu OPENAI_API_KEY
npm run dev                         # http://localhost:3000
```

Verificación: `npm run typecheck` · `npm run build`.

## Variables de entorno

| Variable | Dónde | Para qué |
|---|---|---|
| `OPENAI_API_KEY` | `.env.local` (local) · Vercel env (prod) | llamada al LLM. **Nunca** se commitea (regla #2). |

## Deploy

Deploya en **Vercel** (Next.js App Router). La `OPENAI_API_KEY` se carga como variable de entorno del proyecto en Vercel — no vive en el código ni en el repo.

## El método

`/new-prd` → `/new-architecture` → `/new-roadmap` → `/decompose` → implementación (por prosa a los agentes) → `/deploy-check`. Detalle en `CLAUDE.md § El equipo de agentes` y `docs/sdd/README.md`.
