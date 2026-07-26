/**
 * llmService.js
 *
 * Single abstraction layer for all LLM calls.
 * Switch provider by setting LLM_PROVIDER in .env:
 *   openai     — OpenAI Chat Completions (default)
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
    throw new Error(`Unknown LLM_PROVIDER: "${PROVIDER}". Valid values: openai, anthropic, stub`);
  }
  return fn(messages, opts);
}

module.exports = { complete };
