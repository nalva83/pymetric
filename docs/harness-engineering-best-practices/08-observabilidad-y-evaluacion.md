# 08 — Observabilidad y evaluación

## El problema: el agente decide a ciegas

Le pedís una feature. Corre 20 min, toca un montón de archivos y dice "listo, pero dos tests fallan". Le preguntás por qué — "no estoy seguro, puede ser un tema de timing". ¿Qué rutas críticas cambiaste? — "dejame mirar el código...".

La raíz no es la capacidad del agente: es la falta de **observabilidad** del harness. Sin visibilidad del estado real de runtime, cada decisión es esencialmente una adivinanza. Sin observabilidad: las decisiones se toman bajo incertidumbre, las evaluaciones se vuelven juicios subjetivos y los reintentos se vuelven deambular ciego.

> Tanto OpenAI como Anthropic enmarcan la fiabilidad como un **problema de evidencia**: el harness debe exponer el comportamiento de runtime y las señales de evaluación en una forma que realmente guíe la próxima decisión.

## El costo real de no tener observabilidad

1. **No se distingue "correcto" de "parece correcto".** Una función se ve bien en code review, pero en runtime un error de borde produce resultados incorrectos. Solo los traces de runtime revelan que la ruta de ejecución real se desvió. El review muestra "lo escrito"; el trace, "lo que realmente corrió".
2. **La evaluación se vuelve misticismo.** Sin rúbricas ni criterios de aceptación, el mismo output recibe evaluaciones dispares. La calidad se vuelve no reproducible.
3. **Los reintentos se vuelven adivinanza ciega.** Sin saber por qué falló, el agente reintenta en dirección aleatoria, arreglando rutas no relacionadas. Cada reintento ciego quema tokens y tiempo.
4. **Acantilado de información en el handoff.** Sin observabilidad, la sesión siguiente diagnostica el estado desde cero. Esa redundancia se come **30-50%** del tiempo total de sesión.

## Las dos capas de observabilidad

La observabilidad no es "agregar más logs". Opera en dos capas, ambas esenciales:

- **Runtime observability** (observabilidad de runtime): señales a nivel de sistema — logs, traces, eventos de proceso, health checks. Responde **"qué hizo el sistema"**.
- **Process observability** (observabilidad de proceso): visibilidad de los artefactos de decisión del harness — planes, rúbricas de scoring, criterios de aceptación. Responde **"por qué este cambio debería aceptarse"**.

Las señales de runtime explican el comportamiento; los artefactos de proceso explican la intención. Se refuerzan mutuamente.

## Conceptos clave

- **Task trace**: registro completo del camino de decisión de principio a fin, análogo al request tracing de sistemas distribuidos. Cada paso del agente, con su contexto, queda registrado: cuando algo falla, podés reproducir todo el proceso.
- **Sprint contract**: acuerdo de corto plazo negociado **antes** de empezar a codear, que especifica alcance, estándares de verificación y exclusiones. Herramienta núcleo de la observabilidad de proceso.
- **Evaluator rubric (rúbrica de evaluación)**: transforma la evaluación de calidad de juicio subjetivo a scoring estructurado basado en evidencia, para que distintos evaluadores lleguen a conclusiones similares.

## Por qué el agente no puede resolver esto solo

- **El agente no sabe lo que no sabe.** No registra proactivamente señales que no se da cuenta que necesita.
- **Los formatos de log son inconsistentes** entre sesiones, imposibilitando el análisis sistemático.
- **La observabilidad de proceso no se resuelve con logging.** Los sprint contracts y las rúbricas son artefactos estructurados que requieren soporte a nivel de harness; unos `print` no alcanzan.

Por eso la observabilidad es una **propiedad de la arquitectura del harness**: se diseña desde el principio, no se agrega después.

## Cómo construir observabilidad

### 1. Recolección de señales de runtime en el harness
No dependas de que el agente imprima sus logs. El harness recolecta automáticamente:
- **Ciclo de vida de la app**: startup, ready, running, shutdown.
- **Ejecución de rutas de feature**: entry points, checkpoints, exits de rutas críticas.
- **Flujo de datos**: registros de datos fluyendo entre componentes.
- **Uso de recursos**: patrones anómalos (ej. memoria creciendo de forma continua).
- **Errores y excepciones**: contexto completo del error, no solo el mensaje.

### 2. Sprint contracts
Antes de cada tarea, generador y evaluador negocian un contrato que define qué construir y cómo se ve "hecho":

