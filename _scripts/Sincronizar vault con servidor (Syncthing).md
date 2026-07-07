---
tipo: guia
tags: [memoria, sync, syncthing, servidor]
actualizado: 2026-07-06
---

# 🔄 Sincronizar el vault con el servidor (Syncthing)

Objetivo: que Obsidian trabaje sobre una copia LOCAL que se sincroniza sola con el
servidor (134.209.64.96). Funciona offline; los cambios viajan en ambos sentidos.

## 1. En el servidor (por SSH)
```bash
ssh usuario@134.209.64.96
sudo apt update && sudo apt install -y syncthing
# Ejecutar como servicio con tu usuario:
sudo systemctl enable --now syncthing@usuario.service
```
La interfaz web queda en `localhost:8384` del servidor. Para abrirla desde tu PC sin
exponerla a internet, crea un túnel SSH (en otra ventana de PowerShell):
```powershell
ssh -L 8384:localhost:8384 usuario@134.209.64.96
```
Luego abre en tu navegador: `http://localhost:8384`

En esa interfaz (la del servidor):
1. **Add Folder** → Folder Path = la ruta del vault en el servidor → ponle un Label.
2. **Actions → Show ID** → copia el **Device ID** del servidor.

> Firewall del VPS: abre el puerto **22000/tcp** (y 22000/udp, 21027/udp) para sync directo.
> Si usas UFW: `sudo ufw allow 22000` y `sudo ufw allow 21027/udp`.

## 2. En tu PC (Windows)
1. Instala **SyncTrayzor** (empaqueta Syncthing con bandeja) o Syncthing.
2. Abre su interfaz (`http://localhost:8384`).
3. **Add Remote Device** → pega el Device ID del servidor.
4. En el servidor, acepta el dispositivo "PC" cuando aparezca, y **comparte la carpeta** con él.
5. En el PC, acepta la carpeta compartida y elige la **ruta local** donde vivirá.

## 3. Elegir la ruta local (IMPORTANTE)
- Si el vault del servidor **es este mismo cerebro**, sincronízalo con `C:\loki`
  (haz respaldo antes; Syncthing fusiona por archivo y podría duplicar si difieren).
- Si es un vault **distinto**, usa una carpeta nueva (ej. `C:\ObsidianServer`) para
  revisarlo primero y no mezclar.

## 4. Usarlo
- En Obsidian: *Abrir carpeta como bóveda* → la ruta local sincronizada.
- Pídeme conectar esa misma carpeta y yo leo/escribo los mismos archivos.

## Alternativa sin instalar nada en el servidor
Como ya tienes SSH, `rclone bisync` sobre SFTP sincroniza sin daemon en el servidor.
Menos "automático" que Syncthing, pero cero instalación del lado servidor.

## Enlaces
- [[00 Índice de Memoria]]
- [[README - sync memoria]]
