const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, passwordHash });

    const token = signToken(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Generic message — don't reveal whether the email exists
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({ token, user });
  } catch (err) {
    return next(err);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { register, login };
