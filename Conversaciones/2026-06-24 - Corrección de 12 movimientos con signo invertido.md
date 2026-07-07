---
tipo: memoria-conversacion
fecha: 2026-06-24
titulo: Corrección de 12 movimientos con signo invertido
proyecto: Gestión (Tesorería)
session_id: a0fabf9b-ef0f-4b4d-b205-7ab320dce6b8
tags: [memoria, gestion, saldos, signos, reconcile]
estado: cerrada
---

# Corrección de 12 movimientos con signo invertido

> [!info] Resumen
> Mini-proyecto de cierre: validar que quedó **saneado** el arreglo de **12 movimientos con signo invertido** detectados por la **cadena de saldos**, y generar el prompt de regreso al chat original. Rama `diego/tarik-flujo`, 4 turnos.

## Contexto
- Derivado del saneo masivo: el post-pass `reconcile_saldo` empareja movimientos **por saldo** en el runner para detectar signos mal puestos.

## Puntos clave / decisiones
- Se confirmó el saneo de los 12 movimientos (BBVA-flip + BANBAJÍO): `qa_saldos` pasó de **20 → 12** rotos, **0 regresión**.
- `qa_saldos`/`validar` **re-extraen** (no leen la DB); ojo con la regresión `__DBG` (BBVA 0 movs).
- La DB de BBVA no es parcheable quirúrgicamente → lo demás se difiere a **reproceso total**.

## Pendiente / próximos pasos
- [ ] Reproceso total para cerrar los 12 rotos restantes.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Viene de: [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]]
