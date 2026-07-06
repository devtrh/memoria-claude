#!/usr/bin/env node
'use strict';
/*
 * sync-memoria.cjs
 * Mantiene dos bloques gestionados dentro de un nodo de Obsidian:
 *   1) <!-- MEMORIA:START --> ... <!-- MEMORIA:END -->  ← cuerpo de docs/MEMORIA.md
 *   2) <!-- COMMITS:START --> ... <!-- COMMITS:END -->  ← bitácora de commits (más reciente arriba)
 * No toca nada fuera de esos bloques. Lo invoca el git hook post-commit.
 *
 * Uso:
 *   node sync-memoria.cjs <MEMORIA.md> <nodo.md> [entrada-commit.md]
 */
const fs = require('fs');

const SRC = process.argv[2];
const DST = process.argv[3];
const COMMIT_FILE = process.argv[4]; // opcional
const MAX_COMMITS = 200;

if (!SRC || !DST) {
  console.error('Uso: node sync-memoria.cjs <MEMORIA.md> <nodo.md> [entrada-commit.md]');
  process.exit(1);
}
if (!fs.existsSync(DST)) { console.error('[memoria] no existe destino: ' + DST); process.exit(0); }

let dst = fs.readFileSync(DST, 'utf8').replace(/\r\n/g, '\n');

function replaceBlock(text, start, end, inner) {
  const i = text.indexOf(start);
  const j = text.indexOf(end);
  if (i === -1 || j === -1 || j < i) return null;
  return text.slice(0, i + start.length) + '\n' + inner.trim() + '\n' + text.slice(j);
}

// 1) Bloque MEMORIA (cuerpo de MEMORIA.md sin su frontmatter)
if (SRC && fs.existsSync(SRC)) {
  let src = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
  const fm = src.match(/^---\n[\s\S]*?\n---\n?/);
  const body = (fm ? src.slice(fm[0].length) : src).trim();
  const out = replaceBlock(dst, '<!-- MEMORIA:START -->', '<!-- MEMORIA:END -->', body);
  if (out) dst = out;
}

// 2) Bloque COMMITS (antepone la entrada nueva; dedupe por hash; tope MAX_COMMITS)
if (COMMIT_FILE && fs.existsSync(COMMIT_FILE)) {
  const entry = fs.readFileSync(COMMIT_FILE, 'utf8').replace(/\r\n/g, '\n').trim();
  const CS = '<!-- COMMITS:START -->', CE = '<!-- COMMITS:END -->';
  const i = dst.indexOf(CS), j = dst.indexOf(CE);
  if (entry && i !== -1 && j !== -1 && j > i) {
    let inner = dst.slice(i + CS.length, j).trim();
    const m = entry.match(/`([0-9a-f]{7,40})`/);
    const hash = m ? m[1] : null;
    if (!(hash && inner.includes('`' + hash + '`'))) {
      inner = entry + (inner ? '\n\n' + inner : '');
      // Tope: conserva solo las MAX_COMMITS entradas más recientes (separadas por "### ")
      const parts = inner.split(/\n(?=### )/);
      if (parts.length > MAX_COMMITS) inner = parts.slice(0, MAX_COMMITS).join('\n');
    }
    dst = dst.slice(0, i + CS.length) + '\n' + inner + '\n' + dst.slice(j);
  }
}

// Actualiza 'actualizado:' del frontmatter del destino
const today = new Date().toISOString().slice(0, 10);
dst = dst.replace(/^(actualizado:\s*).*$/m, '$1' + today);

fs.writeFileSync(DST, dst, 'utf8');
console.log('[memoria] nodo sincronizado (' + today + ')');
