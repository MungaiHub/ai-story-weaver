const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Never return the password hash in JSON responses
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

UserSchema.methods.comparePassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
};

module.exports = mongoose.model('User', UserSchema);
