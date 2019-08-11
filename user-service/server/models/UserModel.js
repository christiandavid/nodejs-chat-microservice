const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
    minlength: 8,
  },
  avatar: {
    type: String,
  },
}, { timestamps: true });

UserSchema.pre('save', async function preSave(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
