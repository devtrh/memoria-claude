---
tipo: memoria-conversacion
fecha: 2026-06-12
titulo: Búsqueda por UUID y flujo git de 2 personas (scripts)
proyecto: Gestión (Tesorería)
session_id: 4e5966a5-89e3-4def-aa02-eebb133b61c1
tags: [memoria, gestion, busqueda, git, flujo-2-personas, deploy]
estado: cerrada
---

# Búsqueda por UUID y flujo git de 2 personas (scripts)

> [!info] Resumen
> Dos temas. (1) La **búsqueda global por UUID** ya estaba en el código (commit `679b546`) pero **producción corría una imagen vieja** sin `parseUuid`; se desplegó solo el backend (`buscar.js`) y quedó funcionando en el server. (2) Como ya trabajan **2 personas** en el repo, se crearon los scripts de flujo **`inicio-trabajo.ps1` / `sincronizar.ps1` / `cerrar-y-deploy.ps1`** (una rama por tarea, `pull --rebase --autostash`, commit selectivo, PR y deploy opcional). Se ordenó el working tree mezclado en `main` en 2 PRs (#1 chat-adjuntos, #2 flujo+scripts).

## Contexto
- La barra de Búsqueda global ya tenía soporte UUID de punta a punta en `main`, pero al probar en el servidor no funcionaba: el `buscar.js` desplegado era del 7-jun (sin `parseUuid`). El server **no es repo git**, corre archivos horneados en imagen Docker.
- El repo pasó a tener 2 personas trabajando en `main` a la vez → riesgo de pisarse. `main` local estaba 8 commits atrás del remoto y con cambios mezclados (feature de chat-adjuntos + scripts + `reprocesar db/*.cjs`).

## Puntos clave / decisiones
- **UUID:** verificado contra la DB (`be1b2fdc-…` → HERNO · PEIBO · 2026-04-01 · retiro $24.00). Deploy ligero: `scp buscar.js` + rebuild/restart de `teso-backend`. El **badge cosmético "UUID"** vive en el frontend y no se redeployó (funciona sin la etiqueta).
- **Flujo 2 personas:** una **rama por tarea** (`diego/<tarea>`, prefijo del `git config user.name`), **nunca `git add .`** (commit selectivo con confirmación), `git pull --rebase --autostash` para no perder trabajo a medias, PR con `gh`, deploy a prod **solo si se confirma** (scp de archivos cambiados + rebuild del contenedor afectado). `cep-python` (submódulo) se deja intacto.
- Convención confirmada del `.gitignore`: los scripts `.cjs/.js` **sí** se versionan; los datos **no**.
- Bootstrap del working tree sucio: se separó en **PR #1 (chat-adjuntos → toca prod)** y **PR #2 (flujo+scripts → sin deploy)**; se mergeó el #2 y se adelantó `main` a los 8 commits del compañero.

## Pendiente / próximos pasos
- [ ] PR #1 (chat-adjuntos): QA del usuario y luego merge + deploy (rebuild backend+frontend por nginx/límite express).
- [ ] Bug preexistente en `src/services/api.ts:41`: URL de `actualizarMovimiento` con backslashes `\bancos\movimientos\` en vez de `/`.
- [ ] Opcional: dejar `COMO-TRABAJAMOS.md` en el repo y/o correr `sincronizar.ps1` automáticamente al inicio de cada cambio.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Transcript: [📄 conversación completa](<transcripts/2026-06-12 - en busqueda global ayudame a que podamos buscar por el uuid del… [4e5966a5].md>)
- Relacionada: [[2026-06-25 - Homologar cambios del equipo y subir a git]]
