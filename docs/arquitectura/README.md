# Arquitectura — el *cómo* del proyecto

> **Dueño de:** las decisiones técnicas del proyecto. Viven en **un solo archivo**:
> [`decisiones.md`](decisiones.md) (lo escribe `/new-architecture`), con una sección por tema —
> stack y deploy · datos (y aislamiento entre usuarios, si aplica) · claves y secretos ·
> integración con la IA y techo de gasto · costo estimado.
> **No cubre:** el alcance (→ [`../prd.md`](../prd.md)) · el proceso de trabajo
> (→ [`../sdd/README.md`](../sdd/README.md)).

Reglas de esta carpeta:
- **Un hecho, un dueño:** si algo ya está explicado en una sección, se linkea, no se copia.
- Las reglas innegociables que salen de estas decisiones se numeran en
  [`../sdd/constitucion.md`](../sdd/constitucion.md) y se citan por `#<n>`.
- El porqué de cada decisión durable va a [`DECISIONS.md`](../../DECISIONS.md); lo que queda sin
  resolver, a la sección `## Abierto` de `decisiones.md`.
