/**
 * Validates LLM env config at startup so misconfiguration fails fast with
 * actionable errors instead of surfacing on the first story generation.
 */

// gemini-2.0-* was shut down June 2026; free tier quota is 0 — use 2.5 models
const GEMINI_FALLBACK_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

async function fetchGeminiModel(key, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

async function listGeminiModels(key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return [];
  return (data.models || [])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name.replace(/^models\//, ''));
}

function assertGeminiKey(key) {
  if (!key || /replace|your[-_]?key/i.test(key)) {
    throw new Error(
      'GEMINI_API_KEY is missing or still a placeholder.\n' +
        '  1. Open https://aistudio.google.com/apikey\n' +
        '  2. Create an API key (AIza... or AQ.... format)\n' +
        '  3. Set GEMINI_API_KEY in backend/.env'
    );
  }
}

async function resolveGeminiModel(key) {
  const preferred = process.env.GEMINI_MODEL || GEMINI_FALLBACK_MODELS[0];
  const candidates = [preferred, ...GEMINI_FALLBACK_MODELS.filter((m) => m !== preferred)];

  for (const model of candidates) {
    const { ok } = await fetchGeminiModel(key, model);
    if (ok) {
      if (model !== preferred) {
        console.warn(`[llm] GEMINI_MODEL="${preferred}" unavailable; using "${model}" instead.`);
      }
      process.env.GEMINI_MODEL = model;
      return model;
    }
  }

  const available = await listGeminiModels(key);
  const hint = available.length
    ? `Models available for your key:\n  - ${available.slice(0, 8).join('\n  - ')}`
    : 'Could not list models — check that your API key is valid and the Generative Language API is enabled.';

  throw new Error(
    `No supported Gemini model found. Tried: ${candidates.join(', ')}.\n${hint}\n` +
      'Set GEMINI_MODEL in backend/.env to one of the models above.'
  );
}

async function validateLlmConfig() {
  const provider = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

  if (provider === 'stub') {
    console.log('[llm] Using stub provider (no external API calls)');
    return;
  }

  if (provider === 'gemini') {
    const key = process.env.GEMINI_API_KEY;
    assertGeminiKey(key);
    const model = await resolveGeminiModel(key);
    console.log(`[llm] Gemini ready (model: ${model})`);
    return;
  }

  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (!key || /replace|your[-_]?key/i.test(key)) {
      throw new Error('OPENAI_API_KEY is missing or still a placeholder in backend/.env');
    }
    console.log(`[llm] OpenAI ready (model: ${process.env.OPENAI_MODEL || 'gpt-4o'})`);
  }
}

module.exports = { validateLlmConfig, GEMINI_FALLBACK_MODELS };
