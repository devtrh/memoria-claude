---
tipo: proyecto
nombre: Gestión (Tesorería)
aliases: [Tesorería]
tags: [proyecto, gestion, tesoreria, finanzas]
proyecto_codigo: gestion
bd: tesoreria
estado: activo
actualizado: 2026-07-14
---

# 💰 Gestión (Tesorería)

Nodo principal del área Gestión (Tesorería): sistema del proyecto `gestion` que cubre tesorería, cuentas bancarias, catálogo de clientes, nóminas y efectivos.

## Alcance / temas
- Tesorería y control de efectivos.
- Ingesta y enriquecimiento de movimientos por 4 flujos: (1) estados de cuenta PDF, (2) comprobantes SPEI "Tarik/Efectivos", (3) verificación de CEP en Banxico, (4) captura por Excel/layout.
- Cuentas bancarias y estados de cuenta (matriz de saldos con carry-forward, vista previa de estado de cuenta).
- Catálogo de clientes (tabla `catalogo_clientes`, BD `tesoreria`) y su conciliación.
- Nóminas.
- Carga y borrado masivo de movimientos de tesorería 2026.
- Roles y control de acceso (admin, tesorero, rol control JR, rol Impulse de usuarios).

## Conversaciones relacionadas
> Compiladas el 2026-07-07 desde 28 sesiones de Claude Code (2026-05-20 → 07-07). Índice completo: [[2026-07-07 - Compilado sesiones Gestión (Tesorería)]].

**Sesiones clave (nota propia):**
- [[2026-05-20 - OCR robusto de comprobantes (SitesPay)]]
- [[2026-06-07 - Extractores bancarios — bugs, corrección y reproceso]]
- [[2026-06-15 - Flujo Tarik — frontales, caja, saldos y retornos]]
- [[2026-06-19 - Haberes — filtro por proveedor con vista unificada]]
- [[2026-06-19 - Relación automática de movimientos Tarik y Catania]]
- [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]]
- [[2026-06-23 - Soporte extractor SANTANDER-PYME (2 columnas)]]
- [[2026-06-24 - Impulse — verificación masiva de comprobantes]]
- [[2026-06-24 - Catálogo de Clientes — búsqueda por CLABE y multi-cuenta]]
- [[2026-06-24 - Corrección de 12 movimientos con signo invertido]]
- [[2026-06-25 - Homologar cambios del equipo y subir a git]]
- [[2026-07-06 - Ingesta de estados de cuenta junio 2026]]

**Documentos fuente:**
- Documento fuente: `docs/Clientes/Conciliacion clientes OPS 2026.md` (conciliación catálogo OPS 2026).
- Documento fuente: `docs/flujo_automatizacion.md` (flujos de automatización de tesorería).
- Documento fuente: `docs/superpowers/plans/2026-05-28-tesoreria-2026-carga-y-borrado-masivo.md` (plan de carga masiva + borrado).

