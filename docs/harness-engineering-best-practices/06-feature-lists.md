# 06 — Feature lists

## El problema: el agente no sabe qué significa "hecho"

Le pedís a un agente que construya un e-commerce. Cuando termina, dice "listo". Mirás el código: la autenticación funciona, pero el botón de checkout no hace nada y el flujo de pago no está conectado. ¿Dónde se rompió? **Nunca le dijiste qué significa "hecho"**, así que usó su propio estándar: "escribí bastante código y se ve más o menos completo".

> Un feature list no es un memo para humanos. Es la estructura fundacional sobre la que se construye todo el harness. El scheduler lo usa para elegir tareas, el verificador para juzgar completitud, el reporter de handoff para generar resúmenes. Sin él, esos componentes no tienen consenso compartido del que depender.

El estado de las features debe vivir en un archivo **machine-readable** en el repo, no en texto de conversación.

### Una nota de progreso típica (mala)

```
Hice user auth, el carrito casi listo, falta payments
```

¿Una sesión nueva puede responder con esto? ¿Qué significa "casi listo"? ¿Qué tests pasó el carrito? ¿Qué bloquea payments? Nadie sabe. Resultado: 20 min infiriendo estado y posible re-implementación de features ya hechas. (Buenos registros de progreso reducen el tiempo de diagnóstico de arranque en **60-80%**.)

## Conceptos clave

- **Feature lists como primitivas del harness**: no "herramientas de planificación opcionales", sino estructuras de datos fundacionales de las que dependen todos los demás componentes.
- **Estructura de trío**: cada ítem contiene tres elementos: **(descripción de comportamiento, comando de verificación, estado actual)**. El comportamiento dice qué hacer; la verificación, qué cuenta como hecho; el estado, dónde estamos. Falta uno = ítem incompleto.
- **Modelo de máquina de estados**: cuatro estados — `not_started`, `active`, `blocked`, `passing`. Las transiciones las controla el harness, no el agente libremente.
- **Pass-state gating**: la única forma de pasar de `active` a `passing` es que el comando de verificación se ejecute con éxito. La transición es irreversible.
- **Single source of truth**: toda la información sobre "qué hay que hacer" deriva de un solo feature list. Sin contradicciones con el historial de conversación.

## Por qué deben ser "primitivas"

Los documentos son para que los humanos los lean; las primitivas, para que los sistemas las ejecuten. Los documentos se pueden ignorar; las primitivas, no.

Es como las constraints de trigger de base de datos vs. los chequeos a nivel de aplicación: las primeras las fuerza el motor —ninguna SQL las saltea—; los segundos dependen de que el código de aplicación esté bien y se pueden bypassear por accidente. El feature list como primitiva juega el rol de las constraints a nivel de base de datos.

El feature list sirve a cuatro componentes del harness:
- **Scheduler**: lee estados, elige la próxima feature `not_started`.
- **Verifier**: ejecuta comandos de verificación, decide si permite la transición de estado.
- **Handoff reporter**: genera resúmenes de handoff automáticamente desde el feature list.
- **Progress tracker**: cuenta la distribución de estados, provee métricas de salud del proyecto.

## Cómo hacerlo

### 1. Definí un formato mínimo con el trío

```json
{
  "id": "F03",
  "behavior": "POST /cart/items con {product_id, quantity} devuelve 201",
  "verification": "curl -X POST http://localhost:3000/api/cart/items -H 'Content-Type: application/json' -d '{\"product_id\":1,\"quantity\":2}' | jq .status == 201",
  "state": "passing",
  "evidence": "commit abc123, log de salida del test"
}
```

(Plantilla completa: [`plantillas/feature_list.json`](plantillas/feature_list.json).)

### 2. Que el harness controle las transiciones de estado
El agente no cambia el estado a `passing` directamente: solo envía una solicitud de verificación. El harness ejecuta el comando y decide si permite la transición (pass-state gating).

### 3. Escribí las reglas en `CLAUDE.md`

```markdown
## Reglas del feature list
- Archivo del feature list: /docs/features.md (o feature_list.json)
- Solo una feature activa a la vez
- El comando de verificación debe pasar antes de marcar como passing
- No modifiques los estados vos mismo — el script de verificación los actualiza
```

### 4. Calibrá la granularidad
Cada ítem debe ser "completable en una sesión":
- **Bien**: "El usuario puede agregar ítems al carrito."
- **Demasiado amplio**: "Implementar el carrito de compras."
- **Demasiado angosto**: "Crear el campo `name` en el modelo Cart."

Demasiado amplio y no termina; demasiado angosto y el overhead de gestión crece.

## Caso real (resumido)

E-commerce con 10 features:

| Enfoque | Tiempo de arranque de sesión nueva | Re-implementaciones |
|---------|-----------------------------------|---------------------|
| Memo (notas no estructuradas) | 20 min infiriendo estado | Re-implementa features hechas |
| Feature list estructurado | 3 min (F01-F05 passing, F06 active, F07-F10 not_started) | Cero |

Proyectos con feature lists estructurados: **45% más** de tasa de completitud que el tracking libre, con cero implementaciones duplicadas.

## Aplicación en Claude Code

- Guardá el feature list en `docs/features.md` o `feature_list.json` y referencialo desde `CLAUDE.md`.
- Conectá esto con [05 — WIP=1](05-limites-de-tarea-wip1.md): el feature list **es** el scope surface externalizado, y la regla "una feature `active` a la vez" lo respalda.
- El comando de verificación de cada feature alimenta la [Definición de Hecho](07-verificacion-y-definicion-de-hecho.md). Idealmente, un hook o script actualiza el estado tras correr la verificación, en vez de que el agente lo edite a mano.

## Conclusiones

- El feature list es la estructura fundacional del harness, no un memo para humanos.
- Cada ítem necesita el trío: comportamiento + comando de verificación + estado. Falta uno = incompleto.
- Las transiciones las controla el harness; pasar la verificación es el único camino de upgrade.
- Es el single source of truth: todo "qué hacer" deriva de él.
- Granularidad: "completable en una sesión".
