---
tipo: guia
tags: [memoria, guia, ayuda]
actualizado: 2026-07-06
---

# 🛠️ Cómo alimentar la memoria

Guía rápida para mantener este cerebro (vault) actualizado y útil como contexto.

## Estructura
```
Memoria-Claude/
├── 00 Índice de Memoria.md      ← hub: lista de nodos + conversaciones + pendientes
├── Cómo alimentar la memoria.md ← esta nota
├── Proyectos/                   ← un archivo por NODO principal
│   ├── Tesorería.md
│   ├── Contabilidad.md
│   ├── Legal.md
│   ├── Seguimiento de Proyectos.md
│   └── Sistema de Tickets.md
├── Conversaciones/              ← resumen de cada conversación archivada
└── _Plantillas/                 ← plantillas para nuevos nodos y conversaciones
```

## 3 formas de agregar información

### 1. Dictándoselo a Claude (lo más cómodo)
En una sesión, escribe algo como:
- *"En Contabilidad anota que el cierre mensual es el día 5."*
- *"Agrega un pendiente en Legal: renovar contrato con proveedor X antes del 30/09."*
- *"Crea una conexión entre Tesorería y Seguimiento de Proyectos sobre el presupuesto 2026."*

Claude escribe el dato en la nota correcta con su formato.

### 2. Archivando conversaciones
Al terminar una sesión sobre un área, di:
- *"Guarda esta conversación en el nodo Legal."*

Claude crea una nota resumen en `Conversaciones/` enlazada al nodo.
> ⚠️ Límite: Claude solo puede leer la conversación que esté **abierta** en ese momento. Las conversaciones cerradas de otros proyectos no las ve automáticamente; ábrelas o pega el contenido.

### 3. Desde archivos (Excel, PDF, contratos, reportes)
Si tienes documentos por área en una carpeta, pide:
- *"Conecta la carpeta X y mete lo relevante al nodo Contabilidad."*

Claude extrae lo importante y lo resume en el nodo.

## Conectar información entre nodos
Usa enlaces `[[dobles corchetes]]`. Ejemplo: dentro de `Contabilidad.md` escribe `[[Tesorería]]` y ambos quedan enlazados. En **Vista de Grafo** (Graph view) de Obsidian verás cómo se conectan los proyectos.

## Buenas prácticas
- Un **nodo = un proyecto/área**. No mezcles áreas en una misma nota.
- Escribe **datos y decisiones**, no todo el detalle: la memoria es contexto recuperable, no un archivo muerto.
- Actualiza el campo `actualizado:` del frontmatter cuando cambies algo importante.
- Revisa el [[00 Índice de Memoria]] para ver pendientes de todos los proyectos.

## Cómo pedir que use la memoria
Al iniciar una sesión nueva:
> *"Lee mi carpeta `Memoria-Claude` y úsala como contexto antes de responder."*

## Cómo consultar el avance de un proyecto
Pide que lea la memoria y pregunta. Ejemplos:
- *"Lee `Memoria-Claude` y dime el avance de Tesorería: hecho vs pendiente."*
- *"¿Qué pendientes abiertos hay en todos los proyectos?"*
- *"Abre [[Gestión (Tesorería)]] y resume su registro de cambios más reciente."*
- *"¿Qué conecta [[Gestión (Tesorería)]] con [[Contabilidad]]?"*

El "avance" sale de: los `Pendientes` (`- [ ]`), el `Registro de cambios` y `Datos clave` de cada nodo. Entre más completo el registro de cambios, más preciso el avance.

## Enlaces
- [[00 Índice de Memoria]]
