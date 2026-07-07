---
tipo: plantilla-prompt
tags: [memoria, prompt, claude-code]
actualizado: 2026-07-06
---

# 📋 Prompts por proyecto (Claude Code)

Abre Claude Code **dentro del repo** de cada proyecto y pega el bloque correspondiente.
Genera/actualiza `docs/MEMORIA.md` (memoria de contexto) y deja una regla en `CLAUDE.md`
para que se actualice solo tras cada cambio. La versión completa está en
[[Prompt Claude Code - memoria de proyecto]].

> Todos cubren las 9 dimensiones en "Datos clave": Stack · Arquitectura general · Backend ·
> Frontend · Base de datos · Componentes reutilizables · API/endpoints · Despliegue/infra · Seguridad.

---

## Base (referencia — cada bloque de abajo ya trae estos valores)
```
Crea/actualiza `docs/MEMORIA.md` como memoria de contexto de ESTE proyecto, leyendo el repo:
README, manifiestos (package.json/requirements/pom...), docker-compose*/Dockerfile,
carpetas backend/ y frontend/ o src/, definición de rutas de API, migraciones/SQL y
config/CI. NO abras .env ni secretos. Usa SOLO datos reales; si falta algo, escribe [pendiente].

Estructura EXACTA (frontmatter + estas secciones; no agregues ni quites secciones):
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
- <bullets>
## Conversaciones relacionadas
- *Se enlazan al archivar sesiones.*
## Datos clave
Cubre con datos reales ([pendiente] si no aplica): **Stack**, **Arquitectura general**,
**Backend**, **Frontend**, **Base de datos** (motor/tablas/migraciones), **Componentes
reutilizables**, **API/endpoints**, **Despliegue/infra**, **Seguridad** (solo señalar
riesgos; NUNCA pegar secretos).
## Datos / conexiones con otros proyectos
- <otras áreas + por qué>
## Pendientes
- [ ] <reales>
## Registro de cambios
> Append-only, lo más reciente arriba: <fecha> — qué cambió · por qué · archivos.

Nunca inventes. Sé conciso. Luego agrega a `CLAUDE.md` esta regla permanente:
"Tras cada cambio relevante, agrega una entrada arriba de '## Registro de cambios' de
docs/MEMORIA.md (fecha, qué, por qué, archivos), actualiza Datos clave/Pendientes y el
campo actualizado. Solo datos reales, nunca secretos."
Muéstrame el archivo y NO hagas commits salvo que lo pida.
```

---

## Gestión (Tesorería) — nodo [[Gestión (Tesorería)]]
Usa el prompt Base con: `<ÁREA>=Gestión (Tesorería)`, `<EMOJI>=💰`, `<slug>=gestion`.

## Contabilidad — nodo [[Contabilidad]]
Usa el prompt Base con: `<ÁREA>=Contabilidad`, `<EMOJI>=📒`, `<slug>=contabilidad`.

## Legal — nodo [[Legal]]
Usa el prompt Base con: `<ÁREA>=Legal`, `<EMOJI>=⚖️`, `<slug>=legal`.

## Seguimiento de Proyectos — nodo [[Seguimiento de Proyectos]]
Usa el prompt Base con: `<ÁREA>=Seguimiento de Proyectos`, `<EMOJI>=📊`, `<slug>=seguimiento`.

## Ops — nodo [[Ops]]
Usa el prompt Base con: `<ÁREA>=Ops`, `<EMOJI>=🛠️`, `<slug>=ops`.

## Checador — nodo [[Checador]]
Usa el prompt Base con: `<ÁREA>=Checador`, `<EMOJI>=🕒`, `<slug>=checador`.

## Sistema de Tickets — nodo [[Sistema de Tickets]]
Ya tiene `docs/MEMORIA.md` (nombre interno `ticketTI`, 🎫). Re-corre el Base para
regenerarlo con las 9 dimensiones separadas si lo deseas.

---

## Después de generar el MEMORIA.md
1. Instala el hook para que alimente el vault en cada commit:
   `powershell -ExecutionPolicy Bypass -File "C:\loki\Memoria-Claude\_scripts\install-memoria-hook.ps1" -Repo "<ruta>" -Node "<nodo>"`
2. Ver [[README - sync memoria]].

## Enlaces
- [[00 Índice de Memoria]]
- [[Prompt Claude Code - memoria de proyecto]]
