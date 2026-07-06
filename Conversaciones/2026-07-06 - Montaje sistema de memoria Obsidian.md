---
tipo: memoria-conversacion
fecha: 2026-07-06
titulo: Montaje del sistema de memoria en Obsidian
proyecto: Ops
session_id: local_b3648335-fe6c-46bb-abb0-d5a9c5a43fbe
tags: [memoria, obsidian, vault, ops, infraestructura]
estado: en-curso
---

# Montaje del sistema de memoria en Obsidian

> [!info] Resumen
> Construcción del vault `Memoria-Claude` como cerebro de contexto de todos los proyectos: índice (MOC), nodos de proyecto, plantillas y dato transversal de autenticación. Se cerraron y cruzaron los nodos y se dejó programada la tarea diaria de archivado de conversaciones.

## Contexto
- Se usa Obsidian (`C:\loki\Memoria-Claude`) como memoria extendida y recuperable entre sesiones de Claude.
- Estructura: `00 Índice de Memoria` (MOC), carpeta `Proyectos/`, `Conversaciones/`, `_Plantillas/` y `Transversal/`, todo enlazado con `[[wikilinks]]`.

## Puntos clave / decisiones
- Se aprobó el nodo **Gestión (Tesorería)** y se actualizaron los enlaces `[[Tesorería]]` → `[[Gestión (Tesorería)]]` (el viejo `Tesorería.md` quedó como redirección).
- Se creó el nodo **Ops** con su ancla real (lista OPS 2026) y se cruzaron todos los nodos entre sí en el índice.
- Se añadió el dato transversal **[[Usuarios AUD (autenticación)]]** enlazado a todos los nodos; mecanismo exacto (SSO / tabla `usuarios` compartida / tokens) marcado como `[pendiente]`.
- Se añadió sección "Cómo consultar el avance" en `Cómo alimentar la memoria.md` con ejemplos de preguntas.
- Se programó la tarea **"archivar-conversaciones-obsidian"** (diaria, 8:10 PM): convierte conversaciones nuevas en notas de resumen, las enlaza a su nodo y actualiza el índice. Limitación: solo archiva sesiones abiertas/disponibles en la app.

## Pendiente / próximos pasos
- [ ] Confirmar el mecanismo exacto de autenticación AUD (SSO, tabla compartida o tokens).
- [ ] Poblar con datos reales los nodos vacíos: Contabilidad, Legal, Seguimiento de Proyectos y Ops.
- [ ] Borrar el `Tesorería.md` de redirección al abrir Obsidian.
- [ ] Dar "Run now" una vez a la tarea programada para pre-aprobar permisos.

## Enlaces
- Proyecto: [[Ops]]
- Índice: [[00 Índice de Memoria]]
