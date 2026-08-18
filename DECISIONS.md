<!--
PLANTILLA — DECISIONS.md (registro de decisiones de diseño)
Captura el "POR QUÉ" que la compactación de contexto suele perder.
Formato mínimo por entrada: qué decisión, por qué, alternativa rechazada, constraint, fecha.
-->

# Decisiones de diseño

## 2026-08-17: Simplificar el harness (v2 — rápido y en llano)
- **Decisión:** reducir el equipo de 11 a 6 roles (el Programador `builder` implementa Y verifica; el Planificador `planner` hace plan + specs en un comando `/new-plan`; DevOps absorbe el chequeo de costo), dejar 2 rondas de preguntas en todo el flujo, un solo archivo de arquitectura (`decisiones.md`), estado en un solo lugar (la tabla del plan), plantillas cortas cuyas secciones no aplicables se borran, y todos los documentos visibles en lenguaje llano con anexos técnicos para los agentes. Tres capas con responsabilidad única: skill = CÓMO, agente = QUIÉN, command = ejecución — sin duplicar contenido entre capas.
- **Razón:** en la demo en vivo el harness v1 era lentísimo: ~22.500 palabras de instrucciones, ~18 subagentes mayormente en serie, hasta 11 rondas de preguntas y estado por triplicado. Y el usuario final no es técnico.
- **Alternativa rechazada:** mantener el harness completo y agregar un modo `--fast` aparte — doble mantenimiento; y eliminar las skills moviendo la doctrina a los commands — rompía la separación CÓMO/QUIÉN/ejecución.
- **Constraint:** toda doctrina vive en su skill y se referencia (no se copia) desde commands y agentes; el punto de retorno pre-cambio es el commit `42eb607`.

## <AAAA-MM-DD>: <Título corto de la decisión>
- **Decisión:** <qué se decidió>
- **Razón:** <por qué>
- **Alternativa rechazada:** <qué se descartó y por qué>
- **Constraint / consecuencia:** <restricción que esto impone hacia adelante>

## 2026-01-15: Usar Redis para cachear preferencias de usuario
- **Decisión:** cachear las preferencias de usuario en Redis.
- **Razón:** alta frecuencia de lectura (cada llamada de API), datos chicos.
- **Alternativa rechazada:** vista materializada en PostgreSQL — la alta frecuencia de cambio no justifica el costo de mantenimiento.
- **Constraint:** TTL de cache de 5 minutos, invalidación activa al escribir.
