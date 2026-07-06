#!/bin/sh
# Plantilla de hook post-commit para alimentar el vault "Memoria-Claude".
# El instalador reemplaza @@REPO@@ y @@DST@@. No editar a mano las copias instaladas.
REPO="@@REPO@@"
DST="@@DST@@"
SRC="$REPO/docs/MEMORIA.md"
SCRIPT="C:/loki/Memoria-Claude/_scripts/sync-memoria.cjs"
ENTRY="$REPO/.git/last-commit-entry.md"

{
  printf '### %s · `%s`\n' "$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M')" "$(git log -1 --format=%h)"
  printf '%s\n' "$(git log -1 --format=%s)"
  BODY="$(git log -1 --format=%b)"
  [ -n "$BODY" ] && printf '\n%s\n' "$BODY"
  printf '\nArchivos: %s\n' "$(git show -1 --name-only --format='' | sed '/^$/d' | paste -sd ', ' -)"
} > "$ENTRY"

node "$SCRIPT" "$SRC" "$DST" "$ENTRY" >> "$REPO/.git/memoria-sync.log" 2>&1 || true
