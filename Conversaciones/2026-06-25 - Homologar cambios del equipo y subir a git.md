---
tipo: memoria-conversacion
fecha: 2026-06-25
titulo: Homologar cambios del equipo y subir a git
proyecto: Gestión (Tesorería)
session_id: 4b5e7430-7c35-4a75-b3e6-afac311e8923
tags: [memoria, gestion, git, flujo-equipo, deploy]
estado: en-curso
---

# Homologar cambios del equipo y subir a git

> [!info] Resumen
> Revisar **todas las conversaciones del equipo** y archivos modificados, **homologar** los cambios y agregarlos a la rama para subirlos al repo. Sesión de gestión del flujo de trabajo con 2 personas. Rama `diego/tarik-flujo`, extendida hasta 07-07.

## Contexto
- Se trabaja **entre 2 personas** en el proyecto → hay que subir solo lo modificado y evitar pisar el trabajo del otro.

## Puntos clave / decisiones
- **Flujo de 2 personas:** scripts en la raíz — `inicio-trabajo`, `sincronizar`, `cerrar-y-deploy` (PowerShell).
- **Una rama por tarea**; PR **sin deploy por default**.
- Se homologaron los cambios dispersos de varias sesiones a la rama activa antes de subir.

## Pendiente / próximos pasos
- [ ] Mantener disciplina de rama+PR por tarea para no divergir del servidor (ver aviso "servidor diverge de git").

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-07-06 - Ingesta de estados de cuenta junio 2026]]
