---
tipo: memoria-conversacion
fecha: 2026-07-06
titulo: Agrupado de conversaciones por proyecto
proyecto: Ops
session_id: local_b6822ef1-0245-4b1f-8b6e-fbe8f5228b16
tags: [memoria, ops, organizacion]
estado: cerrada
---

# Agrupado de conversaciones por proyecto

> [!info] Resumen
> Se recopilaron las conversaciones disponibles y se agruparon por proyecto. Resultaron 2 conversaciones en 2 proyectos conectados entre sí por compartir la misma base PostgreSQL.

## Contexto
- Petición: recolectar información de todas las conversaciones y agruparlas según su proyecto.
- Solo son visibles las conversaciones abiertas/activas en la app (en ese momento, 2).

## Puntos clave / decisiones
- **Sistema de Tickets** — auditoría UX (Vite + React 18 + TS, backend Node/Express + Socket.IO + PostgreSQL). Hallazgo de seguridad: credenciales en texto plano en el README y `.env` versionado. Auditoría en pausa esperando Fase 2.
- **Memoria extendida (Obsidian)** — montaje del vault como cerebro de contexto. Sobre conectar la base de datos: es un PostgreSQL propio/local con lectura+escritura; los conectores en la nube no sirven, la vía es un MCP de Postgres en Claude Desktop (pendiente de guiar la instalación).
- **Conexión entre proyectos:** ambos comparten la misma base PostgreSQL — es el cruce que permite un solo cerebro para todo.

## Pendiente / próximos pasos
- [ ] Guiar la instalación del MCP de Postgres en Claude Desktop para conectar la BD local.
- [ ] Abrir más conversaciones en la app si se quieren sumar al agrupado.

## Enlaces
- Proyecto: [[Ops]]
- Relacionadas: [[Sistema de Tickets]], [[2026-07-06 - Auditoria UX proyecto tickets]], [[2026-07-06 - Montaje sistema de memoria Obsidian]]
- Índice: [[00 Índice de Memoria]]
