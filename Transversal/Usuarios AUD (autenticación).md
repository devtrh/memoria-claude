---
tipo: transversal
nombre: Usuarios AUD (autenticación)
tags: [transversal, auth, usuarios, aud]
estado: activo
actualizado: 2026-07-06
---

# 🔐 Usuarios AUD (autenticación)

Dato transversal que aplica a **todos los proyectos/nodos**.

## Hecho clave
- Todos los proyectos se autentican con los **mismos usuarios de AUD** (autenticación compartida / cuenta única de acceso).

## Aplica a
- [[Gestión (Tesorería)]]
- [[Contabilidad]]
- [[Legal]]
- [[Seguimiento de Proyectos]]
- [[Sistema de Tickets]]
- [[Ops]]
- [[Checador]]

## Notas
- Roles y permisos pueden variar por proyecto (p. ej. admin, tesorero, rol control JR, rol Impulse), pero el **origen de identidad es el mismo (AUD)**.
- [pendiente] Detallar mecanismo exacto (SSO, tabla `usuarios` compartida, tokens) cuando se confirme.

## Enlaces
- [[00 Índice de Memoria]]
