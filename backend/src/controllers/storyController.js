const storyService = require('../services/storyService');
const { StoryModel } = require('../models/Story');

/**
 * GET /api/story
 * Returns all stories owned by the authenticated user, newest first.
 */
async function listStories(req, res, next) {
  try {
    const stories = await StoryModel.find({ owner: req.user.userId })
      .sort({ createdAt: -1 })
      .select('_id title genre theme segmentCount createdAt')
      .lean();
    return res.json({ stories });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/story/generate
 * Body: { theme, genre, plotBeats[], segmentCount? }
 */
async function generate(req, res, next) {
  try {
    const { theme, genre, plotBeats, segmentCount } = req.body;
    const result = await storyService.generateStory({
      userId: req.user.userId,
      theme,
      genre,
      plotBeats,
      segmentCount: segmentCount ?? 5,
    });
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/story/:storyId
 */
async function getStory(req, res, next) {
  try {
    const result = await storyService.getStoryTree({
      storyId: req.params.storyId,
      userId: req.user.userId,
    });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/story/:storyId/segment/:segmentId/steer
 * Body: { instruction }
 */
async function steer(req, res, next) {
  try {
    const { storyId, segmentId } = req.params;
    const { instruction } = req.body;
    const newSegment = await storyService.steerSegment({
      storyId,
      segmentId,
      userId: req.user.userId,
      instruction,
    });
    return res.status(201).json(newSegment);
  } catch (err) {
    return next(err);
  }
}

module.exports = { listStories, generate, getStory, steer };
