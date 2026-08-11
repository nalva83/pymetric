<!-- PLANTILLA — índice de arquitectura del proyecto. Se llena por proyecto (lo escribe `/new-architecture` → architecture-author). Los `<...>` son placeholders. -->

# Arquitectura — el *cómo* del proyecto

> **Dueño de:** las decisiones técnicas de fondo y el diseño de cada concepto del sistema. Un archivo por tema.
> **No cubre:** el alcance ni el orden → [`../prd.md`](../prd.md) · el proceso de autoría → [`../sdd/README.md`](../sdd/README.md) · la lista numerada de reglas → [`../sdd/constitucion.md`](../sdd/constitucion.md).
> **Última revisión:** `<fecha>`

---

## Qué vive acá

El *cómo* técnico del producto: stack, límites de servicio, contratos entre capas, y **un archivo por concepto de diseño** (autenticación, modelo de datos, integración con el LLM, deploy, …). Lo escribe `architecture-author` (comando `/new-architecture`), que además delega el modelo de datos a `data-modeler`.

## Reglas de esta carpeta (un hecho, un dueño)

- **Un archivo por concepto.** Si estás re-explicando algo que ya vive en otro archivo, va un link, no una copia.
- **Los invariantes se marcan `⛔ MUST` / `MUST NOT`** en el archivo dueño, y se numeran en [`../sdd/constitucion.md`](../sdd/constitucion.md) con su `#<n>` para poder citarlos desde las specs.
- **Toda decisión durable** cierra con una entrada en [`../../DECISIONS.md`](../../DECISIONS.md) (el *por qué*).
- **Toda ambigüedad de diseño sin resolver** va a la sección `## Abierto` del archivo dueño, no a una spec.
- El alcance (si algo entra o no en el MVP) no se decide acá: eso es del [`../prd.md`](../prd.md).

## Convención de archivos

```
docs/arquitectura/
├── README.md          ← este índice
├── TEMPLATE.md        ← plantilla de un doc de diseño (copiar, no editar)
└── <concepto>.md      ← uno por tema (ej: modelo-de-datos.md, integracion-llm.md, deploy.md)
```

## Mapa concepto → archivo dueño

| Concepto | Archivo dueño | Reglas que numera |
|---|---|---|
| `<ej. modelo de datos + aislamiento por usuario>` | `<modelo-de-datos.md>` | `<#1>` |
| `<ej. secretos y costo>` | `<integracion-llm.md>` | `<#2, #3>` |

<!-- Agregá una fila por cada archivo de diseño que cree `/new-architecture`. -->
