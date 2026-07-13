---
tipo: guia
titulo: Subir conversaciones de un proyecto a la memoria
tags: [memoria, guia, conversaciones, transcripts, proceso]
actualizado: 2026-07-13
---

# 📥 Subir conversaciones de un proyecto a la memoria

Guía para replicar en **cualquier proyecto** lo que ya se hizo con [[Gestión (Tesorería)]]: dejar en la memoria (este vault) **todas las conversaciones** de Claude Code de ese proyecto, en dos formatos, para que cualquiera del equipo tenga el contexto:

1. **Transcript legible** (la conversación real usuario/Claude, sin ruido de herramientas) → `Conversaciones/transcripts/`.
2. **Nota-resumen curada** por sesión → `Conversaciones/` (formato `AAAA-MM-DD - Título.md`).

El script `exportar-conversaciones.cjs` automatiza el paso 1 (transcripts + índice navegable) desde los `.jsonl` de Claude Code. El paso 2 (resúmenes) es a mano, leyendo cada transcript.

> [!tip] Precedente
> El caso completo ya resuelto es Gestión: ver [[_Índice de transcripts — Gestión (Tesorería)]] y las notas en `Conversaciones/`.

---

## De dónde salen las conversaciones

Claude Code guarda un `.jsonl` por sesión en:

```
C:\Users\Diego\.claude\projects\<carpeta-del-proyecto>\
```

