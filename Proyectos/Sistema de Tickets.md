---
tipo: proyecto
nombre: Sistema de Tickets
tags: [proyecto, tickets, react, postgres]
stack: [Vite, React 18, TypeScript, React Router v6, React Query, Zustand, Tailwind, Node/Express, Socket.IO, PostgreSQL]
ruta_local: C:\Users\GARAGE\tickets
repo: https://github.com/devtrh/tickets.git
estado: activo
actualizado: 2026-07-06
---

# Sistema de Tickets

Sistema interno de gestión de tickets con tareas, proyectos, chat en tiempo real y dashboard.

## Ubicación
- **Ruta local:** `C:\Users\GARAGE\tickets`
- **Repositorio:** https://github.com/devtrh/tickets.git

## Conversaciones relacionadas
- [[2026-07-06 - Auditoria UX proyecto tickets]]

## Datos / conexiones con otros proyectos
> Info que se cruza con otras áreas (curado a mano). Usa [[enlaces]].
- [[Seguimiento de Proyectos]] — tareas y tickets ligados a proyectos.
- Autenticación compartida → [[Usuarios AUD (autenticación)]].

## Enlaces
- [[00 Índice de Memoria]]

## Historial de commits (auto — la actualiza el git hook; no editar a mano)
> Se antepone una entrada por commit: fecha/hora, hash, mensaje y archivos cambiados.
<!-- COMMITS:START -->
<!-- COMMITS:END -->

## Memoria del repo (auto — la actualiza el git hook; no editar a mano)
> Sincronizado desde `docs/MEMORIA.md` del repo en cada commit.
<!-- MEMORIA:START -->
# 🎫 ticketTI

Nodo principal del área ticketTI: centro de operaciones de TI (tickets, tareas, proyectos con Gantt jerárquico) sobre PostgreSQL + Node/Express + React.

## Alcance / temas
- Tickets de soporte (ingesta desde WhatsApp/Meta), tareas operativas (con Google Calendar) y proyectos con desglose WBS y diagrama de Gantt.
- Autenticación JWT + roles, catálogos, subida/descarga de archivos y asistente de lenguaje natural (texto → tickets/estructura de proyecto).
- Importación de proyectos por Excel (plantilla WBS: Módulo → Sección → Pestaña → Tarea) y UI blanca/premium (tablas reutilizables, modales accesibles, calendarios temados).

## Datos clave
> Datos duros del proyecto (stack, BD y tablas, endpoints, rutas, cifras). Solo reales.
- **Stack**: PostgreSQL · Node/Express + Socket.IO · Vite/React 18 + TypeScript + Tailwind · Docker · Nginx. IA/NL: `backend/routes/nl.js` (Ollama Llama 3.1 8B según README; dep `@anthropic-ai/sdk` en `backend/package.json`).
- **Prod**: https://n8n.datazentrika.com/tickets/ · Docker (contenedores `tickets-backend`, `tickets-frontend`, `tickets-ollama`). Frontend servido bajo `/tickets/` (base path de Vite); contenedor frontend `8090:80` en `docker-compose.yml`.
- **BD**: PostgreSQL en `134.209.64.96`. Dev: DB `ticketTI`. Prod: BD `aud` con schema propio vía `DB_SCHEMA` (esquemas `tickets` y `seguimiento`). Migraciones NO corren solas en prod (guard por `DB_SCHEMA` en `backend/db/migrate.js`) → aplicar a mano.
- **API** (montada en `/api`, ver `backend/server.js`): `auth`, `tickets`, `tareas`, `proyectos`, `wbs`, `catalogos`, `nl`, `archivos`. Comentadas: `kb`, `chat`, `stats`, `n8n-ingest`.
- **Tablas base** (`backend/sql/01_schema.sql`): empresas, roles, usuarios, usuario_empresas, categorias_ticket, tickets (+ ticket_actividades/archivos/mensajes_wa), tareas (+ tarea_evidencias), catalogo_tareas, proyectos, proyecto_items, proyecto_dependencias, kb_articulos, chat_conversaciones/participantes/mensajes, notificaciones, audit_log.
- **WBS nuevo** (mig. `09_wbs_proyectos*.sql`): `proyecto_modulos` → `proyecto_secciones` → `proyecto_pestanas`; columnas en `tareas`: `modulo_id`, `seccion_id`, `pestana_id`, `es_hito`. CRUD en `/api/wbs`.
- **Modelo legacy `seguimiento`** (schema externo): `projects`/`deliverables`/`subtasks`/`milestones`, lo lee `buildGantt` en `backend/routes/proyectos.js` (vista global "Todos los proyectos" del Gantt).
- **Migraciones**: `backend/sql/01..09` (dos variantes de la 09: `09_wbs_proyectos.sql` y `09_wbs_proyectos_tickets.sql` calificada con schema `tickets` para aplicar a mano en prod).
- ⚠️ **Riesgo de secretos**: `README.md` incluye una contraseña / cadena de conexión de BD en texto plano; existe `backend/.env.example` (plantilla) y `secrets/google-sa.json` (Service Account de Google). No pegar secretos en esta memoria; conviene rotar la credencial expuesta en el README.

