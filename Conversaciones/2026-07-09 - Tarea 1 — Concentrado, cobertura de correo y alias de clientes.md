---
tipo: memoria-conversacion
fecha: 2026-07-09
titulo: "Tarea 1 — Concentrado, cobertura de correo y alias de clientes"
proyecto: gestion (Tesorería) + eli mail
session_id: efe94b51-51f5-470e-abf8-7ad44533195e
tags: [memoria, concentrado, comisionistas, cobertura, correo, alias, homologacion, eli-mail, gestion]
estado: en-curso
---

# Tarea 1 — Concentrado, cobertura de correo y alias de clientes

> [!info] Resumen
> Tres corrientes en una sesión larga: (1) se construyó y **desplegó a prod** el módulo **Concentrado** (ingesta de los Excel mensuales de comisionistas TEAM-VERTICE → resumen ejecutivo con drill-down); (2) se midió la **cobertura del correo de Eli vs el reporte 2025** (~**89%** de la nómina es rastreable por correo); (3) se **sembraron 30 alias de clientes** reusando la infra existente para subir esa cobertura. Coordinado con las ramas de homologación en paralelo.

## 1. Módulo Concentrado (SP1) — desplegado

Nueva sección **"Concentrado"** en el sidebar de `gestion react`. Ingiere los Excel mensuales de comisionistas (`eli mail\analisis\clientes-promotores`, familias **TEAM** `.xls` y **TEAM-VERTICE** `.xlsx`), 7 pestañas, a Postgres.

- **Modelo (híbrido)**: `cc_carga` (1 fila/mes-archivo, hash SHA-256 idempotente) + `cc_fila` (detalle typed + `datos` JSONB) + `cc_resumen` (KPIs por pestaña, `kpis->>'_principal'` = número de la serie anual). DDL en `backend/db/migrate_concentrado.js`.
- **Backend**: `backend/lib/concentrado/` (parsers por pestaña + `parsers/index.js` orquestador, `scanner.js` idempotente por hash + flag `--force`, `scan_cli.js` backfill). Ruta `/api/concentrado/{meses,resumen,anual,detalle,scan}`.
- **Frontend**: `src/pages/concentrado/` — 3 vistas conmutables (Dashboard+selector de mes / Tarjetas anuales por pestaña / Matriz meses×pestañas) + detalle drill-down con export CSV.
- **Validación fuerte**: en los 13 meses, `INGRESOS.total_deposito` == `CONCENTRADO.total_ingresos` **exacto** (auto-valida los parsers).
- **Backfill**: 13 cargas (Feb-Dic 2025 + Ene 2026 en TEAM y TEAM-VERTICE) en **prod**, 0 errores.
- **Deploy**: `n8n-tickets`, `docker-compose.server.yml`, con respaldo (tar src+backend + `docker cp` dist). La "divergencia" de 6 archivos era **solo CRLF vs LF** (0 diffs reales con `diff --strip-trailing-cr`).

**Pestañas vivas vs muertas** (hallazgo): **INGRESOS, COMISION, GTOS OF, OTROS EGRESOS, CONCENTRADO** están pobladas; **NÓMINA y COSTOS SOCIALES = 0 en todo 2025** (ya no se usan). OTROS EGRESOS = FONACOT/ISN/impuestos/proveedores. INGRESOS+COMISION se complementan (ingreso = lo que movió el cliente; comisión = lo del comisionista + lo interno).

## 2. Comparativa de cobertura correo → reporte 2025

Fuente correo: `operaciones_aud.csv` (8.7k ops 2025-2026). **Verdad de monto = Concentrado** (el monto del correo NO es confiable: suma ~6× lo real). Regla de cruce = **por existencia** (cliente homologado + periodo), no por monto.