## Datos clave
> Datos duros extraídos de los documentos del proyecto (fecha 2026-07-06). No inventados.
- **Stack:** Node 18+ (CJS), Express, PostgreSQL (`pg`), React + TypeScript, Vite, Tailwind. Backend en `http://localhost:4000`, front en `:3000`.
- **BD:** `tesoreria`. Tablas clave: `catalogo_clientes` (**377 registros**), `movimientos_bancarios`, `movimientos_efectivo`, `tarik_movimientos`, `tarik_frontales`, `catalogo_clientes_tarik`, `catalogo_bancos`, `usuarios`, `roles`.
- **Conciliación OPS 2026:** 57 ya registrados · 8 dudosos · 11 faltantes por dar de alta.
- **Ejecutivos del catálogo:** Rosa → **ROSSY**, Nancy Arias → **NANCY** (misma persona); también Marco y Xochitl. Match por normalización (mayúsculas, sin acentos, sin sufijos legales), no literal.
- **Flujo 1 — Estados de cuenta PDF:** `desfragmentador.js` en VM sandbox; detecta 13+ bancos (BBVA, Banorte, Santander, BanBajío, Banregio, HSBC, Multiva, Kuspit, BX+, Peibo, Inbursa, Afirme, STP) → INSERT `movimientos_bancarios` (`fuente=analisis-pdf`).
- **Flujo 2 — Tarik/SPEI:** `parsarComprobanteText` + Tesseract.js OCR; 9 bancos → `movimientos_efectivo` + `tarik_*`.
- **Flujo 3 — CEP Banxico:** `parsarComprobanteCep`; verificación en vivo contra Banxico (`valida.do`), descarga PDF CEP o Reporte de Estado de Pago.
- **Flujo 4 — Captura Excel:** `POST /api/captura/importar-layout` → `movimientos_bancarios` (`fuente=manual`). Borrado masivo: `DELETE /api/captura/movimientos` (solo admin; rol `tesorero` recibe 403).
- **Catálogo de empresas AUD:** 80+ (AILEC, CARDINAL, BALOVENTO, APJ, …) para match de empresa.
- **Nota de repo:** sin framework de tests (scripts `node *.test.js`) y sin commits aún; hay data sensible sin trackear.
- **Autenticación:** usa los mismos **usuarios de AUD** que el resto de proyectos → [[Usuarios AUD (autenticación)]].

## Datos / conexiones con otros proyectos
> Info que se cruza con otras áreas. Usa [[enlaces]].
- [[Contabilidad]] — conciliación de movimientos bancarios y asientos.
- [[Ops]] — el catálogo de clientes proviene de la lista "OPS 2026".


## Pendientes
- [ ] Dar de alta los **11 clientes faltantes** del catálogo.
- [ ] Resolver los **8 clientes dudosos**.
- [ ] Generar `INSERT` para lo aprobado en `catalogo_clientes`.

## Enlaces
- [[Gestión (Tesorería) - API.base|Catálogo de endpoints (API)]] — 252 endpoints reales extraídos del código.
- [[Asistente de consulta - saldos (spec)]] — spec del asistente de consulta de saldos (BD + memoria).
- [[00 Índice de Memoria]]

## Historial de commits (auto — la actualiza el git hook; no editar a mano)
> Una entrada por commit: fecha/hora, hash, mensaje y archivos.
<!-- COMMITS:START -->
<!-- COMMITS:END -->

## Memoria del repo (auto — la actualiza el git hook; no editar a mano)
> Sincronizado desde `docs/MEMORIA.md` en cada commit.
<!-- MEMORIA:START -->
---
tipo: proyecto
nombre: Gestión (Tesorería)
tags: [proyecto, gestion]
estado: activo
actualizado: 2026-07-14
---
# 💰 Gestión (Tesorería)
Nodo principal del área Gestión (Tesorería): app web de tesorería (bancos, haberes, adeudos, gastos, inversiones, nómina, cuentas, efectivos, operaciones) con OCR de CEP y chat interno.

## Alcance / temas
- Tesorería: dashboard de bancos, clasificación de movimientos, haberes, adeudos, gastos, inversiones.
- Nómina: colaboradores, auto-match por CLABE/cuenta, cálculo y prorrateo.
- Cuentas / Matriz de saldos: estados de cuenta, directorio de entidades, grupos, empresas.
- Efectivos y Externos (caja manual + proveedores Tarik) y verificación masiva CEP (Impulse/BANREGIO).
- Operaciones: clientes, solicitudes de pago, saldos; chat interno con adjuntos (SSE).
- Captura de datos por tesoreros, roles y permisos, solicitudes de pago por correo.

## Conversaciones relacionadas
- *Se enlazan al archivar sesiones.*

