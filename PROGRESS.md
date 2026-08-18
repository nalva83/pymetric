<!--
PLANTILLA — PROGRESS.md (persistencia de estado entre sesiones)
Actualizar ANTES de cerrar cada sesión; leer al ABRIR la siguiente.
Meta: que una sesión nueva llegue a estado ejecutable en < 3 minutos.
-->

# Progreso del proyecto

## Estado actual
- Último commit: <abc1234 (feat: ...)>
- Estado de tests: <42/43 pasando (falla test_xxx)>
- Lint / typecheck: <pasando>
- Build: <pasando>

## Completado
- [x] <Modelo User y migración de DB>
- [x] <Endpoints CRUD básicos>
- [x] <Integración del middleware de auth>

## En curso
- [ ] <Feature de paginación (90% — falla un edge case)>

## Problemas conocidos / bloqueos
- <test_pagination_edge_case devuelve 500 en resultados vacíos>
- <Pendiente confirmar: ¿los usuarios borrados aparecen en listados?>

## Próximos pasos (en orden)
1. <Arreglar el bug del edge case de paginación>
2. <Agregar query param "include_deleted">
3. <Actualizar la documentación de la API>
