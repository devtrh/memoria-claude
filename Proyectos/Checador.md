---
tipo: proyecto
nombre: Checador
tags: [proyecto, checador, asistencia]
estado: activo
actualizado: 2026-07-06
---

# 🕒 Checador

Nodo principal del área Checador: control de asistencia / registro de entradas y salidas.

## Alcance / temas
- [pendiente] Describir qué cubre (registro de checadas, horarios, reportes de asistencia, etc.).

## Conversaciones relacionadas
- *Se enlazan al archivar sesiones; si no hay, conserva este placeholder.*

## Datos clave
> Datos duros del área (solo reales; usa [pendiente] si falta o no aplica).
- **Stack**: [pendiente]
- **Arquitectura general**: [pendiente]
- **Backend**: [pendiente]
- **Frontend**: [pendiente]
- **Base de datos**: [pendiente]
- **Componentes reutilizables**: [pendiente]
- **API / endpoints**: [pendiente]
- **Despliegue / infra**: [pendiente]
- **Seguridad**: [pendiente]

## Datos / conexiones con otros proyectos
> Info que se cruza con otras áreas. Usa [[enlaces]].
- Autenticación compartida → [[Usuarios AUD (autenticación)]].
- [pendiente] Definir conexiones con otros nodos (p. ej. nóminas en [[Gestión (Tesorería)]]).

## Pendientes
- [ ] [pendiente] Poblar el nodo con datos reales del proyecto.

