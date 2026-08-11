# 02 — Instrucciones en capas

## El problema: la trampa del archivo gigante

Empezás a tomar en serio el harness, creás un `CLAUDE.md` y le metés cada regla, constraint y lección aprendida. Un mes después tiene 300 líneas; dos meses, 450; tres meses, 600. Y el agente **empeora**: en un bugfix simple quema contexto procesando instrucciones de deploy irrelevantes, una constraint de seguridad enterrada en la línea 300 se ignora, y tres reglas de estilo contradictorias hacen que elija una al azar.

El ciclo vicioso: el agente se equivoca → "agreguemos una regla para prevenirlo" → funciona temporalmente → otro error → otra regla → el archivo se infla sin control.

### Por qué duele

- **El presupuesto de contexto se devora.** Un `CLAUDE.md` de 600 líneas consume 10-20K tokens. Parece poco frente a una ventana de 200K, pero entre leer decenas de archivos fuente, salida de herramientas e historial de conversación, cuando el agente realmente necesita entender el código ya gastó el presupuesto.
- **Lost in the middle.** (Liu et al., 2023.) Los LLM aprovechan la información del medio de un texto largo mucho peor que la del principio o el final. Una constraint crítica en la línea 300 de 600 casi seguro se ignora.
- **Conflictos de prioridad.** El archivo mezcla constraints duros innegociables ("nunca uses `eval()`"), guías de diseño ("preferí estilo funcional") y lecciones históricas puntuales. Todas se ven iguales; el agente no tiene señal para distinguir línea roja de mera sugerencia.
- **Decay de mantenimiento.** Las instrucciones viejas rara vez se borran (por miedo a romper algo), pero agregar se siente gratis. El archivo solo crece, y la relación señal/ruido cae.
- **Acumulación de contradicciones.** Reglas agregadas en momentos distintos se contradicen entre sí.

## Conceptos clave

- **Instruction Bloat**: cuando el archivo de instrucciones ocupa 10-15% de la ventana, empieza a desplazar el presupuesto para leer código y razonar la tarea.
- **Instruction Signal-to-Noise Ratio (SNR)**: la proporción de instrucciones relevantes para la tarea actual. Leer 50 líneas de deploy durante un bugfix = SNR bajo.
- **Entry File (archivo de entrada)**: un archivo corto cuyo propósito es **rutear** al agente hacia documentación más detallada, no contenerla. 50-200 líneas.
- **Reveal on Demand (revelar bajo demanda)**: dar el panorama primero, el detalle cuando se necesita. Buen diseño de harness = buen diseño de UI: no le tires todas las opciones al usuario de golpe.

## Cómo dividir

**Principio núcleo:** mantené a mano lo que se necesita seguido, guardá lo ocasional, y no cargues lo que nunca vas a usar.

### El archivo de entrada (`CLAUDE.md`): 50-200 líneas

Solo lo esencial:
- **Overview del proyecto** (una o dos oraciones que dejen claro qué es).
- **Comandos de primera corrida** (`make setup && make test`).
- **Constraints duros globales** (no más de ~15 reglas innegociables).
- **Links a documentos temáticos** (una línea de descripción + condición de aplicabilidad).

```markdown
# CLAUDE.md

## Overview del proyecto
Backend FastAPI en Python 3.11, base de datos PostgreSQL 15.

## Quick Start
- Instalar: `make setup`
- Test: `make test`
- Verificación completa: `make check`

## Constraints duros
- Todas las APIs deben usar autenticación OAuth 2.0
- Todas las queries deben usar sintaxis SQLAlchemy 2.0
- Todo PR debe pasar pytest + mypy --strict + ruff check

## Documentos temáticos
- Patrones de API (`docs/api-patterns.md`) — Lectura obligatoria al agregar endpoints
- Reglas de base de datos (`docs/database-rules.md`) — Al modificar operaciones de DB
- Estándares de testing (`docs/testing-standards.md`) — Al escribir tests
```

### Los documentos temáticos: 50-150 líneas cada uno

Organizados por tema en `docs/` o al lado del módulo correspondiente. El agente solo los lee cuando los necesita. Como cubos organizadores de valija: no hace falta vaciar todo el bolso para encontrar algo.

Parte de la información va mejor **en el código** (definiciones de tipos, comentarios de interfaz, explicaciones en configs): el agente las ve al leer código, no hace falta duplicarlas en instrucciones.

### Cada instrucción con metadatos

Documentá para cada regla:
- **Fuente** ("¿por qué se agregó esta regla?"),
- **Aplicabilidad** ("¿cuándo se necesita?"),
- **Caducidad** ("¿bajo qué circunstancias se puede remover?").

Auditá periódicamente y borrá lo obsoleto, redundante o contradictorio. Gestioná las instrucciones como dependencias de código: lo no usado, fuera.

> Si una instrucción *debe* estar en el archivo de entrada, ponela **arriba o abajo, nunca en el medio**. Pero la mejor opción es moverla a un doc temático.

## Aplicación en Claude Code

- `CLAUDE.md` raíz = router corto. Mové el detalle a `docs/*.md` o a `CLAUDE.md` por subdirectorio (Claude Code carga el del directorio relevante bajo demanda).
- Considerá **Skills / slash commands** para flujos especializados (init, cleanup) en vez de inflar el `CLAUDE.md` con procedimientos largos.
- Si una constraint se repite, pensá si conviene volverla **chequeo automático** (lint rule, hook) en vez de texto — ver [07](07-verificacion-y-definicion-de-hecho.md).

## Caso real (resumido)

Un equipo SaaS infló su archivo de 50 a 600 líneas. Tras refactorizar a un entry file de 80 líneas + tres docs temáticos, y convertir notas históricas en tests o borrarlas:
- éxito en el mismo set de tareas: **45% → 72%**;
- cumplimiento de la constraint de seguridad: **60% → 95%** (porque pasó del medio del archivo al tope del entry file).

## Conclusiones

- "Agregar una regla" es alivio de corto plazo y veneno de largo plazo. Antes de agregar, preguntate si va en un doc temático.
- El archivo de entrada es un router, no una enciclopedia: 50-200 líneas, solo overview + constraints + links.
- Aprovechá "lost in the middle": lo importante arriba o abajo, lo menos crítico a docs temáticos.
- Gestioná el bloat como deuda técnica: auditorías regulares, cada instrucción con fuente, aplicabilidad y caducidad.
