# Directrices de Develop

Antes de programar, lee este documento y `docs/agents/testing-directrices.md`.

- Mantén la lógica de precios, IVA, rentabilidad y stock en `src/domain`.
- Representa dinero en céntimos enteros y redondea con `Math.round` sobre importes positivos.
- Valida costes, IVA, multiplicadores, cantidades y stock negativo.
- Añade o actualiza tests de dominio en el mismo cambio.
- Las operaciones Firestore de inventario deben ser transacciones idempotentes.
- No añadas autenticación, Admin SDK ni secretos al repositorio.
- No modifiques código ajeno a la tarea asignada.

Al terminar, devuelve un resumen breve con archivos tocados, decisiones y comandos ejecutados.
