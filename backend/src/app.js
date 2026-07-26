const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { globalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/story');

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — locked to the configured frontend origin only ───────────────────
const allowedOrigin = process.env.FRONTEND_ORIGIN;
if (!allowedOrigin) {
  throw new Error('FRONTEND_ORIGIN must be set in environment variables');
}
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' })); // hard cap: prevents huge payloads

// ── Global rate limiter (all routes) ──────────────────────────────────────
app.use(globalLimiter);

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/story', storyRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── Global error handler ───────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
});

module.exports = app;