## Datos clave
- **Stack**: Frontend React 19 + TypeScript ~5.8 + Vite 6 + Tailwind 4 + `motion` + `recharts` + `lucide-react`; utilidades `xlsx`, `jszip`, `pdf-lib`, `@google/genai`. Backend Node.js (CommonJS) + Express 4 + PostgreSQL (`pg`), con `tesseract.js` (OCR), `pdf-parse`/`pdfkit`, `exceljs`, `bcryptjs`, `jsonwebtoken`, `multer`, `natural` (fuzzy), `@anthropic-ai/sdk`. (`better-sqlite3` figura en deps del root.)
- **Arquitectura general**: Monorepo con dos servicios. Frontend SPA (un solo [App.tsx](../src/App.tsx) con navegación por *flows*/steps) servido por nginx que hace proxy `/api/*` → `backend:4000`. Backend API REST modular por routers. Contenedores comunicados por red `teso-net`.
- **Backend**: Entrypoint [backend/server.js](../backend/server.js) monta routers bajo `/api/*` y un `/api/health`; puerto `4000` (`PORT`). Dos pools de DB: principal [db/index.js](../backend/db/index.js) y auditoría [db/aud.js](../backend/db/aud.js). Auto-migración al arrancar en [db/migrate.js](../backend/db/migrate.js). Body limit 150mb (adjuntos de chat/Excel). OCR de CEP con Tesseract (spa+eng).
- **Frontend**: SPA sin router; el estado `nav = {flow, step}` decide la vista y sincroniza con la URL (`?flow=`). Gating por rol vía JWT en `localStorage` (`teso_token`/`cfdi_token`, decodificado sin verificar firma — solo UI). Roles: `tesorero` (solo Captura/Config), `impulse` (solo Efectivos/Impulse), `control_jr` (todo menos Cálculo de Nómina), admin (sin restricción). `ViewErrorBoundary` evita pantalla en blanco.
- **Base de datos** (motor/tablas/migraciones): PostgreSQL (`pg`), `ssl:false`, pool principal `max:10`. Parámetros por `.env` (`DB_HOST`/`DB_PORT`/`DB_NAME`; **[pendiente]** `DB_NAME` real, no leído). Segundo pool a BD **`aud`** (`DB_AUD_NAME`, default `aud`) para roles/usuarios y `empresa_bancos_log`. `types.setTypeParser(1082)` devuelve columnas `date` como `YYYY-MM-DD` (evita off-by-one en UTC-6). Migraciones auto en `db/migrate.js` + SQL manuales numerados en [backend/sql/](../backend/sql/) (`01`..`12`: colaboradores, adeudos/inversiones, `fuente`, proyectos de inversión, conciliación, gastos fijos v2, cálculo/interna/prorrateo de nómina, grupos CLABE + log de reemplazo). Tablas clave: `movimientos_bancarios`, `movimientos_efectivo`, `colaboradores`, `catalogo_clientes`, `catalogo_bancos`, `catalogo_clasificaciones_movimientos`, `inversiones_movimientos`, `tarik_frontales`/`tarik_clientes`, `area_interna`, `solicitudes_correo`(+`_partidas`/`_adjuntos`), `usuario_empresas`, `ops_clientes`/`ops_solicitudes`/`ops_saldo_movimientos`, `chat_rooms`/`mensajes_chat`, `directorio_entidades`/`directorio_clabe_entidad`, `grupos_clabe`. Esquema de referencia: `reprocesar db/schema_tesoreria.sql`.
- **Componentes reutilizables**: `DataTable`, `StatCard`, `ConfirmModal`, `SearchInput`, `Select`, `FilterToggle`, `ExcelFilter`, `ModuleSwitcher`, `FinalStepView` (en [src/components/](../src/components/)); layout `Sidebar`/`Header`/`TransactionDrawer`/`MovimientoDrawer`/`EntityDetailDrawer`; hooks en `src/hooks/`; utilidades en `src/utils/` (`fuzzySearch`, `clabe`, `cepDownloader`, …).
- **API/endpoints**: base `/api/` + routers `bancos`, `haberes`, `adeudos`, `gastos`, `inversiones`, `nomina`, `catalogos`, `cuentas`, `analisis`, `captura`, `cash`, `cep`, `auth`, `correos`, `operaciones` (+ `nomina_ops` y `choferes` bajo el mismo prefijo `/api/operaciones`), `satgo`, `buscar`, y `health`. Ingesta de estados de cuenta: `POST /api/analisis/pdf-preview` y `/pdf-guardar`. Matriz de saldos: `GET /api/cuentas/matriz`. SSE de chat bajo `/api/operaciones`.
- **Despliegue/infra** (⟵ *patrón replicable entre proyectos*): la app se sirve como **sub-ruta `/gestion/` bajo un vhost nginx que YA existe** (`n8n.datazentrika.com`, del contenedor n8n en el puerto 5678). **No** se crea dominio nuevo ni certificado SSL nuevo — reutiliza el cert de ese vhost. URL pública: `https://n8n.datazentrika.com/gestion`.
  - **Servidor**: droplet Linux `134.209.64.96`, alias SSH `n8n-tickets`. Dir de la app en prod: `/home/devn8n/teso-app` (el `deploy-remoto.bat`/`cerrar-y-deploy.ps1` usan esta ruta). ⚠️ Nota: `deploy-server.sh` (script de *primer* deploy) apunta a `/opt/teso` — rutas distintas; la operativa real es `/home/devn8n/teso-app`.
  - **Compose de prod**: [docker-compose.server.yml](../docker-compose.server.yml) (≠ el `docker-compose.yml` de local). Backend con `expose: 4000` (NO publicado al exterior); frontend en `127.0.0.1:3000:80` (solo localhost, el nginx del host lo expone por HTTPS). Redes `teso-net` (interna) + `cfdi-net` (external `sat-api_cfdi-network`). `restart: always`, logs rotados 10m×3, healthcheck `/api/health`.
  - **Build del frontend** (args de Docker): `VITE_API_URL=/gestion/api` y `VITE_BASE_PATH=/gestion/` → Vite compila assets y rutas bajo `/gestion/`.
  - **nginx del host** ([nginx-server.conf](../nginx-server.conf)): bloque `location ^~ /gestion/` que **quita el prefijo `/gestion/`** y hace `proxy_pass http://127.0.0.1:3000/`. Tres locations: SPA (`/gestion/`), API (`/gestion/api/` → `:3000/api/`) y un bloque especial **SSE** (`/gestion/api/operaciones/chat/sse`) con `proxy_buffering off` y `proxy_read_timeout 3600s`. `client_max_body_size 50M`. Se pega DENTRO del `server{listen 443 ... n8n.datazentrika.com}` ANTES del `location /`; aplicar con `nginx -t && systemctl reload nginx`.
  - **Volúmenes**: `./ESTADOS DE CUENTA PDF` → `/pdfs` (read-only, `PDF_ROOT_PATH=/pdfs`); en prod además `./CARGAS` → `/cargas` (escribible, `UPLOADS_PATH=/cargas`).
  - **Cómo se despliega** (3 formas): (1) **Primer deploy** en el server: `bash deploy-server.sh --first` (verifica docker/nginx/certbot, build `--no-cache`, `up -d`, corre migración `backend/sql/05_run_migration.js`). (2) **Actualización rápida** desde Windows: `deploy-remoto.bat` → `scp` de una whitelist de archivos + `ssh … docker compose -f docker-compose.server.yml build && up -d --remove-orphans && image prune`; sub-comandos `front`/`back`/`pdfs`/`logs`/`status`/`stop`. (3) **Cierre de jornada con PR**: [cerrar-y-deploy.ps1](../cerrar-y-deploy.ps1) commitea SOLO tus archivos en tu rama → PR → merge a main → `scp` de **solo los archivos cambiados** (src/public/backend/ + whitelist raíz) → rebuild de los servicios afectados. Ninguno versiona `backend/.env`.
  - **Env**: secretos en `backend/.env` (DB + llaves) — **no versionado, no leer**. `.env.example` del root solo trae `VITE_N8N_WEBHOOK_URL`.
