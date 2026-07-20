---
tipo: memoria-conversacion
fecha: 2026-07-20
titulo: "Gastos — dónde suma el traspaso interno, 3 dry runs que descartan la conciliación bancaria, y rediseño a Estado de caja"
proyecto: Gestión (Tesorería)
session_id: 576aecae-b618-4660-b3a9-784af536286a
tags: [memoria, gestion, gastos, efectivo, caja, conciliacion, dry-run, diseño, traspaso-interno]
estado: en-curso
---

# Gastos — diagnóstico con dry runs y rediseño a "Estado de caja"

> [!info] Resumen
> Sesión de **diagnóstico y diseño, sin tocar código de producción**. Se respondió dónde suma realmente el traspaso interno (clase 15), se auditó el módulo Gastos (dos módulos desconectados, ambos rotos) y se corrieron **3 dry runs read-only contra la BD de prod** para validar un rediseño *antes* de construirlo. Los datos **descartaron la premisa original**: la caja de efectivo **no se puede conciliar contra el banco**. Sí cuadra sola por mes. El diseño v1 quedó propuesto, pendiente de aprobar.

## 1) ¿Dónde suma el traspaso interno (clase 15)? — pregunta abierta de MEMORIA.md
Se rastrearon los 4 lugares donde la app suma `retiro`/`deposito`:

| Total | Cómo suma | ¿Incluye clase 15? |
|---|---|---|
| Gastos `/resumen` (`gastos.js:41-43`) | por clase, mapeo `[2,3]`+`[4,5]` | **NO** — la 15 ni figura |
| Haberes (`haberes.js:113-128`) | por CLABE, sin filtro de clase | **SÍ** |
| Matriz de saldos (`cuentas.js:539`, `:1027`) | por cuenta, sin filtro de clase | **SÍ** |
| Bancos (`bancos.js:371-379`) | `clasificacion_id` solo **filtra** la lista | — |

- **Conclusión:** el "−$248M en gastos" apuntado en `docs/MEMORIA.md` es **hipotético**, no de hoy: el único total por clase (`/resumen`) mapea `[2,3,4,5]` y la 15 no está ahí.
- Donde sí pesa (Haberes/Matriz) **debe** verse: es plata que sí se movió en esa cuenta, y con las dos cuentas del grupo registradas **se auto-cancela**. El descuadre viene de las **35 empresas sin registrar**, no de la clasificación.

## 2) Auditoría de Gastos — hay DOS módulos y ninguno sirve
- **Frontend vivo** (`src/pages/gastos/GastosView.tsx`): lee `movimientos_efectivo` (egresos) y **adivina** fijo/variable con una lista hardcodeada `GASTOS_FIJOS_KW` (`telmex`, `cfe`, `totalplay`…). Lo que no casa una keyword **se tira**. Mismo patrón en `GastosStep2.tsx` (`getServiceName`).
- **Backend muerto** (`backend/routes/gastos.js`): suma `movimientos_bancarios.retiro` con `CLASIFICACIONES_GASTOS_FIJOS=[2,3]` / `VARIABLES=[4,5]` — **ids de ejemplo de una plantilla**, nadie lo llama bien.
- Los dos "Gastos" están **desconectados**: el real (caja) nunca toca los millones del banco.

## 3) Dry run 1 — conciliación 1:1 efectivo↔banco: **FALLA**
Matcher greedy por **monto exacto (en centavos) + fecha ±3 días**, 1,488 egresos contra 38,845 retiros en ventana:

| Estado | Filas | % | Monto |
|---|--:|--:|--:|
| conciliado | 128 | **8.6%** | $10,456,630.40 |
| múltiples | 217 | 14.6% | $10,050,883.00 |
| sin match | 1,143 | **76.8%** | $153,194,214.88 |

- Y el 8.6% que "concilió" es **casi todo coincidencia de monto**: `Efectivo Carlos Estrada $10,000 ~ JIMENA CARRANZA SANDOVAL`, `Suegro Mike $2,000 ~ MONICA GONZALEZ ZUBIETA`. Los montos redondos ($399 Telmex, $2,000, $5,000, $10,000) chocan con decenas de retiros distintos.
- **Modelo 1:1 descartado.**

## 4) Dry run 2 — balance de caja: **CUADRA (por mes)**
- egresos **1,488 filas / $173,701,728.28** · ingresos **317 filas / $180,583,005.53** → saldo acumulado **~$6.88M** (≈4% del flujo, sano).
- Mes a mes entra ≈ sale, dentro de **±1-4%** (ej. 2025-02: $22.3M/$21.9M; 2025-07: $15.1M/$15.0M).
- ⚠️ **Anomalía real detectada: 2026-05 con $5,189,196.25 de entradas y $0.00 de salidas** — captura incompleta.
- ❌ **`empresa_corto` viene vacío en casi todos los egresos** (302 ingresos con empresa vs 1,488 egresos sin) → **no se puede desglosar la caja por empresa**.
- ❌ **El banco NO fondea la caja con retiros "efectivo"**: todos los patrones EFECTIVO/DISPOSICIÓN/CAJERO/CHEQUE-EN-EFECTIVO suman **$312,239.02** contra **$173.7M** de salidas. No existe el retiro gordo que se suponía.

