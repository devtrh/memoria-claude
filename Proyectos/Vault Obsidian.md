---
proyecto: Vault Obsidian
repo: C:\loki
actualizado: 2026-07-07
---

# Vault Obsidian

Nodo de memoria del repo `C:\loki`. El bloque de abajo se auto-rellena desde
`docs/MEMORIA.md` del repo en cada commit (hook post-commit). No editar a mano dentro
de los marcadores.

<!-- MEMORIA:START -->
# Vault Obsidian (C:\loki)

Vault principal de Obsidian del usuario, versionado en git. Contiene notas de clientes,
catálogos y el subvault `Memoria-Claude` (sistema de memoria por proyecto).

## Alcance / temas
- Notas y datos de clientes (`Datos_Clientes/`, catálogos `catalogo_*`).
- Sistema de memoria por proyecto en `Memoria-Claude/` (nodos `Proyectos/*.md`).

## Datos clave
> Solo datos reales.

- **Tipo**: Vault de Obsidian versionado en git.
- **Remoto**: https://github.com/devtrh/obsidian.git (`origin`).
- **Plugins Obsidian**: Smart Connections (`.smart-env/`), entre otros.
- **Subvault**: `Memoria-Claude/` — repo git aparte con los nodos de memoria (`Proyectos/*.md`) y `_hooks/` (plantilla + hook post-commit).
- **Memoria de este repo**: `docs/MEMORIA.md` → se sincroniza al nodo `Proyectos/Vault Obsidian.md` del subvault vía hook `post-commit`.

## Datos / conexiones con otros proyectos
- El subvault `Memoria-Claude` centraliza la memoria de TODOS los proyectos del usuario.

## Pendientes
- [ ] ...

## Registro de cambios
> Bitácora append-only. La entrada más reciente va ARRIBA.
- 2026-07-07 — Instalado sistema de memoria (docs/MEMORIA.md + hook post-commit + nodo `Vault Obsidian.md`) · para conservar contexto del proyecto · docs/MEMORIA.md, scripts/hooks/post-commit.
<!-- MEMORIA:END -->