- **Cliente-mes: 87.8% → 89.4%** de los $331M de nómina con rastro en correo (el alza es tras aplicar alias).
- **Cliente-fecha ±3d: 71.9%→73.5%** · **±7d: 77.4%→79%** (el desfase es timing de aguinaldos/finiquitos).
- **Sin correo (captura manual de Eli): ~$35.2M (~11%)**.
- **Feb-Mar 2025 bajos** porque el correo extraído de inicio de año es ralo (255-292 ops/mes vs 530+ desde abril) — falta correo, no falta nómina.
- Herramienta: `backend/cc_cobertura_analisis.cjs`. Salidas: `eli mail\analisis\cobertura_correo\` (`RESUMEN.md` + 3 CSVs: cobertura_por_mes, reporte_sin_correo, correo_sin_reporte).

## 3. Seed de alias de clientes (reuso, no reinventar)

Ya existía la infraestructura de homologación → **no se construyó nada nuevo**:
- **`catalogo_cliente_nombres`** = store de alias por cliente (→ `catalogo_clientes.id`).
- **`empresa_matching.js`** = matcher Jaro-Winkler (auto ≥0.90, sugerencia 0.82-0.89) + normaliza sufijos MX.
- UI de Catálogos ya edita esos nombres; `directorio_entidades` (1083) + `empresas_alias`/`contrapartes_alias` existen.

Seed acotado a **clientes activos 2025-2026** (341 candidatos): **246 ya en catálogo**, **30 auto**, **60 a revisar**, **5 altas**. Guard contra falsos por palabra genérica (Jaro-Winkler infla por prefijo): **ratio de longitud** + regla conservadora **auto = score≥0.95 o (≥0.90 y ratio≥0.85)** (mandó `LOGISTICA 5→LOGISTI K`, `ARTURO SALAZAR→CARTHAGE`, etc. a revisión).

- **30 alias aplicados a prod** (`catalogo_cliente_nombres` 97→127, idempotente/reversible).
- Herramienta: `backend/lib/concentrado/seed_alias.cjs` (dry-run por default, `--apply` para escribir). Salidas: `eli mail\analisis\alias_clientes\` (`alias_sembrados`, `alias_revisar` 60, `candidatos_alta` 5).

## 4. Coordinación con homologación en paralelo

Ramas activas (worktrees): **`diego/f1-frontales-homologado`** (homologa **frontales**; crea `frontales_nombres` "mismo patrón que `catalogo_cliente_nombres`"; agrega default **cliente→frontal + esquema** en `catalogo_clientes` con CSV de revisión), **`diego/jubilar-clientes-homologado`** (jubila la tabla legacy `clientes`, canónico = `catalogo_clientes`), **`diego/sync-ops-catalogo`** (`ops_clientes.catalogo_cliente_id` ← `catalogo_clientes`).

Veredicto: **complementario, sin conflicto** — ninguna inserta en `catalogo_cliente_nombres`; canónico compartido `catalogo_clientes`; mismo flujo (propuesta→aplicar + CSV de revisión). Mi alias **rellena el lado cliente** del patrón que f1 copió para frontales.

## Decisiones clave

- **Auto-llenado = pre-llenar "por confirmar", no capturar a ciegas**: el correo da QUIÉN/CUÁNDO confiable, pero el MONTO y el ESQUEMA vienen de otra fuente (layout / `movimientos_bancarios` / la resolución cliente→frontal de f1).
- Orden: **alias primero**, luego auto-llenado (SP2).

## Gotchas de la sesión

- **Git "flip" de ramas** por worktrees/IDE: los commits caen en la rama activa del momento (mi spec del alias cayó en `diego/esquema-detalle-empresa`; el Concentrado quedó en `feat/concentrado-comisionistas` + 2 commits del usuario encima). **Verificar rama antes de cada commit.**
- **Servidor diverge de git** a veces es solo **CRLF** → comparar con `diff --strip-trailing-cr` antes de asumir divergencia.
- **`CONCENTRADO_DIR` no está en el server** → "Escanear ahora" no corre en prod; meses nuevos = backfill local (`node backend/lib/concentrado/scan_cli.js`).

## Pendiente / próximos pasos

- [ ] Confirmar los **60 de `alias_revisar.csv`** + **5 altas** (sube más la cobertura).
- [ ] **Consolidar git**: mover spec del alias + commitear `seed_alias.cjs` y `cc_cobertura_analisis.cjs` a una rama limpia (ej. `feat/cobertura-alias-clientes`, tras `jubilar`).
- [ ] **Unificar lista de altas** de clientes entre mi seed y la semilla de colaborador de f1 (catálogo incompleto: 364 vs ~700).
- [ ] Diseñar **auto-llenado SP2** (SMTP `solicitudes_correo` → pre-llenar filas del Concentrado "por confirmar").
- [ ] Poner `CONCENTRADO_DIR` accesible en el server (montar carpeta) o dejar backfill local.
- [ ] Medir cobertura de **OTROS EGRESOS / GTOS OF** contra el corpus amplio de correos (pendiente).

## Enlaces

- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-07-07 - Reporte ejecutivo Promotores-Comisionistas (TEAM-VERTICE)]]
- Specs: `gestion financiera\docs\superpowers\specs\2026-07-07-concentrado-comisionistas-design.md`, `2026-07-09-alias-clientes-seed-design.md`
