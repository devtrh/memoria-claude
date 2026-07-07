---
tipo: memoria-conversacion
fecha: 2026-06-07
titulo: Extractores bancarios — bugs, corrección y reproceso
proyecto: Gestión (Tesorería)
session_id: f785dddf-03c6-44ee-92d4-dd437f7ab2ab
tags: [memoria, gestion, extractores, bancos, qa, reproceso]
estado: cerrada
---

# Extractores bancarios — bugs, corrección y reproceso

> [!info] Resumen
> Revisión sistemática de los **algoritmos de extracción** de estados de cuenta: validar que los bugs existen, identificarlos, corregirlos, **reprocesar** los movimientos afectados y verificar el arreglo para todos los movimientos de todos los bancos. Sesión larga (45 turnos, `main`).

## Contexto
- Flujo 1 (estados de cuenta PDF): `desfragmentador.js` detecta 13+ bancos e inserta en `movimientos_bancarios`.
- Existen **3 copias divergentes** del extractor: `n8n.js` (prod, escribe DB), `backend/lib` (WIP con bug de detección) y `desfragmentador-bbva.js`.

## Puntos clave / decisiones
- **Regla de oro:** cualquier cambio a un extractor requiere **snapshot antes/después** en la BD (comparación vieja vs nueva) antes de aplicar.
- Se usó un harness de QA (`qa_validate_*`) para validar por banco.
- Progreso por banco: **BANORTE** y **MULTIVA** corregidos y verificados; pendientes en su momento BX+/BANREGIO/BAJÍO/BBVA/AFIRME/SANTANDER.
- Fixes de parseo reales (TDD): saldo-0, SANTANDER, BBVA (2^n), **BANBAJÍO** dep/ret invertido (98 estados).

## Pendiente / próximos pasos
- [ ] BBVA: signos aún no resueltos aquí (se retoma en la sesión de saneo masivo).
- [ ] Alinear la copia desplegada con el script de reproceso (divergen en ordenante/beneficiario/concepto).

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Continúa en: [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]]
- Relacionada: [[2026-06-23 - Soporte extractor SANTANDER-PYME (2 columnas)]]
