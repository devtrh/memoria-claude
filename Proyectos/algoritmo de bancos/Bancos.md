
---

tags: [tesorería, algoritmo, estados-de-cuenta]

banco: movimientos bancarios

actualizado: 2026-07-06

---

  

# A
### BBVA — `parseBBVA` (`:107`)

- **Formato:** `T1n SPEI ENVIADO {banco} … {ddmmyy} {concepto} Ref. {ref} … {clabe20} {rastreo} BNET… {nombre}` · `T2n SPEI RECIBIDO …`

- **Dirección:** `SPEI ENVIADO`→beneficiario · `SPEI RECIBIDO`→ordenante (fallback retiro/depósito).

- **CLABE:** 18 díg, o 20 díg (`00`+CLABE18 → recorta). **Rastreo:** `BNET…` → `…APR…`.

- **Extrae:** `banco_clabe`, `concepto`, `referencia`, `clabe`, `clave_rastreo`, `beneficiario`/`ordenante`, `tipo_movimiento`.

  

### BANREGIO — `parseBanregio` (`:165`)  ·  3 subformatos + CSV

- **Inbound:** `INT {rastreo}-{code} SPEI, <csv>`  ·  **Outbound:** `TRA SPEI-{ref} SPEI, <csv>`  ·  **FT:** `FT{code} SPEI {RECIBIDO|ENVIADO} {banco} {clabe18} {nombre} REF: … RASTREO: …`

- **CSV (split por coma):** `0=banco · 1=clabe18 · 2=nombre · 3=rastreo canónico · 4=referencia · 5+=concepto`. Parse por split (no regex fija) para no perder nombre en CSV corto.

- **Pago de servicio:** `TRA {folio}-Pago de servicio` → el folio es `referencia`, **no** CLABE. **Recepción de cuenta** → `cuenta`. La CLABE genérica se **valida** (dígito Banxico) antes de aceptarse.

- **Dirección:** retiro → beneficiario=contraparte, ordenante=empresa; depósito al revés.

  

### BANBAJIO — `parseBanbajio` (`:240`)  ·  3 plantillas

- **Envío:** `ENVÍO SPEI:{concepto}(BI-…) INSTITUCIÓN RECEPTORA:{banco} BENEFICIARIO:{nombre}`

- **Depósito:** `DEPÓSITO SPEI:{concepto} INSTITUCIÓN EMISORA:{banco} ORDENANTE:{nombre} CUENTA ORDENANTE:{clabe} REFERENCIA:{rastreo}`

- **Recibido:** `Institucion contraparte:{banco} Ordenante:{nombre} Cuenta:{clabe} Clave de rastreo:{cr} Concepto:{…}`

- **Extrae:** `concepto`, `banco_clabe`, `beneficiario`/`ordenante`, `clabe`, `clave_rastreo`.

  

### BANORTE — `parseBanorte` (`:286`)

- **TEF:** `TEF BCO:{code} {nombre} CTA/CLABE {18} … CVE.RASTREO:{cr} RFC:{rfc}`

- **SPEI:** `SPEI ENVIADO/RECIBIDO {banco} …` con `CVE RAST:`/`RASTREO:`/`BNET`/`APR`.

- **CONCENTRACION CFE:** el número largo es **RAS + convenio, no CLABE** → no extrae CLABE. CLABE preferida: explícita `DE LA CLABE {18}`, si no, genérica **validada**.

  

### MULTIVA — `parseMultiva` (`:348`)

- **Formato:** `SPEI ENVIADO {banco} {clabe18} {nombre} IVA ACREDITABLE:{monto} REF:{ref} RASTREO:{cr} {concepto}`.

- Nombre se corta antes de `IVA`/`REF:`/`RASTREO:`. Rastreo desde `RASTREO:` (no del monto ACREDITABLE).

  

### BX+ — `parseBxMas` (`:381`)

- El PDF usa `". "` como salto de línea → se normaliza primero.

- **Formato:** `… BANCO {x} CUENTA:/CTA ORDENANTE:{clabe18} CONCEPTO:{…} REFERENCIA:{ref} ORDENANTE:/BENEFICIARIO:{nombre} CLAVE RASTREO:{cr}` · rastreo también desde `FT…`.

  

### SANTANDER — `parseSantander` (`:425`)  ·  el más rico

- **SPEI enviado:** `… ENVIADO A {banco} A LA CUENTA {clabe18} … AL CLIENTE {nombre} CLAVE DE RASTREO {cr}` → beneficiario=cliente, ordenante=empresa.

- **SPEI recibido:** `… RECIBIDO DE {banco} DE LA CUENTA {clabe18} … DEL CLIENTE {nombre}` → ordenante=cliente, beneficiario=empresa.

- **~10 patrones no-SPEI** que mapean la contraparte a una entidad fija: `IMSS`, `PAGO VIVIENDA RCV`→INFONAVIT, `RETENCION ISR`/`IMPTO FED`→SAT, comisiones/membresía/prima seguro→SANTANDER, `CARGO PAGO NOMINA`→NOMINA, apertura/compensación/intereses→SANTANDER. En todos, la empresa titular queda del lado correcto según retiro/depósito.

  

### AFIRME — `parseAfirme` (`:563`)

- **Formato:** `SPEI RECIBIDO DE {code}-{banco} {ref} CUENTA:{clabe18} EMISOR:{nombre} RFC EMISOR:{rfc}` con `CVE RASTREO`/`APR`/`BNET`.

  

### KUSPIT — `parseKuspit` (`:583`)

- Fondo de inversión, formato muy variable → solo `clabe`, `clave_rastreo` y `banco_clabe` (primer banco mencionado).

  

### Genérico — `parseGenerico` (`:594`)

- Fallback para bancos sin parser. Exige que el texto contenga `SPEI`; extrae `clabe`, `clave_rastreo` y nombre tras `BNET…`.

  

> [!abstract] Reglas universales (todos los bancos)  ·  `parsearMovimiento` (`:635`)

> - **RAS / CONVENIO** (`:656-660`): en `PAGO CONCENTRACION`/CFE extrae `RAS {10-30 díg}` y el convenio largo (30-40 díg).

> - **Lado propio** (`:662-671`): retiro → `ordenante`=empresa · depósito → `beneficiario`=empresa (si el parser no lo puso).

> - **`clabeLookup`** (`:679-688`): si hay CLABE pero no nombre, lo resuelve por el Map CLABE→nombre (`cargarClabeLookup` `:714`: nombre más frecuente por CLABE + override del directorio canónico confirmado).

> - **`soloNulos`** (default true, `:691`): solo rellena campos vacíos o "sucios" (`esSucio` `:743`: placeholder `SIN_EMPRESA`, códigos BNET/FT, dígitos largos, >120 chars, o rastreo que es solo referencia numérica).

  

### Auxiliares de detección

- `normBanco` + `ALIAS_BANCO` (`:24-45`): homologa nombre de banco (`BBVA BANCOMER→BBVA`, `VE POR MAS→BX+`, `IXE→BANORTE`…).

- `limpiarNombre` (`:48`): quita BNET/FT, números largos, fechas, RFC, paréntesis; rechaza códigos disfrazados de nombre.

- `extraerClabe` (`:80`) / `extraerCR` (`:90`) / `detectarTipo` (`:612`): CLABE, clave de rastreo y `tipo_movimiento` genéricos.

  

## Resumen en una línea

  

`Reglas del algoritmo para clasificar los movimientos`