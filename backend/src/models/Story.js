const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Segment node ────────────────────────────────────────────────────────────
// Each node in the tree represents one story segment (scene / panel).
// A segment can have multiple child branches; each branch is a variant of
// the segment produced by a steer instruction.

const SegmentSchema = new Schema(
  {
    // Reference back to the owning story
    storyId: { type: Schema.Types.ObjectId, ref: 'Story', required: true, index: true },

    // Human-readable index (e.g. 1, 2, 3) within its parent story
    index: { type: Number, required: true },

    // The AI-generated prose for this segment
    content: { type: String, required: true, maxlength: 8000 },

    // Optional title / scene heading
    title: { type: String, maxlength: 200, default: '' },

    // The steering instruction that produced this variant, if any
    steerInstruction: { type: String, maxlength: 1000, default: null },

    // Branch label — 'main' for the original, UUID string for steered branches
    branchId: { type: String, required: true, default: 'main' },

    // Which branchId was the parent of this node (null for root nodes)
    parentBranchId: { type: String, default: null },

    // Reference to the parent segment document (null for root of a new segment index)
    parentSegmentId: { type: Schema.Types.ObjectId, ref: 'Segment', default: null },
  },
  { timestamps: true }
);

// ─── Story ───────────────────────────────────────────────────────────────────
// Top-level document. Segments are stored as a separate collection and linked
// by storyId so the tree can be queried efficiently without unbounded array growth.

const StorySchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    title: { type: String, maxlength: 300, default: 'Untitled Story' },

    genre: {
      type: String,
      required: true,
      enum: ['fantasy', 'sci-fi', 'mystery', 'romance', 'horror', 'adventure', 'literary'],
      maxlength: 50,
    },

    theme: { type: String, required: true, maxlength: 300 },

    // The original plot beats supplied by the user — stored for regeneration context
    plotBeats: {
      type: [{ type: String, maxlength: 500 }],
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 10,
        message: 'plotBeats must have between 1 and 10 items',
      },
    },

    // Active branch ids per segment index — used by the frontend default view
    // Map: segmentIndex (string key) → branchId
    activeBranches: {
      type: Map,
      of: String,
      default: {},
    },

    // Total number of logical segments (panels/scenes) in this story
    segmentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index: fetch all segments of a story cheaply
const SegmentModel = mongoose.model('Segment', SegmentSchema);
const StoryModel = mongoose.model('Story', StorySchema);

module.exports = { StoryModel, SegmentModel };
