---
tipo: proyecto
nombre: POS CRM
tags: [proyecto, pos, crm]
stack: []
ruta_local: 
repo: https://github.com/devtrh/pos-crm.git
estado: activo
actualizado: 2026-07-06
---

# POS CRM

Proyecto nuevo: sistema de punto de venta (POS) + CRM. Nodo recién creado; los datos técnicos (stack, BD, endpoints) se completarán cuando haya código en el repo.

## Ubicación
- **Repositorio:** https://github.com/devtrh/pos-crm.git
- **Ruta local:** _por confirmar_

## Conversaciones relacionadas
- [[2026-07-06 - Auditoria UX proyecto tickets]] — sesión donde se dio de alta este nodo.

## Datos / conexiones con otros proyectos
> Info que se cruza con otras áreas (curado a mano). Usa [[enlaces]].
- Posible autenticación compartida → [[Usuarios AUD (autenticación)]] (por confirmar).
- Mismo owner de repo (`devtrh`) que [[Sistema de Tickets]].

## Pendientes
- [ ] Confirmar ruta local del proyecto en la máquina.
- [ ] Definir/registrar el stack cuando arranque el desarrollo.
- [ ] Configurar el git hook de memoria (bloque `MEMORIA` auto) como en [[Sistema de Tickets]].

## Enlaces
- [[00 Índice de Memoria]]
- [[POS CRM - API.base|Endpoints del API (Base)]] — catálogo de los 84 endpoints, generado desde el código.

## Memoria del repo (auto — la actualiza el git hook; no editar a mano)
> Sincronizado desde `docs/MEMORIA.md` del repo en cada commit.
<!-- MEMORIA:START -->
---
tipo: proyecto
nombre: POS CRM
tags: [proyecto, pos-crm]
estado: activo
actualizado: 2026-07-06
---

# 💳 POS CRM

Nodo principal del área POS CRM: CRM de terminales punto de venta (clientes, prospectos, ventas/transacciones Atena, pagos, cortes y soporte) con frontend React y API Express + PostgreSQL servidos desde un mismo contenedor.

## Alcance / temas
- Gestión de clientes, prospectos, terminales POS y tickets de soporte.
- Ventas/transacciones: carga por layout, alta manual y recepción por webhook Atena (SERTI/Feenicia).
- Pagos, cortes, liquidaciones, dispersión interna y conciliación; comprobantes CEP.
- Autenticación con roles (admin/gerente/agente) + usuario viewer de solo lectura.
- Integración n8n para Citas + Google Calendar; análisis geográfico con mapas.

## Conversaciones relacionadas
- *Se enlazan al archivar sesiones.*

