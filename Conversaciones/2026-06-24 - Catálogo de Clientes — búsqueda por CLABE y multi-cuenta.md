---
tipo: memoria-conversacion
fecha: 2026-06-24
titulo: Catálogo de Clientes — búsqueda por CLABE y multi-cuenta
proyecto: Gestión (Tesorería)
session_id: 87db4914-024c-4cb9-b476-4c9778dc9a05
tags: [memoria, gestion, catalogo-clientes, clabe, busqueda]
estado: cerrada
---

# Catálogo de Clientes — búsqueda por CLABE y multi-cuenta

> [!info] Resumen
> En **Catálogos → Clientes (catálogo global)**, mostrar coincidencias también al buscar por la **CLABE/cuenta** del banco, contemplando que un cliente puede tener **dos o más cuentas**, y arreglar la edición de cuenta. Rama `diego/tarik-flujo`, ~14 turnos.

## Contexto
- Antes el catálogo buscaba principalmente por nombre; faltaba resolver por CLABE/cuenta y soportar clientes con varias cuentas.

## Puntos clave / decisiones
- **Saldo y movimientos** del cliente ahora se **calculan** (no se leen fijos).
- Nueva tabla `catalogo_cliente_cuentas` (la cuenta *legacy* queda como **espejo** de la cuenta principal).
- **Búsqueda global exacta** (se quitó la difusa/fuzzy para evitar falsos positivos por CLABE).

## Pendiente / próximos pasos
- [ ] Revisar sincronía de la cuenta principal ↔ espejo al editar.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-19 - Haberes — filtro por proveedor con vista unificada]]
