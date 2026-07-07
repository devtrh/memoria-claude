---
tipo: plantilla-prompt
tags: [memoria, prompt, claude-code]
actualizado: 2026-07-06
---

# 📋 Prompt para Claude Code — memoria de proyecto

Uso: abre Claude Code **dentro del repo** del proyecto y pega el bloque de abajo.
Reemplaza `<ÁREA>` (p. ej. Contabilidad, Legal, Ops) y `<EMOJI>` (p. ej. 📒, ⚖️, 🛠️).
Genera `docs/MEMORIA.md` con la misma estructura que los nodos del vault de Obsidian, y deja una regla en `CLAUDE.md` para que se actualice solo tras cada cambio.

---

```
Vas a crear y mantener un documento de MEMORIA de este proyecto. Objetivo: que sirva
como contexto recuperable y que se sincronice fácil a mi bóveda de Obsidian.

## 1. Crea el archivo `docs/MEMORIA.md`
Con EXACTAMENTE esta estructura (respeta título con emoji, la línea "Nodo principal
del área...", los callouts `>` y las 6 secciones; no agregues ni quites secciones):

---
tipo: proyecto
nombre: <ÁREA>
tags: [proyecto, <área-en-minúsculas>]
estado: activo
actualizado: <fecha de hoy YYYY-MM-DD>
---

# <EMOJI> <ÁREA>

Nodo principal del área <ÁREA>: <resumen del proyecto en una línea>.

## Alcance / temas
- <qué cubre el proyecto, en bullets cortos>

## Conversaciones relacionadas
- *Se enlazan al archivar sesiones; si no hay, conserva este placeholder.*

## Datos clave
> Datos duros del proyecto. Solo reales, verificados leyendo el repo. Cubre TODAS estas dimensiones (si alguna no aplica, escribe [pendiente]):
- **Stack**: lenguajes, frameworks, librerías clave y sus versiones.
- **Arquitectura general**: cómo se organiza (monorepo / servicios), flujo principal, patrones.
- **Backend**: framework, estructura de carpetas, servicios, autenticación, jobs/colas.
- **Frontend**: framework, routing, manejo de estado, estilos/UI, build.
- **Base de datos**: motor, nombre(s), esquema, tablas principales, migraciones.
- **Componentes reutilizables**: componentes UI / utilidades compartidas y dónde viven.
- **API / endpoints**: rutas montadas, agrupación por recurso, autenticación.
- **Despliegue / infra**: dónde corre (prod/dev), Docker/CI, dominios, puertos, variables de entorno.
- **Seguridad**: solo SEÑALAR riesgos (p. ej. secretos versionados). NUNCA pegar secretos.

## Datos / conexiones con otros proyectos
> Info que se cruza con otras áreas.
- <otra área> — <por qué se conecta>

## Pendientes
- [ ] <pendiente real>

## Registro de cambios
> Bitácora append-only. La entrada más reciente va ARRIBA.
- <YYYY-MM-DD> — <qué cambió> · por qué · archivos tocados.

## 2. Reglas para poblarlo (IMPORTANTE)
- Usa SOLO información real que puedas verificar leyendo el repo (README, manifiestos,
  código, migraciones, docs). NUNCA inventes datos, cifras ni nombres. Si falta un dato,
  escribe `[pendiente]`.
- Para maximizar cobertura, revisa al menos: `README`, manifiestos (`package.json`,
  `requirements.txt`, `pom.xml`, etc.), `docker-compose*/Dockerfile`, carpetas `backend/`
  y `frontend/` o `src/`, definición de rutas de API, migraciones/SQL, y archivos de
  config/CI (`.env.example`, `.github/`, `nginx`, etc.). No abras `.env` ni secretos.
- No leas ni copies secretos: si encuentras `.env`, credenciales o llaves, NO las pegues;
  solo anota su existencia como riesgo.
- Mantén el documento CONCISO: datos y decisiones, no volcados de código.
- Actualiza siempre el campo `actualizado:` del frontmatter cuando edites.

## 3. Deja una regla PERMANENTE en `CLAUDE.md`
Crea (o añade a) `CLAUDE.md` en la raíz esta sección, para que se mantenga solo:

## Memoria del proyecto
- Después de CADA cambio relevante (nueva feature, cambio de esquema/BD, endpoint,
  decisión de arquitectura, fix importante), agrega una entrada NUEVA arriba de la
  sección "## Registro de cambios" de `docs/MEMORIA.md` con: fecha, qué cambió, por qué
  y archivos tocados.
- Si el cambio afecta stack, BD, endpoints o pendientes, actualiza también esas secciones.
- Solo datos reales verificables. Nunca secretos. Mantenlo conciso.
- Actualiza el campo `actualizado:` con la fecha de hoy.

## 4. Al terminar
Muéstrame el `docs/MEMORIA.md` generado y confirma que agregaste la sección a `CLAUDE.md`.
No hagas commits salvo que te lo pida.
```

---

## Cómo sincronizarlo con esta bóveda
Cuando quieras traer la memoria de un proyecto al cerebro:
1. Ábreme el `docs/MEMORIA.md` del repo (o pégame su contenido).
2. Yo copio/actualizo el nodo correspondiente en `Memoria-Claude/Proyectos/`.
3. La sección "Datos / conexiones" se cruza con `[[enlaces]]` a los otros nodos.

> Como `docs/MEMORIA.md` usa la misma estructura que los nodos, el pegado es directo.

## Enlaces
- [[00 Índice de Memoria]]
- [[Cómo alimentar la memoria]]
