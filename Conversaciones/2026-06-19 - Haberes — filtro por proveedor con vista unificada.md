---
tipo: memoria-conversacion
fecha: 2026-06-19
titulo: Haberes — filtro por proveedor con vista unificada
proyecto: Gestión (Tesorería)
session_id: 63ae7da8-b4f6-405f-a9d0-23885c25693d
tags: [memoria, gestion, haberes, ui, navegacion]
estado: cerrada
---

# Haberes — filtro por proveedor con vista unificada

> [!info] Resumen
> En **Haberes**, al filtrar por un **proveedor** (`?flow=cuentas&tab=grupos`), lograr la **misma vista/flujo** que cuando se busca por un banco/empresa. Homologación de la experiencia de navegación entre entidades. Rama `diego/tarik-flujo`, ~12 turnos.

## Contexto
- La navegación por banco/empresa ya tenía una vista de detalle rica; los proveedores quedaban con una vista distinta.
- Objetivo: unificar el patrón de navegación (empresas / frontales / proveedores / clientes / bancos).

## Puntos clave / decisiones
- Reusar el mismo componente/flujo de detalle para proveedores que el de banco/empresa.
- Base para la navegación unificada de "Buscar" (empresas/frontales/proveedores/clientes/bancos) sin tener que escribir.

## Pendiente / próximos pasos
- [ ] Verificar consistencia de conteos y saldos entre las distintas entradas de navegación.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-24 - Catálogo de Clientes — búsqueda por CLABE y multi-cuenta]]
