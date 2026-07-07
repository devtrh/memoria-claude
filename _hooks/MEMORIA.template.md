# <Nombre del proyecto>

Una o dos frases: qué es y para qué sirve.

## Alcance / temas
- Módulos y funcionalidades principales.

## Datos clave
> Solo datos reales. Esto es lo que otros proyectos consultarán para replicar.

- **Stack**: lenguajes, frameworks, BD, infra (p. ej. PostgreSQL · Node/Express · Vite/React + TS + Tailwind · Docker · Nginx).
- **Componentes reutilizables**: nombre + ruta + para qué sirve (p. ej. `DataTable` (`frontend/src/components/DataTable.tsx`) — tabla con orden/paginación; `Modal`, `DateField`, `Field`…). ⟵ *lo que replicas entre proyectos*
- **API**: base path y endpoints (p. ej. montada en `/api`: `auth`, `tickets`, `tareas`, `proyectos`…). Auth: JWT/roles/etc.
- **BD**: motor, host, esquema, tablas base y migraciones.
- **Deploy**: cómo se despliega (Docker/compose, contenedores, Nginx, base path, URL de prod, variables `.env`). ⟵ *lo que replicas entre proyectos*
- ⚠️ **Riesgos/secretos**: credenciales expuestas, cosas a rotar. No pegar secretos aquí.

## Datos / conexiones con otros proyectos
- Servicios, BD o auth que se comparten con otros nodos.

## Pendientes
- [ ] ...

## Registro de cambios
> Bitácora append-only. La entrada más reciente va ARRIBA.
- AAAA-MM-DD — qué cambió · por qué · archivos tocados.
