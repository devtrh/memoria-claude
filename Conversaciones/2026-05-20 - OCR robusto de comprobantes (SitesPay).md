---
tipo: memoria-conversacion
fecha: 2026-05-20
titulo: OCR robusto de comprobantes (SitesPay)
proyecto: Gestión (Tesorería)
session_id: 9738a500-8d38-4fe3-a6ef-b4ebe1e4d744
tags: [memoria, gestion, ocr, comprobantes, cep, tesseract]
estado: cerrada
---

# OCR robusto de comprobantes (SitesPay)

> [!info] Resumen
> En **Efectivos y Externos → Verificar comprobante**, algunos comprobantes que son **imagen de SitesPay** no dejaban extraer **fecha** ni **monto**. Se trabajó en hacer el parser/OCR más robusto para esos formatos. Rama `master`→`main`, ~14 turnos.

## Contexto
- Flujo 2/3 de tesorería: verificación de comprobantes SPEI/CEP con OCR (`Tesseract.js`, `parsarComprobante*`).
- Caso problema: comprobantes en **imagen** (no PDF) del proveedor **SitesPay** → el OCR no encontraba fecha ni monto.

## Puntos clave / decisiones
- Endurecer el reconocimiento para variantes de layout de imagen (no solo el formato "canónico").
- Objetivo: extraer siempre fecha y monto para poder verificar el comprobante contra Banxico.

## Pendiente / próximos pasos
- [ ] Confirmar cobertura del OCR en otros proveedores de imagen además de SitesPay.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-24 - Impulse — verificación masiva de comprobantes]]
