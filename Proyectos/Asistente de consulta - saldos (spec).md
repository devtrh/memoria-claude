---
tipo: spec
proyecto: Gestión (Tesorería)
tags: [spec, tesoreria, api, asistente, saldos]
estado: propuesta
actualizado: 2026-07-06
---

# 🔎 Asistente de consulta de saldos (spec)

Objetivo: que un usuario, desde el sitio de tesorería, consulte por **búsqueda directa** o
**lenguaje natural** DOS fuentes: (1) datos de la BD `tesoreria` (ej. saldo de una empresa) y
(2) la **memoria del vault de Obsidian** (contexto: cómo funciona, esquema, decisiones).
Todo **solo lectura**.

> **Fuente 2 (memoria):** herramienta `buscar_en_memoria(pregunta)` que lee los `.md` del vault
> y responde citando el archivo. Requiere el vault **sincronizado al servidor** en una carpeta
> que el backend pueda leer (`VAULT_PATH`). Ver [[Sincronizar vault con servidor (rclone bisync)]].

> Regla de oro: el **número siempre sale del SQL**, nunca del modelo. El LLM solo interpreta
> la pregunta y da formato al resultado ya verificado.

## Arquitectura
```
Usuario (sitio) 
  ├─ Búsqueda directa ─────────────► GET /api/empresas?query=   → elige empresa
  │                                  GET /api/empresas/:id/saldo → número real (SQL)
  └─ Pregunta NL ─► POST /api/asistente/consulta
                       1) LLM: intención + entidades (empresa, rango fechas)
                          → elige una HERRAMIENTA de una lista blanca (function calling)
                       2) Backend ejecuta la query parametrizada correspondiente
                       3) LLM redacta la respuesta con el dato ya verificado
```

## Parte 1 — Endpoints deterministas (base)
- `GET /api/empresas?query=<texto>` → autocomplete. Reutiliza el **fuzzy match existente**
  (buscaEmpresaCorto / Dice ≥ 0.85) para tolerar typos y nombres cortos. Devuelve `[{id, nombre}]`.
- **YA EXISTE** el cálculo del saldo por empresa: `GET /api/bancos/dashboard` (en
  `routes/bancos.js`) devuelve el saldo total por empresa y está **conciliado** con la
  "Matriz de saldos". El asistente debe **reusar ese endpoint/lógica**, no reinventarlo.
- Si se necesita un endpoint dedicado, replica su criterio determinista:
  - Agrupar por **`empresa_corto`** (text), NO por `empresa_id` (viene NULL en estados viejos).
  - Saldo de cierre por cuenta = último movimiento con orden:
    `COALESCE(fecha_reporte, fecha) DESC, fecha DESC, movimiento_id DESC NULLS LAST, id DESC`.
  - Saldo de la empresa = Σ del saldo de cierre de cada una de sus cuentas.
- Detalle: para el saldo "actual/all-time" de una empresa, el dashboard de Bancos ya es la
  fuente correcta; la Matriz aplica cuando se quiere por año/mes (carry-forward).

## Parte 2 — Asistente NL (function calling)
- `POST /api/asistente/consulta` { pregunta } con un LLM **intercambiable**:
  - **Ollama (local, por defecto)** — ya en el stack (Llama 3.1 8B). Sin costo, datos no salen
    del servidor. Tarea acotada (intención + entidades + elegir herramienta) → 8B alcanza.
  - Anthropic (`@anthropic-ai/sdk`) como alternativa si se quiere más precisión.
  - Interfaz común: una función `interpretar(pregunta) -> {tool, args}` que envuelve al proveedor.
  - Si el modelo no soporta tool-calling nativo, pídele salida en **JSON** y valídala antes de ejecutar.
- Se definen **herramientas con lista blanca** (no SQL libre), p. ej.:
  - `buscar_empresa(nombre)` → usa el endpoint de arriba.
  - `get_saldo_empresa(empresa_id, desde?, hasta?)`.
  - `get_movimientos_empresa(empresa_id, desde?, hasta?, limite?)`.
- Flujo: el modelo elige la herramienta y sus argumentos → el backend la ejecuta con SQL
  parametrizado → el modelo redacta la respuesta con el número devuelto.
- Si la empresa es ambigua (varios candidatos del fuzzy), el asistente **pregunta cuál**.

## Seguridad (obligatorio)
- Usuario de BD **solo lectura**; nada de escritura desde este flujo.
- Solo consultas **parametrizadas**; el modelo NUNCA arma SQL libre.
- Autenticación: solo usuarios logueados (usuarios AUD) y respetar roles/empresas permitidas
  (`usuario_empresas`) para no exponer saldos de empresas que el usuario no debe ver.
- Log de cada consulta (quién, qué empresa, cuándo).
- El modelo no emite cifras que no vengan del resultado de la herramienta.

## Definiciones confirmadas (verificadas en los docs del repo)
- ✅ **Saldo** = último saldo de cierre de cada cuenta, sumado sobre las cuentas de la empresa.
- ✅ **Clave de empresa** = `empresa_corto` (text). NO usar `empresa_id` (NULL en estados viejos).
- ✅ **Ya existe** `GET /api/bancos/dashboard` que entrega este saldo por empresa (conciliado
  con la Matriz de saldos para el año en curso). El asistente lo reutiliza.
- ✅ **Orden determinista de cierre**: `COALESCE(fecha_reporte, fecha) DESC, fecha DESC,
  movimiento_id DESC NULLS LAST, id DESC`.

## Limitación conocida (heredada, no inventar)
- `movimiento_id` está poblado en ~1.3% de las filas, así que el saldo de cierre es una fila
  intradía **determinista pero no necesariamente la "verdadera" última**. Es el criterio
  unificado del sistema; el asistente debe reportar el mismo número que Bancos/Matriz.

## Orden de implementación (fases)
- **Fase 1 — Fuente 1 (BD / saldos):** endpoints + capa NL (Anthropic) + seguridad + frontend.
  Reutiliza `/api/bancos/dashboard`. Entregable usable por sí solo. **No** depende del vault.
- **Fase 2 — Fuente 2 (memoria del vault):** herramienta `buscar_en_memoria` + ruteo de fuente.
  Requiere el vault **sincronizado al servidor** (`VAULT_PATH`). No empezar hasta que exista.

## Enlaces
- [[Gestión (Tesorería)]]
- [[Sincronizar vault con servidor (rclone bisync)]]
- [[00 Índice de Memoria]]
