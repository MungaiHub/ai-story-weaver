const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const validate = require('../middleware/validate');
const authController = require('../controllers/authController');

// ── Validation rules ────────────────────────────────────────────────────────
const registerRules = [
  body('username')
    .isString()
    .trim()
    .isLength({ min: 2, max: 32 })
    .withMessage('Username must be 2–32 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8–128 characters'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
];

// ── Routes ──────────────────────────────────────────────────────────────────
router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);

module.exports = router;
