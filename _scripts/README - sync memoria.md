---
tipo: guia
tags: [memoria, git, hooks, sync]
actualizado: 2026-07-06
---

# 🔁 Sincronización repo → vault (git hook)

Cada repo con `docs/MEMORIA.md` puede alimentar su nodo del vault en cada commit:
- Actualiza el bloque **Memoria del repo** desde `docs/MEMORIA.md`.
- Antepone una entrada al **Historial de commits** (fecha/hora, hash, mensaje, archivos).

## Instalar en un repo (una vez)
```powershell
powershell -ExecutionPolicy Bypass -File "C:\loki\Memoria-Claude\_scripts\install-memoria-hook.ps1" -Repo "<ruta del repo>" -Node "<nombre del nodo>"
```

Ejemplos:
```powershell
# Tickets
... -Repo "C:\Users\GARAGE\tickets" -Node "Sistema de Tickets"
# Gestión / Tesorería
... -Repo "C:\Users\GARAGE\Desktop\proyecto-gestion\gestion" -Node "Gestión (Tesorería)"
```

## Requisitos
- El repo debe tener `docs/MEMORIA.md` (genéralo con el prompt de Claude Code: `_Plantillas/Prompt Claude Code - memoria de proyecto.md`).
- Node instalado y accesible desde git bash.

## Archivos
- `_scripts/sync-memoria.cjs` — hace la fusión en el nodo (bloques gestionados).
- `_scripts/post-commit.template.sh` — plantilla del hook.
- `_scripts/install-memoria-hook.ps1` — instalador por repo.

## Proyectos conectados
| Nodo | Repo | Estado |
|------|------|--------|
| [[Sistema de Tickets]] | C:\Users\GARAGE\tickets | hook instalado |
| [[Gestión (Tesorería)]] | C:\Users\GARAGE\Desktop\proyecto-gestion\gestion | [pendiente] |

## Notas
- El hook `post-commit` corre en cada commit local. Para actualizar también al hacer `git pull`, copia el mismo archivo como `post-merge`.
- Git guarda la fecha del **commit**, no la del `push` (esa no se registra por commit).

## Enlaces
- [[00 Índice de Memoria]]
- [[Cómo alimentar la memoria]]
