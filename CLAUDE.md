# <Nombre del proyecto>

## Overview
<Una o dos oraciones que dejen claro QUÉ es esto.>
Stack: <ej. Next.js + Vercel>.

## Quick Start
- Instalar: `<npm install | ...>`
- Levantar en dev: `<npm run dev | ...>`
- **Verificación completa: `<npm test && npm run lint | make check>`**

## Las reglas del proyecto
Las reglas innegociables, numeradas y citables por `#<n>`, viven en `docs/sdd/constitucion.md`.
Las tres de trabajo diario:
- **Una cosa a la vez:** una spec por vez; la siguiente arranca cuando la actual está terminada.
  Sin refactor colateral ("ya que estoy").
- **Terminado = las 3 verificaciones en verde, en orden** (regla #5). "El código está escrito" no
  es terminado.
- **Base primero:** nada se construye hasta que la demanda real lo llame; el alcance se achica
  quitando piezas, nunca bajando la vara de terminado.

## El equipo de agentes
Cada etapa tiene su responsable. Nombralos al invocarlos.

| Rol | Cómo se invoca | Qué hace |
|---|---|---|
| Analista de Producto | `/new-prd <idea>` | La idea → el PRD (el qué) |
| Arquitecto | `/new-architecture` | El PRD → las decisiones técnicas (el cómo) |
| Planificador | `/new-plan <M#>` | El milestone → plan + specs |
| Programador (`builder`) | prosa: "construí `<ID>`" | Una spec → código verificado (3 verificaciones) |
| Diseñador de Producto (`ux-reviewer`) | prosa: "revisá que no parezca de IA" | Que la app no parezca prototipo |
| DevOps (`deploy-engineer`) | `/deploy-check [entorno]` | El control "listo para publicar" |
| *(red de seguridad)* | `/save-point <etiqueta>` | Punto de retorno en Git |

## Flujo y estado
- **Método:** idea → `/new-prd` → `/new-architecture` → `/new-plan` → "construí `<ID>`" →
  `/deploy-check`. Guía completa: `docs/sdd/README.md`.
- **El estado de las piezas vive en UN solo lugar:** la tabla del plan activo en
  `docs/sdd/plans/active/`.
- **Nota entre sesiones:** `PROGRESS.md` (dónde retomar). **Porqués:** `DECISIONS.md`.

### Al iniciar la sesión
1. Leer `PROGRESS.md` y la tabla del plan activo.
2. Correr la verificación completa para confirmar estado consistente.
3. Continuar desde donde dice `PROGRESS.md`, una cosa a la vez.

### Antes de cerrar la sesión
1. Verificación completa en verde.
2. Tabla del plan y `PROGRESS.md` al día; sin artefactos de debug sueltos.
3. Trabajo commiteado (qué + por qué); decisión durable → `DECISIONS.md`.

## Documentos (leer bajo demanda)
- **Alcance y milestones:** `docs/prd.md` · **Decisiones técnicas:** `docs/arquitectura/decisiones.md`
- **El método y las plantillas:** `docs/sdd/README.md` · **Reglas numeradas:** `docs/sdd/constitucion.md`
