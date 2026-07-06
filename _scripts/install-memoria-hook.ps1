<#
  install-memoria-hook.ps1
  Instala el hook post-commit en un repo para alimentar su nodo del vault.

  Uso (una vez por repo):
    powershell -ExecutionPolicy Bypass -File "C:\loki\Memoria-Claude\_scripts\install-memoria-hook.ps1" `
      -Repo "C:\Users\GARAGE\tickets" -Node "Sistema de Tickets"

  Requisitos: el repo debe tener docs/MEMORIA.md (genéralo con el prompt de Claude Code)
  y Node instalado y accesible desde git bash.
#>
param(
  [Parameter(Mandatory=$true)][string]$Repo,   # ruta local del repo
  [Parameter(Mandatory=$true)][string]$Node    # nombre del .md en Memoria-Claude\Proyectos (sin extensión)
)
$ErrorActionPreference = 'Stop'

$proj = 'C:\loki\Memoria-Claude\Proyectos'
$tpl  = 'C:\loki\Memoria-Claude\_scripts\post-commit.template.sh'
$nodePath = Join-Path $proj "$Node.md"
$hookDir  = Join-Path $Repo '.git\hooks'

if (-not (Test-Path $tpl))      { throw "Falta la plantilla: $tpl" }
if (-not (Test-Path $nodePath)) { throw "No existe el nodo: $nodePath" }
if (-not (Test-Path $hookDir))  { throw "No parece un repo git (falta $hookDir)" }

# 1) Asegura los bloques gestionados en el nodo (si no existen)
$md = [IO.File]::ReadAllText($nodePath)
if ($md -notmatch 'COMMITS:START') {
  $md = $md.TrimEnd() + "`n`n## Historial de commits (auto - la actualiza el git hook; no editar a mano)`n> Una entrada por commit: fecha/hora, hash, mensaje y archivos.`n<!-- COMMITS:START -->`n<!-- COMMITS:END -->`n"
}
if ($md -notmatch 'MEMORIA:START') {
  $md = $md.TrimEnd() + "`n`n## Memoria del repo (auto - la actualiza el git hook; no editar a mano)`n> Sincronizado desde docs/MEMORIA.md en cada commit.`n<!-- MEMORIA:START -->`n<!-- MEMORIA:END -->`n"
}
[IO.File]::WriteAllText($nodePath, $md)

# 2) Genera el hook desde la plantilla (rutas con / y saltos LF)
$repoFwd = ($Repo -replace '\\','/')
$dstFwd  = ($nodePath -replace '\\','/')
$hook = [IO.File]::ReadAllText($tpl)
$hook = $hook.Replace('@@REPO@@', $repoFwd).Replace('@@DST@@', $dstFwd)
$hook = $hook -replace "`r`n", "`n"
[IO.File]::WriteAllText((Join-Path $hookDir 'post-commit'), $hook)

Write-Host "OK: hook instalado en $Repo  ->  nodo '$Node'"
Write-Host "Prueba: cd `"$Repo`"; git commit --allow-empty -m 'test memoria'"
