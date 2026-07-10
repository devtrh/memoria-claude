---
tipo: memoria-conversacion
fecha: 2026-07-10
titulo: "Tarea 2 — Movimientos exportables/filtrables, separar beneficiario-ordenante y alias de búsqueda en grupos"
proyecto: Gestión (Tesorería)
session_id: a315f442-4df1-49ca-885a-879dee4569c1
tags: [memoria, gestion, cuentas, busqueda, movimientos, csv, grupos, alias, deploy]
estado: en-curso
---

# Tarea 2 — Movimientos exportables/filtrables, separar beneficiario/ordenante y alias de búsqueda en grupos

> [!info] Resumen
> Sesión de varias iteraciones sobre el módulo de movimientos y de grupos, todas **desplegadas a prod** (frontend, y al final backend+frontend). Se hizo la tabla de movimientos del cliente exportable/ordenable/filtrable, se separó Beneficiario/Ordenante en columnas en todas las vistas, y se implementó la **Fase 1** de "Otros nombres (alias para búsqueda)" en elementos de grupo. Se detectó y mitigó una **divergencia servidor↔git** peligrosa. La **Fase 2** (sugerir asignar CLABE por coincidencia de alias) quedó **diseñada y aprobada, pendiente de implementar**.

## Puntos clave / decisiones

### 1. Modal de movimientos del cliente (Catálogos › Clientes) — desplegado
- Las 2 tablas estáticas (Bancarios + Tarik) se reemplazaron por **una sola tabla `ClienteMovsTable`** (en `src/pages/cash/CashView.tsx`), modelada sobre la de Buscar: columna **Origen** (Bancario/Tarik, Tarik normaliza `monto`→Depósito/Retiro), **ordenable** por columna, **filtros tipo Excel** (`ExcelFilter`), selección, totales y **export CSV combinado** (reusa `exportToCSV`).
- Filtro de fecha con **toggle Día ↔ Mes** (`fechaGran`; en modo Mes agrupa `YYYY-MM` mostrado como "jul 2026"; resetea selección al convertir) para seleccionar todo un mes de un clic.

### 2. Separar Beneficiario / Ordenante en columnas — desplegado
- La columna combinada "Beneficiario / Ordenante" se dividió en **dos columnas** en: modal del cliente (`CashView`), drawer de detalle de Buscar (`EntityDetailDrawer`), tabla principal de Buscar (`BusquedaView` `MovimientosTable`) y preview de ingesta (`AnalisisView`, columna "Contraparte").
- No se tocó `RelacionMovimiento` (contraparte única deliberada) ni "Concepto / Beneficiario" de Análisis (no involucra ordenante).

### 3. "Otros nombres (alias para búsqueda)" en elementos de grupo — Fase 1, desplegado (backend+frontend)
- Replica el flujo de Clientes hacia los elementos de **Cuentas › Grupos**.
- Nueva tabla `grupos_clabe_nombres (grupo_clabe_id, nombre)` (creada en `migrate.js` y `ensureGruposClabeTable`, **sin FK dura**) + helper `replaceGrupoClabeNombres`.
- `POST/GET/DELETE /cuentas/grupos/asignar` guardan/leen/limpian los alias; `asignarClabeGrupo` acepta `nombres[]`.
- **Búsqueda global** (`buscar.js`) matchea los alias en resultados de **CLABEs** y **Proveedores** (`EXISTS` sobre `grupos_clabe_nombres`). El buscador **local** del tab Grupos también los incluye.
- UI: editor repetible `NombresEditor` en el form del elemento (`GruposTab.tsx`).
- Verificado en prod: `/cuentas/grupos` y `buscar/global` → 200, tabla creada, sin errores.

### 4. ⚠️ Divergencia servidor↔git (crítico para deploys)
- El servidor de prod corre **Concentrado** (comisionistas) que **NO está commiteado** en git (`migrate.js`: `migrate_concentrado`; `api.ts`: funciones `fetchConcentrado*`) y `buscar.js` del server está **atrás** de git HEAD (aún con `homologado` activo).
- Un `scp` ciego habría **borrado Concentrado / revertido cambios ajenos**. Mitigación aplicada: **reconciliar** = aplicar los edits sobre la copia **actual del servidor**, no sobre git base (verificando que la única diferencia vs local fuera la divergencia del server).
- Deploy quirúrgico: siempre **diff (server vs base) + backup** (dist con `docker cp` + copia de los archivos) antes de `scp` + rebuild. Backups en el server: `/home/devn8n/teso_deploy_backups/` y `/home/devn8n/teso_dist_backups/`.

### 5. Fase 2 — diseñada y aprobada, PENDIENTE de implementar
- Objetivo elegido (opción segura): cuando un movimiento viene de una CLABE **no registrada** pero su beneficiario/ordenante coincide con un **alias** de un elemento, **sugerir asignarla al grupo con 1 clic** (no auto, no cambia totales hasta confirmar).
- Diseño aprobado: endpoint **aparte** `GET /cuentas/grupos/sugerencias-nombre` (bajo demanda, no toca el `/grupos` pesado) → CLABEs con `beneficiario/ordenante ILIKE ANY(alias)` excluyendo las ya registradas; match normalizado por "contiene", alias ≥ 4 chars. UI: sección "Coinciden por nombre (N)" por grupo con botón Asignar (reusa `POST /grupos/asignar`, prellenando razón social/alias del elemento que coincidió).

## Pendiente / próximos pasos
- [ ] **Implementar Fase 2** (sugerencias por alias) — backend endpoint + UI en GruposTab.
- [ ] **Sincronizar servidor↔git**: mergear la rama de **Concentrado** y desplegar los commits pendientes de `buscar.js`; mientras tanto cada deploy exige reconciliación manual.
- [ ] Versionar en git el trabajo de estos días (rama + PR); hasta ahora todo vive en el árbol local (el server no es repo git).

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Specs: `docs/superpowers/specs/2026-07-08-exportar-filtrar-movimientos-cliente-design.md`, `docs/superpowers/specs/2026-07-09-otros-nombres-elementos-grupo-design.md`
