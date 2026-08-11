#!/usr/bin/env bash
# Hook `Stop` del arnés. Corre al terminar CADA turno del agente.
# Recordatorio NO-bloqueante del gate: subset RÁPIDO (verify-locks + lint), SIN la suite de tests.
#   - verde → exit 0 silencioso (cierre limpio).
#   - rojo  → aviso a stderr + exit 1 → Claude Code lo MUESTRA sin frenar el turno (no bloquea).
# `verify-locks` va PRIMERO: si tu build resincroniza un lock desincronizado, correrlo antes lo detecta
# sobre el árbol prístino. Ajustá los targets a tu proyecto (o el comando de verificación rápida que uses).
# El gate COMPLETO (`make check` = verify-locks+lint+typecheck+test) sigue siendo explícito: al cerrar
# la sesión (CLAUDE.md §fichar salida) y antes de commitear.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# Template sin Makefile aún: no hay gate rápido que correr → salida limpia.
[ -f Makefile ] || exit 0

out="$(make verify-locks lint 2>&1)"; rc=$?
if [ "$rc" -ne 0 ]; then
  {
    echo "⚠️  Gate rápido en ROJO (make verify-locks lint). No declares 'hecho' sin corregir y correr \`make check\` completo:"
    echo "$out" | tail -20
  } >&2
  exit 1
fi
exit 0
