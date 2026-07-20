---
tipo: memoria-conversacion
fecha: 2026-07-14
titulo: "Tarea BBVA — Calidad de extracción medida (BANORTE falsa alarma) + diseño del fix (único banco roto)"
proyecto: Gestión (Tesorería)
session_id: f03b328a-2557-4fbb-87d4-3d7a1f9258c1
tags: [memoria, gestion, extractor, bbva, banorte, calidad, spei, diseño, tarea-bbva]
estado: en curso
---

# Tarea BBVA — Calidad de extracción medida + diseño del fix

> [!info] Resumen
> Se hizo **medible** el extractor bancario (score de calidad `qa_calidad_extraccion.cjs`)
> y, al medir con cuidado, **2 de los 3 "peores" bancos resultaron falsa alarma**. Solo
> **BBVA** está genuinamente roto (46%). Se **diseñó** (sin implementar, a petición del
> usuario) el fix de BBVA en **3 capas**. Score global: **90%, 9/10 bancos ≥84%**.

## Qué se midió
- `reprocesar db/qa_calidad_extraccion.cjs` (READ-ONLY): por banco y por carga mide
  `clas6`, `contraparte_vacia`, `spei_sin_clabe/rastreo`, `clabe_invalida`. Score = % filas
  sin problema.
- **Regla clave**: solo cuentan como fallo las transferencias **con contraparte real**. Las
  comisiones/IVA/servicios/compensaciones NO llevan CLABE por naturaleza → se excluyen
  (`SIN_CONTRAPARTE`).

## Hallazgo 1 — BANORTE era **falsa alarma** (era el "peor" con 41%)
El 41% eran 100% artefactos de medición, no bugs del parser:
- `TRANSFERENCIA - ENVIO; (SPEI; BANCA POR INTERNET)` = **comisión de $5** del SPEI →
  42 filas, **todas exactamente $5.00**.
- `I.V.A. ORDEN DE PAGO SPEI` = IVA de esa comisión → 282 filas, **todas $0.80** (el score
  no matcheaba "I.V.A." con puntos).
- `COMPENSACION DESFASE SPEI` = compensación interna (trae rastreo, no CLABE).
- La transferencia **real** de BANORTE (`COMPRA ORDEN DE PAGO SPEI … CTA/CLABE:{18} …
  BENEF:… CVE RASTREO:`) sale **580/580 = 100%**. `parseBanorte` está perfecto.
- Fix del **score** (no del parser): `SIN_CONTRAPARTE` ahora excluye `I.?V.?A`,
  `TRANSFERENCIA-ENVIO`, `DESFASE` → **BANORTE 41%→84%, global 88.6%→90.0%**.

> Es la **4ª vez** que el score inicial sobre-marca (antes PEIBO, BANREGIO, BANBAJIO).
> Medir bien ahorró atacar bancos sanos en vano.

## Hallazgo 2 — BBVA es el **único banco realmente roto** (46%, n=308)
Concentrado en `UNIENDO BBVA` (71 contraparte vacía) y `BANDEZ BBVA JUNIO 2026`. Tres capas:

| Capa | Qué es | Riesgo |
|---|---|---|
| **1 · clasificación** | `PAGO CUENTA DE TERCERO` cae **56/56 a clas6** (ninguna regla lo matchea) → regla nueva → clas 3 | Bajo |
| **2 · parseBBVA** | Contraparte embebida (`BNET {cuenta} {nombre} Ref`) que el parser no saca | Medio |
| **3 · desfragmentador** | Pie de página ("BBVA MEXICO … BANCA MULTIPLE") capturado en vez de la contraparte (salto de página) | Alto (defer) |

- **Validado por dry-run**: el `parseBBVA` actual recupera **0 de 68** → la capa 2 necesita
  **regex nueva**, no solo re-enriquecer (razones: `RE_BNET` exige `BNET` pegado a los
  dígitos, aquí es `BNET ` + espacio + cuenta de 10; concepto pegado a la fecha).
- ⚠️ **Decisión de negocio pendiente del usuario**: el texto tras `BNET {cuenta}` a veces
  es un nombre (`MAITE MENDEZ GOMEZ`) y a veces solo concepto (`PAGO FACTURA`). ¿Guardarlo
  como `beneficiario`, `concepto`, o solo si no es palabra-concepto conocida?

## Entregables (esta sesión)
- **Spec de diseño**: `docs/superpowers/specs/2026-07-14-bbva-extraccion-contraparte-design.md`
  (estado: diseño, pendiente de aprobación). Detalla capas 1-3, golden-tests, doble path
  (ingesta `parseBancoSpecific` server + re-enriquecido `extraer_spei.js`), deploy reconciliado.
- **Score refinado**: `reprocesar db/qa_calidad_extraccion.cjs` (excluye artefactos BANORTE).
- **Commit** `39d1a7a` en rama `diego/esquema-detalle-empresa` (spec + MEMORIA + score).
  Los archivos del extractor (`formato_fecha.js`, `clasificacion.js`) siguen gitignored →
  el fix, cuando se implemente, se despliega por scp reconciliado.

## Pendiente / próximos pasos
- [ ] **Decisión usuario**: nombre vs concepto en cuenta-de-tercero BBVA (bloquea capa 2).
- [ ] **Capa 1** (recomendada primero, bajo riesgo): regla `PAGO CUENTA DE TERCERO` /
      `TRASPASO A CUENTA DE TERCEROS` → clas 3 en `clasificacion.js` + golden-test +
      reclasificar existente (~56 filas). Deploy reconciliado.
- [ ] **Capa 2**: regex nueva en `parseBBVA` + `parseBancoSpecific` + re-enriquecer + medir.
- [ ] **Capa 3**: mal-unión por salto de página (desfragmentador) — defer.
- [ ] Item 5 pendiente (aparte): medir tasa de match dudoso de umbrales
      `buscaEmpresaCorto ≥0.85` / frecuencia `clabeLookup` antes de moverlos.

## Enlaces
- Índice: [[00 Índice de Memoria]]
- Nodo: [[Gestión (Tesorería)]]
- Algoritmo: [[Algoritmo]], [[Bancos]]
- Relacionadas: [[2026-07-09 - Tarea 4 - Saneo extractor bancario y fix nomina]]
