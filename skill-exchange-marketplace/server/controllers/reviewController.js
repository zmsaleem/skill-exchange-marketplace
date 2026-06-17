const asyncHandler = require('../utils/asyncHandler');
const { prisma } = require('../config/db');

const formatReview = (review) => ({
  _id: review.id,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
  reviewer: review.reviewer
    ? {
        _id: review.reviewer.id,
        name: review.reviewer.name,
        profilePicture: review.reviewer.profilePicture,
      }
    : null,
  skill: review.skill
    ? {
        _id: review.skill.id,
        title: review.skill.title,
      }
    : null,
});

const createReview = asyncHandler(async (req, res) => {
  const { skill: skillId, rating, comment } = req.body;

  const existingReview = await prisma.review.findFirst({
    where: {
      skillId: Number(skillId),
      reviewerId: Number(req.user._id),
    },
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this skill');
  }

  const completedBooking = await prisma.booking.findFirst({
    where: {
      skillId: Number(skillId),
      learnerId: Number(req.user._id),
      status: 'completed',
    },
  });

  if (!completedBooking) {
    res.status(400);
    throw new Error('You must have a completed booking for this skill to leave a review');
  }

  const skill = await prisma.skill.findUnique({
    where: { id: Number(skillId) },
  });

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  const review = await prisma.review.create({
    data: {
      skillId: skill.id,
      reviewerId: Number(req.user._id),
      instructorId: skill.instructorId,
      rating,
      comment,
    },
    include: {
      reviewer: {
        select: { id: true, name: true, profilePicture: true },
      },
      skill: { select: { id: true, title: true } },
    },
  });

  res.status(201).json({ success: true, review: formatReview(review) });
});

const getSkillReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { skillId: Number(req.params.skillId) },
    include: {
      reviewer: { select: { id: true, name: true, profilePicture: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews: reviews.map(formatReview),
  });
});

const getInstructorReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { instructorId: Number(req.params.instructorId) },
    include: {
      reviewer: { select: { id: true, name: true, profilePicture: true } },
      skill: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews: reviews.map(formatReview),
  });
});

module.exports = { createReview, getSkillReviews, getInstructorReviews };