- **Seguridad** (solo riesgos, nunca secretos): contraseñas iniciales **sembradas** en `db/migrate.js` para roles semilla — rotar tras el primer login. Conexión a Postgres con `ssl:false`. JWT decodificado en frontend sin verificar firma (solo *gating* de UI; la autorización real debe vivir en el backend). Secretos reales en `backend/.env` y `.env.local` del root (`GEMINI_API_KEY`) — **no versionar ni leer**. CORS del backend restringido a `localhost:*`.
- **Puente Obsidian (tableros `.base`)**: [scripts/exportar-bases.mjs](../scripts/exportar-bases.mjs) (Node 20, sin deps) consume los endpoints de la app y genera una nota `.md` por registro en el vault de Obsidian `C:\loki\Datos` (sobrescribible con `VAULT_DIR`; API con `API_URL`, default `localhost:4000`, prod `https://n8n.datazentrika.com/gestion/api`). Reusa la lógica del backend (carry-forward, homologación, cancelación) en vez de reescribir SQL. Colecciones y tags: **Cuentas** (`cuenta`, desde `/cuentas/matriz`+`/directorio-cuentas`), **Empresas** (`empresa`, agregado), **Clientes** (`cliente_catalogo`, `/catalogos/catalogo-clientes`), **Gastos** (`gasto`), **Efectivos** (`efectivo`, `/cash/efectivo`). Los `.base` (definición de vistas/filtros, solo lectura) viven en [docs/](.) y se copian al vault en cada corrida. Las notas generadas van a subcarpetas dedicadas (`Clientes/catalogo`, etc.) para no pisar notas manuales como `Clientes/Conciliacion clientes OPS 2026.md`. Vacíos en prod (adeudos/inversiones/ops-solicitudes) y `nomina/colaboradores` roto (bug `GROUP BY c.id_cliente`) → sin tablero por ahora.

