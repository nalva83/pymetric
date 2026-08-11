<!--
PLANTILLA — Checklist de cierre de sesión (estado limpio)
session completa = la tarea pasa verificación AND el chequeo de estado limpio pasa.
Falta una de las 5 dimensiones = la sesión NO está hecha.
Ideal: automatizar parte con un hook de Claude Code. Ver: docs/09-handoff-y-limpieza.md
-->

# Checklist de cierre de sesión

## Las 5 dimensiones del estado limpio (todas innegociables)
- [ ] **Build pasa** — `<npm run build | make build>`
- [ ] **Tests pasan** — `<npm test | make test>` (incluidos los que existían antes de esta sesión)
- [ ] **Progreso registrado** — `PROGRESS.md` y feature list actualizados (completadas / en curso / no iniciadas)
- [ ] **Sin artefactos obsoletos** — sin `console.log`, `debugger`, archivos temporales, código comentado, TODOs sueltos
- [ ] **Ruta de arranque estándar disponible** — `<npm run dev | make dev>` funciona sin intervención manual

## Pasos de cierre
1. Actualizar `PROGRESS.md` (estado actual, completado, en curso, problemas, próximos pasos).
2. Actualizar el estado del feature list (solo vía verificación; no editar estados a mano).
3. Correr la verificación completa: `<make check>`.
4. Limpieza idempotente de temporales:
   ```bash
   rm -f /tmp/debug-*.log
   git checkout -- .env.local
   <make check>   # confirmar que la limpieza no rompió nada
   ```
5. Commitear todo el trabajo completado con mensaje que explique qué y por qué.

## Limpieza periódica (semanal — además del cierre de cada sesión)
- [ ] Scan completo del sistema en busca de drift y duplicación.
- [ ] Actualizar el `QUALITY.md` (score por módulo).
- [ ] Correr benchmarks para detectar regresiones.
- [ ] Considerar simplificar el harness: deshabilitar 1 componente, correr benchmark; si no empeora, removerlo.
