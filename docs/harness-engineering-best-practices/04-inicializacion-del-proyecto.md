# 04 — Inicialización del proyecto

## El problema: mezclar inicialización con implementación

Arrancás una sesión nueva y le decís "agregá una feature de búsqueda". Se mete a codear directo. A los 20 min descubre que el framework de tests no está bien configurado, gasta otros 10 arreglándolo, después el formato del script de migración está mal, más toqueteo. La búsqueda al final se agrega, pero la sesión fue ineficiente: la mayor parte se fue en "entender cómo funciona este proyecto".

**La mejor práctica: hacer la inicialización en una fase dedicada, separada de la implementación.** Son dos tipos de trabajo fundamentalmente distintos.

## Dos tipos de trabajo con objetivos distintos

- La fase de **implementación** busca maximizar la cantidad y calidad de features verificadas.
- La fase de **inicialización** busca maximizar la fiabilidad y eficiencia de toda la implementación posterior.

Cuando las mezclás, el agente enfrenta un problema multi-objetivo: construir infraestructura y escribir código de feature a la vez. Sin prioridad explícita, gravita hacia escribir código (output directamente visible) y sacrifica infraestructura (cuyo valor solo aparece en sesiones futuras). Resultado: la infraestructura no queda sólida y la fiabilidad del código de feature también sufre.

### Qué pasa cuando las mezclás

- **La infraestructura no queda sólida.** El framework de tests se configura pero nunca se verifica, las reglas de lint quedan demasiado laxas, no se crea archivo de progreso. Los defectos no son obvios en la primera sesión (el agente todavía recuerda lo que hizo), pero golpean en la segunda.
- **Acumulación de código no verificado.** Código escrito antes de configurar bien los tests: cuando vas a agregar tests, podés descubrir que el diseño estaba mal. Cuanto más código de antemano, más hay que tirar y rehacer.
- **Desperdicio de presupuesto de contexto.** La inicialización consume buena parte del presupuesto, dejando menos para la feature. Lo peor de ambos mundos.
- **Minas de suposiciones implícitas.** La sesión 1 eligió Vitest; la sesión 2 no lo sabe e introduce Jest. Dos frameworks conviviendo, costo de mantenimiento doble.

> Dato: proyectos con fase de inicialización dedicada mostraron **31% más** de tasa de completitud de features en escenarios multi-sesión vs. el enfoque mixto. El tiempo invertido se recupera por completo en las siguientes 3-4 sesiones.

## Conceptos clave

- **Initialization Phase**: la primera fase del ciclo de vida del agente; solo establece prerrequisitos, sin desarrollo de features. Su salida es infraestructura, no código de negocio.
- **Startup Readiness Checklist**: las condiciones bajo las cuales una sesión nueva puede operar el proyecto sin ambigüedad: **puede arrancar, puede testear, puede ver el progreso, puede retomar el próximo paso.** Las cuatro, obligatorias.
- **From Scratch vs From Template**: empezar desde cero obliga al agente a inferir la estructura; empezar desde plantilla ya trae la infraestructura. La plantilla gana por lejos.
- **Always Ready to Hand Off**: en cualquier momento, una sesión nueva puede tomar el relevo solo mirando el repo.

## Cómo hacer la inicialización bien

La primera sesión hace **solo** inicialización — nada de código de feature. Produce:

### 1. Entorno ejecutable
El proyecto arranca, las deps están instaladas y lockeadas, sin problemas de entorno.

### 2. Framework de tests verificable
Al menos un test de ejemplo pasa, probando que el framework está bien configurado.

### 3. Documento de Startup Readiness Checklist

```markdown
# Startup Readiness Checklist

## Comandos de inicio
- Instalar dependencias: `make setup`
- Levantar dev server: `make dev`
- Correr tests: `make test`
- Verificación completa: `make check`

## Estado actual
- Todas las dependencias instaladas y lockeadas
- Framework de tests configurado (Vitest + React Testing Library)
- Test de ejemplo pasando (1/1)
- Reglas de lint configuradas (ESLint + Prettier)

## Estructura del proyecto
- src/ — Código fuente
- src/components/ — Componentes React
- src/api/ — Cliente de API
- tests/ — Archivos de test
```

### 4. Desglose de tareas (task breakdown)
Dividí el proyecto en una lista ordenada, cada tarea con criterio de aceptación claro:

```markdown
# Desglose de tareas

## Tarea 1: Autenticación básica de usuario
- Implementar middleware de auth JWT
- Agregar endpoints de login/register
- Aceptación: pytest tests/test_auth.py todo pasando

## Tarea 2: Página de perfil de usuario
- Implementar CRUD de perfil
- Agregar formulario de edición
- Aceptación: pytest tests/test_profile.py todo pasando
```

(Esto se formaliza como **feature list** en [06](06-feature-lists.md).)

### 5. Commit de git como checkpoint
Tras completar la inicialización, commiteá un checkpoint limpio. Todo el trabajo posterior arranca desde ahí.

## Checklist de aceptación de inicialización

```markdown
## Aceptación de inicialización
- [ ] `make setup` funciona desde cero
- [ ] `make test` tiene al menos un test pasando
- [ ] Una sesión nueva puede responder "cómo ejecutar" y "cómo testear" solo con el repo
- [ ] Existe archivo de desglose de tareas con al menos 3 tareas
- [ ] Todo commiteado en git
```

> El criterio de completitud de la inicialización **no es "cuánto código se escribió"**, sino si se cumplen las cuatro condiciones: puede arrancar, puede testear, puede ver el progreso, puede retomar.

## Empezar desde plantilla, no desde cero

No arranques desde un directorio vacío. Usá una plantilla de proyecto (create-react-app, fastapi-template, etc.) para presetear estructura de directorios estándar, configuración de dependencias y framework de tests. Horneá los pasos comunes en la plantilla, dejando solo la inicialización específica del proyecto.

## Aplicación en Claude Code

- Considerá un **slash command / Skill** dedicado a la inicialización (ej. `/init-project`) que ejecute esta fase de forma reproducible.
- La primera sesión: pedile explícitamente a Claude Code "solo inicialización, sin features", y validá contra el checklist de aceptación antes de commitear el checkpoint.
- Conectá esto con [03 — Estado entre sesiones](03-estado-entre-sesiones.md): el Startup Readiness Checklist + `PROGRESS.md` son lo que la sesión 2 lee para retomar en menos de 3 min.

## Conclusiones

- Inicialización e implementación tienen objetivos distintos; mezclarlas hunde a ambas.
- La salida de la inicialización no es código de negocio, es infraestructura: entorno ejecutable, tests verificables, startup readiness checklist, desglose de tareas.
- Validá con las cuatro condiciones: puede arrancar, testear, ver progreso, retomar.
- Plantilla > desde cero.
- El tiempo de inicialización se recupera por completo en las siguientes 3-4 sesiones: no es costo extra, es inversión adelantada.
