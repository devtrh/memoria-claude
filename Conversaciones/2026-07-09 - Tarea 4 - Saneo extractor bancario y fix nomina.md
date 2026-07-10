---
tipo: memoria-conversacion
fecha: 2026-07-09
titulo: "Tarea 4 — Saneo del extractor bancario (CLABE 085, BANREGIO, ordenante=beneficiario, pagos de servicio) + edición CLABE superusuario + fix nómina"
proyecto: Gestión (Tesorería)
session_id: 4726236e-fcd3-4ac6-9ae2-fbb97c8b5e03
tags: [memoria, gestion, extractor, clabe, banregio, dedup, nomina, deploy, tarea-4]
estado: cerrada
---

# Tarea 4 — Saneo del extractor bancario + edición CLABE superusuario + fix nómina

> [!info] Resumen
> Sesión de saneo del **algoritmo de extracción bancaria** (`backend/lib/extraer_spei.js` + `desfragmentador/runner.js`) y de la data histórica en `movimientos_bancarios`. Cada cambio de datos con **dry-run + respaldo full-row**; todo **desplegado a prod** (docker cp + restart backend / rebuild frontend) con respaldos en el server. Se abrieron 3 PRs (**#11 mergeado**, #12, #13).

## 1) Bug "085" — CLABE inválida
- `extraerClabe` tomaba el **primer bloque de 18 díg** aunque fuera basura (ej. `INT 085900557640318166-… BANAMEX 002180026978208522 …` guardaba `085…` en vez de la real `002…`).
- **Fix (todos los bancos):** valida el **dígito de control Banxico** + **prefiere una CLABE cuyo banco exista** en el catálogo SPEI; guard universal en `parsearMovimiento` + `esSucio('clabe')`.
- **Reproceso:** 180 movs `clabe LIKE '085%'` → CLABE real (0 limpiadas).
- **Edición de CLABE en el Detalle de Movimiento SOLO superusuario** (`rol_clave='superadmin'`): editor inline con validación en vivo (`validateClabeChecksum` en `utils/clabe`, `isSuperadmin` en `utils/auth`, nuevo) + backstop en `PATCH /bancos/movimientos/:id`.

## 2) Marcador "-- N of M --" (BANREGIO/BANBAJIO/BX+)
- Pie de página del PDF que se pegaba a `descripcion`/`concepto` (ej. `PAGO FAC 3682 29 -- 6 of 10 --`). `limpiarMarcadorBancario` en extractor + runner. **2298 filas limpiadas in-place** (mismos UUID).

## 3) Duplicados de extracción BANREGIO
- El desfragmentador repetía movimientos en saltos de página. **Auto-dedup en el runner** (firma fecha+retiro+deposito+saldo+descripcion) para ingestas futuras.
- **Hallazgo clave:** el `saldo` de BANREGIO es **diario/de corte, NO corriente por movimiento** → "mismo saldo" NO indica duplicado (ej. SERVINTEG con 3 pagos distintos de $422,500 el mismo día comparten saldo).
- Dedup histórico SEGURO = solo grupos con `descripcion` idéntica que incluye una **clave de rastreo real única**: **72 duplicados garantizados borrados** ($958,972.05 de doble-conteo) + **2 pagos RTM** verificados contra el PDF (aparecían 1× en el PDF, 2× en la DB). 16 grupos ambiguos (comisión por transferencia legítima, cuota admin mensual) dejados a revisión del usuario.

## 4) `ordenante == beneficiario`
- Imposible en un SPEI interbancario (una parte es la empresa titular, la otra la contraparte). El extractor actual ya repartía bien, pero en `soloNulos` no des-empataba un valor que venía de aguas arriba.
- **Guard de de-empate en `parsearMovimiento`** (self-healing, también en soloNulos): fija el lado propio a `empresa_corto`; traspasos misma-empresa legítimos intactos.
- **Reproceso:** 277 movs corregidos in-place; 338 dejados (traspasos propios + SALDO_CIERRE vacíos + POS sin contraparte).

## 5) Pagos de servicio mal guardados en `clabe`
- Las 111 CLABEs inválidas restantes (no-085) eran **referencias de línea de captura**: BBVA `P14 … REF:<ref> CIE:<cie>` (CFE/SAT/seguros/municipio), BANREGIO `(BE) PAGO SERVICIO`, SANTANDER `CARGO TRANSFERENCIA ENLACE`.
- Decisión del usuario: **no borrar, robustecer el algoritmo** → nuevo bloque universal enruta `convenio ← CIE` y `ras ← referencia del servicio`; `clabe` queda NULL (el guard ya la rechaza).
- **Reproceso:** 111 movs (clabe→NULL, +87 ras, +67 convenio, +8 referencia, 73 referencia basura limpiada) → **0 CLABEs inválidas de 18 díg**.

## 6) Fix nómina — `GET /api/nomina/colaboradores` (bug en prod)
- Truena con `column "c.id_cliente" must appear in the GROUP BY clause`: `colaboradores_filtrados` es un **CTE** (no tabla base) → `GROUP BY c.id` no da la dependencia por PK.
- **Fix:** agregado de pagos en un CTE `pagos` (por `colaborador_id`) + `LEFT JOIN`; total con `COUNT(*) OVER()`. Endpoint **HTTP 200** (antes 500).

## Deploy (regla "server diverge de git")
- Backend: `docker cp` a `teso-backend:/app/...` + restart (el código está *baked*, no montado; host `backend/X` = container `/app/X`). Diff previo de cada archivo (server == base, sin divergencia) + `node --check` + test-load antes de reiniciar.
- Frontend: scp de mis 3 archivos al host + `docker compose build frontend && up -d`; bundle nuevo; **no se tocaron** CashView/EntityDetailDrawer (trabajo del usuario ya desplegado).
- Respaldos: código en `/home/devn8n/teso_code_backups/<stamp>`, dist en `/home/devn8n/teso_dist_backups/`.

## Git / PRs
- **PR #11 mergeado** a `diego/jubilar-clientes-homologado` (085 + marcador + dedup + de-empate).
- **PR #12** (nómina → main).
- **PR #13** (pagos de servicio → jubilar) — commiteado vía **git worktree** para no tocar el working tree del usuario (que reseteó/cambió de rama a media sesión).
- `backend/lib/desfragmentador/runner.js` sigue **gitignored** (vive en el server) → requiere scp manual; se desplegó junto con `extraer_spei.js` porque importa `limpiarMarcadorBancario` de ahí.

## Pendiente / próximos pasos
- [ ] Mergear PR #12 (nómina) y PR #13 (pagos servicio).
- [ ] **286 CLABEs con longitud ≠ 18** sin analizar (truncadas / cuentas mal guardadas) — caso aparte.
- [ ] 16 grupos duplicados ambiguos BANREGIO (6 cuota admin mensual "Comisión Administración - renta" + 8 comisión legítima) — revisión manual del usuario.
- [ ] Versionar `runner.js`/`desfragmentador` (hoy fuera de git = riesgo de pérdida).
- [ ] Pendientes de seguridad heredados: mergear PR #8 (gitignore de secretos) + rotar contraseña de BD prod hardcodeada.

## Enlaces
- Índice: [[00 Índice de Memoria]]
- Nodo: [[Gestión (Tesorería)]]
- Relacionadas: [[2026-06-07 - Extractores bancarios — bugs, corrección y reproceso]], [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]]
