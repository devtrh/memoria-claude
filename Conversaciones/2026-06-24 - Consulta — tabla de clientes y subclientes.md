---
tipo: memoria-conversacion
fecha: 2026-06-24
titulo: Consulta — tabla de clientes y subclientes
proyecto: Gestión (Tesorería)
session_id: c1eda725-7997-4930-abd7-722e163ad773
tags: [memoria, gestion, catalogos, clientes, consulta]
estado: cerrada
---

# Consulta — tabla de clientes y subclientes

> [!info] Resumen
> Consulta rápida (1 turno): de qué tabla salen los clientes/subclientes de **Catálogos › Clientes**. Respuesta: **`catalogo_clientes`** (DB `tesoreria`) — cliente vs subcliente por `tipo` + `cliente_padre_id`; las cuentas viven en `catalogo_cliente_cuentas`. Aviso importante: hay **otras 2 tablas** (`ops_clientes` y `clientes`) que alimentan la **Búsqueda global**, no Catálogos, y pueden desincronizarse en el flag de estado (`activo` vs `status`).

## Contexto
- Duda puntual sobre el origen de datos de la pantalla de Catálogos.

## Puntos clave / decisiones
- **`catalogo_clientes`** = catálogo editable (endpoint `GET /api/catalogos/catalogo-clientes` en `backend/routes/catalogos.js`).
- **`catalogo_cliente_cuentas`** = múltiples cuentas por cliente; las columnas legacy `cuenta/clabe/clabe_sufijo` quedan como espejo de la principal.
- **`ops_clientes`** y **`clientes`** las usa la Búsqueda global (`backend/routes/buscar.js`) — [[project_tres_tablas_clientes]].

## Pendiente / próximos pasos
- [ ] (Ninguno — consulta informativa.)

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Transcript: [📄 conversación completa](<transcripts/2026-06-24 - en que tabla tenemos los clientes y subclientes que mostramos en… [c1eda725].md>)
- Relacionada: [[2026-06-16 - Catálogos Clientes — saldo calculado, multi-cuenta, ejecutivos y CSV Tarik]]
