---
tipo: plantilla
tags: [memoria, plantilla, prompt, claude-code, git]
actualizado: 2026-07-06
---

# 🧩 Prompt — configurar memoria en un repo

Pégalo en Claude Code **abriendo el proyecto** (en su carpeta). Deja el sistema de memoria
Obsidian igual que en [[POS CRM]]: `docs/MEMORIA.md` en el repo + hook `post-commit` que lo
sincroniza al nodo del vault.

Ver también: [[Cómo consultar la memoria (proyecto)]] · [[Cómo alimentar la memoria]] · `_hooks/INSTALAR.md`.

## Prompt (copiar)

````text
Configura el sistema de memoria Obsidian de ESTE proyecto (igual que en pos-crm).

Vault: C:\loki\Memoria-Claude  (Git Bash: /c/loki/Memoria-Claude)
La plantilla y el hook base están en su carpeta _hooks/.

Reglas: usa SOLO datos reales que verifiques leyendo el repo (README, manifiestos,
docker-compose/Dockerfile, rutas de API, migraciones/SQL, config/CI). NUNCA leas .env
ni secretos: solo anota su existencia como riesgo. Si falta un dato, escribe [pendiente].
Sé conciso. NO hagas commits salvo que te lo pida.

1) Define <ÁREA> = nombre del proyecto y su nodo en el vault: Proyectos/<ÁREA>.md
   - Si el nodo NO existe, créalo a partir de _hooks/MEMORIA.template.md y ASEGÚRATE
     de que tenga el bloque:
       <!-- MEMORIA:START -->
       <!-- MEMORIA:END -->

2) Crea/actualiza docs/MEMORIA.md con EXACTAMENTE este frontmatter y estas secciones
   (no agregues ni quites secciones):
   ---
   tipo: proyecto
   nombre: <ÁREA>
   tags: [proyecto, <slug>]
   estado: activo
   actualizado: <hoy YYYY-MM-DD>
   ---
   # <EMOJI> <ÁREA>
   Nodo principal del área <ÁREA>: <resumen en una línea>.
   ## Alcance / temas
   ## Conversaciones relacionadas
   - *Se enlazan al archivar sesiones.*
   ## Datos clave
   (cubre con datos reales, [pendiente] si no aplica: **Stack**, **Arquitectura general**,
    **Backend**, **Frontend**, **Base de datos** (motor/tablas/migraciones),
    **Componentes reutilizables**, **API/endpoints**, **Despliegue/infra**,
    **Seguridad** — solo señalar riesgos, NUNCA pegar secretos)
   ## Datos / conexiones con otros proyectos
   ## Pendientes
   ## Registro de cambios
   > Append-only, lo más reciente arriba: <fecha> — qué cambió · por qué · archivos.

3) Instala el hook post-commit (versionado, viaja con el repo):
   mkdir -p scripts/hooks
   cp "/c/loki/Memoria-Claude/_hooks/post-commit" scripts/hooks/post-commit
   chmod +x scripts/hooks/post-commit
   git config core.hooksPath scripts/hooks
   Luego edita en scripts/hooks/post-commit la variable NOTE="Proyectos/<ÁREA>.md"
   (VAULT y SRC ya vienen bien; SYNC_VAULT_COMMIT=1 = auto-commit+push del vault).

4) Añade/asegura en CLAUDE.md del repo esta regla:
   "Tras cada cambio relevante, agrega una entrada arriba de '## Registro de cambios' de
    docs/MEMORIA.md (fecha, qué, por qué, archivos), actualiza Datos clave/Pendientes y el
    campo actualizado. Solo datos reales, nunca secretos."

5) Corre el 'doctor' y repórtame OK/FALTA de cada punto (usa comandos propios, NO ejecutes
   el script del vault):
   - docs/MEMORIA.md existe y está trackeado
   - remoto git configurado (git remote get-url origin)
   - git config core.hooksPath == scripts/hooks
   - scripts/hooks/post-commit existe
   - Proyectos/<ÁREA>.md existe y contiene "MEMORIA:START"

6) Si es un proyecto con API, ofréceme además generar un Obsidian .base con el catálogo de
   endpoints REALES (método, ruta, auth) extraídos del código, como en
   "POS CRM - API.base".

Muéstrame docs/MEMORIA.md al terminar. NO commitees hasta que yo lo pida.
Recuerda: al clonar en otra máquina hay que correr una vez `git config core.hooksPath scripts/hooks`.
````

## Enlaces
- [[00 Índice de Memoria]]
- [[POS CRM]]
