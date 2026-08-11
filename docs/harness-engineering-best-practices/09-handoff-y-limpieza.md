# 09 — Handoff y limpieza

## El problema: el desorden se acumula solo

Tu agente trabaja toda la tarde, modifica 20 archivos, commitea y la sesión termina. La sesión siguiente arranca y descubre: build roto, tests en rojo, archivos temporales de debug por todos lados, feature list sin actualizar, progreso completamente opaco. Los primeros 30 min de la sesión nueva se van en "averiguar qué hizo la anterior".

> La fiabilidad de largo plazo depende de **disciplina operacional**, no solo del éxito de una corrida. La calidad del estado al final de cada sesión determina directamente la eficiencia de la siguiente.

## El crecimiento de entropía es el estado por defecto

Las leyes de evolución de software de Lehman: un sistema en cambio continuo se vuelve inevitablemente más complejo a menos que se lo gestione activamente. Con agentes es peor: cada sesión introduce cambios y, sin limpieza al salir, la deuda técnica se acumula exponencialmente.

Durante 5 meses de experimentos con Codex, OpenAI observó: **los agentes copian patrones ya presentes en el repo, aun los inconsistentes o subóptimos.** Con el tiempo, esa copia lleva a drift. El primero deja una taza de café; el segundo, "ya está sucio igual", deja otra; una semana después la mesa está sepultada. Un codebase funciona igual.

OpenAI llegó a una solución sistemática:
- **Codificar "golden rules" en el repo**: reglas concretas, mecánicas y auto-chequeables (ej. "preferí el paquete de utilidades compartido sobre helpers ad-hoc", "no adivines estructuras de datos a lo YOLO — validá en la frontera o usá SDKs tipados").
- **Workflows de limpieza periódicos**: tareas de fondo que escanean desviaciones, actualizan scores de calidad y abren PRs de refactor dirigidos.
- **Capturar el gusto humano una vez, enforzarlo continuamente**: comentarios de review, PRs de refactor y bugs de usuario se traducen en updates de documentación o se codifican en tooling. Cuando la doc no alcanza, se promueve la regla a código.

> La deuda técnica es un préstamo de interés alto. Pagarla en cuotas chicas de forma continua casi siempre vence a dejarla acumular hasta un pago masivo.

## Estado limpio: más que "el código compila"

El estado limpio debe satisfacer **cinco condiciones** al cerrar la sesión. Falta una y la sesión NO está "hecha":

1. **Build pasa.** La sesión siguiente no debería tener que arreglar errores de build primero.
2. **Tests pasan** — incluyendo los que existían antes de la sesión. Sos responsable de no romper lo que andaba. Verificado en CI, no solo "en mi máquina".
3. **Progreso registrado** en artefactos machine-readable: subtareas completadas con su criterio de aprobación, subtareas en curso con su estado, subtareas no iniciadas. (Reduce el tiempo de diagnóstico de arranque en **60-80%**.)
4. **Sin artefactos obsoletos**: logs de debug, archivos temporales, código comentado, marcadores TODO. Aumentan la carga cognitiva de la sesión siguiente.
5. **Ruta de arranque estándar funciona.** ¿La sesión siguiente puede empezar a trabajar sin intervención manual? Init de entorno, carga del codebase, adquisición de contexto, selección de tarea — ninguna ruta rota.

## Conceptos clave

- **Session integrity**: análogo a las transacciones de DB — o commiteás completo dejando estado limpio, o rollback al último estado consistente. No hay punto medio.
- **Quality document**: artefacto activo que registra continuamente los ratings de calidad de cada módulo. No una evaluación de una vez, sino un tracker de si el codebase se fortalece o debilita con el tiempo.
- **Cleanup loop**: sesión de mantenimiento regular para reducir entropía sistemáticamente. Operación rutinaria, no arreglo de emergencia.
- **Harness simplification**: conforme los modelos mejoran, remover periódicamente componentes del harness ya innecesarios.
- **Idempotent cleanup**: las operaciones de limpieza producen el mismo resultado sin importar cuántas veces se corran (seguras ante reintentos).

## "Limpio después" significa nunca limpiar

La sesión nueva no sabe qué dejaste: ve un desorden de código y estado incierto, y gasta tiempo infiriendo "qué es intencional y qué es temporal". Peor: cada sesión tiene su propio objetivo; la nueva está para hacer trabajo nuevo, no para limpiar lo anterior. Ignora el caos y construye encima, agregando más caos. Es el loop de retroalimentación positiva de la entropía.

Los números (proyecto de 12 semanas con agentes):

| Semana | Sin estrategia de limpieza | Con estrategia de limpieza |
|--------|----------------------------|----------------------------|
| 1 | Build 100% / Tests 100% / arranque 5 min | 100% / 100% / 5 min |
| 4 | Build 95% / Tests 92% / 15 min | — |
| 8 | Build 82% / Tests 78% / 35 min | — |
| 12 | Build 68% / Tests 61% / 60+ min, 103 artefactos obsoletos | Build 97% / Tests 95% / 9 min, 11 artefactos |

A la semana 12: 29 puntos porcentuales de diferencia en build, 34 en tests, y 85% menos de tiempo de arranque. Cada sesión gastó 5 min extra en limpieza; en 12 semanas eso ahorró decenas de horas de caos.