## 5) Dry run 3 — ingresos de caja (fondeo) ↔ banco: **FALLA**
317 ingresos, ventana ±5 días, con medición de **coincidencia de nombre** para separar match real de coincidencia de monto:

| ingresos vs… | conciliado | múltiple | sin match |
|---|--:|--:|--:|
| banco.**retiro** | 48 (15.1%) | 52 (16.4%) | **217 (68.5%)** · $172,778,105.37 |
| banco.**depósito** | 11 (3.5%) | 15 (4.7%) | 291 (91.8%) |

- De los 100 casados contra retiro, solo **65 tienen nombre coincidente** — y son **cheques de nómina chicos** ($4,487.40 Traverse, $4,996.20 Arquitectos).
- Los **grandes son falsos positivos**: `$500,000 EFECTIVO INGRESO TARIK ~ SEPULVEDA GONZALEZ…` (overlap 0.00), `$170,000 Efectivo Nomina Vialli ~ OSCIL OPERADORA…` (0.00).
- Contra depósitos: **0 de 26** con nombre coincidente → todo coincidencia.

## 6) Hallazgo — `tipo_movimiento` NO es fijo/variable
La columna **"TIPO DE GASTO"** del Excel (`Efectivos 2025.xlsx` → `movimientos_efectivo.tipo_movimiento`, vía `backend/import_efectivos_2025.js`) es una **categoría sucia**, no una naturaleza:

```
NOMINA 507 · GASTO 505 · (vacío) 363 · Nómina 37 · NÓMINA 19 · COMISION 12 ·
GASTO OFICINA 6 · PRESTAMO 5 · REEMBOLSO 3 · COMISIONES 3 · GASOLINA · RETORNO ·
INVERSION · DEVOLUCION · FACTURA · Despensa · Recarga Tag · COMISONES …
```

**Ninguna dice "fijo" ni "variable" → el fijo/variable no existe en los datos.** Por eso el frontend lo inventa. Lo que sí hay son ~10 categorías reales con variantes de mayúsculas/acentos por unificar.

## 7) Veredicto y diseño v1 propuesto — "Estado de caja"
**Veredicto de los 3 dry runs:** `movimientos_efectivo` es un **libro de caja autónomo**; los $180M que entran **no se rastrean** a movimientos del banco. La verificación contra el banco **los datos no la permiten**.

**v1 propuesto (sin banco):**
- Backend: borrar lo muerto de `gastos.js` (`CLASIFICACIONES_GASTOS_*`, `/resumen`, `/`, `/banco-retiros`). Tres endpoints: `GET /caja/mensual` (entradas·salidas·neto·saldo), `GET /caja/:mes/categorias`, `GET /caja/:mes/movimientos`. Normalizador `normCategoria()` que colapsa `NOMINA/Nómina/NÓMINA`→`nomina`, `COMISONES`→`comision`, etc.
- Frontend (`GastosView.tsx`): fuera el adivinador de keywords. Landing = tabla mensual con **semáforo en el neto** (caza casos como 2026-05). Drill-down mes → categorías → movimientos.
- Test obligatorio: `normCategoria` sobre las variantes sucias + agregación mensual sobre fixture.
- **NO se construye** (probado con datos): conciliación bancaria, fijo/variable, desglose por empresa.

## Notas de método
- Los 3 scripts de dry run fueron **read-only** (solo `SELECT`), corridos contra `tesoreria` en `134.209.64.96` reusando la config de `backend/db_final.js`. Viven en el **scratchpad de la sesión (efímero)**, no se versionaron.
- **No se modificó ningún archivo del repo** en esta sesión.

## Pendiente / próximos pasos
- [ ] **Aprobar el diseño v1** y escribir el spec en `docs/superpowers/specs/` + plan de implementación.
- [ ] Decidir qué hacer con el hallazgo de **2026-05** ($5.19M entradas / $0 salidas): ¿captura pendiente o error?
- [ ] Definir el **set canónico de categorías** (~10) al que colapsa `normCategoria`.
- [ ] La pregunta abierta *"¿el traspaso interno sale de los totales?"* queda **parcialmente resuelta**: hoy no está en ningún total de gasto, así que la decisión **no tiene efecto práctico** hasta que se rediseñe Gastos sobre bancarios.
- [ ] Si se quiere reproducibilidad, versionar los 3 scripts de dry run (hoy solo en scratchpad).
- [ ] **Deploy pendiente heredado** (no se tocó en esta sesión): `deploy-nodos.bat` para la regla de DEVOLUCION.

## Enlaces
- Índice: [[00 Índice de Memoria]]
- Nodo: [[Gestión (Tesorería)]]
- Relacionadas: [[2026-06-19 - Clusterización de movimientos (análisis serio)]], [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]], [[2026-06-15 - Flujo Tarik — frontales, caja, saldos y retornos]]
