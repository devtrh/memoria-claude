---
tipo: memoria-conversacion
fecha: 2026-06-22
titulo: Saneo masivo de la BD — descripción, signos y saldos
proyecto: Gestión (Tesorería)
session_id: 32f8e947-d65f-4309-832c-1bfaf99bdf1d
tags: [memoria, gestion, extractores, saldos, signos, reproceso]
estado: en-curso
---

# Saneo masivo de la BD — descripción, signos y saldos

> [!info] Resumen
> **Macro-sesión** (112 turnos, 68 MB, `diego/tarik-flujo`) que arrancó revisando toda la BD por movimientos con **descripción vacía/nula** y creció a un saneo integral: relleno de descripción, corrección de **signos** invertidos y validación de **cadenas de saldos** por cuenta. Sigue abierta.

## Contexto
- Punto de partida: `movimientos_bancarios` con `descripcion` vacía/nula (~30%).
- Método de validación: **cadena de saldos** mes a mes (`dry_run_reproceso_total` + `qa_saldos_mes_a_mes`); los scripts **re-extraen**, no leen la DB.

## Puntos clave / decisiones
- **Descripción:** sin-descripción bajó de **~30% → 0.35%**.
- **BANBAJÍO:** 137 traspasos con **signo invertido** en la DB (el extractor estaba OK; el dato viejo estaba mal).
- **BBVA:** fix de signo anclando **por saldo** (no por block-solve crudo); `qa_saldos` BBVA 11→1.
- **BANREGIO:** guard para saltar estados de **TDC**; 4 filas borradas de la DB.
- **Post-pass `reconcile_saldo`:** emparejar por saldo en el runner saneó BBVA-flip + BANBAJÍO (qa 20→12 rotos, 0 regresión).
- **Campos RAS/convenio** nuevos + arreglo de **CLABEs falsas** (CONCENTRACION/servicio/CVE RAST); backfill 2025-2026.
- ⚠️ **El servidor diverge de git:** corre código sin commitear más nuevo que git → un `scp` ciego sobrescribe trabajo no versionado. Siempre **diff + backup** (docker cp del dist) antes de rebuild.

## Pendiente / próximos pasos
- [ ] Reproceso total para alinear la DB con el extractor desplegado.
- [ ] Cerrar quirks pendientes: SANTANDER(PYME)/BANORTE/BBVA/BANBAJÍO en la validación por cadena.
- [ ] La DB de BBVA no es parcheable quirúrgicamente → diferir a reproceso total.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Viene de: [[2026-06-07 - Extractores bancarios — bugs, corrección y reproceso]]
- Relacionada: [[2026-06-24 - Corrección de 12 movimientos con signo invertido]]
