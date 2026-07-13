---
tipo: memoria-conversacion
fecha: 2026-06-15
titulo: Alta de CLABEs y clientes no registrados (en periodo)
proyecto: Gestión (Tesorería)
session_id: b5d0d079-6383-4534-bb28-5eb19913d905
tags: [memoria, gestion, clientes, clabe, colaboradores, alta]
estado: cerrada
---

# Alta de CLABEs y clientes no registrados (en periodo)

> [!info] Resumen
> A partir de un CSV de CLABEs/colaboradores **EN PERIODO (2025-2026)** se cruzaron **102 clientes únicos** contra los 3 catálogos de la DB (`catalogo_clientes`, `ops_clientes`, `clientes` + alias/razón social = 538 variantes). Resultado: ~87 ya existían y **9 se dieron de alta** en `catalogo_clientes` (7 clientes + 2 sub-clientes). El **archivo de disco estaba corrupto** (CLABEs en notación científica `2.16E+16` y sin columna `periodo`), por lo que el alta real de las **CLABEs/colaboradores quedó pendiente** de un export limpio.

## Contexto
- Fuente: `clabes_nuevas_por_dar_alta.csv`. El de Downloads estaba dañado por Excel (CLABEs perdieron dígitos, faltaba `periodo`); se trabajó con el CSV **pegado en el mensaje** (sí traía CLABE completa, grupo, ejecutivo, periodo, años). Conexión por `ssh n8n-tickets`.
- Regla clave [[project_tres_tablas_clientes]]: hay 3 tablas de clientes que se desincronizan; el alta canónica del app es **solo `catalogo_clientes`** (POST `/catalogo-clientes`, `nombre` en mayúsculas, `tipo`, `activo`).

## Puntos clave / decisiones
- **9 altas** en `catalogo_clientes` (ids **325–333**): CLAUDIA GABRIELA FRANCO BERNALDEZ, KARLA, TORO CAPITAL, INVERSIONES DANER, SERVICIOS INFORMATICOS PREFERENCE, CHICHARO Y CIA, REYNA VALLEJO + sub-clientes **CORPORATIVO VERACRUZ** y **CORPORATIVO BAJIO** (padre MEDICAMENTOS id 185). No hay constraint único en `nombre` → alta idempotente por anti-join `NOT EXISTS`.
- **Mapeos guardados** para el alta futura de colaboradores: VICTOR ANGUIANO → **ARTIBUS OPUS** (colab. ANGUIANO VILLARREAL VICTOR ADRIAN, CLABE 4645980019143789); CORP VER/ALAISA → CORPORATIVO VERACRUZ; corp bajio → CORPORATIVO BAJIO; ETANOL MINA (QRO)/MINA VIZARRON (ya completo, RFC ESC210204BSA); **TLK = TL KAPITAL** (ya existía).
- Solo se tocó `catalogo_clientes` (no `ops_clientes`/`clientes`, que se desincronizan por diseño).

## Pendiente / próximos pasos
- [ ] **Export limpio** (UTF-8, CLABE como **texto**, con columna `periodo`) para dar de alta los **colaboradores** en la tabla `colaboradores`, ya enlazados a su cliente según los mapeos.
- [ ] ~332 filas de colaboradores con **cliente vacío** (bloque Nancy 2026 + `(sin)`): asignar cliente antes del alta.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Transcript: [📄 conversación completa](<transcripts/2026-06-15 - clabesnuevaspordaralta.csv [b5d0d079].md>)
- Relacionada: [[2026-06-24 - Catálogo de Clientes — búsqueda por CLABE y multi-cuenta]]
