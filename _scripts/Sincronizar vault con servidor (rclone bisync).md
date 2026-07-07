---
tipo: guia
tags: [memoria, sync, rclone, sftp, servidor]
actualizado: 2026-07-06
---

# 🔃 Sincronizar el vault con el servidor (rclone bisync / SFTP)

Sincronización bidireccional entre una carpeta local y el vault del servidor
(134.209.64.96) usando SSH/SFTP. No instala nada en el servidor.

## 0. Datos que necesitas
- Usuario SSH del servidor.
- Ruta del vault en el servidor → aquí `<RUTA_SERVIDOR>` (ej. `/home/usuario/vault`).
- Decidir quién manda en el primer sync (ver paso 3).

## 1. Instalar rclone (Windows)
```powershell
winget install Rclone.Rclone
```

## 2. Crear el remoto SFTP (recomendado: llave SSH)
Con llave:
```powershell
rclone config create vault sftp host 134.209.64.96 user USUARIO port 22 key_file "C:\Users\GARAGE\.ssh\id_rsa"
```
Con contraseña (se guarda ofuscada):
```powershell
rclone config create vault sftp host 134.209.64.96 user USUARIO port 22 pass "TU_PASSWORD" --obscure
```
Probar conexión:
```powershell
rclone lsd "vault:<RUTA_SERVIDOR>"
```

## 3. Primer sync (baseline con --resync) — ELIGE DIRECCIÓN
El primer run necesita `--resync` para crear la línea base. **Path1 gana** los conflictos.

- Opción A — el SERVIDOR tiene el contenido bueno (traerlo a una carpeta NUEVA):
```powershell
rclone bisync "vault:<RUTA_SERVIDOR>" "C:\ObsidianServer" --resync --filters-file "C:\loki\Memoria-Claude\_scripts\rclone-filters.txt" --verbose
```

- Opción B — este cerebro local `C:\loki` es el bueno (subirlo al servidor):
```powershell
rclone bisync "C:\loki" "vault:<RUTA_SERVIDOR>" --resync --filters-file "C:\loki\Memoria-Claude\_scripts\rclone-filters.txt" --verbose
```

> ⚠️ Haz respaldo de ambos lados antes del primer `--resync`. Path1 sobrescribe en conflicto.

## 4. Sync continuo (mismo orden, SIN --resync)
```powershell
rclone bisync "<PATH1>" "<PATH2>" --filters-file "C:\loki\Memoria-Claude\_scripts\rclone-filters.txt" --conflict-resolve newer --verbose
```
Usa exactamente el mismo orden Path1/Path2 que en el resync.

## 5. Automatizar (cada 10 min con el Programador de tareas)
```powershell
$act = New-ScheduledTaskAction -Execute "rclone.exe" -Argument 'bisync "<PATH1>" "<PATH2>" --filters-file "C:\loki\Memoria-Claude\_scripts\rclone-filters.txt" --conflict-resolve newer'
$trg = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10)
Register-ScheduledTask -TaskName "rclone-vault-sync" -Action $act -Trigger $trg
```

## Notas
- No es tiempo real: corre por schedule o a mano.
- Si un run falla por "cambios excesivos", vuelve a correr con `--resync` para re-basar.
- Obsidian abre la carpeta local (`C:\loki` o `C:\ObsidianServer`); yo conecto esa misma carpeta.

## Enlaces
- [[00 Índice de Memoria]]
- [[README - sync memoria]]
