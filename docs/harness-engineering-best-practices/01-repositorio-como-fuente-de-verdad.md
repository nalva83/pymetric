# 01 — El repositorio como fuente de verdad

## El principio

> **El repo ES la spec.** Información que no está en el repositorio, para el agente no existe.

Un agente tiene exactamente tres fuentes de entrada:
1. System prompt y descripción de la tarea,
2. contenido de archivos del repositorio,
3. salida de ejecución de herramientas.

Tu Slack, tus tickets de Jira, tu Confluence, la decisión de arquitectura que cerraste con un colega el viernes a la tarde: **nada de eso lo ve el agente**. No puede "preguntarle a alguien". Su mundo entero de trabajo es el repositorio.

Esto no es un problema de "escribir más documentación", es de **poner la información de decisión en el lugar correcto**. Un `ARCHITECTURE.md` de 50 líneas dentro de `src/api/` es mucho más útil que un documento de diseño de 500 páginas en Confluence que nadie mantiene. La proximidad importa más que la longitud.

## El Fresh Session Test (test de sesión nueva)

La forma de medir si tu "mapa" es suficientemente bueno: abrí una **sesión completamente nueva** de Claude Code, dale solo el contenido del repo (sin ningún contexto verbal) y comprobá si puede responder estas cinco preguntas:

| Pregunta | Dónde debería encontrar la respuesta |
|----------|--------------------------------------|
| ¿Qué es este sistema? | `CLAUDE.md` / `README` |
| ¿Cómo está organizado? | `ARCHITECTURE.md` / docs de módulo |
| ¿Cómo lo ejecuto? | `Makefile` / `init.sh` / scripts de package |
| ¿Cómo lo verifico? | comandos de test, lint, check |
| ¿Dónde estamos ahora? | `PROGRESS.md` / feature list / historial de git |

Si no puede responder alguna, ahí el mapa tiene un hueco en blanco. Donde el mapa está en blanco, el agente adivina; las adivinanzas erradas se vuelven bugs y las adivinanzas en exceso queman contexto. **El costo de adivinar siempre es mayor que el de dibujar bien el mapa la primera vez.**

## Conceptos clave

- **Knowledge Visibility Gap**: la proporción del conocimiento del proyecto que NO está en el repo. A mayor brecha, mayor tasa de falla. Apuntá a menos del 10%.
- **System of Record**: el repo como autoridad final sobre decisiones, constraints de arquitectura, estado de ejecución y estándares de verificación. Si la regla solo vive en la cabeza de alguien, hay que preguntarle cada vez.
- **Discovery Cost**: cuánto presupuesto de contexto quema el agente para encontrar una pieza clave de información. La información crítica va donde el agente la ve primero, no enterrada diez niveles de directorios.
- **Knowledge Decay Rate**: la proporción de entradas del repo que quedan obsoletas por unidad de tiempo. **Documentación desactualizada es peor que no tener documentación**: manda al agente en la dirección equivocada mientras él cree que va bien.

## Cómo dibujar un buen mapa

1. **El conocimiento vive al lado del código.** Una regla sobre autenticación de endpoints va al lado del código de la API, no en un documento global gigante. El directorio del módulo es un índice natural: cuando el agente llega al código, llega también a las constraints, sin buscar.
2. **Usá un archivo de entrada estandarizado.** `CLAUDE.md` es la "landing page" del agente. No necesita contener todo, pero debe permitir responder rápido: qué es el proyecto, cómo se ejecuta, cómo se verifica. 50-100 líneas alcanzan. (Ver [02 — Instrucciones en capas](02-instrucciones-en-capas.md).)
3. **Mínimo pero completo.** Si quitar una regla no afecta la calidad de decisión del agente, esa regla no debería existir. Pero cada pregunta del fresh session test debe tener respuesta.
4. **Actualizá junto con el código.** Atá las actualizaciones de conocimiento a los cambios de código: poné los docs de arquitectura en el directorio del módulo correspondiente, así al modificar código notás el doc. CI puede recordarte revisarlos.

### Estructura de repo concreta

```
proyecto/
├── CLAUDE.md               # Entrada: overview, comandos de ejecución, constraints duros
├── src/
│   ├── api/
│   │   ├── ARCHITECTURE.md  # decisiones de arquitectura de la capa API
│   │   └── ...
│   ├── db/
│   │   ├── CONSTRAINTS.md   # constraints duros de operaciones de DB
│   │   └── ...
│   └── ...
├── PROGRESS.md             # progreso actual: hecho, en curso, bloqueado
└── Makefile                # comandos estandarizados: setup, test, lint, check
```

## Gestionar el estado del agente con principios ACID

Aplicá los principios de transacciones de base de datos al estado del agente:

- **Atomicidad**: cada operación lógica ("agregar endpoint + actualizar tests") = un commit de git. Si falla a mitad, `git stash` para revertir. Todo o nada, nunca "a medias".
- **Consistencia**: definí predicados de verificación de "estado consistente" (todos los tests pasan, lint en cero errores). El agente verifica tras cada operación; los estados intermedios inconsistentes no se commitean.
- **Aislamiento**: con varios agentes concurrentes, evitá race conditions. Solución simple: cada agente con su propio archivo de progreso, o ramas de git para aislar.
- **Durabilidad**: el conocimiento crítico vive en archivos versionados por git. Lo que está en la cabeza no cuenta; solo lo escrito cuenta.

## Aplicación en Claude Code

- Nombrá el archivo de entrada `CLAUDE.md` (Claude Code lo lee automáticamente). Podés usar también `CLAUDE.md` por subdirectorio para reglas locales de cada módulo.
- Corré el fresh session test literalmente: nueva conversación, sin contexto verbal, las cinco preguntas. Iterá el repo hasta que las responda todas.
- Para conocimiento de equipo no derivable del código (objetivos, constraints externas), usá un `docs/` versionado, no canales efímeros.

## Conclusiones

- Conocimiento que no está en el repo no existe para el agente. Es la inversión de harness más fundamental.
- Usá el fresh session test para evaluar la calidad del repo.
- El conocimiento debe estar cerca del código, ser mínimo pero completo, y actualizarse con el código.
- Usá ACID para el estado: commits atómicos, verificación de consistencia, aislamiento de concurrencia, durabilidad del conocimiento crítico.
- El decay de conocimiento es el peor enemigo.
