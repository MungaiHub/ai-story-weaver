const rateLimit = require('express-rate-limit');

/**
 * Broad global limiter — applied to all routes.
 * Protects against general abuse.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' },
});

/**
 * Strict limiter for expensive LLM endpoints (generate + steer).
 * Reads window/max from env so they can be tuned without code changes.
 */
const llmLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      'You have hit the AI generation rate limit. Please wait before trying again.',
  },
});

module.exports = { globalLimiter, llmLimiter };
