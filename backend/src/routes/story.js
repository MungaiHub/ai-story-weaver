const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const requireAuth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { llmLimiter } = require('../middleware/rateLimiter');
const storyController = require('../controllers/storyController');

// ── Validation rule sets ────────────────────────────────────────────────────

const generateRules = [
  body('theme')
    .isString()
    .trim()
    .isLength({ min: 2, max: 300 })
    .withMessage('theme must be 2–300 characters'),
  body('genre')
    .isString()
    .trim()
    .isIn(['fantasy', 'sci-fi', 'mystery', 'romance', 'horror', 'adventure', 'literary'])
    .withMessage('genre must be one of: fantasy, sci-fi, mystery, romance, horror, adventure, literary'),
  body('plotBeats')
    .isArray({ min: 1, max: 10 })
    .withMessage('plotBeats must be an array of 1–10 items'),
  body('plotBeats.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Each plot beat must be 1–500 characters'),
  body('segmentCount')
    .optional()
    .isInt({ min: 2, max: 8 })
    .withMessage('segmentCount must be an integer between 2 and 8'),
];

const steerRules = [
  param('storyId').isMongoId().withMessage('Invalid storyId'),
  param('segmentId').isMongoId().withMessage('Invalid segmentId'),
  body('instruction')
    .isString()
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('instruction must be 2–1000 characters'),
];

const getStoryRules = [
  param('storyId').isMongoId().withMessage('Invalid storyId'),
];

// ── Routes ──────────────────────────────────────────────────────────────────

// All story routes require authentication
router.use(requireAuth);

// List all stories for the current user
router.get('/', storyController.listStories);

// Generate a new story — rate-limited
router.post(
  '/generate',
  llmLimiter,
  generateRules,
  validate,
  storyController.generate
);

// Get the full story tree
router.get('/:storyId', getStoryRules, validate, storyController.getStory);

// Steer a segment — rate-limited
router.post(
  '/:storyId/segment/:segmentId/steer',
  llmLimiter,
  steerRules,
  validate,
  storyController.steer
);

module.exports = router;
