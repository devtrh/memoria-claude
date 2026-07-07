---
tipo: guia
tags: [memoria, git, hook, guia]
actualizado: 2026-07-06
---

# ⚙️ Instalar el hook de memoria en un repo

Objetivo: que **cada repo**, en cada commit, escriba sus datos clave (stack, **componentes reutilizables**, **API**, **deploy**, BD, pendientes) en su nota del vault. Así, estando en un proyecto puedes preguntarle a la memoria qué tiene otro y cómo replicarlo.

Los archivos base están en esta carpeta `_hooks/`:
- `post-commit` — el hook.
- `MEMORIA.template.md` — plantilla de `docs/MEMORIA.md`.

## Pasos por repo (ejemplo: `pos-crm`)

1. **Crea el archivo de datos** en el repo, a partir de la plantilla:
   ```bash
   cd C:\Users\GARAGE\pos-crm
   mkdir -p docs
   cp "C:\loki\Memoria-Claude\_hooks\MEMORIA.template.md" docs/MEMORIA.md
   # edita docs/MEMORIA.md con los datos reales del proyecto
   ```

2. **Instala el hook** (versionado, viaja con el repo):
   ```bash
   mkdir -p scripts/hooks
   cp "C:\loki\Memoria-Claude\_hooks\post-commit" scripts/hooks/post-commit
   chmod +x scripts/hooks/post-commit
   git config core.hooksPath scripts/hooks
   ```

3. **Configura el hook**: abre `scripts/hooks/post-commit` y ajusta arriba:
   ```bash
   VAULT="/c/loki/Memoria-Claude"        # ruta del vault en formato Git Bash
   NOTE="Proyectos/POS CRM.md"           # la nota destino (debe existir con marcadores)
   SRC="docs/MEMORIA.md"                 # fuente dentro del repo
   ```

4. **Verifica que la nota destino** en `Proyectos/` tenga el bloque:
   ```
   <!-- MEMORIA:START -->
   <!-- MEMORIA:END -->
   ```
   (Las notas creadas con la plantilla de proyecto ya lo traen.)

5. **Prueba**:
   ```bash
   git add -A && git commit -m "docs: memoria del proyecto"
   ```
   En la salida debe aparecer `[memoria] sincronizado docs/MEMORIA.md -> Proyectos/POS CRM.md`. Abre la nota en Obsidian y confirma que el contenido está entre los marcadores.

## Notas
- **Windows:** los hooks corren con Git Bash; usa rutas tipo `/c/loki/...` dentro del hook.
- **Otras máquinas:** al clonar el repo, repite el paso 2 (`git config core.hooksPath scripts/hooks`) una vez.
- **Auto-guardar en el vault:** pon `SYNC_VAULT_COMMIT=1` en el hook para que el vault se committee solo tras sincronizar (déjalo en `0` si prefieres commitear el vault a mano).
- Para **tickets** ya existe su bloque; solo tendrías que crear su `docs/MEMORIA.md` y apuntar `NOTE="Proyectos/Sistema de Tickets.md"`.

## Enlaces
- [[00 Índice de Memoria]]
- [[Cómo consultar la memoria (proyecto)]]
