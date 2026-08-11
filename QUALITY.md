<!--
PLANTILLA — QUALITY.md (quality document, artefacto activo)
NO es una evaluación de una sola vez: es un tracker de si el codebase
se fortalece o debilita con el tiempo. Actualizar en la limpieza periódica (semanal).
Las sesiones nuevas leen esto y arreglan PRIMERO el módulo de menor score.
Escala: A (sólido) → D (problemático). Ver: docs/09-handoff-y-limpieza.md
-->

# Quality Document

_Última actualización: <AAAA-MM-DD>_

## <Módulo de Autenticación> (Calidad: A)
- Verificación pasando: Sí
- Entendible por el agente: Sí
- Estabilidad de tests: Estable
- Fronteras de arquitectura: Cumple
- Convenciones de código: Seguidas

## <Módulo de Pagos> (Calidad: C)
- Verificación pasando: Parcial (<callback de pago sin testear>)
- Entendible por el agente: Difícil (<lógica dispersa en 3 archivos>)
- Estabilidad de tests: Inestable (<2 tests flaky>)
- Fronteras de arquitectura: Hay violaciones (<acceso directo a la DB desde la capa UI>)
- Convenciones de código: Parcialmente seguidas

## <Módulo X> (Calidad: <A-D>)
- Verificación pasando: <Sí / Parcial / No>
- Entendible por el agente: <Sí / Difícil>
- Estabilidad de tests: <Estable / Inestable>
- Fronteras de arquitectura: <Cumple / Violaciones>
- Convenciones de código: <Seguidas / Parcial>
