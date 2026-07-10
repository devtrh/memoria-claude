---
tipo: registro
nombre: Registro de tiempos
tags: [registro, tiempos]
estado: activo
actualizado: 2026-07-07
---

# ⏱️ Registro de tiempos

Bitácora de cambios por sesión, clasificados por área (UI, Backend, API, Integración, Docs).
La columna **Duración** es una **estimación aproximada del tiempo de trabajo del agente** (no medición exacta; no incluye tiempo humano de revisión).

Proyecto relacionado: [[Sistema de Tickets]]

## 2026-07-07 — ticketTI (sesión: detalle ClickUp, adjuntos y fixes de Gantt/Select)

| # | Categoría | Cambio | Archivos | Duración |
|---|-----------|--------|----------|----------|
| 1 | UI · Componente | `Select`: el desplegable se **reposiciona** al hacer scroll en vez de cerrarse (afecta el selector de proyecto y todos los Select) | `frontend/src/components/Select.tsx` | ≈4 min |
| 2 | UI · Fix | **Gantt**: ya no se oculta cuando los elementos no tienen fecha; dibuja la jerarquía con una ventana por defecto (hoy) | `frontend/src/components/ProjectGantt.tsx` | ≈6 min |
| 3 | UI | **Detalle WBS estilo ClickUp**: breadcrumb con ancestros clickeables, título/nombre editable grande, filas de propiedad (`PropRow`), lista de subelementos navegable | `frontend/src/views/Projects.tsx` | ≈10 min |
| 4 | Backend · API | **Adjuntos de tareas**: `GET/POST /api/archivos/tarea/:id`, `POST .../url`, `DELETE .../tarea-evidencia/:id` sobre la tabla `tarea_evidencias` (sin migración) | `backend/routes/archivos.js` | ≈6 min |
| 5 | Frontend · API cliente | Métodos de adjuntos (`archivos`, `addUrl`, `uploadArchivos`, `delArchivo`) | `frontend/src/api/tareas.ts` | ≈2 min |
| 6 | UI · Componente | Componente reutilizable **`Attachments`** (archivos, imágenes con vista previa, enlaces) integrado en el detalle de tareas WBS | `frontend/src/components/Attachments.tsx`, `frontend/src/views/Projects.tsx` | ≈9 min |
| 7 | UI · Componente | **Detalle unificado ClickUp**: `EntityMiniCard` (popover compacto) + `EntityDetailModal` (detalle grande editable) + modelo normalizado y adaptadores | `frontend/src/components/EntityMiniCard.tsx`, `frontend/src/components/EntityDetailModal.tsx`, `frontend/src/lib/entityDetail.tsx` | ≈15 min |
| 8 | UI · Componente | **`DataTable`**: `onRowClick` ahora pasa el evento para anclar el popover al cursor | `frontend/src/components/DataTable.tsx` | ≈1 min |
| 9 | Integración | Cableado del detalle unificado en **Tickets**, **Tareas** y **Gantt WBS** (fila/barra → mini-card → modal) | `frontend/src/views/{Tickets,Tasks,Projects}.tsx` | ≈8 min |
| 10 | Docs | Bitácora `docs/MEMORIA.md` + `## Registro de tiempos` de esta sesión | `docs/MEMORIA.md` | ≈4 min |
| | | | **Total** | **≈65 min** |

### Resumen por área
- **UI / Frontend**: #1, #2, #3, #6, #7, #8, #9 (7)
- **Backend / API**: #4 (1)
- **API cliente**: #5 (1)
- **Docs**: #10 (1)
