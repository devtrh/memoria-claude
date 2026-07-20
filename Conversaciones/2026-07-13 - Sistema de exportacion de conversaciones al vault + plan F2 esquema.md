---
tipo: memoria-conversacion
fecha: 2026-07-13
fecha_fin: 2026-07-14
titulo: "Sistema de exportación de conversaciones al vault (cobertura completa) + plan F2 esquema-empresa"
proyecto: Gestión (Tesorería)
session_id: 3ff20b18-e19c-473d-b55c-6aca4a97c202
tags: [memoria, gestion, obsidian, memoria-claude, transcripts, exportador, seguridad, esquema-empresa, plan]
estado: en curso
---

# Sistema de exportación de conversaciones al vault + plan F2 esquema

> [!info] Resumen
> Se construyó el **exportador reutilizable** de conversaciones de Claude Code
> (`.jsonl` → Markdown legible) y se dejó **Gestión con cobertura completa** (transcript +
> nota-resumen por sesión) en el vault, con **redacción automática de secretos** y una
> **guía** para replicarlo en otros proyectos. Se detectó una **contraseña de BD de prod en
> texto plano** (redactada, pero pendiente de rotar). Después se planeó la **Fase 2** del
> esquema-detalle-empresa (`esquemas_catalogo` + normalizar `metodos_dispersion`).

## Contexto
Sesión "meta" (rama `diego/esquema-detalle-empresa`, 2026-07-13→14): el usuario pidió tomar
contexto del vault `c:/obsidian/memoria-claude`, subir **todas** las conversaciones de
Gestión (Tesorería) a `Conversaciones/`, y dejar un documento con los pasos para replicarlo
en los demás proyectos. Decisión: **ambos** formatos (transcript legible + resumen curado);
Claude hace commit + push.

## Puntos clave / decisiones
- **Exportador** `_scripts/exportar-conversaciones.cjs`: convierte los `.jsonl` a Markdown
  legible (solo texto usuario/Claude; ignora `tool_use`/`tool_result`, `thinking`,
  sidechains, `isMeta` y wrappers `<system-reminder>`/comandos). **Fusiona turnos**
  consecutivos del mismo rol. Genera un `.md` por sesión + `_Índice de transcripts —
  <Proyecto>.md` que cruza transcript ↔ nota-resumen por `session_id` + `_index-<slug>.json`.
- **Multi-proyecto sin colisiones**: nombres con id corto `[id8]`; índice y json llevan el
  nombre/slug del proyecto; opción `--resumenes <dir>` para desacoplar la carpeta de resúmenes;
  `--skip <id>` para omitir la sesión activa.
- **Cobertura completa de Gestión** (2026-07-13): las 19 sesiones con `.jsonl` quedaron con
  transcript + nota-resumen (se crearon 6 resúmenes nuevos). Índice de memoria y Compilado
  actualizados. Subido a `devtrh/memoria-claude` (main, con rebase).
- **Guía** `_scripts/Subir conversaciones de un proyecto a la memoria.md`: tabla
  proyecto→carpeta con conteos reales (POS CRM 4, Legal 3, SAT API 5…), comandos
  PowerShell/Bash, cómo crear los resúmenes faltantes y el commit+push.
- **Plan F2 esquema-empresa** (segunda mitad de la sesión): tras confirmar que los "M" del
  árbol eran ruido de CRLF (no WIP), se escribió el plan en
  `docs/superpowers/plans/2026-07-14-esquema-detalle-empresa-F2-esquemas.md` — 4 tasks TDD:
  (1) tabla `esquemas_catalogo` + seed 13 esquemas idempotente en `migrate.js`;
  (2) módulo puro `esquemas_normalize.cjs` (mapeo verbatim del dry-run: Soc.Civil→SC, quitar
  Procom, IAS MTY→IAS…); (3) dry-run read-only con CSV de revisión; (4) apply gated con
  snapshot antes/después en 1 transacción.

## ⚠️ Seguridad (acción del usuario)
Un transcript traía **en texto plano la contraseña de la BD de producción** (host
`134.209.64.96`, del script `reprocesar db/_del_junio_folder.cjs`) y la contraseña compartida
de la app. Se **enmascararon** (el exportador ahora redacta secretos con patrones genéricos,
sin incrustar literales) y se verificó 0 secretos en lo subido. Pero la contraseña real sigue
hardcodeada (se confirmó después: en **85 archivos rastreados por git** + historial) → **hay
que rotarla**, redactar el vault no reduce esa exposición.

## Pendiente / próximos pasos
- [ ] **Rotar** la contraseña de BD de prod y centralizarla en `.env` (exposición activa en git).
- [ ] Replicar la exportación en los demás proyectos (POS CRM, Legal, SAT API…) con la guía.
- [ ] Ejecutar el **plan F2** (tasks 1–2 en local; dry-run→validar→apply de datos con visto bueno).
- [ ] Punto abierto menor del seed: `SINDICATO.requiere_empresa` (dejado en `false`, "por confirmar").

## Enlaces
- Índice: [[00 Índice de Memoria]]
- Nodo: [[Gestión (Tesorería)]]
- Transcript: [📄 conversación completa](<transcripts/2026-07-13 - agarra contexto de c obsidian memoria-claude luego de todas las… [3ff20b18].md>)
- Guía: [[Subir conversaciones de un proyecto a la memoria]]
- Relacionadas: [[2026-07-07 - Vault Obsidian como fuente de contexto y comisionistas.base]] · [[2026-07-10 - Tarea 3 — Esquema con detalle de empresa (frontales homologado)]]
