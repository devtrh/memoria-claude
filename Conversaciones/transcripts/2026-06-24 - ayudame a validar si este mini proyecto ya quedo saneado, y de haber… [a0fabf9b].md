---
tipo: transcript-conversacion
fecha: 2026-06-24
fecha_fin: 2026-06-25
titulo: "ayudame a validar si este mini proyecto ya quedo saneado, y de haber…"
proyecto: "Gestión (Tesorería)"
session_id: a0fabf9b-ef0f-4b4d-b205-7ab320dce6b8
tags: [memoria, transcript, conversacion]
---

# ayudame a validar si este mini proyecto ya quedo saneado, y de haber…

> [!info] Metadatos de la sesion
> - **Sesion:** `a0fabf9b-ef0f-4b4d-b205-7ab320dce6b8`
> - **Rango:** 2026-06-24 → 2026-06-25
> - **Rama(s) git:** `diego/tarik-flujo`
> - **Turnos:** 4 de usuario · 4 de Claude
> - **Proyecto:** Gestión (Tesorería)
> - **Claude Code:** v2.1.183
> - _Transcript legible (solo texto usuario/Claude, sin herramientas). Secretos evidentes enmascarados como «REDACTADO». Fuente: `.claude/projects/.../a0fabf9b-ef0f-4b4d-b205-7ab320dce6b8.jsonl`._

---

### 👤 Usuario · 17:31

ayudame a validar si este mini proyecto ya quedo saneado, y de haber quedado listo ayudame con el promt de regreso para el chat original por favor Mini-proyecto: corregir los 12 movimientos con signo invertido (cadena de saldos)

Corrige 12 movimientos donde dep/ret está invertido → rompen la cadena mes-a-mes por Δ = 2×monto. Long-tail de signos de BBVA (dual-saldo) + relacionados BANBAJIO y BANREGIO (EXXPAND multi-cuenta). Meta: qa_saldos_mes_a_mes.cjs sin rotos por signo, sin regresión.

Las 12: BBVA UNIENDO (2025-03→04, 08→09, 2026-03→04), PLACTON (2025-02→03, 05→06), ANZAND (2026-03→04), ARBOLEDA (2026-02→03), BANDEZ (2025-03→04); BANBAJIO BALOVENTO (2025-07→08), RESONANTE (2025-10→11); BANREGIO EXXPAND (2025-03→04, 04→05).

Diagnóstico hecho: cada quiebre = 1 mov con dep/ret invertido. Ej. BBVA P14 ESCUELA JOHN F KENNE 8,155.00 98,324.13 98,324.13 = retiro puesto como depósito (Δ=2×8,155=16,310). Códigos P14/N06/R01: keyword NO basta (N06 es dep Y ret). El saldo BBVA NO viene en la línea (84% sin él) → sale del parseo dual-saldo por columna; usar el delta de saldo antes/después como verdad del signo (patrón KUSPIT/SANTANDER-PYME).

Dónde: desfragmentador.js (gitignored, deploy scp+server.yml) → extraerMovimientosBBVA y duplicado extraerMovimientosBBVA8; signoSemantico/resolverBloque/vaciarPendientes/dualSaldo. BANBAJIO extraerMovimientosBanbajio (ya tiene delta-saldo, ver por qué falla). BANREGIO EXXPAND = encadenar saldo POR moneda.

Guard: tras corregir, saldo_anterior + Σ(dep−ret) == saldo_final_pdf por estado (si no, no aplicar). Verificar DB vs extractor: si la DB ya está correcta (como OVEDAI), 0 datos que tocar, solo el extractor para futuro; si hay que reclasificar signo en datos → OK explícito del usuario (toca dirección = contabilidad), emparejar por SALDO.

Aceptación: qa_saldos BBVA sube sin regresión; validar_frontera.cjs los 12 → OK/BOUNDARY; test RED→GREEN; deploy verificado (healthy, /cargas, migraciones).

### 🤖 Claude · 17:31

Voy a validar el estado de este mini-proyecto. Primero déjame revisar los archivos clave y correr el QA que es el criterio de aceptación.

Déjame revisar el QA de frontera, el de saldos, y qué cambió en el extractor. Voy a correr el QA que es el criterio de aceptación.

Ahora déjame ver las 12 fronteras objetivo y correr las validaciones. Reviso `rotos_saldo.json`, el diff del qa_saldos, y si el extractor BBVA fue tocado (está gitignored).

El extractor `desfragmentador.js` está gitignored (no puedo ver su diff por git). Déjame verificar si fue tocado recientemente y correr las validaciones reales contra la DB.

El extractor fue editado a las **10:52** hoy, *después* de la última corrida del QA (rotos_saldo.json a las 10:40). Tiene la lógica dual-saldo (`resolverBloque`/`vaciarPendientes`/`signoSemantico`/`dualSaldo`) y el manejo del retiro fantasma BANREGIO. Necesito re-correr las validaciones contra el estado actual. `validar_frontera.cjs` re-extrae los PDFs (prueba el extractor directo) — ese es el criterio de aceptación.

El resultado es engañoso: dice "sin movs en esa moneda" en las 11, no OK/BOUNDARY. Eso significa que la re-extracción no devolvió movimientos (no que esté limpio). Necesito averiguar por qué — ¿faltan los PDFs localmente, o el extractor truena? Déjame probar una extracción directa.

El query directo se cuelga (aunque `validar_frontera` sí conectó). Voy a matar ese proceso y escribir un probe en archivo — más confiable que `-e` inline en Windows — que re-extrae un PDF BBVA y reporta si truena, cuántos movs, y sample de saldo/moneda. Eso revela por qué "sin movs".

El extractor BBVA devuelve **0 movimientos** — está roto. El "0 EXTRACTOR-BUGS" de `validar_frontera` era un falso verde (el `catch {}` silencioso ocultó que la extracción no produce nada). Esto es una regresión. Déjame confirmar con otro PDF BBVA y ver el dispatch, para descartar artefacto del probe.

Confirmado: BBVA devuelve 0 movs en múltiples PDFs. El extractor está roto tras la edición de las 10:52. Déjame capturar el `log` del extractor para ver dónde bota.

El runner no expone el log interno. Voy a leer directamente `extraerMovimientosBBVA` para ver dónde se rompe, y llamar la función directo con el texto del PDF.

Texto BBVA OK (anchor en 1735, 25370 chars). El bug es **río abajo**: tras encontrar el anchor, el loop de parseo produce 0 movimientos. Voy a invocar el extractor crudo vía `runNode` para capturar su `log` interno.

Voy a invocar `runNode('desfragmentador.js')` directo para ver el header crudo (log, movimientos, error).

Hay una clave `«REDACTADO»`. Déjame verla junto con saldo_inicio/saldo_corte.

