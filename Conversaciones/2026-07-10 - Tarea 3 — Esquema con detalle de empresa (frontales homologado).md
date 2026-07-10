---
tipo: memoria-conversacion
fecha: 2026-07-10
titulo: Tarea 3 — Esquema con detalle de empresa (frontales homologado)
proyecto: Gestión (Tesorería)
session_id: 4b5e7430-7c35-4a75-b3e6-afac311e8923
tags: [memoria, gestion, nomina, esquema, frontales, homologacion, grupos, dispersion]
estado: en-curso
---

# Tarea 3 — Esquema con detalle de empresa (frontales homologado)

> [!info] Resumen
> Sub-proyecto #1 de la serie "método/esquema de colaboradores". Se diseñó el modelo de **esquema de dispersión con detalle de empresa** (SA/SC/asimilados/tarjeta) y se empezó a implementar **F1: catálogo de frontales homologado**. Flujo completo: brainstorming → spec → dry-run read-only → plan → ejecución subagent-driven. Clave: la **clasificación de proveedor ya vive en la DB** (`grupos_clabe.grupo_tipo/grupo_id`), así que se **deriva de ahí** en vez de pedirla a mano. Rama aislada en worktree por colisión con otra tarea concurrente. Quedan **2 conflictos** por decidir antes de aplicar.

## Contexto
- Miles de colaboradores quedaron **sin método/esquema**, y falta el detalle de **por cuál empresa** se dispersó (SA→qué frontal, SC→qué frontal, tarjeta→LUCARD/INNTEC, asimilados→qué empresa, registro IMSS).
- Fuentes de verdad (validadas con **Naye/Nayeli**): `modelo_flujos_nomina.xlsx` (37 flujos), `flujos-reconstruidos/Flujos_Reconstruidos.md`, `cliente-colaboradores/CLIENTE - COLABORADORES_NAYELI.xlsx`, `INTEGRACION_gestion_react.md` (operación = cliente+periodo+esquema+fecha+monto).

## Puntos clave / decisiones
- **Empresa varía por pago/periodo** (se captura en la línea de nómina, no fija en el colaborador). Un colaborador tiene **1+ esquemas y NO son estáticos**.
- **SC = Sociedad Civil** (figura análoga a SA). "Sin comprobante / a la brava" es un **esquema aparte**. **SA vs SC se auto-deriva del sufijo de la razón social** (`SA DE CV` / `SC` / `S DE RL` / `A.C.`).
- **Maquila y Tercerización se quedan tal cual** (nomenclatura arraigada; el detalle es solo nota). **Procom** eliminado. **Soc. Civil → SC**.
- Enfoque **A**: catálogos normalizados + captura por operación.
- **La clasificación de proveedor ya está en la DB**: `proveedor_externo` (CATANIA/MTY/TARIK/AR/FER AVILA/MFB/INTERNO) + `grupos_personalizados` (SA/ASIMILADOS/GASTOS/SINDICATO/INVERSIONES EXTERNAS) + `grupos_clabe.grupo_tipo/grupo_id`. Se **deriva de ahí** (no overrides a mano). El grupo **GASTOS** ya marca los no-frontales a excluir.

## Estado de implementación (F1)
- Rama **`diego/f1-frontales-homologado`** en worktree `C:/Users/Diego/Documents/GitHub/gestion-f1-frontales` (aislada por colisión con la tarea concurrente "alias de clientes" en `diego/esquema-detalle-empresa`).
- **Task 1** — migración 13 (columnas `razon_social/rfc/tipo_figura/clasificacion` + tabla `frontales_nombres` + `empresa_id` nullable): **aplicada y verificada en PROD** (snapshot en `backend/backups/`).
- **Task 2** — módulo puro `backend/lib/frontales_homolog.cjs` (figura jurídica + union-find + `clasifFromGrupos`): **TDD, revisado (Spec ✅)**.
- **Task 3** — generador read-only `homologar_frontales.cjs`: deriva clasificación de `grupos_clabe`. Resultado: **99 canónicos → 89 frontales reales, 10 gastos excluidos**; auto-clasificados interno 19 / catania 19 / tarik 22 / fer_avila 27; **solo 2 conflictos**. Dedup extra por grupo `FRONTAL:<name>` (arregló SERVINTEG).
- **Task 4** — `aplicar_frontales_homologado.cjs` listo, **detenido en compuerta humana** (validación del CSV).

## Pendiente / próximos pasos
- [ ] **Resolver 2 conflictos** (empresa en dos grupos): **ATENAS** (CATANIA vs TARIK) y **JASARQ** (FER AVILA vs TARIK).
- [ ] Correr **Task 4** (apply a `frontales` + `frontales_nombres`) con snapshot antes/después.
- [ ] Review final de rama + `finishing-a-development-branch`.
- [ ] **F2–F5**: `esquemas_catalogo` + normalizar `metodos_dispersion`; semilla colaboradores (empresa_asimilados/tarjeta_proveedor); captura por pago en `nomina_calculo_lineas`; UI de Nóminas (esquema+empresa+CLABE).

## Artefactos
- Spec: `docs/superpowers/specs/2026-07-09-esquema-detalle-empresa-design.md`
- Plan: `docs/superpowers/plans/2026-07-09-esquema-detalle-empresa-F1-frontales.md`
- Propuesta validable: `analisis/Frontales_homologadas_PROPUESTA_grupos.csv`
- Dry-run: `C:/tmp/dryrun-esquemas/dryrun.py`

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-15 - Flujo Tarik — frontales, caja, saldos y retornos]]
- Relacionada: [[2026-06-24 - Catálogo de Clientes — búsqueda por CLABE y multi-cuenta]]
