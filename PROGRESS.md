<!--
PLANTILLA — PROGRESS.md (persistencia de estado entre sesiones)
Actualizar ANTES de cerrar cada sesión; leer al ABRIR la siguiente.
Meta: que una sesión nueva llegue a estado ejecutable en < 3 minutos.
Ver: docs/03-estado-entre-sesiones.md
-->

# Progreso del proyecto

## Estado actual
- Último commit: pendiente de commitear el scaffold de M0-01 (ver "En curso").
- Estado de tests: sin suite de unit todavía (M0-01 es infra + shell); gate estático en verde.
- Lint / typecheck: `eslint` ✓ y `tsc --noEmit` ✓.
- Build: `next build` ✓.
- Deploy: producción viva en **https://curso-ai-app-demo.vercel.app** (GET → 200).

## Completado
- [x] **M0-01 — Esqueleto Next.js desplegado en Vercel + config de entorno** (✅ done)
  - Scaffold Next.js App Router (TS): `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx` (shell placeholder).
  - `.env.local.example` con `OPENAI_API_KEY=` (plantilla, sin valor).
  - Deploy a Vercel prod + alias `curso-ai-app-demo.vercel.app` (200).
  - `#2`: `OPENAI_API_KEY` como env var del proyecto (Production + Preview), no en el repo (grep limpio).
  - `#3`: tope USD 5/mes en OpenAI (out-of-band), confirmado por el owner.
  - 3 capas en verde: estático (build/tsc/eslint + grep de secretos) → infra (`vercel env ls production`) → e2e (curl 200).

## En curso
- [ ] Commitear el scaffold de M0-01 (working tree con archivos net-new sin commitear).

## Problemas conocidos / bloqueos
- `npm audit`: 3 high transitivas de Next (postcss, sharp) — sólo se resuelven con el upgrade breaking a Next 16; no alcanzables en este shell estático. Diferido (WIP=1, base primero).
- `next lint` avisa deprecación (se remueve en Next 16); funciona hoy. Migrar a ESLint CLI cuando toque Next 16.

## Próximos pasos (en orden)
1. Commitear M0-01 (scaffold + state files).
2. **M0-02** — Route Handler `POST /api/diagnostico`: contrato de entrada, salida estructurada (`generateObject` + esquema), errores tipados (`presupuesto_agotado` | `timeout` | `fallo_llm`); lee `OPENAI_API_KEY` de env (#2), mapea sobre-límite del proveedor (#3), stateless/no-log (#6). Depende de M0-01 (listo).
3. **M0-03** — Prompt/rúbrica de diagnóstico (español neutro), coherencia con el input fijo de prueba.
