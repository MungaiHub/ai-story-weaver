/**
 * llmService.js
 *
 * Single abstraction layer for all LLM calls.
 * Switch provider by setting LLM_PROVIDER in .env:
 *   openai     — OpenAI Chat Completions (default)
 *   gemini     — Google Gemini (@google/genai SDK)
 *   anthropic  — Anthropic Messages API  (stub, swap in SDK)
 *   stub       — Returns deterministic fake text; useful for offline dev/testing
 *
 * The rest of the application NEVER imports an LLM SDK directly.
 */

const PROVIDER = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

// ─── Provider implementations ─────────────────────────────────────────────

async function callOpenAI(messages, opts = {}) {
  // Lazy-require so the module doesn't crash if openai isn't installed and
  // LLM_PROVIDER=stub is used.
  const OpenAI = require('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages,
    temperature: opts.temperature ?? 0.85,
    max_tokens: opts.maxTokens ?? 1200,
  });

  return response.choices[0].message.content.trim();
}

async function callGemini(messages, opts = {}) {
  const { GoogleGenAI } = require('@google/genai');
  const { GEMINI_FALLBACK_MODELS } = require('../config/validateLlm');
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const systemMsg = messages.find((m) => m.role === 'system');
  const userMessages = messages.filter((m) => m.role !== 'system');

  const preferred = process.env.GEMINI_MODEL || GEMINI_FALLBACK_MODELS[0];
  const modelCandidates = [preferred, ...GEMINI_FALLBACK_MODELS.filter((m) => m !== preferred)];

  const history = [];
  for (let i = 0; i < userMessages.length - 1; i++) {
    const m = userMessages[i];
    history.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  }

  const lastUser = userMessages[userMessages.length - 1];
  const generationConfig = {
    temperature: opts.temperature ?? 0.85,
    maxOutputTokens: opts.maxTokens ?? 1200,
  };

  let lastError;
  for (const modelName of modelCandidates) {
    try {
      const chat = client.chats.create({
        model: modelName,
        config: {
          ...generationConfig,
          ...(systemMsg && { systemInstruction: systemMsg.content }),
        },
        history,
      });
      const result = await chat.sendMessage({ message: lastUser.content });
      if (modelName !== preferred) {
        process.env.GEMINI_MODEL = modelName;
      }
      return result.text.trim();
    } catch (err) {
      lastError = err;
      const isModelMissing = /404|not found|not supported/i.test(String(err.message));
      if (!isModelMissing) throw err;
    }
  }

  throw lastError;
}

async function callAnthropic(messages, opts = {}) {
  // Swap in @anthropic-ai/sdk here when needed.
  // The message format below mirrors the OpenAI shape; translate as required.
  throw new Error(
    'Anthropic provider not yet wired up. Install @anthropic-ai/sdk and implement callAnthropic().'
  );
}

async function callStub(messages, _opts = {}) {
  // Deterministic stub for offline development and testing.
  const prompt = messages.find((m) => m.role === 'user')?.content ?? '';
  const snippet = prompt.slice(0, 60).replace(/\n/g, ' ');
  return `[STUB] Generated text for prompt: "${snippet}..." Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum habitant morbi tristique.`;
}

// ─── Provider dispatch table ──────────────────────────────────────────────
const PROVIDERS = {
  openai: callOpenAI,
  gemini: callGemini,
  anthropic: callAnthropic,
  stub: callStub,
};

/**
 * Complete a chat with the configured LLM provider.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {{ temperature?: number, maxTokens?: number }} [opts]
 * @returns {Promise<string>} Raw model text
 */
async function complete(messages, opts = {}) {
  const fn = PROVIDERS[PROVIDER];
  if (!fn) {
    throw new Error(`Unknown LLM_PROVIDER: "${PROVIDER}". Valid values: openai, gemini, anthropic, stub`);
  }
  return fn(messages, opts);
}

module.exports = { complete };
