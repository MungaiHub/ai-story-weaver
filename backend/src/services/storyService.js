/**
 * storyService.js
 *
 * Business logic for story generation and segment steering.
 * All LLM calls go through llmService; all DB access through Mongoose models.
 */

const { v4: uuidv4 } = require('uuid');
const { StoryModel, SegmentModel } = require('../models/Story');
const llm = require('./llmService');

// ─── Prompt builders ──────────────────────────────────────────────────────

/**
 * Build the messages array for initial story generation.
 */
function buildGeneratePrompt({ theme, genre, plotBeats, segmentCount }) {
  const beats = plotBeats.map((b, i) => `${i + 1}. ${b}`).join('\n');
  return [
    {
      role: 'system',
      content: `You are a creative fiction writer. You write vivid, engaging short stories split into exactly ${segmentCount} segments (numbered scenes). Each segment is 3–5 sentences. Format your entire response as valid JSON with this exact shape:
{
  "title": "<story title>",
  "segments": [
    { "index": 1, "title": "<scene title>", "content": "<prose>" },
    ...
  ]
}
Do not include any text outside the JSON object.`,
    },
    {
      role: 'user',
      content: `Write a ${genre} story with the theme: "${theme}".

Plot beats:
${beats}

Write exactly ${segmentCount} segments.`,
    },
  ];
}

/**
 * Build the messages array for steering a single segment.
 */
function buildSteerPrompt({ precedingContent, segmentContent, followingContent, instruction }) {
  const context = [];
  if (precedingContent) {
    context.push(`PRECEDING SEGMENT:\n${precedingContent}`);
  }
  if (followingContent) {
    context.push(`FOLLOWING SEGMENT:\n${followingContent}`);
  }

  return [
    {
      role: 'system',
      content: `You are a creative fiction editor. You rewrite a single story segment based on a steering instruction, while keeping it consistent with the surrounding segments. Respond with valid JSON only:
{
  "title": "<scene title>",
  "content": "<rewritten prose — 3–5 sentences>"
}
Do not include any text outside the JSON object.`,
    },
    {
      role: 'user',
      content: `${context.join('\n\n')}

CURRENT SEGMENT TO REWRITE:
${segmentContent}

STEERING INSTRUCTION:
${instruction}

Rewrite the current segment so it flows naturally from the preceding and into the following content.`,
    },
  ];
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function safeParseJSON(raw) {
  // Strip markdown code fences if the model wraps its output
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

// ─── Service functions ────────────────────────────────────────────────────

/**
 * Generate a brand-new story and persist it.
 * Returns the full Story document + the initial segments array.
 */
async function generateStory({ userId, theme, genre, plotBeats, segmentCount = 5 }) {
  const messages = buildGeneratePrompt({ theme, genre, plotBeats, segmentCount });
  const raw = await llm.complete(messages);

  let parsed;
  try {
    parsed = safeParseJSON(raw);
  } catch (e) {
    throw Object.assign(new Error('LLM returned malformed JSON'), { status: 502 });
  }

  const { title, segments } = parsed;

  if (!Array.isArray(segments) || segments.length === 0) {
    throw Object.assign(new Error('LLM returned no segments'), { status: 502 });
  }

  // Persist story document
  const story = await StoryModel.create({
    owner: userId,
    title: title || 'Untitled Story',
    genre,
    theme,
    plotBeats,
    segmentCount: segments.length,
    activeBranches: Object.fromEntries(segments.map((_, i) => [String(i + 1), 'main'])),
  });

  // Persist segment documents
  const segmentDocs = await SegmentModel.insertMany(
    segments.map((s, i) => ({
      storyId: story._id,
      index: s.index ?? i + 1,
      title: s.title ?? '',
      content: s.content,
      branchId: 'main',
      parentBranchId: null,
      parentSegmentId: null,
      steerInstruction: null,
    }))
  );

  return { story, segments: segmentDocs };
}

/**
 * Steer a single segment: regenerate it with an instruction, save as new branch.
 * Returns the new segment document.
 */
async function steerSegment({ storyId, segmentId, userId, instruction }) {
  // Verify story ownership
  const story = await StoryModel.findOne({ _id: storyId, owner: userId });
  if (!story) {
    throw Object.assign(new Error('Story not found'), { status: 404 });
  }

  // Load the segment to steer
  const segment = await SegmentModel.findOne({ _id: segmentId, storyId });
  if (!segment) {
    throw Object.assign(new Error('Segment not found'), { status: 404 });
  }

  // Load neighbours for context (active branch versions)
  const precedingBranchId = story.activeBranches.get(String(segment.index - 1)) || 'main';
  const followingBranchId = story.activeBranches.get(String(segment.index + 1)) || 'main';

  const [preceding, following] = await Promise.all([
    segment.index > 1
      ? SegmentModel.findOne({
          storyId,
          index: segment.index - 1,
          branchId: precedingBranchId,
        })
      : null,
    SegmentModel.findOne({
      storyId,
      index: segment.index + 1,
      branchId: followingBranchId,
    }),
  ]);

  const messages = buildSteerPrompt({
    precedingContent: preceding?.content ?? null,
    segmentContent: segment.content,
    followingContent: following?.content ?? null,
    instruction,
  });

  const raw = await llm.complete(messages);

  let parsed;
  try {
    parsed = safeParseJSON(raw);
  } catch (e) {
    throw Object.assign(new Error('LLM returned malformed JSON'), { status: 502 });
  }

  const newBranchId = uuidv4();

  const newSegment = await SegmentModel.create({
    storyId,
    index: segment.index,
    title: parsed.title ?? segment.title,
    content: parsed.content,
    branchId: newBranchId,
    parentBranchId: segment.branchId,
    parentSegmentId: segment._id,
    steerInstruction: instruction,
  });

  // Update the story's active branch for this segment index
  story.activeBranches.set(String(segment.index), newBranchId);
  await story.save();

  return newSegment;
}

/**
 * Fetch the full story tree: story metadata + all segment variants grouped by index.
 */
async function getStoryTree({ storyId, userId }) {
  const story = await StoryModel.findOne({ _id: storyId, owner: userId });
  if (!story) {
    throw Object.assign(new Error('Story not found'), { status: 404 });
  }

  // All segments across all branches, sorted for deterministic output
  const allSegments = await SegmentModel.find({ storyId }).sort({ index: 1, createdAt: 1 });

  // Group into { [index]: [segmentDoc, ...] } so the client can render branches
  const tree = {};
  for (const seg of allSegments) {
    const key = String(seg.index);
    if (!tree[key]) tree[key] = [];
    tree[key].push(seg);
  }

  return { story, tree };
}

module.exports = { generateStory, steerSegment, getStoryTree };