## Datos clave
- **Stack**: React 18 + React Router 6, Vite 5, Tailwind 3, Recharts, Leaflet/react-leaflet, react-simple-maps, Lucide React (frontend). Node + Express 4, PostgreSQL (`pg` 8), `jsonwebtoken`, `bcryptjs`, CORS (backend). PostgreSQL 16 (Docker) / 14+ (esquema).
- **Arquitectura general**: monolito servido por un solo proceso Express que expone la API REST y sirve el build estático de React (`/dist`). Rutas montadas en `/api/...` y espejadas en `${CRM_BASE_PATH}/api/...` (por defecto `/crm/api`). En dev, Vite (5173) hace proxy de `/api` → Express (3001). Ver [api/index.js](../api/index.js), [vite.config.js](../vite.config.js).
- **Backend**: [api/](../api/) — Express con routers por recurso en [api/routes/](../api/routes/), pool `pg` en [api/db.js](../api/db.js), middleware `requireAuth` (JWT) y `blockViewerWrites` (bloquea escrituras del rol viewer). Scripts: `npm start`, `npm run dev` (node --watch), `node api/seed-users.js` para el usuario inicial (bcrypt). Body limit 140mb (documentos base64).
- **Frontend**: [src/](../src/) — SPA con `App.jsx` (router) y páginas en [src/pages/](../src/pages/): Dashboard, Ventas, Terminales, Clientes, Prospectos, Pagos, Citas, Análisis, DispersionInterna, Soporte, Ajustes, Info, Login, ClientePublico. Contextos `AppContext` y `AuthContext`. Scripts: `npm run dev|build|preview`.
- **Base de datos**: PostgreSQL. Esquema base [database/schema.sql](../database/schema.sql) con tablas `app_settings`, `clientes`, `cliente_contactos`, `cliente_documentos`, `terminales`, `prospectos`, `prospecto_actividades`, `ventas`, `pagos`, `tickets` (+ índices y triggers `updated_at`). Auth en [database/migrate_auth.sql](../database/migrate_auth.sql): `usuarios`, `password_reset_tokens`. Migraciones en [database/migrations/](../database/migrations/): `001_extend_ventas_atena.sql` (campos/flags Atena en `ventas`, índice único `detail_control_id`), `002_atena_merchants.sql` (`atena_merchants` merchant→cliente/terminal). En Docker, `schema.sql` se auto-carga vía `docker-entrypoint-initdb.d`.
- **Componentes reutilizables**: [src/components/](../src/components/) — `UI.jsx` (Badge, StatCard, Table, Btn, Avatar…), `Layout.jsx` (Sidebar + Topbar), `BulkImportModal`, `PeriodoSelector`, `CuentasBancariasEditor`, `CepComprobantesUploader`, mapas `ChoroplethMap`/`PurchaseMap`. Librerías en [src/lib/](../src/lib/): `conciliacion`, `cortes`, `xlsxExport`/`xlsxLayout`.
- **API/endpoints**: recursos bajo `/api/` — `auth`, `pub` (snapshots públicos), `webhook/atena` (autenticado por header `X-Webhook-Secret`), `clientes`, `prospectos`, `terminales`, `tickets`, `citas`, `settings`, `proveedores`, `promotores`, `ventas`, `transacciones`, `cortes`, `liquidaciones`, `pagos`, `pagos-internos`, `cep`, `atena-merchants`. Health: `GET /api/health`. Ej. `GET /api/ventas?origen=&tipo_tx=SALE|CANCEL|REVERSAL|REFUND&limit=` (default 500, máx 2000).
- **Despliegue/infra**: Docker Compose ([docker-compose.yml](../docker-compose.yml)) con `db` (postgres:16-alpine, puerto host 5433) y `api` (build `Dockerfile.api`, publica `API_PORT`→3001, por defecto 3777, `extra_hosts` host.docker.internal para n8n en 5678). Volumen `poscrm_postgres_data`. Helper Windows [deploy.ps1](../deploy.ps1) (`-ApiPort`, `-RecreateDb`). CI: [pendiente] (no hay workflows).
- **Seguridad** (solo riesgos, sin pegar secretos): existen `.env` y `webhook/jwt.json` con secretos reales — no versionar/exponer. Variables sensibles (documentadas en `.env.example`, no leídas aquí): `POSTGRES_PASSWORD`, `N8N_WEBHOOK_PASSPHRASE`, `ATENA_WEBHOOK_INTERNAL_SECRET`, `AUTH_VIEWER_PASSWORD`, JWT secret. `docker-compose.yml` trae defaults de contraseña de dev (`poscrm_secret`) que deben sobrescribirse en prod. CORS abierto (`cors()` sin restricción de origen).

## Datos / conexiones con otros proyectos
- Atena (SERTI/Feenicia) — origen de transacciones TPV recibidas por webhook; el `merchant_id` identifica usuario/TPV y se mapea a cliente/terminal en `atena_merchants`.
- n8n (`n8n.datazentrika.com` / interno `host.docker.internal:5678`) — orquesta webhooks de Citas + Google Calendar y reenvía notificaciones Atena al CRM.
- Obsidian — este documento se sincroniza como nodo de proyecto a la bóveda.

## Pendientes
- [ ] Definir/añadir pipeline CI (no existe `.github/workflows`).
- [ ] [pendiente] Confirmar pendientes funcionales reales del proyecto con el equipo.

## Registro de cambios
> Append-only, lo más reciente arriba: <fecha> — qué cambió · por qué · archivos.
- 2026-07-06 — Reestructurado `docs/MEMORIA.md` a subsecciones de Datos clave (Stack, Arquitectura, Backend, Frontend, BD, Componentes, API, Despliegue, Seguridad) tras leer docker-compose, vite.config y rutas · para memoria de contexto más completa y verificable · docs/MEMORIA.md.
- 2026-07-06 — Se crea `docs/MEMORIA.md` como nodo de memoria del proyecto · para tener contexto recuperable y sincronizable a Obsidian · docs/MEMORIA.md, CLAUDE.md.
<!-- MEMORIA:END -->
