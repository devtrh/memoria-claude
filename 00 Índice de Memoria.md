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
| [[Gestión (Tesorería)]] | Finanzas / Tesorería | activo |
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
| 2026-07-09 | [[2026-07-09 - Tarea 4 - Saneo extractor bancario y fix nomina]] | [[Gestión (Tesorería)]] | extractor, CLABE 085, BANREGIO dedup, ordenante=beneficiario, pagos servicio→ras/convenio, edición CLABE superusuario, fix nómina, deploy | cerrada |
| 2026-07-10 | [[2026-07-10 - Tarea 3 — Esquema con detalle de empresa (frontales homologado)]] | [[Gestión (Tesorería)]] | esquema/dispersión, frontales, homologación, grupos | en-curso |
| 2026-07-10 | [[2026-07-10 - Tarea 2 — Movimientos exportables, beneficiario-ordenante y alias en grupos]] | [[Gestión (Tesorería)]] | movimientos CSV, filtros Día/Mes, beneficiario/ordenante, alias grupos, deploy reconciliado | en-curso |
| 2026-07-09 | [[2026-07-09 - Tarea 1 — Concentrado, cobertura de correo y alias de clientes]] | [[Gestión (Tesorería)]] | Concentrado, cobertura correo, alias clientes, homologación | en-curso |
| 2026-07-06 | [[2026-07-06 - Auditoria UX proyecto tickets]] | [[Sistema de Tickets]] | UX, React, accesibilidad, seguridad | en-curso |
| 2026-07-06 | [[2026-07-06 - Montaje sistema de memoria Obsidian]] | [[Ops]] | Obsidian, vault, tarea programada | en-curso |
| 2026-07-06 | [[2026-07-06 - Agrupado de conversaciones por proyecto]] | [[Ops]] | organización, PostgreSQL, MCP | cerrada |
| 2026-07-07 | [[2026-07-07 - Compilado sesiones Gestión (Tesorería)]] | [[Gestión (Tesorería)]] | compilado de 28 sesiones (índice) | en-curso |
| 2026-07-07 | [[2026-07-07 - Reporte ejecutivo Promotores-Comisionistas (TEAM-VERTICE)]] | eli mail | promotores, comisionistas, TEAM/VERTICE, margen | en-curso |
| 2026-07-06 | [[2026-07-06 - Ingesta de estados de cuenta junio 2026]] | [[Gestión (Tesorería)]] | ingesta mensual PDFs, arquitectos aparte | cerrada |
| 2026-06-25 | [[2026-06-25 - Homologar cambios del equipo y subir a git]] | [[Gestión (Tesorería)]] | git, flujo 2 personas, rama+PR | en-curso |
| 2026-06-24 | [[2026-06-24 - Impulse — verificación masiva de comprobantes]] | [[Gestión (Tesorería)]] | Impulse, CEP, BANREGIO masivo | en-curso |
| 2026-06-24 | [[2026-06-24 - Catálogo de Clientes — búsqueda por CLABE y multi-cuenta]] | [[Gestión (Tesorería)]] | catálogo clientes, CLABE, multi-cuenta | cerrada |
| 2026-06-24 | [[2026-06-24 - Corrección de 12 movimientos con signo invertido]] | [[Gestión (Tesorería)]] | cadena de saldos, signos | cerrada |
| 2026-06-23 | [[2026-06-23 - Soporte extractor SANTANDER-PYME (2 columnas)]] | [[Gestión (Tesorería)]] | extractor SANTANDER PYME 2 columnas | cerrada |
| 2026-06-22 | [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]] | [[Gestión (Tesorería)]] | descripción, signos, saldos, reproceso | en-curso |
| 2026-06-19 | [[2026-06-19 - Relación automática de movimientos Tarik y Catania]] | [[Gestión (Tesorería)]] | CLABE→grupos Tarik/Catania, backfill | cerrada |
| 2026-06-19 | [[2026-06-19 - Haberes — filtro por proveedor con vista unificada]] | [[Gestión (Tesorería)]] | Haberes, filtro proveedor, navegación | cerrada |
| 2026-06-15 | [[2026-06-15 - Flujo Tarik — frontales, caja, saldos y retornos]] | [[Gestión (Tesorería)]] | Tarik, frontales, caja, retornos | cerrada |
| 2026-06-07 | [[2026-06-07 - Extractores bancarios — bugs, corrección y reproceso]] | [[Gestión (Tesorería)]] | extractores, bugs, reproceso, QA | cerrada |
| 2026-05-20 | [[2026-05-20 - OCR robusto de comprobantes (SitesPay)]] | [[Gestión (Tesorería)]] | OCR, comprobantes imagen, SitesPay | cerrada |

## Pendientes abiertos (de todas las conversaciones)
- [ ] Auditoría UX: confirmar avance a Fase 2 sobre `frontend/src`.
- [ ] Auditoría UX: rotar credenciales expuestas y quitar `.env` del repo.
- [ ] Memoria Obsidian: confirmar mecanismo de autenticación AUD y poblar nodos vacíos.
- [ ] Memoria Obsidian: guiar instalación del MCP de Postgres para la BD local.

## Notas
- Hay **16 conversaciones** listadas: 3 originales + 13 de [[Gestión (Tesorería)]] (compilado 2026-07-07 de **28 sesiones**; ver [[2026-07-07 - Compilado sesiones Gestión (Tesorería)]] para la tabla completa). A medida que tengamos más sesiones, se añadirán aquí como nuevas notas y filas.
- Consulta opcional con Dataview (si tienes el plugin):

```dataview
TABLE fecha, tags, estado
FROM "Memoria-Claude/Conversaciones"
SORT fecha DESC
```
