---
tipo: proyecto
nombre: Gestión (Tesorería)
aliases: [Tesorería]
tags: [proyecto, gestion, tesoreria, finanzas]
proyecto_codigo: gestion
bd: tesoreria
estado: activo
actualizado: 2026-07-06
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
- *Aún sin conversaciones archivadas; se enlazarán al archivar sesiones.*
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
<!-- MEMORIA:END -->
