#!/usr/bin/env node
'use strict';
/*
 * probar-ollama-asistente.cjs
 * Prueba si Ollama (Llama 3.1) interpreta bien consultas de tesorería y elige la
 * herramienta correcta devolviendo JSON. NO toca ninguna BD: solo prueba el "cerebro".
 *
 * Requisitos: Ollama corriendo (http://localhost:11434) y el modelo descargado:
 *   ollama pull llama3.1:8b
 * Uso:
 *   node probar-ollama-asistente.cjs
 *   node probar-ollama-asistente.cjs --model qwen2.5:7b
 */
const args = process.argv.slice(2);
const mi = args.indexOf('--model');
const MODEL = mi >= 0 ? args[mi + 1] : 'llama3.1:8b';
const HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

const SYSTEM = `Eres un enrutador de consultas de tesorería. Herramientas disponibles:
- buscar_empresa(nombre)
- get_saldo_empresa(empresa, desde?, hasta?)
- get_movimientos_empresa(empresa, desde?, hasta?, limite?)
Responde SOLO con JSON válido, sin texto extra, con esta forma:
{"tool": "<nombre|null>", "args": {"empresa": "...", "desde": "YYYY-MM-DD|null", "hasta": "YYYY-MM-DD|null"}, "aclaracion": "<texto|null>"}
Reglas: si la pregunta NO es de tesorería, usa tool=null y explica en "aclaracion".
Nunca inventes montos ni datos; tu trabajo es solo elegir la herramienta y los argumentos.`;

// Preguntas de prueba (incluye typos, ambigüedad, fechas y fuera de alcance)
const PREGUNTAS = [
  '¿cuánto saldo tiene Impulse?',
  'saldo de AILEC a fin de mayo',
  'muéstrame los movimientos de FAREK de este mes',
  'cuanto tiene la empre impuls',          // typo
  'dame el total de bancos',               // agregado
  'saldo de bajio',                        // ambiguo (varias empresas)
  '¿qué clima hará mañana?',               // fuera de alcance
];

async function preguntar(q) {
  const r = await fetch(`${HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      format: 'json',           // fuerza salida JSON
      stream: false,
      options: { temperature: 0 },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: q },
      ],
    }),
  });
  const j = await r.json();
  return j?.message?.content ?? JSON.stringify(j);
}

(async () => {
  console.log(`Modelo: ${MODEL} · Host: ${HOST}\n`);
  for (const q of PREGUNTAS) {
    process.stdout.write(`❓ ${q}\n`);
    try {
      const raw = await preguntar(q);
      let parsed;
      try { parsed = JSON.parse(raw); } catch { parsed = null; }
      console.log(`   → ${parsed ? JSON.stringify(parsed) : '[JSON inválido] ' + raw}\n`);
    } catch (e) {
      console.log(`   ✖ Error: ${e.message} (¿está corriendo Ollama en ${HOST}?)\n`);
    }
  }
})();
