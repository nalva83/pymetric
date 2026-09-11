# Pymetric — PRD

> **Este documento manda sobre el *qué*: qué construimos, en qué orden, y qué significa
> «terminado».** El *cómo* técnico vive en `docs/arquitectura/` (un documento por tema) y no se decide acá.
>
> **Última revisión:** `2026-09-10`

---

## 1. Qué es Pymetric

**Pymetric es un SaaS de automatización y análisis de costos para PyMEs de hasta 20 empleados.**

- **Para quién:** dueños/gerentes de PyME sin equipo de IT ni de datos, que hoy arman
  presupuestos, gastos y listas de precios a mano.
- **Qué promete:** que el tiempo que hoy se pierde en tareas administrativas repetitivas
  se recupere para lo que hace crecer el negocio — vender más, mejorar el producto,
  atender clientes.
- **Qué problema resuelve:** el costo oculto (tiempo propio) de tareas repetitivas —
  redactar presupuestos, actualizar listas de precios de proveedores, no tener
  visibilidad clara de los costos del negocio.

## 2. El MVP — un recorrido completo, no una lista de features

```
El dueño se registra solo (self-serve)
  → sube la lista de precios de un proveedor y recibe el xls actualizado, listo
    para importar a su sistema
  → carga sus costos y ve el análisis (por categoría / proveedor / período)
  → genera un presupuesto usando esos costos y márgenes — resultado visible: una
    cotización lista para enviar
```

Si eso corre de punta a punta **una vez**, el MVP está probado. Las tres capacidades de
`docs/solucion.md` entran en el MVP — el orden de construcción abajo no recorta
alcance, solo secuencia qué se prueba primero.

## 3. Milestones (en orden)

### M1 — Actualización de listas de precios

**Objetivo:** el dueño sube el archivo original de un proveedor y recibe un xls
actualizado listo para importar a su sistema.
**Por qué primero:** es el recorrido más corto y autocontenido de las tres
capacidades (no depende de datos previos cargados en la plataforma) — el más rápido
para llegar a un "probalo vos" real y validar que el producto entrega valor.

**Está terminado cuando:**
- [ ] El dueño se registra solo, sin intervención humana de nuestro lado.
- [ ] Sube un archivo de lista de precios en el formato que le llega del proveedor.
- [ ] Recibe un xls con los precios actualizados, listo para importar a su sistema.
- [ ] El recorrido corre de punta a punta sin ayuda externa.

### M2 — Análisis de costos

**Objetivo:** el dueño carga sus costos y obtiene una vista organizada de en qué se
va la plata.
**Por qué segundo:** necesita que el usuario ya esté registrado (M1) y establece la
base de datos de costos que M3 (presupuestos) va a reutilizar — sin esto, presupuestos
tendría que resolver la carga de costos dos veces.

**Está terminado cuando:**
- [ ] El dueño carga sus costos (manual, sin integraciones externas).
- [ ] Ve un reporte organizado por categoría, proveedor y período.
- [ ] El reporte refleja fielmente lo cargado, sin intervención manual adicional.

### M3 — Presupuestos automatizados

**Objetivo:** el dueño genera una cotización a partir de los costos, ítems y
márgenes cargados.
**Por qué tercero:** cierra el recorrido completo del MVP reutilizando los costos de
M2 — es la capacidad que ataca el dolor más agudo del ICP, y depende de que ya exista
una base de costos sobre la que calcular.

**Está terminado cuando:**
- [ ] El dueño genera un presupuesto usando sus costos, ítems y márgenes cargados.
- [ ] El presupuesto queda listo para enviar (formato exportable/compartible).
- [ ] El recorrido completo (M1 → M2 → M3) corre de punta a punta en una sola
  sesión, sin ayuda externa.

## 4. Riesgos, con su límite aceptado

| # | Riesgo | Hasta dónde se tolera / qué se hace al cruzarlo |
|---|---|---|
| 1 | El precio base ($50-100/mes, `docs/solucion.md`) no está validado con clientes reales | Se tolera hasta el cierre de M1 con los primeros usuarios reales; si ninguno lo paga, se revisa el precio antes de seguir a M2 |
| 2 | La falta de integraciones (banco/contable/ERP) frena la adopción de PyMEs que ya usan un sistema | Se tolera durante todo el MVP (decisión explícita en `docs/solucion.md`); si el feedback de M1-M3 muestra que es un bloqueante recurrente, se evalúa como milestone siguiente — no se agrega a mitad de camino |
| 3 | El costo de procesar archivos/generar presupuestos con IA no está estimado — puede comer el margen del precio base | Se tolera hasta `/costo` (estimación de infraestructura); si el costo por usuario supera un tercio del precio base, se revisa el modelo antes de publicar precio final |

## 5. Fuera de alcance

- Integraciones automáticas con banco, sistema contable o ERP (el MVP entra/sale por
  archivo, según `docs/solucion.md`).
- Onboarding asistido o intervención humana en el alta — el producto es 100%
  self-serve en esta etapa.
- Multiusuario/roles dentro de una misma cuenta de PyME.
- Cualquier estrategia comercial de precios (tiers, descuentos, trials) — eso es
  territorio de la oferta, no del producto.

## 6. Preguntas abiertas

1. **¿El número exacto del precio base (dentro del rango $50-100/mes)?** — *cerrar
   antes de `/deploy`, con datos de los primeros usuarios de M1.*
2. **¿Qué proveedor de IA (si aplica) procesa listas de precios y presupuestos, y
   cuál es su costo real por uso?** — *cerrar antes de `/arquitectura`, ya que define
   el modelo de integraciones IA.*
3. **¿La ausencia de integraciones bloquea la venta a PyMEs del extremo alto (15-20
   empleados)?** — *cerrar antes de M2, con el feedback de los primeros usuarios de M1.*

## 7. El cómo técnico (lo completa `/arquitectura`)

- **Stack, deploy y costo:** `<link a docs/arquitectura/stack.md>`
- **Modelo de datos:** `<link>`
- **Secretos:** `<link>`
- **Recorrido del usuario:** `<link>`
- **Marca:** `<link>`
- **Integraciones IA / otros sistemas / auth y permisos:** `<links, o "no aplica — <por qué>">`

## 8. La regla de gestión

> **El alcance se achica quitando features (que quedan visibles en §5), nunca bajando la vara de
> «terminado».** Un milestone con condiciones recortadas parece cerrado y no lo está: la deuda
> queda escondida en un checkbox tildado.

Si algo se posterga, se anota con milestone destino y dueño, y el porqué va a
[`DECISIONS.md`](../DECISIONS.md). Lo que toque la regla #1 de la
[constitución](sdd/constitucion.md) (datos de usuarios) no se posterga nunca.
