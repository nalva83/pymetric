# 07 — Verificación y Definición de Hecho

> Este documento combina dos lecciones: **evitar que el agente declare victoria temprano** y **por qué solo una corrida de pipeline completo cuenta como verificación real**.

## El problema: los agentes están sistemáticamente sobreconfiados

Le pedís a un agente "reset de contraseña". Modifica el schema, escribe el endpoint, agrega el template de email, corre los unit tests (todos verdes) y dice confiado "está hecho". Cuando lo corrés de verdad: el link de reset no se envía (falta config del servicio de email), la migración falló a mitad dejando el schema inconsistente, y el flujo end-to-end nunca se ejecutó.

El paper clásico de Guo et al. (ICML 2017) lo probó: las redes neuronales modernas están **sistemáticamente sobreconfiadas** — la confianza reportada supera la precisión real. Los agentes de código no son la excepción. **Tu harness debe reemplazar los "sentimientos" del agente por verificación externalizada basada en ejecución.**

## Conceptos clave

- **Premature Completion Declaration**: el agente afirma que la tarea está completa, pero quedan specs de corrección sin cumplir. Juzga por confianza local a nivel de código; la corrección a nivel de sistema requiere verificación global.
- **Confidence Calibration Bias**: brecha sistemática entre la confianza auto-reportada y la calidad real. En tareas multi-archivo complejas, el sesgo es positivo (más confiado que su desempeño real).
- **Termination Criteria / Definition of Done**: condiciones ejecutables que el agente debe satisfacer antes de declarar completitud. "Hecho" pasa de juicio subjetivo a determinación objetiva.
- **Verification-Validation Dual Gate**: la primera capa (verification) chequea si el código implementa el comportamiento especificado; la segunda (validation) chequea si el comportamiento a nivel sistema cumple los requisitos end-to-end. Ambas deben pasar.
- **Component Boundary Defects**: A y B pasan sus unit tests por separado, pero su interacción produce comportamiento incorrecto. Lo que el E2E sabe cazar.

## Pasar unit tests ≠ tarea completa

Es la trampa más común y más peligrosa. La filosofía de diseño del unit test —aislar la unidad bajo prueba, mockear dependencias— es **precisamente lo que lo incapacita** para detectar problemas entre componentes:

- **Interface Mismatch**: el renderer pasa una ruta relativa al preload, pero el preload espera una absoluta. Ambos unit tests usan mocks y ambos pasan. El problema solo aparece en el E2E.
- **State Propagation Errors**: una migración cambia el schema, pero la capa de cache del ORM sigue con entradas del schema viejo. Los unit tests corren en un mock fresco cada vez, nunca lo exponen.
- **Resource Lifecycle Issues**: handles de archivo, conexiones de DB, sockets — se adquieren y liberan a través de varios componentes. Los unit tests crean/destruyen recursos independientes por caso, nunca exponen contención ni leaks.
- **Environment Dependency**: el código anda en el entorno de test (todo mockeado) pero falla en el real por diferencias de config, latencia o servicios caídos.

> **Testing Adequacy Gradient**: defectos detectables por unit tests ≤ por integración ≤ por end-to-end. La capacidad de detección crece con cada capa. Solo el E2E prueba la ausencia de defectos a nivel de sistema.

Bonus: cuando el agente **sabe** que su trabajo será validado por E2E, su comportamiento de codeo cambia — empieza a considerar interacciones entre componentes, respetar fronteras de arquitectura y manejar rutas de error.

## "Ya que estoy, refactorizo" es veneno para el juicio de completitud

Claude Code tiende a refactorizar, optimizar performance y mejorar estilo **antes** de que la funcionalidad core pase la verificación. El refactor mueve la frontera entre código verificado y no verificado, pudiendo romper rutas que eran implícitamente correctas.

> **Completion Priority Constraint**: primero verificá corrección funcional, después performance, al final estilo. **Nada de refactor hasta que la funcionalidad core esté verificada.**

## Separar a quien hace de quien revisa

Anthropic encontró que cuando un agente evalúa su propio trabajo, da evaluaciones sistemáticamente demasiado positivas — aun cuando un humano lo juzgaría claramente deficiente. La solución no es pedirle que sea "más objetivo" (el mismo modelo genera y evalúa, es generoso consigo mismo). La solución es **separar al "trabajador" del "verificador"**.

Un agente evaluador independiente, afinado para ser "quisquilloso", es mucho más efectivo:

| Arquitectura | Tiempo | Costo | ¿Features core andan? |
|--------------|--------|-------|------------------------|
| Agente único (corrida pelada) | 20 min | $9 | No |
| Tres agentes (planner + generator + evaluator) | 6 h | $200 | Sí (juego jugable) |