## Enlaces
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
nombre: Checador
tags: [proyecto, checador]
estado: activo
actualizado: 2026-07-06
---
# ⏰ Checador
Nodo principal del área Checador: sistema de asistencia con reconocimiento facial, validación GPS y lista blanca de Wi-Fi, 100% web (PWA) sobre Docker.
## Alcance / temas
- Registro de asistencia entrada/salida por reconocimiento facial 1:N (dlib ResNet 128-d).
- Validación de geocerca (haversine vs `radius_m`) y lista blanca de Wi-Fi por sucursal.
- App empleado (login por PIN, home, check-in, historial) + panel admin (empleados, sucursales, Wi-Fi, equipo, reportes).
- Modo quiosco con JWT propio (`/kiosk`) y modo público sin login (`/probar`).
- Detección de rostro en el navegador con MediaPipe Face Mesh; el embedding 128-d se calcula en el backend.
## Conversaciones relacionadas
- *Se enlazan al archivar sesiones.*
## Datos clave
- **Stack** — Front React 18 + Vite; API FastAPI (Python 3.12); BD Postgres 16 + `pgvector`; orquestado con Docker Compose. Reconocimiento facial: MediaPipe Face Mesh (navegador, 468 landmarks) + `face_recognition`/dlib 128-d (servidor).
- **Arquitectura general** — 3 servicios: `web` (React→build Vite→nginx: sirve estáticos y proxya `/api`), `api` (FastAPI, embeddings dlib) y Postgres (en el host, fuera de compose). Auth por JWT (empleado y quiosco). El navegador detecta el rostro con MediaPipe y sube un JPEG; el backend extrae el vector 128-d y lo compara contra `face_embeddings`.
- **Backend** — `api/app/main.py` monta routers con prefijo `/api`: `auth`, `enroll`, `checkin`, `admin`, `kiosk`, `me`, `test`. SQLAlchemy 2 + asyncpg; bcrypt (PIN); PyJWT; geocerca haversine (`app/geo.py`); validación de SSID. Migración idempotente `db/migrate.sql` al arrancar si `AUTO_MIGRATE=true` (`api/seed.py`).
- **Frontend** — `web/src/` React + react-router-dom 6. Pantallas empleado (Login, Home, CheckIn, Enroll, History) y admin (Today, Employees, EnrollEmployee, Locations, Wifi, Equipment, Reports) + Kiosk/KioskSetup/Probar. MediaPipe cargado por CDN en `index.html`. Mapa Leaflet, gráficas Recharts, export xlsx/jspdf.
- **Base de datos** — Postgres 16 + `pgvector`. Esquema en `db/init.sql` (primera vez), `db/migrate.sql` (idempotente) y `db/equipment.sql`. Tablas: `locations`, `allowed_ssids`, `employees`, `employee_locations`, `contact`, `departments`, `positions`, `face_embeddings` (`vector(128)`, índice HNSW l2), `attendance`, `equipment`.
- **Componentes reutilizables** — `components/admin/`: Modal, ConfirmModal, DataTable, Stepper, KpiCard, Avatar, CatalogSelect, EnrollFaceModal, Toaster (+ `lib/toast.js`, pub/sub de toasts). `components/`: Icon (set SVG lucide-style), FaceOverlay, Select, DatePicker/TimeField, ColorPicker, KioskHeaderCard.
- **API/endpoints** — (prefijo `/api`) `auth/login`; `checkin`; `enroll/face`; `me` (+`/attendance`,`/stats`); `kiosk/{me,identify,identify-multi}`; `admin/*` (CRUD employees/departments/positions/equipment/locations/ssids, `today*`, `reports/{attendance,retardos,failures}`, `stats`, `kiosk-token`, `wifi`, `employees/{id}/face`, `employees/{id}/reset-pin`); `test/*` (público); `health`.
- **Despliegue/infra** — Dev: `docker-compose.yml`. Prod: `docker-compose.server.yml` (imagen `web` nginx `127.0.0.1:3105→80`; imagen `api` expone `8000`; el front se compila DENTRO de la imagen vía `web/Dockerfile.prod`). Deploy remoto desde Windows: `deploy-remoto.ps1` (alias SSH `n8n-tickets`, dir `~/checador`) → `deploy-server.sh` (`docker compose build && up -d`). Prod: https://n8n.datazentrika.com/checador/ (subpath: `VITE_BASE_PATH=/checador/`, `VITE_API_URL=/checador`).
- **Seguridad** — `/api/test/identify` está PÚBLICO sin auth (riesgo: cualquiera con foto de un empleado enrolado puede fichar; documentado en el README). Secretos en `api/.env` / `api/.env.server` (`JWT_SECRET`, `DB_PASSWORD`, `DATABASE_URL`, `FACE_THRESHOLD`) — no versionar; no leídos aquí. Privacidad: solo se guarda el vector 128-d, nunca la imagen. HTTPS obligatorio para cámara/GPS.
## Datos / conexiones con otros proyectos
- **Infra n8n (datazentrika)** — comparte host y el nginx del server; la app vive bajo el subpath `/checador` dentro del `server{}` de `n8n.datazentrika.com`; el alias SSH de deploy es `n8n-tickets`.
- **Postgres compartido** — en server usa `DB_SCHEMA=checador` sobre la BD Postgres del host (`host.docker.internal`), compartida con ese stack.
## Pendientes
- [ ] Seguridad: `/api/test/identify` expuesto sin auth. Mitigar: quitar el link del login, exigir token de quiosco, o filtrar por IP en nginx.
- [ ] Quitar el HUD/medidor temporal de recursos en `web/src/screens/KioskClassic.jsx` (marcado `ponytail:`) tras calibrar el modo ligero en la tablet.
- [ ] Reconocimiento con cubrebocas limitado (dlib) — bajar `FACE_THRESHOLD`, re-enrolar con cubrebocas, o migrar a ArcFace 512-d (requiere migración de BD).
- [ ] Bundle web >500 kB (warning de Vite en build) — evaluar code-splitting.
## Registro de cambios
> Append-only, lo más reciente arriba: <fecha> — qué cambió · por qué · archivos.
- 2026-07-06 — Creación de `docs/MEMORIA.md` (contexto recuperable, Datos clave por sub-temas) + regla "Memoria del proyecto" en `CLAUDE.md`. · sincronizable a bóveda de Obsidian. · Archivos: docs/MEMORIA.md, CLAUDE.md.
- 2026-07-06 — Mejoras UX (feedback + visual): toasts en admin + spinner de guardado; contraste AA en tokens `--warn`/`--ok`; tokens de sombra y "cards premium"; fix `RESULT_HOLD_MS` 2s→4s; errores específicos de cámara (kiosko) y red/credenciales (login). · legibilidad y feedback de acciones. · Archivos: web/src/lib/toast.js, web/src/components/admin/Toaster.jsx, web/src/components/admin/AdminLayout.jsx, web/src/screens/admin/{Employees,Equipment,Locations,Wifi}.jsx, web/src/screens/{Login,KioskClassic}.jsx, web/src/styles.css.
<!-- MEMORIA:END -->