## Datos / conexiones con otros proyectos
> Info que se cruza con otras áreas.
- **n8n / Meta Cloud API** — ingesta de tickets desde WhatsApp (tabla `ticket_mensajes_wa`); prod vive bajo el dominio `n8n.datazentrika.com`.
- **Google Calendar** (`googleapis`, `secrets/google-sa.json`) — sincronización de tareas.
- **BD compartida `aud`** — el schema `public` aloja auth/CFDI de otra app; ticketTI usa schema propio (`DB_SCHEMA`) para no contaminarlo (ver guard en `backend/db/migrate.js`).
- **App de `seguimiento`** — esquema externo de gestión de proyectos que el Gantt global consume en modo legacy.

## Pendientes
- [ ] Orden de tareas WBS no persiste (falta columna `orden` en `tareas`) y reparentar contenedores WBS no está en `PATCH /api/wbs/*` (solo `nombre`/`orden`).
- [ ] Vista global "Todos los proyectos" del Gantt sigue en el modelo `seguimiento` (no migrada a WBS).
- [ ] "Externo" suelto en el Gantt legacy se crea como tarea (sin tipo propio en `seguimiento`).
- [ ] Flechas de dependencia en el Gantt: falta modelo de datos.
- [ ] Duplicar contenedores WBS (módulo/sección/pestaña con su subárbol): no implementado.

## Registro de cambios
> Bitácora append-only. La entrada más reciente va ARRIBA.
- 2026-07-06 — Gantt por proyecto migrado al modelo WBS (Módulo→Sección→Pestaña→Tarea/Hito): aplanado del árbol, leyenda "guía de jerarquía" con 5 niveles arrastrables, alta/renombrado/borrado/toggle vía `/api/wbs` + `tareas`, detalle de tarea al clic, duplicar tarea y reordenar (orden de contenedores + reparentar tareas). · migrar la vista de datos de `seguimiento` al esquema nuevo. · `frontend/src/components/ProjectGantt.tsx`, `frontend/src/views/Projects.tsx`, `frontend/src/api/wbs.ts`.
- 2026-07-06 — Importación de proyectos por Excel con desglose WBS + plantilla jerárquica; al importar, la vista selecciona el proyecto nuevo. · dar de alta proyectos con su árbol en un paso. · `frontend/src/views/Projects.tsx`, `backend/routes/proyectos.js`.
- 2026-07-06 — Componente `DataTable` reutilizable (encabezados ordenables, paginación, presentadores Pill/Dot/Avatar/DateCell) aplicado a Tickets y Tareas; header de proyecto (`ProjectHeader`). · unificar y elevar la UI de tablas. · `frontend/src/components/DataTable.tsx`, `frontend/src/components/ProjectHeader.tsx`, `frontend/src/views/Tickets.tsx`, `frontend/src/views/Tasks.tsx`.
- 2026-07-06 — `DateField` (calendario de una sola fecha, temado) reemplaza `<input type="date">`; popover en portal con posición `fixed` (no lo recorta el modal). Primitiva `Field` + `.input` full-width; focus-trap en `Modal`. · UX de formularios/calendarios. · `frontend/src/components/DateField.tsx`, `Field.tsx`, `Modal.tsx`, `frontend/src/styles/globals.css`, `z.ts`.
- 2026-07-06 — Fix: arrastrar "sección" al Gantt ya no se crea como tarea (flag `grupo` en `seguimiento.deliverables`); rutas del Gantt con `try/catch` (antes un 500 dejaba el diagrama en blanco). Migración `07_tickets_fecha_limite.sql` requerida en prod. · `backend/routes/proyectos.js`, `frontend/src/views/Projects.tsx`.
<!-- MEMORIA:END -->