Mismo modelo, mismo prompt. La única diferencia es el harness. (Ver [08 — Observabilidad y evaluación](08-observabilidad-y-evaluacion.md).)

## Cómo prevenir la declaración prematura

### 1. Externalizar el juicio de terminación
El juicio de completitud no lo hace el agente. El harness ejecuta la validación de forma independiente, usando señales de runtime como input. En `CLAUDE.md`:

```markdown
## Definición de Hecho
- Feature completa = verificación end-to-end pasada, no "el código está escrito"
- Niveles de verificación requeridos:
  1. Unit tests pasan
  2. Tests de integración pasan
  3. Verificación de flujo end-to-end pasa
- No avanzar al nivel 2 si el 1 falla
- No avanzar al nivel 3 si el 2 falla
```

### 2. Construir validación de terminación en tres capas

```markdown
## Jerarquía de validación
- Nivel 1: Sintaxis y análisis estático (lint, typecheck) — costo mínimo, pero debe pasar
- Nivel 2: Comportamiento en runtime (tests, arranque de app, rutas críticas) — la evidencia core: no solo escrito, ejecutable
- Nivel 3: Confirmación a nivel sistema (E2E, integración, simulación de escenarios de usuario) — obligatorio cuando hay cambios cross-componente
- Saltar cualquier nivel requerido = NO completo
```

### 3. Definir fronteras de arquitectura ANTES del E2E
El E2E necesita que el sistema tenga fronteras claras. Si la arquitectura es un enredo, el E2E solo prueba "el enredo corre" sin decir dónde se violó la intención de diseño.

> Los agentes copian patrones existentes en el repo, aun los inconsistentes o subóptimos. Sin constraints de arquitectura, introducen más drift cada sesión. Establecé las constraints como prerrequisito desde el día uno. **Enforzá invariantes; no micromanagees la implementación** (ej: exigí "los datos se parsean en la frontera", pero no prescribas qué librería).

### 4. Convertir reglas de arquitectura en chequeos ejecutables
Cada constraint con su test o regla de lint:

```bash
# ¿El proceso renderer llama directo a APIs de Node.js?
grep -r "require('fs')" src/renderer/ && exit 1 || echo "OK: sin acceso directo a fs en renderer"
```

### 5. Mensajes de error orientados al agente
No le digas solo "está mal": decile qué está mal, por qué y cómo arreglarlo. Tres elementos: **qué, por qué, cómo**.

```
ERROR: Import directo de 'fs' en src/renderer/App.tsx:12
WHY: El proceso renderer no tiene acceso a APIs de Node.js por seguridad
FIX: Mové las operaciones de archivo a src/preload/file-ops.ts y llamá vía window.api.readFile()
```

Esto convierte fallas de test en loops de auto-corrección: el agente se corrige sin intervención humana.

### 6. Promoción de feedback de review
Cada vez que descubrís una nueva categoría de error del agente en code review, convertila en un chequeo automatizado. Un mes después tu harness es mucho más fuerte. Cada defecto capturado se vuelve una línea de defensa permanente.

### 7. Capturar señales de runtime
- ¿La app arrancó y llegó a estado ready?
- ¿Las rutas de feature críticas se ejecutaron bien en runtime?
- ¿Las escrituras de DB, operaciones de archivo y otros side effects fueron correctos?
- ¿Se limpiaron los recursos temporales?

## Aplicación en Claude Code

- Escribí la "Definición de Hecho" explícita en `CLAUDE.md` y conectala con el comando de verificación de cada feature ([06](06-feature-lists.md)).
- Usá **hooks** de Claude Code (ej. un hook de `Stop` o `PostToolUse`) para correr la validación automáticamente, en vez de confiar en que el agente lo haga.
- Para la separación trabajador/verificador, usá un **subagente evaluador** con instrucciones de ser quisquilloso, idealmente con **Playwright MCP** para click-testing real del E2E.
- El trade-off de tiempo (ej. tests de 2 s a 15 s con E2E) es perfectamente aceptable en un flujo con agentes.

## Conclusiones

- Los agentes están sistemáticamente sobreconfiados. Código escrito ≠ código correcto.
- El juicio de completitud debe externalizarse: el harness verifica independiente. No confíes en los "sentimientos" del agente.
- Las tres capas son esenciales: sintaxis pasa, comportamiento pasa, sistema pasa. Sin atajos.
- Los unit tests son ciegos a los defectos de frontera entre componentes por diseño. Solo el E2E los caza.
- Los mensajes de error deben incluir pasos concretos de arreglo (loop de auto-corrección).
- Las reglas de arquitectura deben ser ejecutables, no texto esperando a que alguien las lea.
- Sin refactor hasta que la funcionalidad core esté verificada.