## Datos / conexiones con otros proyectos
- Infra compartida con **n8n** (`n8n.datazentrika.com`, host `134.209.64.96`); ingesta masiva histórica de estados de cuenta corre como workflow n8n (nodos respaldados en `reprocesar db/desfragmentador_nodes/`).
- BD **`aud`** de auditoría/roles compartida con otros módulos de la plataforma (`ModuleSwitcher`) → ver [[Contabilidad]], [[Ops]].
- Integraciones externas: OCR/CEP bancarios (BANREGIO/Impulse), proveedores "Tarik" (frontales/clientes), Gemini (`@google/genai`) y Anthropic SDK en backend.

## Pendientes
- [x] DB principal confirmada: **`DB_NAME=tesoreria`** (schema `public`); la BD `aud` es el 2º pool. `colaboradores` vive en `tesoreria.public`.
- [ ] Ejecutar SQLs manuales pendientes e importar colaboradores (script `03`).
- [ ] Rotar contraseñas iniciales sembradas y sacarlas del código.
- [ ] No hay CI configurado (`.github/` ausente) — [pendiente] definir pipeline de build/test.
- [ ] `backend/lib/desfragmentador/runner.js` se importa en `analisis.js` pero no está en git (vive solo en el server desplegado). Mitigado: el `require` ahora es tolerante (try/catch) → el backend arranca local aunque falte el módulo; solo se degrada el procesado de PDFs de Análisis.
- [ ] Bug en prod: `GET /api/nomina/colaboradores` truena (`column "c.id_cliente" must appear in the GROUP BY clause`) — bloquea el tablero de colaboradores.
- [ ] **(Tarea 4) 286 CLABEs con longitud ≠ 18** en `colaboradores` (truncadas / cuentas mal guardadas) — sin analizar, caso aparte. Nota: el alta/reemplazo por UI ya valida checksum Banxico (2026-07-13), pero estas viejas quedaron sembradas directo en `colaboradores_cuentas` sin validar.
- [ ] **(Tarea 4 · seguridad) Rotar el password de BD prod hardcodeado** en `ingestar_mes.cjs` — sacarlo a `.env`.
- [ ] **(Tarea 4) 16 grupos duplicados ambiguos BANREGIO** (comisiones / cuota admin) — dejados a revisión manual del usuario.