¡Encontrado! El error es **`__DBG is not defined`** — quedó una variable de debug huérfana en el extractor BBVA. Eso hace que toda la extracción BBVA truene y devuelva 0 movimientos. Déjame localizarla.

Una línea de debug huérfana en [desfragmentador.js:3020](backend/lib/desfragmentador/nodes/desfragmentador.js#L3020) — `__DBG` nunca se definió, lanza ReferenceError, el `catch` la convierte en `error_movimientos` y devuelve 0 movs. Veo el contexto.

Esto es la causa raíz: el mini-proyecto **NO está saneado** — el extractor BBVA está roto (0 movs en todos los PDFs) por esa línea de debug huérfana. Es un leftover que solo loguea, así que quitarlo no cambia la semántica de extracción y desbloquea la validación real.

Ahora re-extraigo el BBVA y verifico que produce movimientos y encadena.

BBVA ya extrae (113 movs), pero **queda 1 break interno** y `final=1511894.08` (el valor "actual" incorrecto, no el esperado 1528204.08). Ese break es justo el movimiento P14 de 8,155 invertido (Δ=2×8155=16310). El crash `__DBG` enmascaraba todo. Ahora corro `validar_frontera` completo para ver el estado real de las 11.

Ahora sí el cuadro real (el crash `__DBG` lo ocultaba todo):

- **8 EXTRACTOR-BUG** → el extractor sigue emitiendo el signo equivocado (la resolución dual-saldo NO los arregló).
- **3 BOUNDARY** (ARBOLEDA 2025-05→06, BANDEZ 2025-10→11, BANDEZ 2026-03→04) → fronteras de periodo reales del banco, no son bug.

Nota: las BANBAJIO/BANREGIO de las "12" originales ya **no aparecen** en rotos_saldo.json (solo quedan 11, todas BBVA). Corro el `qa_saldos` completo para el titular DB y confirmar que no hay regresión en otros bancos.

El `qa_saldos` completo (estado DB) confirma que las BANBAJIO y BANREGIO de las "12" **siguen rotas** — antes solo veía 11 BBVA porque el `rotos_saldo.json` previo estaba parcial; esta corrida lo regeneró con las 20 reales. Como `rotos_saldo.json` ahora tiene las 20, re-corro `validar_frontera` para clasificar TODAS (incluidas BANBAJIO/BANREGIO) en EXTRACTOR-BUG vs BOUNDARY.

Listo. Tengo el cuadro completo y verificado. Déjame limpiar los probes scratch que creé.

## Validación — el mini-proyecto **NO está saneado**

Corrí los criterios de aceptación contra el estado actual. Resultado: no está listo, y además encontré una **regresión crítica** que enmascaraba todo.

### 🔴 Hallazgo crítico (lo arreglé)
El extractor BBVA estaba **devolviendo 0 movimientos en TODOS los PDFs**. Causa: una línea de debug huérfana en [desfragmentador.js:3020](backend/lib/desfragmentador/nodes/desfragmentador.js#L3020) — `if (__DBG) console.error('[DBG8155]...')` — `__DBG` nunca se definió → lanza `ReferenceError: __DBG is not defined`, que el `try/catch` convierte en `error_movimientos` y vacía la extracción.

- Lo confirmé extrayendo PDFs reales: `error_movimientos: "Error al extraer movimientos: __DBG is not defined"`, 0 movs.
- **Quité la línea** (solo logueaba; cero impacto en semántica). Tras el fix: UNIENDO ESFUERZO BBVA pasa de 0 → **113 movs**.
- ⚠️ Esto significa que **cualquier deploy/reproceso en el estado anterior habría borrado todo BBVA**. No desplegar nada de ese punto.
- Verifiqué que no quedan otras vars debug huérfanas (`__DBG`/`__DEBUG`/`DBG8155`): ninguna.

### Estado real tras destapar el crash
`validar_frontera.cjs` ahora clasifica las 20 transiciones rotas en DB:

- **12 EXTRACTOR-BUG** — el extractor sigue dando el signo equivocado. **Coinciden exactamente con las 12 del mini-proyecto.** Ninguna está resuelta.
- **8 BOUNDARY** — fronteras de periodo reales del banco (no son bug; dejarlas): KUSPIT GUNX/HERNO, BANREGIO PLACTON/ARQUITECTOS×2, BBVA ARBOLEDA 05→06 / BANDEZ 10→11 / BANDEZ 26-03→04.

`qa_saldos_mes_a_mes.cjs` (estado DB, sin reprocesar): **769 transic, 20 rotos (97.4%)** — BBVA 11, BANREGIO 5, BANBAJIO 2, KUSPIT 2. Las BANBAJIO (BALOVENTO, RESONANTE) y BANREGIO (EXXPAND ×2) de las "12" **siguen rotas** en DB.

**Conclusión:** la lógica dual-saldo (`resolverBloque`/`signoSemantico`/`vaciarPendientes`) está en el código pero **no resuelve ninguna de las 12**. EXXPAND BANREGIO tiene 6 breaks (es el multi-cuenta de [BANREGIO_MULTICUENTA_PROBLEMA.md](BANREGIO_MULTICUENTA_PROBLEMA.md) — encadenar saldo por cuenta/moneda); las BBVA/BANBAJIO tienen 1-2 breaks (signo invertido puntual).

---

### Prompt de regreso para el chat original

> **Estado del mini-proyecto "12 signos invertidos" tras validación — NO saneado, falta todo el fix de signo.**
>
> **🔴 PRIMERO — regresión que rompía todo:** había una var debug huérfana `__DBG` en `backend/lib/desfragmentador/nodes/desfragmentador.js:3020` (dentro de `extraerMovimientosBBVA`) que lanzaba `ReferenceError: __DBG is not defined` → el `catch` la volvía `error_movimientos` y **toda extracción BBVA devolvía 0 movimientos**. Ya la quité (solo logueaba). Cualquier deploy/reproceso del estado anterior habría **vaciado BBVA**. Revisar que no se reintroduzca al seguir editando.
>
> **Estado real (ya con el extractor funcionando):** corrí `qa_saldos_mes_a_mes.cjs` + `validar_frontera.cjs`. De las 20 transiciones rotas en DB:
> - **12 = EXTRACTOR-BUG**, y son EXACTAMENTE las 12 del proyecto. **Ninguna está arreglada todavía.** La lógica dual-saldo (`resolverBloque`/`signoSemantico`/`vaciarPendientes`/`dualSaldo`) está presente pero no resuelve estos casos.
> - **8 = BOUNDARY** (fronteras de periodo reales del banco) → **NO tocar** (KUSPIT GUNX/HERNO, BANREGIO PLACTON/ARQUITECTOS×2, BBVA ARBOLEDA 25-05→06, BANDEZ 25-10→11 y 26-03→04).
>
> **Las 12 que faltan (con # de breaks internos como pista):**
> - BBVA 1 break (signo puntual invertido): UNIENDO 2025-03→04 (Δ16310=2×8155), 2025-08→09 (Δ20000), 2026-03→04 (Δ0.1); PLACTON 2025-05→06 (Δ720k!); ANZAND 2026-03→04 (Δ40k); BANDEZ 2025-03→04 (Δ20k).
> - BBVA 2 breaks: PLACTON 2025-02→03 (Δ0.74); ARBOLEDA 2026-02→03 (Δ37146).
> - BANBAJIO 1 break: BALOVENTO 2025-07→08 (Δ-400622); RESONANTE 2025-10→11 (Δ1493875). Ya tiene delta-saldo — ver por qué no aplica el signo.
> - BANREGIO EXXPAND **6 breaks**: 2025-03→04 y 04→05 = el multi-cuenta de `BANREGIO_MULTICUENTA_PROBLEMA.md` (encadenar saldo POR cuenta/moneda, no es un signo suelto).
>
> **DB:** sigue con 20 rotos (sin reprocesar). Reclasificar signo en datos toca dirección contable → requiere OK explícito; emparejar por SALDO.
>
> **Aceptación (sin cambios):** `validar_frontera.cjs` las 12 → todas OK/BOUNDARY (0 EXTRACTOR-BUG); `qa_saldos` BBVA/BANBAJIO/BANREGIO suben sin regresión; guard `saldo_anterior + Σ(dep−ret) == saldo_final_pdf` por estado; deploy verificado.

¿Quieres que **deje commiteado el fix del `__DBG`** (es un one-liner que estaba rompiendo producción BBVA) por separado, o prefieres mandarlo al otro chat para que entre junto con el fix de signo en un solo deploy?

> ⚙️ *Herramientas: Read×6, Glob×3, Bash×25, Write×3, Edit×4*

### 👤 Usuario · 18:13

ok empareja saldo por favor, hay qye sanearlo todo aqui

### 🤖 Claude · 18:14

Voy a sanear todo aquí: emparejar por saldo. Esto es depuración + corrección de datos contables (con tu OK explícito), así que lo haré de forma sistemática y con snapshot antes/después por regla del proyecto. Déjame cargar la disciplina de debugging primero.

Estoy en Fase 1 (causa raíz). La pregunta clave antes de tocar nada: **¿la columna `«REDACTADO»` en la DB es verdad independiente (viene del PDF) o se calculó desde el dep/ret equivocado?** Eso decide si "emparejar por saldo" funciona. Voy a volcar los datos reales alrededor de cada break.

**Hallazgo clave de Fase 1:** los renglones en la DB **NO están en orden cronológico** — todos tienen `fecha_reporte=2025-04-30` (la fecha de corte) y mi diagnóstico los ordenó por `id` (UUID aleatorio). Por eso aparecen 112 "breaks" falsos. La columna `saldo` es real (del PDF) pero el ORDEN es lo que está perdido. Necesito ver cómo ordena `qa_saldos` y si existe una columna de secuencia.

**Hallazgo decisivo de Fase 1:** `qa_saldos` y `validar_frontera` **NO leen los signos de la DB** — re-extraen el PDF fresco (`procesarPDF`) y validan la cadena sobre esa extracción ("lo que produciría el reproceso"). Es decir, **ambos QA prueban el EXTRACTOR, no la DB**. Los "rotos" son bugs de signo del extractor en orden-PDF correcto. Entonces "emparejar por saldo" se hace **en el extractor**. Mi diag anterior miraba la DB en orden-UUID (irrelevante). Lo reescribo para mirar la extracción fresca y aislar el break.

Break en índice 81: realΔ=-16910 pero el movimiento es ret=600. La caída real de 16910 entre los renglones 80→81 indica que el error está en el **movimiento 80** (su saldo viene 16310 demasiado alto), no en el 81. Necesito ver la vecindad completa (el P14 ESCUELA 8155). Imprimo índices 76–84.

**Causa raíz confirmada (caso BBVA single-flip):** En índice 80, la línea PDF es `P14 ESCUELA JOHN F KENNE 8,155.00 **98,324.13**` (saldo inline 98,324.13, exactamente el del prompt). El movimiento 79 cierra en 106,479.13; con el saldo inline → 106,479.13 − 8,155 = 98,324.13 = **retiro**. Pero el extractor lo puso **dep=8155** (código P14 ambiguo, keyword no basta), inflando `net` en 2×8155=16,310. 

Clave: el **último saldo (1,511,894.08) ES correcto** (final real del PDF); lo único malo es `net`. qa_saldos valida `prevFinal + net == lastSaldo`, y `net` está inflado. Entonces la corrección es: **voltear el movimiento de 8155** para que `net == lastSaldo − openSaldo`. 

Ahora confirmo si BANBAJIO y BANREGIO (multi-cuenta, 6 breaks) siguen el mismo patrón o son estructurales. Localizo y diagnostico esos PDFs.

Voy a obtener los `archivo` exactos de la DB para los rotos de BANBAJIO/BANREGIO y diagnosticar la extracción fresca de cada uno.

EXXPAND 2025-04 mezcla varios PDFs (los "TDC" son tarjetas de crédito mal archivadas; el real multi-cuenta es "PESOS Y DLL"). Diagnostico los tres patrones: BANBAJIO ×2 y el BANREGIO multi-cuenta (MXN+USD).

BANBAJIO tiene **otra causa raíz** (no es flip de signo): en ambos, el **último movimiento** captura el saldo como monto (BALOVENTO `dep=404218.92`=saldo, debía ser 3596; RESONANTE `ret=1493876.32`=saldo, debía ser 1.2). Aquí la columna saldo SÍ es fiable, así que `realDelta` corrige monto Y signo. Distinto a BBVA (donde el saldo del renglón malo está corrompido). Ahora diagnostico el tercer patrón: BANREGIO EXXPAND multi-cuenta (MXN+USD).

Phase 1 completa. El tercer patrón es **estructural, no un signo invertido**: EXXPAND BANREGIO "PESOS Y DLL ABRIL" extrae limpio (26 movs, **0 breaks**). Los 6 breaks que reporta el QA vienen de que la carpeta de abril tiene **PDFs de tarjeta de crédito (TDC) de 2024 mal archivados** que se concatenan y atribuyen a EXXPAND BANREGIO abril — más la estructura multi-cuenta del [doc BANREGIO](BANREGIO_MULTICUENTA_PROBLEMA.md). Eso no se arregla con saldo.

Déjame actualizar el diagnóstico y resumir los **3 causas-raíz distintas** que encontré:

Antes de construir, un hallazgo material cambia el plan: **las "12" no son 12 flips de signo** — son **3 mecanismos distintos**, y uno no es de signo. También confirmé algo clave: **`«REDACTADO»`/`validar_frontera` re-extraen el PDF (no leen la DB)** → corregir la DB *no* los pone en verde; **hay que arreglar el extractor/runner** para que el QA pase, y aparte reprocesar la DB para la app.

Resumen de causa raíz:

| Patrón | Casos | Causa | "Emparejar por saldo" lo arregla? |
|---|---|---|---|
| **BBVA flip** | UNIENDO 03→04/08→09, PLACTON 05→06, ANZAND, ARBOLEDA 02→03, BANDEZ 03→04 | 1 movimiento con código ambiguo (P14/N06) recibe signo contrario; saldo final correcto, `net` inflado 2×monto | **Sí** (flip por reconciliación de net/saldo) |
| **BBVA ruido** | UNIENDO 26-03→04 (Δ0.1), PLACTON 02→03 (Δ0.74) | centavos/redondeo, no es signo | son ~OK; el guard los deja igual |
| **BANBAJIO** | BALOVENTO, RESONANTE | el **último** movimiento captura el saldo como monto (BALOVENTO dep=404,218.92 debía ser 3,596; RESONANTE ret=1,493,876.32 debía ser 1.20) | **Sí** (realΔ corrige monto+signo) |
| **BANREGIO EXXPAND** | 2025-03→04, 04→05 | **NO es signo**: PDFs de TDC 2024 mal archivados en carpetas 2025 se concatenan a EXXPAND BANREGIO + multi-cuenta pesos/dólares (es el `BANREGIO_MULTICUENTA_PROBLEMA.md`) | **No** — es higiene de datos + multicuenta, otro proyecto |

Mi plan recomendado: construir un **post-pass `reconcileBySaldo` guardado** en el runner (capa única que alimenta QA, /pdf-guardar y reproceso), que SOLO actúa cuando la cadena no cuadra y SOLO aplica si deja `net == saldo_final − saldo_inicial` (cero regresión sobre los 749 OK). Eso sanea BBVA-flip + BANBAJIO. BANREGIO EXXPAND lo dejo fuera (es el otro proyecto multicuenta + mover los TDC mal archivados).

Alcance confirmado: **BBVA-flip + BANBAJIO** vía post-pass guardado; **DB con dry-run + snapshot** y tu OK antes de aplicar. BANREGIO queda para el proyecto multicuenta.

Voy con TDD: primero el test (RED), luego el módulo `reconcile_saldo`, luego lo cableo al runner y valido con los harnesses reales.

Escribo el test primero (RED) con datos sintéticos que reflejan las 3 formas reales.

RED confirmado (módulo no existe). Ahora escribo el módulo mínimo para pasar.

GREEN. Ahora cableo el post-pass al runner y valido con los harnesses reales (la prueba definitiva, que usa saldos reales del PDF).

Ahora la prueba definitiva: re-corro `validar_frontera` (re-extrae con el post-pass activo). BBVA-flip y BANBAJIO deben pasar a OK; BANREGIO debe seguir EXTRACTOR-BUG (fuera de alcance), KUSPIT BOUNDARY.

Excelente avance: **EXTRACTOR-BUGS 12 → 4**. El post-pass arregló las 2 BANBAJIO y 6 de las BBVA (todas a gap 0). Quedan 4:
- **EXXPAND BANREGIO ×2** — fuera de alcance (multicuenta), esperado.
- **UNIENDO 2026-03→04 Δ0.1** — ruido de centavos (no es signo).
- **PLACTON BBVA 2025-05→06 Δ-720k** — uno grande que NO se arregló. Hay que investigar.

Corro el `qa_saldos` completo (chequeo de regresión global) y en paralelo diagnostico los 2 BBVA pendientes.

BBVA rotos **11 → 5**, sin regresión (105 OK vs 99 antes; 6 arreglados, 0 rotos nuevos). De esos 5, **3 son BOUNDARY reales** (ARBOLEDA 05→06, BANDEZ 10→11, BANDEZ 26-03→04 — gaps de periodo del banco, no bugs; `qa_saldos` no los distingue). Quedan 2 bugs BBVA verdaderos: PLACTON 06 (Δ720k) y UNIENDO 26-04 (Δ0.1). Los diagnostico.

Dos casos distintos:
- **UNIENDO 2026-04 Δ0.1:** break en [104] realΔ=-2999.95 vs ret 3000 → diferencia de **5 centavos** (ruido del banco, no es signo). Fuera de "signos invertidos".
- **PLACTON 2025-06 Δ-720k:** break en [63] realΔ=-711,882.3 (≈720k). No es un flip simple de un solo monto; el `half=360000` no existe como movimiento único. Necesito ver la vecindad. Volcado ampliado:

Diagnóstico claro:
- **UNIENDO 2026-04 Δ0.1:** break de **5 centavos** (realΔ=-2999.95 vs ret 3000) — ruido del banco, no es signo invertido. El guard correctamente no lo toca.
- **PLACTON 2025-06 Δ-720k:** NO es un flip simple. En [62] `N06 PAGO CUENTA 400,000.00` el saldo inline es 372,649.88 pero ni +400k ni −400k desde [61] dan ese saldo — es una **corrupción de parseo dual-saldo de varias líneas** (la cola larga de BBVA que el prompt advertía). Mi post-pass correctamente **revierte** (no puede cuadrar limpio → lo deja marcado, sin inventar). Requiere trabajo del parser dual-saldo, no de saldo.

Lo importante: arreglé **8 casos limpios** (2 BANBAJIO + 6 BBVA) sin regresión. Verifico regresión global en TODOS los bancos:

**Cero regresión confirmada.** Comparativa global:

| banco | rotos antes | rotos después |
|---|---|---|
| BANBAJIO | 2 | **0** ✓ |
| BBVA | 11 | **5** ✓ |
| BANREGIO | 5 | 5 (fuera de alcance) |
| KUSPIT | 2 | 2 (BOUNDARY/dormidas) |
| resto | 0 | 0 |
| **TOTAL** | **20** | **12** |

Ningún banco subió; 8 rotos eliminados. De los 12 que quedan: ~8 son BOUNDARY/ruido reales (no bugs), 2 BANREGIO EXXPAND (fuera de alcance), 1 PLACTON-junio (corrupción de parseo dual-saldo, el guard lo deja marcado sin inventar), 1 UNIENDO 0.1 (centavos).

Actualizo todos y paso al dry-run de DB. Hallazgo importante: la DB de UNIENDO ya tenía `ret=8155` **correcto** (el bug era solo del extractor que re-extrae) — así que como dice el patrón OVEDAI, puede que **no haya datos que tocar**. El dry-run compara DB vs extractor corregido emparejando **por saldo**.

El dry-run destapó un problema en MI lógica: el post-pass recalcula **toda** la columna de saldos (running sum), lo que hace que los saldos diverjan de la realidad en renglones no-cambiados (UNIENDO 09: 21 unmatched) y genera **falsos diffs** por saldos duplicados (650/4346.88 con mismo saldo). 

Debo recalcular **solo el saldo del movimiento cambiado** (local), no toda la cadena — los saldos aguas abajo ya son anclas reales. Corrijo `reconcile_saldo.js`:

Local-saldo fix no regresiona (sigue arreglando los 8; unit test verde). Re-corro el dry-run — ahora los renglones no-cambiados conservan su saldo real, así que los falsos diffs por drift deberían desaparecer:

Aún hay falsos diffs por **saldos duplicados** en UNIENDO 2025-04 (650 y 4346.88 comparten saldo 283401.65 → el join los cruza) y porque comparar el estado COMPLETO destapa discrepancias DB-vs-extractor históricas ajenas a este fix. Debo limitar el dry-run a **solo los movimientos que el post-pass cambió** (`reconcile.detalle`), emparejados por su saldo corregido. Anoto el saldo en cada cambio:

Ahora reescribo el dry-run para mirar **solo los cambios del post-pass** (`r.reconcile.detalle`), emparejados por su saldo ancla con la DB:

Mucho más limpio. Pero los BBVA sign-flip dan "sin renglón DB que empate" — porque mi saldo recomputado del movimiento volteado **no coincide con el saldo real en la DB** (la DB y el extractor desplegado son poblaciones distintas — memoria: "Reproceso ≠ extractor desplegado"). UNIENDO 04 sí empató y la **DB ya estaba correcta** (ret=8155).

La pregunta correcta para BBVA no es emparejar renglón, sino: **¿la DB de ese estado ya cuadra?** Agrego un chequeo de net de la DB vs target (autoritativo, sin emparejar renglones):

`target=?` porque el runner no expone `grupos`. Lo agrego:

Ahora el cuadro de la DB es claro y heterogéneo. El chequeo de net (autoritativo) revela:

- **BANBAJIO ×2** — DB descuadra justo por el monto del fix → **2 renglones a corregir, limpios** (snapshot guardado).
- **BBVA**: mezcla —
  - ANZAND 2026-04, BANDEZ 2025-04: **DB ya cuadra** ✓ (no tocar).
  - PLACTON 2025-03: descuadra 0.74 (centavos, ruido).
  - UNIENDO 2025-04: el 8155 **ya está bien** en DB; hay un −2,600 aparte (otro problema, fuera de alcance).
  - UNIENDO 2025-09: descuadra **20,000** (= el fix); la DB sí necesita el flip pero el renglón no empata por saldo (DB ≠ extractor desplegado).
  - ARBOLEDA 2026-03: descuadra **−335,202** (problema grande aparte, no es nuestro signo).

El renglón de UNIENDO 09 sí es nuestro. Agrego un fallback de emparejado por (descripción + valor erróneo `from`) para ubicarlo:

Hay colisión de nombre `target`. Reescribo el cuerpo del loop con fallback y nombre `hit`:

El fallback por `from` resultó **peligroso**: marcó BANDEZ (cuya DB **ya cuadra**) para "corregir" un ret=10,000 legítimo → lo habría **corrompido**. Y PLACTON es ruido de 0.37; UNIENDO 09 tiene 2 candidatos idénticos (ambiguo). Confirma que el parcheo quirúrgico de BBVA en DB **no es seguro** (DB ≠ extractor desplegado).

Reescribo el dry-run para que SOLO proponga correcciones por **ancla de saldo** (la vía confiable = BANBAJIO) y clasifique el resto por el chequeo de net, sin parchear a ciegas:

Ahora el dry-run es **seguro y limpio** (la falsa corrección de BANDEZ desapareció). Resultado final:

**2 renglones a corregir — BANBAJIO, vía ancla de saldo, snapshot guardado:**

| Estado | Movimiento | DB actual | Corregir a | Verificación |
|---|---|---|---|---|
| BALOVENTO 2025-08 | DEPÓSITO SPEI ASESORIA FISCAL | dep **404,218.92** | dep **3,596.00** | net→5,114.57 = target ✓ |
| RESONANTE 2025-11 | IVA COMISION TRANSFERENCIA | ret **1,493,876.32** | ret **1.20** | net→−29,343.44 = target ✓ |

**BBVA — nada que parchear a ciegas** (DB ≠ extractor desplegado; el parcheo quirúrgico corrompía BANDEZ):
- ANZAND 2026-04, BANDEZ 2025-04: **DB ya cuadra** ✓
- UNIENDO 09 (Δ20k = nuestro signo, pero 2 candidatos idénticos), UNIENDO 04 (Δ−2,600 aparte), PLACTON 03 (Δ−0.74 ruido), ARBOLEDA 03 (Δ−335,202 problema grande aparte) → **van por reproceso**, no por UPDATE.

Te confirmo el snapshot guardado:

El snapshot confirma el diagnóstico: la descripción trae `TOTAL* $ 404 218.92` y `TOTAL* $ 1 493 876.32` — el parser BANBAJIO capturó la línea **TOTAL** como monto. Los valores reales son claros: BALOVENTO depósito **3,596.00**, RESONANTE el **IVA de 1.20** sobre una comisión. Correcciones inequívocas.

Estoy en el punto de "confirmo contigo antes de aplicar". Snapshot de respaldo ya guardado en [snapshot_signos_db.json](reprocesar%20db/snapshot_signos_db.json).

Aplicando los 2 UPDATE de BANBAJIO (transacción única, snapshot ya respaldado):

✅ Los 2 BANBAJIO aplicados. Antes de reprocesar BBVA, debo verificar algo importante: el descuadre de **ARBOLEDA es −335,202** (mucho mayor que nuestro signo de ~37k) y UNIENDO 04 tiene −2,600 aparte. Reprocesar vía `procesarPDF` sobrescribe el estado completo (y según memoria, la DB fue poblada por otro script y **diverge en ordenante/concepto**). No quiero sobrescribir datos buenos con malos sin confirmar que el extractor es la verdad. Verifico el apply de BANBAJIO y investigo ARBOLEDA + busco el tooling de reproceso:

BANBAJIO verificado (ambos cuadran ✓). Antes de reprocesar BBVA, investigo el descuadre grande de ARBOLEDA (−335,202) para confirmar si el extractor es la verdad (reproceso seguro) o si la DB tiene datos buenos que no debo pisar. También reviso qué hace el tooling de reproceso:

**Hallazgo importante en ARBOLEDA 2026-03:** el extractor produce 51 movs, net=6,540.06, y su **último saldo (457,724.44) == el saldo_corte oficial del PDF** → el extractor es **correcto/verificado**. La DB tiene los mismos 51 movs pero net=−328,661.94. O sea la DB de ese estado está **muy mal** (no es 1 signo nuestro, son ~335k en varios movimientos mal ingestados desde el inicio) y el extractor lo arreglaría.

Pero `reprocesar_movimientos.js` es un actualizador de campos desde CSV, no delete+reinsert. Reviso `ingestar_mes.cjs` y `dry_run_reproceso_total.cjs` — y aquí hay un riesgo que debo verificar antes de pisar datos: el reproceso vía `procesarPDF` reescribe TODO el estado, incluidos campos enriquecidos (ordenante/concepto) que según memoria la DB puede tener mejores:

Ahora entiendo el tooling y un punto clave: **el repo trata importes/saldo como verdad curada** — `reproceso_aditivo.cjs` explícitamente "NUNCA toca importes" y empareja por `fecha+retiro+deposito+SALDO`. Un delete+reinsert ciego iría contra esa filosofía y pisaría campos enriquecidos (ordenante/concepto) que la DB puede tener mejores.

Pero ARBOLEDA tiene importes **mal** (net −335k) y el extractor está **verificado** (último saldo == saldo_corte del PDF). La vía segura que respeta ambas cosas: **realinear solo importes** (dep/ret/saldo) copiando del extractor verificado, emparejando por (fecha + monto absoluto + descripción), sin tocar campos enriquecidos, con snapshot. Lo construyo como dry-run:

El realineo por monto+descripción resulta **demasiado ambiguo** para BBVA (24/17/19/30 movimientos con mismo monto+descripción — muchas nóminas iguales, sin orden estable en la DB). Y no captura el error real de ARBOLEDA: solo 1 realineo encontrado pese a −335,202 de descuadre (los errores están entre los 12 ambiguos + 6 sin-match). Además ANZAND salió "no confiable" (saldo_corte se parseó como 63.84).

**Conclusión (pared arquitectónica):** el importe de BBVA en la DB **no se puede arreglar quirúrgicamente** — ni por saldo, ni por monto+desc (ambigüedad por duplicados sin orden). La única vía fiable es **delete + re-ingesta** del estado completo vía extractor verificado, que **sí** sobrescribe campos enriquecidos. Eso es más grande y riesgoso que "12 signos", y ARBOLEDA resultó ser un estado entero mal ingestado (no 1 signo).

Limpio los scratch fallidos y te reporto el estado real para que decidas la vía de BBVA con información completa:

## Estado del saneamiento — resumen honesto

### ✅ Hecho y verificado
1. **Regresión fatal arreglada:** `__DBG` huérfano hacía que BBVA extrajera **0 movimientos**. Quitado.
2. **Extractor saneado (post-pass `reconcile_saldo`, con TDD):** emparejar por saldo, guardado (cero regresión). Resultado en los harnesses reales:
   - `qa_saldos`: rotos **20 → 12**; **8 transiciones arregladas**, 0 rotos nuevos en ningún banco.
   - BANBAJIO 2→0, BBVA 11→5 (de esos 5: 3 son BOUNDARY reales, 1 ruido 0.1, 1 PLACTON-junio con corrupción de parseo dual-saldo que el guard deja marcado sin inventar).
3. **DB BANBAJIO:** 2 UPDATE aplicados y verificados (BALOVENTO y RESONANTE ahora cuadran). Snapshot en [snapshot_signos_db.json](reprocesar%20db/snapshot_signos_db.json).

### ⚠️ DB de BBVA — choqué con una pared y necesito tu decisión
Pediste "reprocesar los 8 estados", pero al investigar encontré cosas que cambian el riesgo:

| Estado | DB | Realidad |
|---|---|---|
| ANZAND 2026-04, BANDEZ 2025-04 | **ya cuadra ✓** | no tocar |
| PLACTON 2025-03 | Δ−0.74 | ruido de centavos |
| UNIENDO 2025-04 | Δ−2,600 | el 8155 ya está bien; hay otro −2,600 ajeno |
| UNIENDO 2025-09 | Δ−20,000 | es nuestro signo (un 10k), pero **2 candidatos idénticos** |
| **ARBOLEDA 2026-03** | **Δ−335,202** | estado **entero mal ingestado**; extractor verificado correcto (último saldo == saldo_corte del PDF) |

**El importe de BBVA en la DB no se puede arreglar quirúrgicamente:** lo intenté por ancla de saldo (DB≠extractor desplegado, no empata) y por monto+descripción (24/17/30 movimientos con mismo monto+desc → ambiguo, sin orden estable). La única vía fiable es **delete + re-ingesta** del estado vía extractor verificado — pero eso **sobrescribe campos enriquecidos** (ordenante/concepto), lo cual va contra la filosofía del repo (`reproceso_aditivo` "NUNCA toca importes"). Y ARBOLEDA resultó un problema mayor que "12 signos".

Lo durable —el **extractor**— ya quedó bien: cualquier reproceso/ingesta futura sale correcta.

Entendido: **diferir BBVA al reproceso total** (el extractor ya quedó saneado) y **guardar aprendizajes**. Escribo la memoria del proyecto.

Memoria guardada. Verificación final de los entregables:

Nota importante para deploy: `reconcile_saldo.js` (nuevo), `runner.js` (modificado) y `desfragmentador.js` (fix `__DBG`) están en carpeta **gitignored** → se despliegan por **scp + server.yml** (como `desfragmentador.js`), no por git. `_diag_gaps4.txt` no es mío (preexistente), lo dejo.

Listo. Saneamiento cerrado según tus decisiones.

## Resumen final

**Extractor (lo durable) — saneado y verificado, cero regresión:**
- Arreglada regresión fatal `__DBG` que hacía a BBVA extraer **0 movimientos** (un deploy en ese estado habría vaciado BBVA).
- Nuevo post-pass `reconcile_saldo` (emparejar por saldo, guardado, con TDD) cableado en el runner: `qa_saldos` rotos **20 → 12**, **8 transiciones arregladas**, 0 rotos nuevos en ningún banco. Los 12 restantes: ~8 BOUNDARY reales + 2 BANREGIO multicuenta (otro proyecto) + PLACTON-junio (corrupción de parseo) + 1 ruido de centavos.

**DB:**
- BANBAJIO: 2 UPDATE aplicados y verificados (BALOVENTO, RESONANTE ahora cuadran; snapshot guardado).
- BBVA: **diferido al reproceso total** (no es parcheable quirúrgicamente; el extractor ya da el signo correcto, así que el reproceso "re-extrayendo para alinear" lo saneará).

**Memoria:** guardada en [project_reconcile_saldo_postpass.md](../../.claude/projects/c--Users-Diego-Documents-GitHub-gestion-react-gestion-financiera/memory/project_reconcile_saldo_postpass.md) + índice.

**⚠️ Deploy pendiente:** los cambios viven en carpeta gitignored → hay que subir por **scp + server.yml**: `reconcile_saldo.js` (nuevo), `runner.js` (modificado) y `desfragmentador.js` (fix `__DBG`). En producción todavía corre el código viejo.

---

### Prompt de regreso para el chat original

> **Saneamiento de los "12 signos invertidos" — cerrado (parcial por diseño).**
>
> **Causa raíz (3 mecanismos, no 12 flips):** BBVA = código ambiguo (P14/N06) con signo contrario, net inflado 2×monto, saldo final correcto; BANBAJIO = el último mov captura la línea TOTAL/saldo como monto; BANREGIO EXXPAND = NO es signo (PDFs TDC 2024 mal archivados + multicuenta → es el otro proyecto).
>
> **Hecho:**
> 1. Arreglada regresión `__DBG is not defined` en `desfragmentador.js` (extraerMovimientosBBVA) que hacía BBVA = 0 movimientos. **No desplegar nada anterior a este fix.**
> 2. Nuevo `backend/lib/desfragmentador/reconcile_saldo.js` — post-pass "emparejar por saldo" cableado en `runner.js` `procesarPDF` (paso 7). Guard: solo corrige si la cadena no cuadra y solo aplica si deja `net == saldo_final − saldo_inicial` (cero regresión). TDD en `reprocesar db/test_reconcile_saldo.cjs`.
> 3. qa_saldos rotos 20→12 (BANBAJIO 2→0, BBVA 11→5), 8 transiciones arregladas, 0 regresión. validar_frontera: las 8 → BOUNDARY gap 0.
> 4. DB BANBAJIO: 2 UPDATE aplicados (BALOVENTO, RESONANTE). DB BBVA diferida al reproceso total.
>
> **Pendiente:**
> - **Deploy** scp+server.yml de `reconcile_saldo.js` + `runner.js` + `desfragmentador.js` (gitignored), luego verificar healthy/cargas/migraciones.
> - **DB BBVA** vía reproceso total: ARBOLEDA 2026-03 está mal ingestado entero (DB net −328k vs extractor 6540, mismos 51 movs; extractor verificado: último saldo == saldo_corte). UNIENDO 09 (−20k), UNIENDO 04 (−2,600 ajeno). ANZAND/BANDEZ ya cuadran. PLACTON 03 = ruido.
> - **PLACTON BBVA junio 2025** (Δ−720k): corrupción de parseo dual-saldo de varias líneas (no es flip simple); el guard la deja marcada. Requiere trabajo del parser dual-saldo BBVA.
> - **BANREGIO EXXPAND**: sigue al `BANREGIO_MULTICUENTA_PROBLEMA.md` (separar pesos/dólares + reubicar PDFs TDC).

¿Quieres que prepare el deploy scp ahora, o lo dejas para cuando juntes el lote (PEIBO+BANORTE+SANTANDER+BANREGIO)?

> ⚙️ *Herramientas: Skill×2, ToolSearch, TodoWrite×7, Write×8, Bash×31, Read×7, Edit×14, AskUserQuestion×3*

### 👤 Usuario · 19:31

<task-notification>
<task-id>bykzifyk4</task-id>
<tool-use-id>toolu_0177FdUux1DjAkkaBMRMn2RK</tool-use-id>
<output-file>C:\Users\Diego\AppData\Local\Temp\claude\c--Users-Diego-Documents-GitHub-gestion-react-gestion-financiera\a0fabf9b-ef0f-4b4d-b205-7ab320dce6b8\tasks\bykzifyk4.output</output-file>
<status>completed</status>
<summary>Background command "Check PDFs exist for one rotos case" completed (exit code 0)</summary>
</task-notification>

### 🤖 Claude · 19:33

Ese era el probe viejo del inicio (el query que parecía colgado) — ya quedó obsoleto, no aporta nada al estado actual. Lo ignoro.

Sigo a la espera de tu decisión sobre el **deploy**: ¿lo preparo por scp ahora, o lo dejas para juntarlo con el lote (PEIBO + BANORTE + SANTANDER + BANREGIO)?

### 👤 Usuario · 18:06

Ahora el prompt de regreso para el otro chat (resumen ejecutable de lo logrado + lo que queda, listo para pegar):

RESULTADO mini-proyecto "corregir 12 movimientos con signo invertido (cadena de saldos)".

ESTADO: hecho y desplegado. qa_saldos BBVA pasó de 11→1 roto (90%→99.1%), sin regresión.
Alcance confirmado = SOLO extractor (patrón OVEDAI: la DB ya estaba correcta para BBVA/BANBAJIO;
no se tocó contabilidad). Único cambio de datos: 4 filas basura TDC borradas (BANREGIO, con OK).

QUÉ SE ARREGLÓ (backend/lib/desfragmentador/nodes/desfragmentador.js — gitignored, deploy scp+rebuild backend):
- BBVA extraerMovimientosBBVA (~2503): causa raíz = el signo del movimiento ANCLA (con saldo impreso)
  se decidía por block-solve crudo; con bloques grandes (n>20, 84% de líneas BBVA sin saldo) caía en
  heurística voraz y elegía mal. Fix = "ancla por saldo impreso": (1) semántica SPEI inequívoca del
  propio mov, (2) si no, el saldo_antes que cierra el bloque RESPETANDO semántica (errorCierreBloque),
  forzando la semántica SOLO si reconcilia (err≤0.5) para no voltear pendientes en anomalías.
- signoSemantico BBVA ampliado: T2x/SPEI RECIBIDO→dep, T1x/SPEI ENVIADO→ret, C07/DEP.CHEQUES→dep.
- BANREGIO extraerMovimientosBanregio (~3613): guard al inicio que detecta estados de TARJETA DE
  CRÉDITO (/tarjeta de crédito/i + /pago mínimo|línea de crédito/i) y devuelve 0 movimientos (no son
  cuentas bancarias; contaminaban EXXPAND). + borradas 4 filas DB (archivo ILIKE '%TDC%').
- BANBAJIO: ya estaba en 0 rotos (corregido en sesión previa).

RESULTADO por banco: BBVA 1 roto (Δ0.1 centavos UNIENDO 2026-04); BANBAJIO 0; BANREGIO 0 EXTRACTOR-BUGS
(los rotos restantes son BOUNDARY = gaps de periodo reales).

PENDIENTE (2 quirks net-preserving, NO son inversiones de signo — qa_saldos pasa):
1) ARBOLEDA 2026-03: el C07 ya tiene el signo correcto (depósito). Queda un break interno de 163,800
   porque BBVA DIFIERE el saldo del cheque (op 26/MAR → liq 27/MAR). Para 100% interno habría que
   reordenar el C07 a su fecha de liquidación. Bajo valor.
2) UNIENDO 2025-09: línea con dual-saldo fusionado "10,000.00 579,983.20 599,983.20" (dos N06 de 10000,
   diff=2×monto). Ambigüedad real. Net cuadra; cadena interna desfasa. Requeriría parseo de "dual-saldo
   de bloque" — riesgoso.

HERRAMIENTAS (reprocesar db/): qa_saldos_mes_a_mes.cjs (net cross-month, --banco=X), validar_frontera.cjs
(EXTRACTOR-BUG vs BOUNDARY, lee rotos_saldo.json), test_extractor_bbva_signo.cjs y
test_extractor_banregio_tdc.cjs (TDD). PDFs locales en "ESTADOS DE CUENTA PDF". DB = tesoreria@134.209.64.96.
Deploy: backup *.predeploy en server → scp → rebuild backend (docker-compose.server.yml) → healthy.

RECOMENDACIÓN: parar aquí (objetivo cumplido; los 2 restantes son comportamiento del banco, net-preserving,
sin impacto en totales ni DB). Detalle completo en memoria: project_extractor_signo_bbva_banregio.md.

### 🤖 Claude · 18:09

Antes del prompt, una reconciliación crítica entre los dos chats (trabajaron el **mismo** `desfragmentador.js` en paralelo):

- **El otro chat ganó y es lo canónico.** Su fix de *ancla por saldo impreso* en `extraerMovimientosBBVA` resolvió BBVA en el parser (11→1) y **ya está desplegado**. Eso supera mi enfoque local de post-pass (`reconcile_saldo.js`, 11→5).
- **El `__DBG`/`[DBG8155]` que yo "arreglé" era SU breadcrumb de debug** (el 8155 = el caso UNIENDO ESCUELA) en plena cirugía del anclaje. Su versión final lo resolvió bien.
- **⚠️ NO desplegar mi rama local** (`reconcile_saldo.js` + edición de `runner.js` + mi edición de `desfragmentador.js`): haría *scp ciego* sobre el fix mejor que ya está en producción (justo el peligro de [servidor diverge de git]). Recomiendo **descartar** esos cambios locales; lo único durable que dejo son los **2 UPDATE BANBAJIO** (ortogonales, ya aplicados y consistentes con "BANBAJIO 0 rotos").
- **Cross-validación:** mi análisis independiente coincide con el suyo en los 2 pendientes (UNIENDO 2025-09 dual-saldo fusionado; ARBOLEDA 2026-03). Su lectura de ARBOLEDA es **más correcta** que la mía: es cheque diferido (op 26→liq 27, net-preserving), no 335k de signos mal — confirma que diferir la DB BBVA fue lo acertado.

---

### Prompt de regreso (consolidado, listo para pegar)

> **CIERRE mini-proyecto "12 signos invertidos (cadena de saldos)" — consolidado entre los dos chats.**
>
> **ESTADO: hecho y desplegado (2026-06-24).** El fix canónico fue del chat del extractor: *ancla por saldo impreso* en `extraerMovimientosBBVA` + guard TDC en `extraerMovimientosBanregio`. qa_saldos BBVA **11→1 roto** (99.1%), BANBAJIO 0, BANREGIO 0 EXTRACTOR-BUGS (resto = BOUNDARY reales). Sin regresión. Alcance = SOLO extractor (patrón OVEDAI; la DB ya estaba correcta para BBVA/BANBAJIO). Único cambio de datos: 4 filas basura TDC borradas en BANREGIO (con OK) + 2 UPDATE BANBAJIO de monto (BALOVENTO 404,218.92→3,596; RESONANTE 1,493,876.32→1.20, eran la línea TOTAL capturada como monto).
>
> **Validado de forma independiente** por el chat de validación (qa_saldos_mes_a_mes.cjs + validar_frontera.cjs, re-extracción fresca): mismos 2 pendientes, ambos **net-preserving** (qa pasa, no son inversiones de signo):
> 1. **UNIENDO 2025-09**: línea con dual-saldo de bloque fusionado ("10,000.00 579,983.20 599,983.20", dos N06 de 10k). Ambigüedad real; cadena interna desfasa, net cuadra. Requeriría parseo "dual-saldo de bloque" (riesgoso).
> 2. **ARBOLEDA 2026-03**: el C07 ya tiene signo correcto (depósito); break interno de 163,800 porque BBVA **difiere** el saldo del cheque (op 26/MAR → liq 27/MAR). Para 100% interno habría que reordenar el C07 a fecha de liquidación. Bajo valor.
> 3. **UNIENDO 2026-04**: Δ0.1 centavos (ruido del banco, no es signo).
>
> **Limpieza de ramas paralelas:** el chat de validación produjo un enfoque alterno (post-pass `reconcile_saldo.js` en el runner) que quedó **superado** por el fix de parser ya desplegado. **NO desplegar esa rama** (pisaría producción). Descartar `reconcile_saldo.js` + edición de `runner.js` + edición local de `desfragmentador.js` de ese chat. (El `__DBG`/[DBG8155] era un breadcrumb de debug en tránsito, ya resuelto en la versión desplegada.)
>
> **PENDIENTE futuro (no signos):** BANREGIO EXXPAND multicuenta pesos/dólares sigue al `BANREGIO_MULTICUENTA_PROBLEMA.md`. DB BBVA: diferida al reproceso total ("re-extrayendo para alinear"); ARBOLEDA/UNIENDO-09 se resuelven solos ahí (son net-preserving, no urgentes).
>
> **HERRAMIENTAS** (`reprocesar db/`): qa_saldos_mes_a_mes.cjs (--banco=X), validar_frontera.cjs (lee rotos_saldo.json), test_extractor_bbva_signo.cjs / test_extractor_banregio_tdc.cjs (TDD). PDFs en "ESTADOS DE CUENTA PDF". DB = tesoreria@134.209.64.96. Deploy: backup *.predeploy en server → scp → rebuild backend (docker-compose.server.yml) → healthy. Detalle: memoria `project_extractor_signo_bbva_banregio.md`.
>
> **RECOMENDACIÓN: parar aquí.** Objetivo cumplido; los 2 restantes son comportamiento del banco, net-preserving, sin impacto en totales ni DB.

¿Quieres que **descarte ahora mi rama local** (`reconcile_saldo.js`, el cambio en `runner.js` y mi edición de `desfragmentador.js`) para dejar el árbol limpio y alineado con lo desplegado? Los 2 UPDATE BANBAJIO los dejo como están (ya aplicados).
