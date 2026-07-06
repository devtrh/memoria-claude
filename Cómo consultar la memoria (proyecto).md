---
tipo: guia
tags: [memoria, guia, git, cowork]
actualizado: 2026-07-06
---

# 🔎 Cómo consultar esta memoria como un proyecto

Guía del flujo **low-cost** para usar esta bóveda como una base de conocimiento consultable: **Git** para sincronizarla entre equipos y **Cowork (Claude)** para preguntarle cosas en lenguaje natural. Todo es gratis.

## Costos
- **GitHub repo privado:** gratis.
- **Preguntar desde Cowork:** incluido en tu uso de Claude.
- **NO se necesita** Obsidian Sync ni Publish ni plugins de pago.

## 1. Sincronizar la bóveda con Git (configuración, una sola vez)

Abre una terminal en la carpeta del vault (`C:\loki\Memoria-Claude`) y ejecuta:

```bash
cd C:\loki\Memoria-Claude
git init
git add .
git commit -m "Memoria inicial"
```

Crea un repo **privado** en GitHub (p. ej. `devtrh/memoria-claude`) y conéctalo:

```bash
git remote add origin https://github.com/devtrh/memoria-claude.git
git branch -M main
git push -u origin main
```

> El `.gitignore` ya está puesto: ignora el cache/estado local de Obsidian, no las notas.

## 2. Uso diario

Cuando cambies notas y quieras guardar/compartir:

```bash
git add . && git commit -m "actualizo memoria" && git push
```

En otro equipo, la primera vez `git clone` del repo y abre esa carpeta como bóveda en Obsidian. Después, para traer cambios: `git pull`.

## 3. Preguntarle cosas (desde Cowork)

En una sesión nueva de Cowork:
1. Conecta la carpeta `Memoria-Claude`.
2. Pide: *"lee mi carpeta Memoria-Claude y úsala como contexto"*.
3. Pregunta en lenguaje natural, por ejemplo:
   - *"¿Qué stack usa el Sistema de Tickets?"*
   - *"Dame los pendientes abiertos de todos los proyectos."*
   - *"¿Qué proyectos comparten autenticación AUD?"*
   - *"Resúmeme la última conversación del proyecto POS CRM."*

El [[00 Índice de Memoria]] está pensado como punto de entrada: enlaza los nodos de `Proyectos/` y las conversaciones.

## 4. (Opcional) Preguntar dentro de Obsidian

Si algún día quieres el chat integrado en Obsidian sin abrir Cowork, hay plugins como **Smart Connections** o **Copilot** (usan tu propia API key; costo = lo que consumas de la API). No es necesario para el flujo de arriba.

## Enlaces
- [[00 Índice de Memoria]]
- [[Cómo alimentar la memoria]]
