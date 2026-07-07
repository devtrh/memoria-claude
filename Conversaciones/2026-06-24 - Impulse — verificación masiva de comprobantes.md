---
tipo: memoria-conversacion
fecha: 2026-06-24
titulo: Impulse — verificación masiva de comprobantes
proyecto: Gestión (Tesorería)
session_id: 083c2630-4daa-4f55-bd28-3471b3ca2de2
tags: [memoria, gestion, impulse, cep, banregio, comprobantes]
estado: en-curso
---

# Impulse — verificación masiva de comprobantes

> [!info] Resumen
> Mini-proceso: agregar una pestaña **Impulse** en **Efectivos y Externos** para **verificar masivamente** comprobantes (a partir del recibo masivo de **BANREGIO**). Incluye parser del recibo + motor CEP. Sesión de 59 turnos (`diego/tarik-flujo`), extendida hasta 07-07.

## Contexto
- Insumo: recibos masivos en `IMPULSE/ban…` (BANREGIO) con muchas operaciones por archivo.
- Reusa el motor de verificación **CEP** existente (Banxico) contra cada operación del recibo.

## Puntos clave / decisiones
- Pestaña nueva en **Efectivos y Externos** (y también accesible desde Externos); gating por rol `impulse`.
- **Parser del recibo masivo** BANREGIO + **motor CEP** por fila.
- La **clave de rastreo de BANREGIO se manda CON diagonales** (`/`) al verificar.
- Un recibo tipo **"solicitud"** = **sin clave de rastreo** = comprobante malo (no verificable).

## Pendiente / próximos pasos
- [ ] Ampliar cobertura a otros formatos de recibo masivo además de BANREGIO.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-05-20 - OCR robusto de comprobantes (SitesPay)]]
