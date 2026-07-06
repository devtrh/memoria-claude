---
tipo: indice-memoria
tags: [memoria, moc, indice]
actualizado: 2026-07-06
---

# 🧠 Índice de Memoria — Conversaciones con Claude

Memoria extendida de las conversaciones que he tenido con Claude (Cowork). Cada nota resume una conversación: contexto, decisiones, hallazgos y pendientes. Sirve como **contexto recuperable**: en una nueva sesión puedo pedirle a Claude que lea esta carpeta antes de empezar.

> 📖 ¿No sabes cómo agregar info? Lee [[Cómo alimentar la memoria]].

## Cómo usar esta memoria
- Al iniciar una sesión nueva, pídele a Claude: *"lee mi carpeta `Memoria-Claude` en el vault y úsala como contexto"*.
- Cada conversación vive en `Conversaciones/` con formato `AAAA-MM-DD - Título.md`.
- El frontmatter (`tipo`, `fecha`, `tags`, `estado`) permite filtrar y buscar con Dataview o la búsqueda de Obsidian.

## Nodos principales (proyectos)

| Nodo | Área | Estado |
|------|------|--------|
| [[Tesorería]] | Finanzas | activo |
| [[Contabilidad]] | Finanzas | activo |
| [[Legal]] | Legal | activo |
| [[Seguimiento de Proyectos]] | Gestión | activo |
| [[Sistema de Tickets]] | Producto/TI | activo |
| [[POS CRM]] | Producto/TI | activo |
| [[Checador]] | RH/Asistencia | activo |

> Cada nodo tiene su nota en `Proyectos/` con sus datos y sus **conexiones cruzadas** hacia otros nodos (usa la sección "Datos / conexiones con otros proyectos"). En el grafo de Obsidian los verás enlazados.

## Datos transversales (compartidos)

| Dato | Aplica a |
|------|----------|
| [[Usuarios AUD (autenticación)]] | Todos los nodos |

## Conversaciones registradas

| Fecha | Conversación | Proyecto | Temas | Estado |
|-------|--------------|----------|-------|--------|
| 2026-07-06 | [[2026-07-06 - Auditoria UX proyecto tickets]] | [[Sistema de Tickets]] | UX, React, accesibilidad, seguridad | en-curso |
| 2026-07-06 | [[2026-07-06 - Montaje sistema de memoria Obsidian]] | [[Ops]] | Obsidian, vault, tarea programada | en-curso |
| 2026-07-06 | [[2026-07-06 - Agrupado de conversaciones por proyecto]] | [[Ops]] | organización, PostgreSQL, MCP | cerrada |

## Pendientes abiertos (de todas las conversaciones)
- [ ] Auditoría UX: confirmar avance a Fase 2 sobre `frontend/src`.
- [ ] Auditoría UX: rotar credenciales expuestas y quitar `.env` del repo.
- [ ] Memoria Obsidian: confirmar mecanismo de autenticación AUD y poblar nodos vacíos.
- [ ] Memoria Obsidian: guiar instalación del MCP de Postgres para la BD local.

## Notas
- Hay **3 conversaciones** archivadas. A medida que tengamos más sesiones, se añadirán aquí como nuevas notas y filas en la tabla.
- Consulta opcional con Dataview (si tienes el plugin):

```dataview
TABLE fecha, tags, estado
FROM "Memoria-Claude/Conversaciones"
SORT fecha DESC
```
