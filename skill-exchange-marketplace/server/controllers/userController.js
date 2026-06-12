const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get a user's public profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, user });
});

/**
 * @desc    Update the authenticated user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name !== undefined ? req.body.name : user.name;
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
  user.profilePicture =
    req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;
  user.skillsToTeach =
    req.body.skillsToTeach !== undefined ? req.body.skillsToTeach : user.skillsToTeach;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      skillsToTeach: updatedUser.skillsToTeach,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  });
});

module.exports = { getUserById, updateProfile };
