---
tipo: memoria-conversacion
fecha: 2026-07-07
titulo: Reporte ejecutivo Promotores/Comisionistas (TEAM vs VERTICE)
proyecto: eli mail
session_id: 4726236e-fcd3-4ac6-9ae2-fbb97c8b5e03
tags: [memoria, eli-mail, promotores, comisionistas, team, vertice, reporte]
estado: en-curso
---

# Reporte ejecutivo Promotores / Comisionistas (TEAM vs VERTICE)

> [!info] Resumen
> Excel ejecutivo mensual/anual de promotores/clientes/comisionistas a partir de los reportes mensuales **TEAM-VERTICE** (`eli mail\analisis\clientes-promotores`), con semáforo verde/rojo de margen. Generado por `C:\obsidian\scripts\generar_reporte_ejecutivo.cjs` (idempotente); nota espejo en `Datos\Reporte Ejecutivo Promotores.md`.

## Fórmula del margen (decidida con el usuario)
- **MARGEN = Comisión + IVA s/comisión (16%) − Gastos de oficina − Comisiones a promotores.** 🟢 ≥0 / 🔴 <0.
- **Ingreso = Comisión de la oficina** (hoja INGRESOS POR NOMINA, col COMISION, valor calculado por renglón — cada cliente tiene su fórmula). La **nómina base (SUBTOTAL)** es dinero en tránsito, NO ingreso propio.
- Se muestran además las 4 columnas reales: **Subtotal · Comisión · IVA · Total Depósito · Suma (Com+IVA)**. La IVA de la hoja = traslado sobre nómina (no entra al margen).
- **Gastos de oficina = "GRAN TOTAL" de GTOS OF** cuando existe; si no, suma de detalle (la suma cruda de la columna sobre-cuenta 3-10×). Los gastos son **compartidos** entre TEAM y VERTICE → se usa el **gasto total del mes**.

## TEAM vs VERTICE
- Segmento por **cartera**: TEAM = archivos `…TEAM.xls` (datos desde 2026); VERTICE = archivos `TEAM-VERTICE`/`Team - Cve`.
- Clasificación fina por cliente en `analisis\clientes_grupo.csv` (se agregaron ~119 clientes activos ausentes; backup `clientes_grupo.backup-2026-07-07.csv`).
- ⚠️ **`TEAM.xls` tiene otro esquema:** INGRESOS cols 13-16 sí coinciden (confiable), pero `GTOS OF` viene vacío y la hoja `COMISION` está en otra base (comisión $2.55M en INGRESOS vs $23.7M en COMISION; comisiones a promotores $18.16M).
- **Comisión de oficina de TEAM = la de INGRESOS** (misma base que VERTICE). Las **comisiones a promotores de TEAM quedan pendientes** → el margen combinado 2026 es **provisional/sobrestimado** (marcado en rojo).

## Cifras
- Margen VERTICE: 2025 **$5.04M** · 2026 YTD **$3.45M** · total **$8.49M**.
- Combinado (provisional): comisión total **$34.64M** · gasto total **$15.41M** · margen 2026 YTD **$16.16M**.

## Pendiente / próximos pasos
- [ ] Resolver la base de la hoja COMISION de TEAM.xls para poder restar sus comisiones a promotores y cerrar el margen combinado.
- [ ] Llenar el grupo (TEAM/VERTICE) de los ~119 clientes agregados a `clientes_grupo.csv`.

## Enlaces
- Índice: [[00 Índice de Memoria]]
- Datos: `C:\obsidian\Datos\Reporte Ejecutivo Promotores.md`