## Registro de cambios
> Append-only, lo más reciente arriba: <fecha> — qué cambió · por qué · archivos.

- 2026-07-13 — **Colaborador multi-cuenta + historial de CLABE** · Un colaborador ya puede tener varias cuentas/CLABEs y reemplazar una conservando la vieja (historial). Nueva tabla **`colaboradores_cuentas`** (1:N, `es_principal`/`activa`/`vigente_desde,hasta`; índice único parcial: máx. 1 activa+principal), sembrada idempotente desde la cuenta actual de cada colaborador. Las columnas `banco/cuenta/clabe` de `colaboradores` quedan como **espejo** de la principal, sincronizado en la capa app (`syncColaboradorEspejo`). Endpoints `GET/POST/PATCH /api/nomina/colaboradores/:id/cuentas` + `/reemplazar`; `POST /colaboradores` siembra la principal; el **auto-match** ahora matchea contra **cualquier cuenta activa** (CTE `colab_cuentas` + LEAD `next_colaborador_id` para no marcar falso "ambiguo"). UI: sección **"Cuentas"** en el modal (agregar/hacer principal/desactivar); multi-esquema ya existía (chips `metodos_dispersion[]`). Además **paginación** de la tabla anual de colaboradores (50/pág, cliente) — se trababa por render de miles×12 celdas (`/colaboradores-anuales` no pagina y el front lo pedía con `solo_internos:false`). Migración SQL 14 aplicada a mano en `tesoreria`. Desplegado a prod front+back (deploy quirúrgico: 4 archivos + rebuild ambas imágenes). · archivos: backend/sql/14_migration_colaboradores_cuentas.sql (+`14_run_migration.js`), backend/lib/colaboradores_cuentas.cjs, backend/routes/nomina.js, src/services/api.ts, src/pages/nominas/NominasView.tsx, deploy-quirurgico.bat; spec+plan en docs/superpowers/.

- 2026-07-09 — **Fix `ordenante == beneficiario`** + 2 duplicados RTM · (1) Muchos movimientos tenían el MISMO nombre en `ordenante` y `beneficiario` (imposible en SPEI interbancario; ej. ce4de856: depósito a SERVINTEG desde COMERCIALIZADORA quedó con ambos = COMERCIALIZADORA). El extractor ACTUAL ya reparte bien (contraparte del texto + `empresa_corto` en el lado propio); `reprocesar db/fix_ordenante_beneficiario.cjs --apply` re-extrae y **corrige 277 filas IN-PLACE (mismos UUID)** — solo donde DESEMPATA (contraparte distinta); deja 338 intactas (traspasos legítimos misma-empresa + SALDO_CIERRE vacíos + POS sin contraparte). Respaldo. (2) Verificados contra el PDF los 2 pagos "reales" RTM MAYO que quedaban (SUA/SIPARE $8,278.73 y factura $150,000): cada uno aparece 1× en el PDF pero 2× en la DB → **duplicados de extracción, borrados** (conservada la copia con clasificación correcta: SUA=clasif 10; respaldo full-row). · archivos: reprocesar db/fix_ordenante_beneficiario.cjs, respaldos en reprocesar db/backups/. Ver [[project_banregio_marcador_dedup]].
- 2026-07-09 — Columna "Beneficiario / Ordenante" **separada en dos columnas** (Beneficiario, Ordenante) en (1) el modal de movimientos del cliente `ClienteMovsTable` (columnas ordenables + export CSV con encabezados separados) y (2) el drawer de detalle de la búsqueda global (`EntityDetailDrawer`, tabla de movimientos por CLABE — backend `buscar.js:675` ya devuelve ambos campos) · el usuario pidió tenerlos separados · src/pages/cash/CashView.tsx, src/layout/EntityDetailDrawer.tsx. **Desplegado a prod** (frontend, flujo quirúrgico: diff=solo el split, backup `dist_20260709_102203`, scp 2 archivos + rebuild); bundle `index-DFRbzPtd.js` + HTTP 200. Sin commitear. (Nota: la tabla principal del tab Movimientos de Buscar `MovimientosTable` sigue con la columna combinada — no se tocó.)

