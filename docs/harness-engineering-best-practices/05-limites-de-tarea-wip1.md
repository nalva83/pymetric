# 05 — Límites de tarea (WIP=1)

## El problema: el agente quiere "hacer un poco de más"

Le decís a Claude Code "agregá autenticación de usuario" y empieza a modificar el schema, escribir rutas, cambiar componentes de frontend y —ya que está— refactorizar el middleware de manejo de errores. Dos horas después: 12 archivos modificados, 800 líneas nuevas, y ni una sola feature funciona end-to-end.

Los agentes nacen con el impulso de "hacer de más": ven cosas relacionadas y las resuelven al pasar. El problema es que hacer demasiado a la vez casi garantiza que nada quede bien.

> Cuando los prompts son demasiado amplios, los agentes tienden a "empezar varias cosas a la vez" en vez de "terminar una primero". No es un problema del modelo: es del harness. No dibujaste el límite.

## La atención es un recurso finito (literalmente)

No es metáfora, es matemática. Si la capacidad de contexto del agente es `C` y activa `k` tareas en simultáneo, cada tarea recibe en promedio `C/k` recursos de razonamiento. Cuando `C/k` cae por debajo del mínimo necesario para completar una sola tarea, **ninguna se termina**.

Ejemplo del comportamiento real: pedís "agregá registro de usuario" y el agente:
1. crea un modelo User,
2. escribe la ruta de registro,
3. nota que necesita verificación de email → agrega un servicio de mail,
4. ve que las contraseñas necesitan hash → trae bcrypt,
5. nota que el manejo de errores es inconsistente → refactoriza el middleware global,
6. ve que la estructura de tests es un desorden → reorganiza el directorio.

Seis pasos, todos a medias. Sin verificación end-to-end, acoplamiento complejo entre código a medio hornear, y la próxima sesión se pierde por completo.

> Datos: agentes con estrategia de "próximo paso chico" (equivalente a WIP=1) tienen **37% más** de tasa de completitud que con prompts amplios. Y las líneas de código generadas correlacionan **negativamente** con features completadas: más código, menos features hechas.

## Conceptos clave

- **Overreach (sobrealcance)**: el agente activa más tareas de las óptimas en una sesión. Cuantificable: hacer 5 features con 0 pasando end-to-end es overreach.
- **Under-finish (subterminación)**: la proporción de tareas que pasan verificación end-to-end cae por debajo del umbral. Código escrito pero tests sin pasar = under-finish.
- **WIP Limit (límite de trabajo en curso)**: de Kanban. Para agentes, **WIP=1 es el default más seguro**: terminá una antes de empezar la siguiente.
- **Completion Evidence**: la condición verificable que una tarea debe cumplir para pasar de "en curso" a "hecha". Sin esto, el agente sustituye "el código se ve bien" por "el comportamiento pasa los tests".
- **Scope Surface**: estructura tipo DAG donde cada nodo es una unidad de trabajo y los ejes son dependencias. Estados: `not_started`, `active`, `blocked`, `passing`.
- **Verified Completion Rate (VCR)**: tareas verificadas / tareas activadas.

Overreach y under-finish son **dos caras de la misma moneda**: el sobrealcance diluye la atención, la atención diluida causa subterminación, y el código a medias deja complejidad que impulsa más sobrealcance en la próxima tarea. Círculo vicioso (Ley de Little: `L = λ·W` — más trabajo en curso, más tiempo de entrega por tarea).

## Cómo hacerlo bien

### 1. Forzar WIP=1
En `CLAUDE.md`:

```markdown
## Reglas de trabajo
- Trabajar en una feature a la vez
- Empezar la siguiente solo cuando la actual pase verificación end-to-end
- No "refactorizar también" la feature B mientras se implementa la A
```

### 2. Definir evidencia de finalización ejecutable para cada tarea
"Hecho" no es "el código está escrito", es "el comportamiento pasa la verificación". Cada entrada del feature list lleva un comando de verificación:

```
F01: Registro de usuario
  Verificación: curl -X POST /api/register -d '{"email":"test@example.com","password":"123456"}' | jq .status == 201
  Estado: passing
```

### 3. Externalizar el scope surface
Usá un archivo machine-readable (JSON o Markdown) que registre todos los estados de tareas. Cualquier sesión nueva lo lee y sabe al instante: ¿cuál está `active`? ¿qué comportamiento cuenta como hecho? ¿qué verificaciones pasaron? (Ver [06 — Feature lists](06-feature-lists.md).)

### 4. Monitorear el VCR
El harness rastrea VCR = verificadas / activadas. **Bloqueá la activación de nuevas tareas cuando VCR < 1.0.**

## Caso real (resumido)

Proyecto API REST con 8 features:

| Modo | Líneas (sesión 1) | Tests E2E | Completitud final |
|------|-------------------|-----------|-------------------|
| Sin restricción (5 features a la vez) | ~800 / 12 archivos | 20% | 3/8 (37.5%) |
| WIP=1 (una feature por vez) | ~200 / 4 archivos | 100% | 7/8 (87.5%) |

Menos código total, pero más código efectivo. **"Hacer menos pero terminar" siempre vence a "hacer más pero dejar a medias".**

## Aplicación en Claude Code

- Escribí la regla WIP=1 en `CLAUDE.md` y reforzala en el prompt inicial de tareas complejas.
- Atomizá los requerimientos amplios antes de delegar: convertí "implementá gestión de usuarios" en ≥5 unidades atómicas, cada una con (a) descripción de un solo comportamiento, (b) comando de verificación ejecutable, (c) dependencias.
- Para paralelizar de verdad (cuando hace falta), usá **subagentes / worktrees aislados** en vez de pedirle a un solo agente que active 5 tareas en un mismo contexto.

## Conclusiones

- WIP=1 es el default seguro: terminá una, después empezá la siguiente.
- La evidencia de finalización debe ser ejecutable: "el código se ve bien" no cuenta; "curl devuelve 201" sí.
- El scope surface va externalizado en un archivo machine-readable, no solo mencionado en la conversación.
- Overreach y under-finish son simbióticos: resolver uno resuelve el otro.
