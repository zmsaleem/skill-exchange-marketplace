const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a review for a skill (requires completed booking)
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = asyncHandler(async (req, res) => {
  const { skill: skillId, rating, comment } = req.body;

  // Check for duplicate review
  const existingReview = await Review.findOne({ skill: String(skillId), reviewer: req.user._id });
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this skill');
  }

  // Require a completed booking as learner
  const completedBooking = await Booking.findOne({
    skill: String(skillId),
    learner: req.user._id,
    status: 'completed',
  });

  if (!completedBooking) {
    res.status(400);
    throw new Error('You must have a completed booking for this skill to leave a review');
  }

  const skill = await Skill.findById(String(skillId));
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  const review = await Review.create({
    skill: skillId,
    reviewer: req.user._id,
    instructor: skill.instructor,
    rating,
    comment,
  });

  await review.populate('reviewer', 'name profilePicture');

  res.status(201).json({ success: true, review });
});

/**
 * @desc    Get all reviews for a specific skill
 * @route   GET /api/reviews/skill/:skillId
 * @access  Public
 */
const getSkillReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ skill: req.params.skillId })
    .populate('reviewer', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

/**
 * @desc    Get all reviews for a specific instructor
 * @route   GET /api/reviews/instructor/:instructorId
 * @access  Public
 */
const getInstructorReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ instructor: req.params.instructorId })
    .populate('reviewer', 'name profilePicture')
    .populate('skill', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

module.exports = { createReview, getSkillReviews, getInstructorReviews };
