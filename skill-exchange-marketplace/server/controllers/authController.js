const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/sendEmail');
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

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const normalizedEmail = String(email).toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    res.status(400);
    throw new Error('User with that email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'both',
    },
  });

  res.status(201).json({
    success: true,
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id),
  });
});

/**
 * @desc    Authenticate user and return token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    profilePicture: user.profilePicture,
    skillsToTeach: user.skillsToTeach,
    token: generateToken(user.id),
  });
});

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.user._id) },
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

/**
 * @desc    Send password reset link to email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = String(email).toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 3600000),
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail(
      email,
      'Reset your SkillXchange password',
      `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px;">
          <h2 style="color: #5346D8;">Reset your password</h2>
          <p style="color: #374151;">You requested a password reset for your SkillXchange account.</p>
          <p style="color: #374151;">Click the button below to set a new password:</p>
          <a href="${resetUrl}"
            style="display:inline-block; background:#5346D8; color:#fff;
            padding:12px 28px; border-radius:8px; text-decoration:none;
            font-weight:600; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color:#6b7280; font-size:13px; margin-top:24px;">
            This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin-top:24px;">
          <p style="color:#9ca3af; font-size:12px;">SkillXchange · If the button doesn't work, copy this link: ${resetUrl}</p>
        </div>
      `
    );
  }

  res.status(200).json({ message: 'If this email exists, a reset link was sent.' });
});

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset link. Please request a new one.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.status(200).json({ message: 'Password updated successfully.' });
});

module.exports = { registerUser, loginUser, getMe, forgotPassword, resetPassword };
