<!-- PLANTILLA — un documento de diseño (un concepto). Copiá a docs/arquitectura/<concepto>.md y completá los `<...>`. NO edites esta plantilla. -->

# <Concepto> — diseño

> **Dueño de:** `<qué concepto del sistema gobierna este archivo, en una línea>`.
> **No cubre:** `<lo que vive en otro archivo — con link>`.
> **Última revisión:** `<fecha>`

---

## 1. Decisión de diseño

`<Qué se decidió y cómo funciona. El cómo técnico de este concepto. Diagramas/tablas si ayudan.>`

## 2. Invariantes (⛔ MUST / MUST NOT)

Lo que ninguna spec puede violar. Cada invariante se numera en [`../sdd/constitucion.md`](../sdd/constitucion.md).

- **⛔ `<#n>`** — `<enunciado MUST / MUST NOT en una línea>`. Modo de falla: `<qué se rompe si se viola>`.

## 3. Contrato con otras capas

`<Qué entra, qué sale, qué garantías. Endpoints, esquemas, eventos, límites.>`

## 4. Alternativas consideradas

`<Qué se descartó y por qué. La decisión durable también va a ../../DECISIONS.md.>`

## Abierto

`<Preguntas de diseño sin resolver todavía. Una spec que las toque deja un [?] y apunta acá; no las decide.>`
