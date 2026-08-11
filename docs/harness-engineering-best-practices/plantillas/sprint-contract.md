<!--
PLANTILLA — Sprint Contract (observabilidad de proceso)
Acuerdo de corto plazo NEGOCIADO ANTES de codear, entre generador y evaluador.
Front-loadea la alineación: evita que el generador construya algo que el evaluador
rechazará por razones previsibles. Uno por feature/sprint. Ver: docs/08-observabilidad-y-evaluacion.md
-->

# Sprint Contract: <Nombre de la feature>

## Alcance (qué se construye)
- <Modificar el componente X>
- <Actualizar Y>
- <Agregar tests de Z>

## Estándares de verificación (qué significa "hecho")
- <Tests de regresión visual pasan por componente>
- <Tests end-to-end del flujo principal pasan>
- <Sin flash of unstyled content (FOUC)>
- <Comando concreto: `make check` en verde>

## Exclusiones (qué NO se toca en este sprint)
- <No se manejan estilos de impresión>
- <No se maneja el caso de componentes de terceros>

## Rúbrica de aceptación (umbrales duros — si alguna no llega, el sprint FALLA)
| Dimensión | Umbral mínimo para aprobar |
|-----------|----------------------------|
| Corrección de código | Todos los tests pasan |
| Cumplimiento de arquitectura | Sin violaciones de frontera |
| Funcionalidad | Las interacciones core funcionan de verdad (no solo presentacionales) |
| Cobertura de tests | Flujo principal + edge cases |
