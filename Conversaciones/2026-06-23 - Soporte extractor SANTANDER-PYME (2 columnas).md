---
tipo: memoria-conversacion
fecha: 2026-06-23
titulo: Soporte extractor SANTANDER-PYME (2 columnas)
proyecto: Gestión (Tesorería)
session_id: c118c148-8c71-49d1-82a3-64b64ebeba16
tags: [memoria, gestion, extractores, santander, pyme]
estado: cerrada
---

# Soporte extractor SANTANDER-PYME (2 columnas)

> [!info] Resumen
> Mini-proyecto: agregar soporte para el formato **"CUENTA SANTANDER PYME"** (layout de **2 columnas**) en `backend/lib/desfragmentador/nodes/desfragmentador.js`, función `extraerMovimientosSantander` (~L6891), que hasta entonces no lo manejaba. Rama `diego/tarik-flujo`, 6 turnos.

## Contexto
- El extractor de SANTANDER cubría el layout estándar; el formato **PYME a 2 columnas** rompía el parseo.

## Puntos clave / decisiones
- Se creó un **parser dedicado** para el layout de 2 columnas.
- **Root cause:** un glyph en zona **PUA** (área de uso privado Unicode) rompía el **seed del saldo** (caso "OVEDAI").
- Resultado tras el fix: **41/41** movimientos correctos.

## Pendiente / próximos pasos
- [ ] Validar SANTANDER-PYME dentro de la validación por cadena de saldos del reproceso total.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-07 - Extractores bancarios — bugs, corrección y reproceso]]
