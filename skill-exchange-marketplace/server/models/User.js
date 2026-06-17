const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['learner', 'instructor', 'both', 'admin'],
      default: 'both',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    skillsToTeach: {
      type: [String],
      default: [],
    },
    // Password reset fields
    resetToken: {
      type: String,
      default: undefined,
    },
    resetTokenExpiry: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true }
);
 
// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 
/**
 * Compare entered password with stored hashed password
 * @param {string} enteredPassword - Plain-text password to check
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
 
module.exports = mongoose.model('User', userSchema);
 