```markdown
# Sprint Contract: Soporte de Dark Mode

## Alcance
- Modificar el componente de toggle de tema
- Actualizar las variables CSS globales
- Agregar tests de dark mode

## Estándares de verificación
- Tests de regresión visual pasan por componente
- Tests end-to-end del flujo principal pasan
- Sin flash of unstyled content (FOUC)

## Exclusiones
- No se manejan estilos de impresión
- No se maneja dark mode de componentes de terceros
```

(Plantilla: [`plantillas/sprint-contract.md`](plantillas/sprint-contract.md).)

### 3. Rúbrica de evaluación
Convertí "está bueno o no" en scoring cuantificable:

```markdown
# Rúbrica de scoring

| Dimensión | A | B | C | D |
|-----------|---|---|---|---|
| Corrección de código | Todos los tests pasan | Flujo principal pasa | Parcial | Build falla |
| Cumplimiento de arquitectura | Total | Desvíos menores | Desvíos obvios | Violaciones serias |
| Cobertura de tests | Principal + edge cases | Solo flujo principal | Solo esqueleto | Sin tests |
```

Cada dimensión con un umbral duro: si alguna no llega, el sprint falla y el generador recibe feedback detallado.

### 4. Estandarizar con OpenTelemetry
Un trace por sesión del harness, un span por tarea, sub-spans por paso de verificación. Atributos estándar para integrar con toolchains (Jaeger, Zipkin).

## La arquitectura de tres agentes (experimento de Anthropic)

Misma tarea ("construir un DAW en el browser con Web Audio API"), tres roles. Datos reales: 3 h 50 min, $124.70, en 3 rondas de build + QA.

- **Planner**: recibe un requerimiento de 1-4 oraciones y lo expande a una spec de producto completa. Instruido a "ser audaz en el alcance" y "enfocarse en contexto de producto y diseño técnico de alto nivel, no en implementación detallada". Razón: si el planner fija detalles técnicos granulares prematuramente y se equivoca, los errores cascadean. Mejor restringir entregables y dejar que el agente encuentre su camino en ejecución.
- **Generator**: implementa feature por feature, sprint por sprint. Antes de cada sprint negocia el sprint contract con el evaluador. Implementa según el contrato, se auto-evalúa y entrega a QA.
- **Evaluator**: usa **Playwright MCP** para interactuar con la app corriendo como un usuario real — testeando UI, endpoints y estado de DB. Puntúa cada sprint en cuatro dimensiones: profundidad de producto, funcionalidad, diseño visual, calidad de código. Cada dimensión con umbral duro.

Ejemplo de feedback de QA (específico, con evidencia, no "no se siente bien"): *"App visualmente impresionante con buena integración de IA, pero varias features core del DAW son solo presentacionales: los clips no se pueden arrastrar/mover, no hay panel de UI de instrumento (perillas de synth, drum pads), ni editor visual de efectos (curvas de EQ, medidores de compresor)."*

> El evaluador no nació afilado. Las versiones tempranas identificaban problemas reales y después se convencían de que no eran graves, aprobando igual. El arreglo: **leer los logs del evaluador, encontrar dónde su juicio divergió del humano y actualizar el prompt de QA** para esos problemas específicos. Tras varias rondas de este loop de desarrollo, el scoring se volvió fiable.

## Aplicación en Claude Code

- Implementá la separación de roles con **subagentes**: un subagente generador y un subagente evaluador, cada uno con su prompt. El evaluador con instrucciones explícitas de ser quisquilloso.
- Conectá el evaluador a **Playwright MCP** (u otra herramienta de browser) para click-testing real del E2E.
- Usá el sprint contract como artefacto versionado por tarea (front-loadea la alineación y evita que el generador construya algo que el evaluador rechazará por razones previsibles).
- Si notás que el evaluador es demasiado blando, aplicá el loop de Anthropic: leé sus logs, encontrá las divergencias con tu juicio y ajustá su prompt.

## Conclusiones

- La observabilidad es una propiedad de la arquitectura del harness: se diseña desde el principio.
- Ambas capas son esenciales: las señales de runtime explican "qué pasó", los artefactos de proceso "por qué se hizo así".
- Los sprint contracts front-loadean la alineación.
- Las rúbricas de scoring hacen la evaluación reproducible.
- Sin observabilidad se desperdicia 30-50% del tiempo de sesión en diagnóstico redundante.
