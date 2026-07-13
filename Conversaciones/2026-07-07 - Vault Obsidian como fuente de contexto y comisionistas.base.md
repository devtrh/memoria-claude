---
tipo: memoria-conversacion
fecha: 2026-07-07
titulo: Vault Obsidian como fuente de contexto y comisionistas.base
proyecto: Gestión (Tesorería)
session_id: 6cb76c34-18d0-4b90-b5ac-f32721c8ab58
tags: [memoria, gestion, obsidian, comisionistas, base, consultas]
estado: en-curso
---

# Vault Obsidian como fuente de contexto y comisionistas.base

> [!info] Resumen
> Sesión donde se usó el **vault `C:\obsidian` como fuente de contexto** para responder consultas ad-hoc sobre datos de tesorería (conteo de proyectos, gastos de una empresa, bancos por empresa) leyendo las notas `Datos/Empresas`, `Datos/Gastos`, etc. Luego se empezó a construir un **`.base` de comisionistas** en el vault a partir de los reportes de clientes-promotores (`eli mail/.../REPORTES 2026`), con la comisión que le toca a cada cliente. Enlaza con [[project_comisionistas_base]].

## Contexto
- Instrucción del usuario: "de cualquier pregunta que te haga, el contexto lo obtendrás de `C:\obsidian`". El vault tiene catálogos de empresas/clientes/gastos como notas markdown además de la Memoria-Claude.
- Ejemplos resueltos leyendo el vault: **8 proyectos** formales en `Proyectos/`; **gastos de BANDEZ = $595,740.52** (8 movs, jun-2026); **AILEC usa BANORTE · MULTIVA · VE POR MAS** (aclarado "SILEC"→AILEC).

## Puntos clave / decisiones
- El vault sirve como capa de consulta rápida sobre datos ya volcados (Datos/Empresas, Datos/Gastos) sin tocar la DB.
- Se arrancó el **`comisionistas.base`**: fuente = `eli mail/eli mail/analisis/clientes-promotores/REPORTES 2026/…` (xlsx con clientes + comisiones); formato `.base` como los que ya usa el vault.

## Pendiente / próximos pasos
- [ ] Completar el `comisionistas.base` (ver estado y detalle en [[project_comisionistas_base]] / módulo Concentrado).

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Transcript: [📄 conversación completa](<transcripts/2026-07-07 - de cualquier pregunta que te haga el contexto lo obtendras de… [6cb76c34].md>)
- Relacionada: [[2026-07-07 - Reporte ejecutivo Promotores-Comisionistas (TEAM-VERTICE)]]