## Cómo hacerlo

### 1. El estado limpio es condición necesaria de completitud
`session completa = la tarea pasa verificación AND el chequeo de estado limpio pasa`. En `CLAUDE.md`:

```markdown
## Checklist de cierre de sesión
- [ ] Build pasa (npm run build)
- [ ] Todos los tests pasan (npm test)
- [ ] Feature list actualizado
- [ ] Sin código de debug (console.log, debugger, TODO)
- [ ] Ruta de arranque estándar disponible (npm run dev)
```

(Plantilla: [`plantillas/checklist-cierre-sesion.md`](plantillas/checklist-cierre-sesion.md).)

### 2. Estrategia de limpieza de doble modo
- **Limpieza inmediata** (al final de cada sesión): limpiar artefactos temporales de la sesión, actualizar estado del feature list, asegurar build y tests. Es limpieza por "conteo de referencias".
- **Limpieza periódica** (semanal): scan completo del sistema — problemas estructurales acumulados, actualizar quality document, correr benchmarks para detectar drift. Es la pasada de mantenimiento integral.

### 3. Mantener un quality document
Artefacto activo que puntúa cada módulo:

```markdown
# Quality Document

## Módulo de Autenticación (Calidad: A)
- Verificación pasando: Sí
- Entendible por el agente: Sí
- Estabilidad de tests: Estable
- Fronteras de arquitectura: Cumple
- Convenciones de código: Seguidas

## Módulo de Pagos (Calidad: C)
- Verificación pasando: Parcial (callback de pago sin testear)
- Entendible por el agente: Difícil (lógica dispersa en 3 archivos)
- Estabilidad de tests: Inestable (2 tests flaky)
- Fronteras de arquitectura: Hay violaciones
- Convenciones de código: Parcialmente seguidas
```

Las sesiones nuevas lo leen y saben dónde priorizar: arreglá primero el módulo de menor score. (Plantilla: [`plantillas/QUALITY.md`](plantillas/QUALITY.md).)

### 4. Simplificar el harness periódicamente
Cada componente del harness existe porque el modelo no podía hacer algo de forma fiable. Conforme los modelos mejoran, esas suposiciones caducan.

> Ejemplo: un harness incluía un mecanismo de sprint-splitting para que un modelo más débil completara de a chunks. Con un modelo más fuerte, la capacidad nativa manejaba la descomposición sola, volviendo el splitting overhead innecesario. Al removerlo, el builder trabajó 2+ horas sin drift, y más fluido. **Pero** el evaluador siguió aportando valor aun con el modelo más fuerte, cazando funcionalidad faltante y stubs. El evaluador no es un sí/no fijo: depende de dónde cae la dificultad de la tarea respecto de la capacidad del modelo.

**Práctica recomendada:** cada mes, agarrá un componente del harness, deshabilitalo temporalmente y corré tareas de benchmark. Si los resultados no empeoran, removelo. Si empeoran, restauralo o reemplazalo por una alternativa más liviana.

> Principio más profundo: conforme los modelos mejoran, las combinaciones interesantes del harness no se achican — **se desplazan**. Problemas que antes requerían solución explícita son absorbidos por el modelo, pero nuevas fronteras de capacidad abren espacios de diseño antes imposibles.

### 5. Las operaciones de limpieza deben ser idempotentes

```bash
rm -f /tmp/debug-*.log     # -f: sin error si los archivos no existen
git checkout -- .env.local  # restaurar a estado conocido
npm run test                # verificar que la limpieza no rompió nada
```

### 6. Alto throughput cambia la filosofía de merge
Cuando el output del agente supera por lejos la capacidad de review humano, minimizá los gates bloqueantes de merge. Los PRs deben ser de vida corta; el flakiness de tests suele resolverse con corridas siguientes en vez de bloquear indefinidamente.

> **Criterio clave:** costo promedio de arreglar un bug vs. costo promedio de esperar review humano. Cuando el primero es menor, mergear rápido es lo correcto. **Cuidado:** esto es irresponsable en entornos de bajo throughput; solo aplica cuando el output del agente supera ampliamente la atención humana.

## Aplicación en Claude Code

- Escribí el checklist de cierre en `CLAUDE.md` y, mejor aún, automatizá parte con un **hook** (ej. un hook que corra build + tests al detectar fin de tarea).
- Considerá un **slash command / Skill** de limpieza periódica (ej. `/cleanup`) para la pasada semanal.
- Atá la actualización de `PROGRESS.md` ([03](03-estado-entre-sesiones.md)) y del feature list ([06](06-feature-lists.md)) al cierre: son parte del estado limpio.
- Revisá el harness con el modelo que estás usando: una constraint necesaria con un modelo puede ser overhead con otro más capaz.

## Conclusiones

- El estado limpio es condición necesaria de completitud: parte de la "Definición de Hecho", no housekeeping opcional.
- Las cinco dimensiones son innegociables: build, tests, progreso, artefactos, arranque.
- Los quality documents hacen rastreable la salud del codebase: solo arreglás proactivamente lo que sabés que se degrada.
- Simplificá el harness periódicamente conforme mejoran los modelos.
- "Limpio después" = nunca limpiar. La entropía crece por defecto; solo la limpieza activa la contrarresta.
