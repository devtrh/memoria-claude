---
tipo: memoria-conversacion
fecha: 2026-07-06
titulo: Auditoría UX — proyecto de tickets
session_id: local_d57f28d4-dcc5-44bd-a447-cc19ecf2d97e
tags: [memoria, ux, auditoria, react, accesibilidad, proyecto-tickets]
estado: en-curso
---

# Auditoría UX — proyecto de tickets

> [!info] Resumen
> Auditoría UI/UX de solo lectura sobre un sistema de gestión de tickets. Se ejecutó la **Fase 1 (Discovery)** completa; quedó pendiente la confirmación del usuario para avanzar a la **Fase 2 (auditoría estática en 5 capas)**. Además se detectó un hallazgo de **seguridad** fuera del alcance UX.

## Contexto del proyecto
- **Producto:** sistema interno de gestión de tickets (con tareas, proyectos, chat en tiempo real y dashboard).
- **App auditada:** `frontend/src` (la app de producción según el README).
- **Prototipo aparte ignorado:** existe un segundo frontend en `tickets/tickets/*.jsx` que parece un prototipo y quedó fuera del alcance salvo indicación contraria.

## Stack detectado
- **Frontend:** Vite + React 18 + TypeScript.
- **Routing:** React Router v6.
- **Datos/estado:** TanStack React Query v5 + Zustand.
- **Estilos:** Tailwind CSS 3 + CSS propio (`globals.css`).
- **UI/otros:** lucide-react (iconos), recharts (gráficas), socket.io-client (tiempo real).
- **Backend (fuera de alcance UX):** Node/Express + Socket.IO + PostgreSQL.

## Flujos críticos identificados
1. **Autenticación** — `Login.tsx` + `store/auth.ts`
2. **Tickets (núcleo del producto)** — `Tickets.tsx` (lista/filtros) + `TicketDetail.tsx`
3. **Tareas y Proyectos** — `Tasks.tsx`, `Projects.tsx`, `ProjectGantt.tsx` / `GanttChart.tsx`
4. **Chat interno en tiempo real** — `Chat.tsx` + `hooks/useSocket.ts`
5. **Dashboard y Estadísticas** — `Dashboard.tsx`, `Stats.tsx`
- Admin: `Audit.tsx`, `Catalogs.tsx`, `Settings.tsx`

## Puntos clave / decisiones
- La auditoría opera en **modo solo lectura**; el único archivo que se escribiría es `UX-AUDIT.md` en la raíz del proyecto.
- Metodología en 3 fases con parada y confirmación del usuario tras Fase 1 y Fase 2.
- Fase 2 evalúa 5 capas: arquitectura de información, usabilidad heurística (Nielsen), accesibilidad WCAG 2.2 AA, carga cognitiva y camino crítico.

## ⚠️ Hallazgo de seguridad (fuera de alcance UX)
- El `README.md` **expone credenciales reales en texto plano**: contraseña de PostgreSQL (líneas ~17/21) y contraseña de admin (línea ~41).
- Existe un `backend/.env` versionado en el repo (no se abrió).
- **Recomendación:** rotar esas credenciales y sacarlas del repositorio.

## Pendiente / próximos pasos
- [ ] Confirmar si se procede con la **Fase 2** sobre `frontend/src`.
- [ ] Decidir si incluir o no el prototipo `tickets/tickets/*.jsx`.
- [ ] Rotar credenciales expuestas y eliminar `.env` del control de versiones.

## Enlaces
- Proyecto: [[Sistema de Tickets]]
- Índice: [[00 Índice de Memoria]]