- 2026-07-08 — **BANREGIO: marcador "-- N of M --" + duplicados de extracción** · (1) Los PDF de BANREGIO/BANBAJIO/BX+ traen un pie de página `-- N of M --` (footer de tabla) que la extracción pegaba a `descripcion`/`concepto` (ej. `PAGO FAC 3682 29 -- 6 of 10 --`). Se agregó `limpiarMarcadorBancario()` al extractor y al runner de ingesta; **reproceso in-place de 2298 filas** (BANREGIO 2017, BANBAJIO 274, BX+ 6, AFIRME 1) — **mismos UUID** (no se pierden conciliaciones/asignaciones), con respaldo. (2) Descubrimiento clave: **el `saldo` de BANREGIO es diario/de corte, NO saldo corriente por movimiento** → "mismo saldo" NO indica duplicado (ej. SERVINTEG con 3 pagos distintos de $422,500 el mismo día comparten saldo). (3) El desfragmentador a veces **emitía un movimiento repetido** en saltos de página; se agregó **auto-dedup** al runner (firma fecha+retiro+deposito+saldo+descripcion) para ingestas futuras. (4) Dedup histórico seguro = solo grupos con `descripcion` idéntica que incluye una **clave de rastreo real única** (no puede repetirse): **72 duplicados garantizados borrados** ($958,972.05 de doble-conteo; respaldo full-row restaurable; 0 conflictos de asignación manual; conserva la copia con clasificación). Los 16 grupos ambiguos (comisión por transferencia legítima, cuota mensual "Comisión Administración - renta", 2 pagos reales RTM) se **dejaron intactos** por decisión del usuario para revisión manual. Tests extractor 2/2 · archivos: backend/lib/extraer_spei.js (`limpiarMarcadorBancario`), backend/lib/desfragmentador/runner.js (limpieza + auto-dedup + `dups_removidos`), reprocesar db/{fix_marcador_paginacion,qa_duplicados_banregio,dedup_banregio}.cjs (`--incluir-ambiguos`/`--patron`), respaldos en reprocesar db/backups/.
- 2026-07-08 — Modal de movimientos del cliente: el filtro de fecha ahora tiene **toggle Día/Mes** (`fechaGran` state + `setGran` resetea la selección al convertir; `colVal.dia` corta a `YYYY-MM` en modo Mes; helper `fmtMes` YYYY-MM→"jul 2026"). Permite seleccionar todos los movimientos de un mes con un clic · el usuario pidió poder filtrar por mes completo · src/pages/cash/CashView.tsx. **Desplegado a prod** (frontend, mismo flujo quirúrgico: diff=solo el toggle, backup `dist_20260708_134748`, scp 1 archivo + rebuild); verificado bundle `index-byl2GuOU.js` + HTTP 200. Sin commitear.

