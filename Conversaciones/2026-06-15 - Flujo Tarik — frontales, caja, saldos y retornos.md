---
tipo: memoria-conversacion
fecha: 2026-06-15
titulo: Flujo Tarik — frontales, caja, saldos y retornos
proyecto: Gestión (Tesorería)
session_id: 4e6eb9ff-9ff0-4fb3-9538-732f78d126cb
tags: [memoria, gestion, tarik, frontales, efectivos, retornos]
estado: cerrada
---

# Flujo Tarik — frontales, caja, saldos y retornos

> [!info] Resumen
> Análisis del flujo completo de **Tarik**: frontales, la pestaña de **efectivo / movimientos de caja**, y **Tarik saldos y retornos**. Incluyó ponerse al día con git e iniciar la jornada (`inicio-trabajo.ps1 tarik-diego`). Rama `main`, ~8 turnos.

## Contexto
- Tarik = proveedor externo; sus **frontales** reciben cobros de clientes que luego se concilian.
- Módulos tocados: `tarik_frontales`, `tarik_movimientos`, efectivos/caja y el cálculo de retornos.

## Puntos clave / decisiones
- **Comisión Tarik por fecha:** **2.9%** antes del **2026-11-11** (nota: fecha en formato del sistema) y **3.9%** desde esa fecha — clave para reconstruir retornos correctamente.
- Se documentó el flujo para poder reconstruir saldos y retornos con la comisión correcta según la fecha del movimiento.

## Pendiente / próximos pasos
- [ ] **Agrupamientos manuales** cuando hay 2 ingresos el mismo día (feature pendiente).

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-19 - Relación automática de movimientos Tarik y Catania]]
