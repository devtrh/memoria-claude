---
tipo: plantilla
tags: [memoria, claude-code, comando, onboarding]
actualizado: 2026-07-06
---

# ⚙️ Comando de Claude Code: /actualizar-memoria

Comando versionado en el repo para que TODO el equipo mantenga `docs/MEMORIA.md` igual,
sin pegar prompts a mano.

## Instalar en un repo
Crea el archivo `.claude/commands/actualizar-memoria.md` en la raíz del repo con el
contenido de abajo, y haz commit para que todos lo tengan al clonar.

## Uso
Dentro del repo, en Claude Code:
```
/actualizar-memoria
/actualizar-memoria "migré el Gantt al modelo WBS"
```

## Contenido del archivo `.claude/commands/actualizar-memoria.md`
````
---
description: Genera o actualiza docs/MEMORIA.md (memoria de contexto del proyecto) leyendo el repo
argument-hint: "[nota opcional del cambio]"
---

Actualiza la memoria de contexto de ESTE proyecto en `docs/MEMORIA.md`.

## Qué leer (para máxima cobertura, sin inventar)
Revisa: `README`, manifiestos (`package.json`/`requirements.txt`/`pom.xml`/…),
`docker-compose*`/`Dockerfile`, carpetas `backend/` y `frontend/` o `src/`, la definición
de rutas de API, migraciones/SQL y config/CI (`.env.example`, `.github/`, `nginx`…).
NO abras `.env` ni ningún secreto. Usa SOLO datos reales verificables; si falta algo, `[pendiente]`.

## Estructura EXACTA de `docs/MEMORIA.md` (no agregues ni quites secciones)
```
---
tipo: proyecto
nombre: <nombre del proyecto>
tags: [proyecto, <slug>]
estado: activo
actualizado: <hoy YYYY-MM-DD>
---
# <emoji> <nombre>
Nodo principal del área <nombre>: <resumen en una línea>.
## Alcance / temas
## Conversaciones relacionadas
- *Se enlazan al archivar sesiones.*
## Datos clave
(cubre con datos reales, [pendiente] si no aplica): **Stack**, **Arquitectura general**,
**Backend**, **Frontend**, **Base de datos** (motor/tablas/migraciones), **Componentes
reutilizables**, **API/endpoints**, **Despliegue/infra**, **Seguridad** (solo señalar
riesgos; NUNCA pegar secretos).
## Datos / conexiones con otros proyectos
## Pendientes
## Registro de cambios
> Append-only, lo más reciente ARRIBA: <fecha> — qué cambió · por qué · archivos.
```

## Reglas
- Si `docs/MEMORIA.md` ya existe, actualízalo: refresca lo que cambió y **antepone** una
  entrada nueva en "Registro de cambios". No borres el historial.
- Si se pasó una nota como argumento ($ARGUMENTS), úsala como resumen del cambio.
- Actualiza `actualizado:` con la fecha de hoy. Conciso. Nunca inventes ni pegues secretos.
- Muéstrame el resultado. NO hagas commits salvo que te lo pida.
````

## Enlaces
- [[00 Índice de Memoria]]
- [[Onboarding compañero (memoria)]]
