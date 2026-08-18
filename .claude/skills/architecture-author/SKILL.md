---
name: architecture-author
description: >-
  Cómo fijar las decisiones técnicas del proyecto — la doctrina del Arquitecto (etapa 2). Se activa
  con /new-architecture o cuando el usuario pide "definí la arquitectura", "dónde se guardan los
  datos", "modelo de datos". Escribe UN archivo (docs/arquitectura/decisiones.md) con una sección
  por tema — stack, datos y aislamiento por usuario, secretos, integración con la IA y techo de
  gasto, deploy — y numera las reglas innegociables en docs/sdd/constitucion.md. Sin subagentes: el
  modelo de datos es una sección más. No decide alcance (eso es docs/prd.md) ni implementa.
---

# architecture-author — cómo se fijan las decisiones técnicas

Doctrina de la **etapa 2**: bajar el PRD (el *qué*) a las **decisiones técnicas** (el *cómo*),
para que no se re-discutan en cada spec. Todo va a **un solo archivo**:
`docs/arquitectura/decisiones.md`, con una sección por tema.

## Doctrina

1. **Un archivo, una sección por tema.** Cubrir como mínimo: **stack y deploy** · **datos**
   (dónde viven, y si hay datos de más de un usuario, cómo se aíslan entre sí) · **secretos**
   (de dónde salen las claves; nunca del código) · **integración con la IA** (modelo, límite de
   gasto por llamada) · **costo estimado**. Si un tema no aplica (ej. "sin base de datos"), se
   dice en una línea y por qué — no se desarrolla.
2. **Las reglas innegociables se numeran.** Cada MUST/MUST NOT que salga de estas decisiones se
   enuncia en su sección y se registra en `docs/sdd/constitucion.md` con su número `#<n>`
   (completar los dueños "pendiente" de #1–#4 apuntando a la sección correspondiente de
   `decisiones.md`). Desde cualquier otro documento se cita por `#<n>`, no se copia el enunciado.
3. **El porqué durable va a `DECISIONS.md`.** Una entrada por decisión que se sostiene en el
   tiempo (qué se eligió, qué se descartó, por qué). Lo que quede sin resolver va a la sección
   `## Abierto` del mismo archivo.
4. **No decide alcance.** Si aparece un "¿esto entra o no?", es del PRD.
   Si una decisión técnica es genuinamente del owner, se le sirve digerida: qué significa en
   llano, pros y contras, y una opción sugerida según el contexto.
5. **Salida en llano.** El archivo se escribe para que el dueño del producto lo entienda; la
   precisión fina para los agentes va en el "Anexo técnico" al final del archivo.

## El flujo

1. **Leer el PRD** (`docs/prd.md`): MVP, milestones, fuera de alcance. Las decisiones sirven a ese
   *qué*, no lo amplían.
2. **Escribir `docs/arquitectura/decisiones.md`**: una sección por tema (punto 1), con sus reglas
   MUST marcadas.
3. **Reconciliar la constitución**: completar los dueños de #1–#4 y agregar reglas nuevas si las hay.
4. **Registrar** las decisiones durables en `DECISIONS.md` y ofrecer el puente: **`/new-plan`**.

**Cierre:** cada regla innegociable tiene número y dueño; el archivo cubre los temas mínimos; las
decisiones durables están en DECISIONS.md.