- 2026-07-08 — **Fix bug "085" (CLABE inválida en el extractor)** · al parsear la descripción se tomaba el primer bloque de 18 díg como CLABE aunque fuera basura (ej. `INT 085900557640318166-… BANAMEX 002180026978208522 …` guardaba `085…` en vez de la real `002…`). Ahora `extraerClabe()` valida el **dígito de control Banxico** y **prefiere una CLABE cuyo código de banco exista** en el catálogo SPEI; guard universal en `parsearMovimiento` (todos los bancos) + `esSucio('clabe')` para que las CLABEs viejas inválidas se reemplacen al reprocesar. **Reproceso aplicado**: `clabe LIKE '085%'` → **180 movimientos corregidos** a la CLABE Banamex real (0 limpiadas), con respaldo revertible. Dry-run global (34,401 movs) sin regresiones reales (única diferencia MULTIVA es también una corrección; los 62 "REGRESS" son `085→002`). Además, **edición de CLABE en el Detalle de Movimiento solo para superusuario** (`rol_clave='superadmin'`): editor inline con validación en vivo del dígito de control + campo de la CLABE bloqueado en modo edición para no-super; backstop de validación en el backend. Tests de extractor pasan (5/5) · archivos: backend/lib/extraer_spei.js, backend/routes/bancos.js (PATCH /movimientos/:id valida CLABE), src/utils/clabe.ts (`validateClabeChecksum`), src/utils/auth.ts (nuevo, `isSuperadmin`), src/layout/MovimientoDrawer.tsx (`ClabeField`), reprocesar db/{dry_run_clabe_085,fix_clabe_085,qa_clabe_global}.cjs.
- 2026-07-08 — Modal de movimientos del cliente (Catálogos › Clientes): las dos tablas estáticas (Bancarios + Tarik) se reemplazan por una sola tabla `ClienteMovsTable` ordenable por columna + filtros tipo Excel (Origen/Día/Empresa/Banco) + selección + totales + **exportar CSV combinado** (columna Origen, Tarik normaliza monto→Depósito/Retiro, incluye beneficiario/ordenante/CLABE/referencia/clave de rastreo) · el usuario pidió poder exportar y ordenar/filtrar igual que en la pantalla de Buscar · src/pages/cash/CashView.tsx (nuevo componente + import de CopyButton), docs/superpowers/specs/2026-07-08-exportar-filtrar-movimientos-cliente-design.md. **Desplegado a prod** (solo frontend): diff confirmó server == git base (solo CRLF), backup del dist en `/home/devn8n/teso_dist_backups/dist_20260708_125319`, scp del único archivo + `docker compose build/up -d frontend`; verificado HTTP 200 en `/gestion/`, nuevo bundle y `/api/health`. Sin commitear (cambios viven en árbol local; el server no es repo git).
- 2026-07-07 — Documentado el deploy como receta replicable (sub-ruta `/gestion/` bajo vhost n8n existente, compose `docker-compose.server.yml`, nginx-server.conf que quita prefijo, 3 flujos de deploy, servidor `134.209.64.96`/`/home/devn8n/teso-app`) · para replicarlo en otros proyectos desde la memoria · docs/MEMORIA.md (leídos: docker-compose*.yml, deploy-server.sh, deploy-remoto.bat, cerrar-y-deploy.ps1, nginx-server.conf).
- 2026-07-06 — Puente Obsidian: exportador `scripts/exportar-bases.mjs` (endpoints→notas `.md` en vault `C:\loki\Datos`) + tableros `.base` Cuentas/Empresas (enriquecidos) y nuevos Clientes/Gastos/Efectivos; `analisis.js` tolera `desfragmentador` ausente para arrancar local · para ver datos reales de tesorería en Obsidian y desbloquear el backend local · scripts/exportar-bases.mjs, docs/*.base, backend/routes/analisis.js.
- 2026-07-06 — Alineado el nodo al vault: `nombre`→`Gestión (Tesorería)`, tag→`gestion`; línea de BD reescrita desde `db/index.js`/`db/aud.js` (dos pools, `types 1082`, `.env`); pendientes ampliados · para que MEMORIA.md coincida con `Proyectos/Gestión (Tesorería).md` y sea verificable · docs/MEMORIA.md.
- 2026-07-06 — Creación de MEMORIA.md · memoria de contexto inicial del proyecto leyendo repo (manifiestos, Docker, migraciones, rutas, deploy) · docs/MEMORIA.md, CLAUDE.md.
<!-- MEMORIA:END -->
