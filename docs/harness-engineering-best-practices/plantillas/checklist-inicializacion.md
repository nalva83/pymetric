<!--
PLANTILLA — Checklist de inicialización
La PRIMERA sesión hace SOLO inicialización: nada de código de feature.
Su salida es infraestructura, no código de negocio.
Validá las 4 condiciones antes de commitear el checkpoint inicial.
Ver: docs/04-inicializacion-del-proyecto.md
-->

# Inicialización del proyecto

## Las 4 condiciones de "startup readiness" (todas obligatorias)
- [ ] **Puede arrancar** — el proyecto levanta, deps instaladas y lockeadas, sin problemas de entorno.
- [ ] **Puede testear** — al menos un test de ejemplo pasa (prueba que el framework está bien configurado).
- [ ] **Puede ver el progreso** — existe `PROGRESS.md` y feature list / desglose de tareas.
- [ ] **Puede retomar** — una sesión nueva sabe cuál es el próximo paso solo mirando el repo.

## Checklist de aceptación de inicialización
- [ ] `<make setup>` funciona desde cero
- [ ] `<make test>` tiene al menos un test pasando
- [ ] Una sesión nueva puede responder "cómo ejecutar" y "cómo testear" solo con el repo (Fresh Session Test)
- [ ] Existe desglose de tareas / feature list con al menos 3 tareas
- [ ] Reglas de lint y typecheck configuradas
- [ ] `CLAUDE.md`, `PROGRESS.md` y feature list creados
- [ ] Todo commiteado en git (checkpoint inicial limpio)

## Entregables de la inicialización (infraestructura, NO features)
1. Entorno ejecutable (deps lockeadas, versiones fijadas con `.nvmrc` / `.python-version`).
2. Framework de tests verificable (1 test de ejemplo pasando).
3. Documento de startup readiness (comandos, estado actual, estructura).
4. Desglose de tareas / feature list (cada tarea con criterio de aceptación).
5. Commit de checkpoint.

> Recordá: empezá desde una PLANTILLA de proyecto, no desde un directorio vacío.
