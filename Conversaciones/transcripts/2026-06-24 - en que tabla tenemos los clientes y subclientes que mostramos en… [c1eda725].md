---
tipo: transcript-conversacion
fecha: 2026-06-24
fecha_fin: 2026-06-24
titulo: "en que tabla tenemos los clientes y subclientes que mostramos en…"
proyecto: "Gestión (Tesorería)"
session_id: c1eda725-7997-4930-abd7-722e163ad773
tags: [memoria, transcript, conversacion]
---

# en que tabla tenemos los clientes y subclientes que mostramos en…

> [!info] Metadatos de la sesion
> - **Sesion:** `c1eda725-7997-4930-abd7-722e163ad773`
> - **Rango:** 2026-06-24 → 2026-06-24
> - **Rama(s) git:** `diego/tarik-flujo`
> - **Turnos:** 1 de usuario · 1 de Claude
> - **Proyecto:** Gestión (Tesorería)
> - **Claude Code:** v2.1.183
> - _Transcript legible (solo texto usuario/Claude, sin herramientas). Secretos evidentes enmascarados como «REDACTADO». Fuente: `.claude/projects/.../c1eda725-7997-4930-abd7-722e163ad773.jsonl`._

---

### 👤 Usuario · 16:41

en que tabla tenemos los clientes y subclientes que mostramos en catalogos clientes

### 🤖 Claude · 16:41

Voy a verificar en el código cómo se cargan los clientes y subclientes en Catálogos.

Los clientes y subclientes que se muestran en **Catálogos → Clientes** salen de la tabla **`catalogo_clientes`** (en la DB `tesoreria`).

Detalles relevantes:

- **`catalogo_clientes`** — es el catálogo editable. Distingue cliente vs subcliente con la columna `tipo` (`cliente`/`subcliente`) y `cliente_padre_id` (apunta al cliente padre). También trae `nombre`, `razon_social`, `ejecutivo`, `rfc`, `cuenta`, `clabe`, `activo`. Lo sirve el endpoint `GET /api/catalogos/catalogo-clientes` en [backend/routes/catalogos.js](backend/routes/catalogos.js).
- **`catalogo_cliente_cuentas`** — tabla auxiliar para las **múltiples cuentas** por cliente/subcliente (`cliente_id` FK → `catalogo_clientes`). El GET devuelve `cuentas: [...]`. Las columnas legacy `cuenta/clabe/clabe_sufijo` en `catalogo_clientes` quedan como espejo de la cuenta principal.

Ojo: hay otras dos tablas de clientes en la misma DB que **NO** alimentan esta pantalla:
- **`ops_clientes`** y **`clientes`** — esas las usa la **Búsqueda global** ([backend/routes/buscar.js](backend/routes/buscar.js)), no Catálogos. Pueden desincronizarse en el flag de estado (`activo` vs `status`).

¿Quieres que confirme contra el código actual la query exacta del endpoint (por si cambió en estos días)?

> ⚙️ *Herramientas: Read×2*
