const asyncHandler = require('../utils/asyncHandler');
const { prisma } = require('../config/db');

const formatUser = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  profilePicture: user.profilePicture,
  skillsToTeach: user.skillsToTeach,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profilePicture: true,
      skillsToTeach: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    count: users.length,
    users: users.map(formatUser),
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profilePicture: true,
      skillsToTeach: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, user: formatUser(user) });
});

const updateUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existingUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const data = {};
  if (req.body.role !== undefined) data.role = req.body.role;
  if (req.body.bio !== undefined) data.bio = req.body.bio;
  if (req.body.profilePicture !== undefined) data.profilePicture = req.body.profilePicture;

  const updatedUser = await prisma.user.update({
    where: { id: existingUser.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profilePicture: true,
      skillsToTeach: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ success: true, user: formatUser(updatedUser) });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existingUser) {
    res.status(404);
    throw new Error('User not found');
  }

  await prisma.user.delete({ where: { id: existingUser.id } });
  res.status(200).json({ success: true, message: 'User removed' });
});

const updateProfile = asyncHandler(async (req, res) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: Number(req.user._id) },
  });

  if (!existingUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const data = {
    name: req.body.name !== undefined ? req.body.name : existingUser.name,
    bio: req.body.bio !== undefined ? req.body.bio : existingUser.bio,
    profilePicture:
      req.body.profilePicture !== undefined ? req.body.profilePicture : existingUser.profilePicture,
    skillsToTeach:
      req.body.skillsToTeach !== undefined ? req.body.skillsToTeach : existingUser.skillsToTeach,
  };

  const updatedUser = await prisma.user.update({
    where: { id: existingUser.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profilePicture: true,
      skillsToTeach: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ success: true, user: formatUser(updatedUser) });
});

module.exports = { getUsers, getUserById, updateUser, deleteUser, updateProfile };
