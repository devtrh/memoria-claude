---
tipo: guia
tags: [memoria, onboarding, equipo]
actualizado: 2026-07-06
---

# 👥 Onboarding: cómo contribuir a la memoria (para el equipo)

La memoria del equipo NO se alimenta subiendo historiales crudos de Claude Code (son
locales y ruidosos). Se alimenta por **git**: cada repo tiene un `docs/MEMORIA.md` que
todos actualizan y empujan. Una máquina "consolidadora" lo lleva al vault de Obsidian.

## Qué debe hacer tu compañero (por cada repo)
1. `git pull` — obtiene la regla en `CLAUDE.md` y el comando `/actualizar-memoria`.
2. Trabajar normal en Claude Code. La regla de `CLAUDE.md` hace que se actualice
   `docs/MEMORIA.md` tras cada cambio; o correr `/actualizar-memoria "resumen"` para forzarlo.
3. `git add docs/MEMORIA.md && git commit && git push` — su aporte queda en el repo compartido.

> No necesita instalar el git hook ni tener el vault. Solo empuja a git.

## Quién consolida al vault
- UNA máquina (o el servidor) tiene el vault y el hook instalado (`install-memoria-hook.ps1`).
- Ahí se hace `git pull` del repo y el hook actualiza el nodo del vault (bloques
  "Memoria del repo" e "Historial de commits").
- Si quieres que se consolide solo, programa un `git pull` periódico en esa máquina.

## Requisitos por repo (una vez, quien lo prepare)
- `docs/MEMORIA.md` inicial (comando `/actualizar-memoria` o el prompt Base).
- Regla en `CLAUDE.md` (memoria del proyecto).
- Comando `.claude/commands/actualizar-memoria.md` commiteado (ver [[actualizar-memoria (comando Claude Code)]]).

## Enlaces
- [[00 Índice de Memoria]]
- [[README - sync memoria]]
- [[Prompts por proyecto (Claude Code)]]