El nombre de `<carpeta-del-proyecto>` es la ruta de trabajo del repo con los separadores (`:`, `\`, `/`, espacios) convertidos a `-`. En este equipo (2026-07-13):

| Proyecto (nodo del vault) | Carpeta en `~/.claude/projects/` | Sesiones |
|---|---|:--:|
| [[Gestión (Tesorería)]] ✅ hecho | `c--Users-Diego-Documents-GitHub-gestion-react-gestion-financiera` | 20 |
| [[POS CRM]] | `c--Users-Diego-Documents-GitHub-CRM-pos-crm` | 4 |
| [[Legal]] | `c--Users-Diego-Documents-GitHub-legal` | 3 |
| (SAT API / CFDI) | `c--Users-Diego-Documents-GitHub-sat-api` | 5 |
| Firma electrónica | `c--Users-Diego-Documents-GitHub-firma-electronica` | 1 |
| Recibos nómina | `c--Users-Diego-Documents-GitHub-recibos-nomina-web-recibos-react-recibos` | 1 |
| Reportes Vértice | `c--Users-Diego-Documents-GitHub-reportes-vertice` | 1 |
| [[Ops]] | `c--Users-Diego-Documents-GitHub-operaciones` | 0 |
| [[Sistema de Tickets]] | `c--Users-Diego-Documents-GitHub-tickets` | 0 |

> Ops y Tickets tienen **0** `.jsonl` en su carpeta (esas sesiones no corrieron desde ese `cwd`). Verifica el conteo antes de empezar:
> ```powershell
> (Get-ChildItem "$env:USERPROFILE\.claude\projects\<carpeta>\*.jsonl").Count
> ```

---

## Paso 1 — Exportar los transcripts (automático)

Desde la raíz del vault (`C:\obsidian\memoria-claude`):

```powershell
node "_scripts\exportar-conversaciones.cjs" `
  "$env:USERPROFILE\.claude\projects\<carpeta-del-proyecto>" `
  "C:\obsidian\memoria-claude\Conversaciones\transcripts" `
  --proyecto "<Nombre del proyecto>" `
  --skip <session-id-activa>
```

Equivalente en Git Bash:

```bash
node _scripts/exportar-conversaciones.cjs \
  "$HOME/.claude/projects/<carpeta-del-proyecto>" \
  "c:/obsidian/memoria-claude/Conversaciones/transcripts" \
  --proyecto "<Nombre del proyecto>"
```

Ejemplos reales:

```powershell
# POS CRM
node "_scripts\exportar-conversaciones.cjs" "$env:USERPROFILE\.claude\projects\c--Users-Diego-Documents-GitHub-CRM-pos-crm" "C:\obsidian\memoria-claude\Conversaciones\transcripts" --proyecto "POS CRM"

# Legal
node "_scripts\exportar-conversaciones.cjs" "$env:USERPROFILE\.claude\projects\c--Users-Diego-Documents-GitHub-legal" "C:\obsidian\memoria-claude\Conversaciones\transcripts" --proyecto "Legal"

# SAT API
node "_scripts\exportar-conversaciones.cjs" "$env:USERPROFILE\.claude\projects\c--Users-Diego-Documents-GitHub-sat-api" "C:\obsidian\memoria-claude\Conversaciones\transcripts" --proyecto "SAT API"
```

Qué produce (en `Conversaciones/transcripts/`):
- Un `AAAA-MM-DD - Título [id8].md` por sesión (conversación legible; los nombres llevan el `id` corto → **no colisionan entre proyectos**).
- `_Índice de transcripts — <Proyecto>.md` — tabla navegable que **cruza cada transcript con su nota-resumen** (por `session_id`).
- `_index-<proyecto>.json` — índice de máquina.

Opciones útiles: `--skip <id>` (omite una sesión, p. ej. la activa), `--min-turnos 2` (ignora consultas de 1 turno), `--no-tools` (sin la línea de herramientas), `--resumenes <dir>` (dónde buscar las notas-resumen; por defecto la carpeta padre = `Conversaciones/`).

> [!warning] No borres la carpeta
> `transcripts/` es **compartida** entre proyectos. El script **sobrescribe por nombre de archivo**; NO hagas `rm *.md` ahí (borrarías los transcripts de otros proyectos).

### Cómo saber la session-id activa (para `--skip`)
Es el `.jsonl` con fecha de modificación más reciente (la sesión abierta):
```powershell
Get-ChildItem "$env:USERPROFILE\.claude\projects\<carpeta>\*.jsonl" | Sort-Object LastWriteTime -Desc | Select-Object -First 1 Name
```
El nombre sin `.jsonl` es la session-id. (Opcional: solo evita exportar una conversación a medias.)

---

## Paso 2 — Crear las notas-resumen faltantes (a mano)

El índice del Paso 1 marca con "—" en la columna **Resumen curado** las sesiones que **aún no tienen** nota. Para cada una:

1. Abre su transcript (ya es corto y legible).
2. Crea `Conversaciones/AAAA-MM-DD - Título.md` con la plantilla [[Plantilla Conversacion]]:
   - Frontmatter con `session_id` **igual** al de la sesión (así el índice la cruza automáticamente en la próxima corrida).
   - `Resumen` (callout), `Contexto`, `Puntos clave / decisiones`, `Pendiente`, y en `Enlaces` el link al transcript:
     ```markdown
     - Transcript: [📄 conversación completa](<transcripts/AAAA-MM-DD - Título [id8].md>)
     ```
3. Vuelve a correr el Paso 1 (es idempotente): el índice ahora enlazará el resumen.

> Sesiones de 1 turno o consultas triviales: un resumen de 3 líneas basta. Prioriza las de más turnos.

---

## Paso 3 — Registrar en los índices del vault

- Agrega las conversaciones nuevas a la tabla **Conversaciones registradas** de [[00 Índice de Memoria]].
- Si el proyecto tiene muchas sesiones, considera una nota "Compilado de sesiones — <Proyecto>" (como [[2026-07-07 - Compilado sesiones Gestión (Tesorería)]]).
- Si aplica, menciona en el nodo del proyecto (`Proyectos/<Proyecto>.md`) que ya hay transcripts.

---

## Paso 4 — Subir (commit + push)

Desde la raíz del vault:

```powershell
cd C:\obsidian\memoria-claude
git add "Conversaciones/" "_scripts/" "00 Índice de Memoria.md"
git commit -m "memoria(<proyecto>): transcripts + resúmenes de conversaciones"
git pull --rebase
git push
```

El vault se sincroniza al equipo por Syncthing/rclone (ver [[README - sync memoria]] y [[Sincronizar vault con servidor (rclone bisync)]]). Con eso, cualquier compañero que abra el vault tendrá el contexto.

---

## Notas y gotchas
- **Seguridad:** el script **enmascara secretos evidentes** como `«REDACTADO»` (patrones `password:`/`PGPASSWORD=`, credenciales entre backticks, cadenas de conexión `user:pass@host`, JWT, llaves privadas, y tokens con forma de contraseña). Aun así, **revisa** el resultado antes de subir: `grep -rIn "«REDACTADO»"` para ver qué se ocultó, y busca cualquier secreto que se te ocurra que pueda haber quedado. Si aparece una credencial real de infraestructura (como pasó con la contraseña de BD de prod), **rótala** además de redactarla.
- El script **solo** exporta texto de usuario y de Claude; ignora `tool_use`/`tool_result`, `thinking`, sidechains de subagentes, mensajes `isMeta` y los bloques inyectados (`<system-reminder>`, comandos, selección del IDE).
- Fusiona turnos consecutivos del mismo rol para que lea corrido; deja una línea compacta *(Herramientas: …)* por turno de Claude.
- Los `.jsonl` grandes (decenas de MB) se reducen a cientos de KB de texto — sin problema.
- Una sesión larga puede aparecer con **varias ramas git**; es normal (se reusó a lo largo de días). Una misma `session_id` puede estar resumida en más de una nota (tareas distintas dentro de la sesión) — el índice las lista todas.
- Sesiones viejas ya **purgadas** (sin `.jsonl`) no se pueden recuperar; solo sobreviven si quedaron en un compilado.

## Enlaces
- Script: `_scripts/exportar-conversaciones.cjs`
- Ejemplo hecho: [[_Índice de transcripts — Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
