---
tipo: memoria-conversacion
fecha: 2026-07-06
titulo: Ingesta de estados de cuenta junio 2026
proyecto: Gestión (Tesorería)
session_id: f03b328a-2557-4fbb-87d4-3d7a1f9258c1
tags: [memoria, gestion, ingesta, estados-cuenta, pdf]
estado: cerrada
---

# Ingesta de estados de cuenta junio 2026

> [!info] Resumen
> Subir los **estados de cuenta de junio 2026** ya acomodados en `ESTADOS DE CUENTA PDF/2026`, recordando que los de **arquitectos** van en su carpeta aparte. Ingesta mensual por lote con el extractor corregido. Rama `main`, ~14 turnos.

## Contexto
- Flujo 1 (estados de cuenta PDF): ingesta mensual con el extractor ya saneado.
- Convención de carpetas: `ESTADOS DE CUENTA PDF/2026` (+ carpeta dedicada para "arquitectos").

## Puntos clave / decisiones
- Herramienta: `ingestar_mes.cjs` (backend/lib) sube un mes completo con el extractor corregido.
- **Gotchas de ingesta:** detección de banco, columnas `NOT NULL`, cuentas **TDC/dormidas**, todo en **1 transacción**, y **scp de los PDFs al servidor** (la app los sirve desde `/pdfs`).

## Pendiente / próximos pasos
- [ ] Confirmar que los PDFs de junio quedaron también en el servidor (volumen `/pdfs`).

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]]
