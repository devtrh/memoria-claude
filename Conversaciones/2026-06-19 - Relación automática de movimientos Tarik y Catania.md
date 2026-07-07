---
tipo: memoria-conversacion
fecha: 2026-06-19
titulo: Relación automática de movimientos Tarik y Catania
proyecto: Gestión (Tesorería)
session_id: ac0c75e3-51f7-4c18-b6d9-27428856fdef
tags: [memoria, gestion, tarik, catania, clabe, backfill]
estado: cerrada
---

# Relación automática de movimientos Tarik y Catania

> [!info] Resumen
> Investigar por qué algunos movimientos que se sabe son de **Tarik** o **Catania** ya no traían la **relación** con sus grupos (antes lo hacía el flujo de automatización). Sesión muy larga (**154 turnos**, `diego/tarik-flujo`). Se corrigió la lógica de relación y se hizo **backfill** masivo de 2026.

## Contexto
- La relación CLABE→grupos (Tarik/Catania) es un **JOIN en lectura** sobre la tabla `grupos_clabe` (no un campo materializado).
- El extractor de **BBVA SPEI ENVIADO** no capturaba la **CLABE del beneficiario** (formato `<cod3> 00<CLABE18>`) → por eso ciertos movimientos (p. ej. GMZOR) no aparecían en Catania, que filtra por CLABE.

## Puntos clave / decisiones
- **Backfill 2026:** se recuperó la CLABE desde el `concepto` → Tarik pasó de 211 a **6033** filas relacionadas; Catania de 15 a **439**.
- **Catania no tiene catálogo de CLABEs** propio (limitación conocida).
- Fix del extractor BBVA + **backfill de 121 filas** (con snapshot); solo se recupera cuando la CLABE empieza con el código del banco.
- Bug de front: hacía lookup crudo de la relación.

## Pendiente / próximos pasos
- [ ] Construir/depurar un catálogo de CLABEs para Catania.
- [ ] Revisar el lookup crudo en el front.

## Enlaces
- Proyecto: [[Gestión (Tesorería)]]
- Índice: [[00 Índice de Memoria]]
- Relacionada: [[2026-06-15 - Flujo Tarik — frontales, caja, saldos y retornos]]
- Continúa en: [[2026-06-22 - Saneo masivo de la BD — descripción, signos y saldos]]
