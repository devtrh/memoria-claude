---
tipo: memoria-conversacion
fecha: 2026-06-16
titulo: Catálogos Clientes — saldo calculado, multi-cuenta, ejecutivos y CSV Tarik
proyecto: Gestión (Tesorería)
session_id: 9cbc9f08-6d72-4b00-8ef9-66fcc977b2c1
tags: [memoria, gestion, catalogos, clientes, saldo, multi-cuenta, ejecutivos, deploy]
estado: cerrada
---

# Catálogos Clientes — saldo calculado, multi-cuenta, ejecutivos y CSV Tarik

> [!info] Resumen
> Sesión larga sobre **Catálogos › Clientes**, toda desplegada al servidor con **deploy ligero** (solo archivos necesarios, sin deploy completo). Cuatro cambios: (1) **saldo/movimientos calculados** de movimientos reales igual que Haberes; (2) **Búsqueda global → exacta** (sin `%…%`, sin fuzzy); (3) **múltiples cuentas por cliente** (tabla `catalogo_cliente_cuentas` + editor de lista en UI); (4) **consolidación de ejecutivos** (NAYELI SAMANO→NAYELI, ROSA JOAQUIN→ROSSY en las 3 tablas). Además, CSV de **19 clientes que mueven por Tarik**.

## Contexto
- Catálogos mostraba `saldo`/`movimientos` desde columnas estáticas (casi siempre 0); Haberes los **calcula** de `movimientos_bancarios` + `movimientos_externo`. Se replicó esa lógica en `catalogos.js` (`GET /catalogo-clientes`).
- Deploy ligero verificado: el backend hornea el código en la imagen (sin bind-mount). Método = `scp` al host + `docker cp` en caliente + `docker restart teso-backend`. **Frontend requiere rebuild del contenedor** (nginx sirve bundle compilado). Siempre se comparó el archivo del server vs git HEAD antes de sobrescribir (server ≠ repo; solo diferencias CRLF/LF).

## Puntos clave / decisiones
- **Saldo/movimientos:** suman depósitos−retiros y cuentan filas de ambas fuentes por CLABE/cuenta y por nombre (Tarik). Los inputs manuales de Saldo/Movs del formulario ya **no** tienen efecto visible (queda el valor calculado).
- **Búsqueda exacta:** quitó comodines (`ILIKE 'q'`) y **desactivó el fallback fuzzy** en las 8 categorías; CLABE/fecha/UUID/monto siguen estructurados. Ojo: en Movimientos el texto exacto sobre `descripcion` casi nunca hará match (buscar por monto/fecha/CLABE).
- **Multi-cuenta:** nueva tabla `catalogo_cliente_cuentas` (1+ por cliente, `{cuenta, clabe, clabe_sufijo}`) con **backfill automático**; columnas legacy quedan como espejo de la cuenta principal (para no romper Haberes ni el match de efectivos). Alcance **solo Catálogos**. UI: componente `CuentasEditor` (agregar/quitar) en alta/edición y tabla con contador "N cuentas".
- **Ejecutivos:** el dropdown se arma de `DISTINCT ejecutivo` de **`colaboradores` ∪ `ops_clientes`** (no hay catálogo dedicado). Para que desaparezcan hubo que renombrar en las 3 tablas (snapshot antes/después, 0 residuos). Dropdown final: INTERNO · MARCO · NANCY · NAYELI · ROSSY · XOCHITL · YANET. Quedó **`ROSA=1`** suelto (distinto de "ROSA JOAQUIN").
- **CSV Tarik:** `clientes_tarik.csv` = distintos de `cliente` en `movimientos_externo` con `proveedor='tarik'` (**19**, todos registrados, tipo cliente). Se dedupó por nombres duplicados en `catalogo_clientes` (ATR/MARTHA HILDA/SESITI con 2 registros).

## Pendiente / próximos pasos
- [ ] Decidir si Haberes y el auto-match de efectivos por últimos-4 también consideran **todas** las cuentas (hoy solo la principal).
- [ ] ¿Pasar el `ROSA=1` suelto a ROSSY?
- [ ] Limpiar duplicados de nombre en `catalogo_clientes` (ATR/MARTHA HILDA/SESITI) y completar catálogo de 6 clientes Tarik sin ejecutivo/RFC.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Transcript: [📄 conversación completa](<transcripts/2026-06-16 - AYUDAME A QUE CUANDO ESTAMOS EN LA PANTALLA DE CATALOGOS EN CLIENTES,… [9cbc9f08].md>)
- Relacionada: [[2026-06-24 - Catálogo de Clientes — búsqueda por CLABE y multi-cuenta]]
- Relacionada: [[2026-06-19 - Haberes — filtro por proveedor con vista unificada]]
