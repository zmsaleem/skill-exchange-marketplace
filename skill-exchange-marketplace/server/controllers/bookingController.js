const Booking = require('../models/Booking');
const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new booking for a skill
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const { skill: skillId, date, message } = req.body;

  const skill = await Skill.findById(String(skillId));
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (skill.instructor.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot book your own skill');
  }

  const booking = await Booking.create({
    skill: skillId,
    learner: req.user._id,
    instructor: skill.instructor,
    date,
    message: message || '',
  });

  await booking.populate([
    { path: 'skill', select: 'title category' },
    { path: 'instructor', select: 'name email' },
  ]);

  res.status(201).json({ success: true, booking });
});

/**
 * @desc    Get all bookings where the user is either learner or instructor
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    $or: [{ learner: req.user._id }, { instructor: req.user._id }],
  })
    .populate('skill', 'title category')
    .populate('learner', 'name email')
    .populate('instructor', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

/**
 * @desc    Update the status of a booking (accept, reject, complete)
 * @route   PUT /api/bookings/:id/status
 * @access  Private (instructor only)
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  const validStatuses = ['accepted', 'rejected', 'completed'];
  if (!validStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  booking.status = req.body.status;
  const updatedBooking = await booking.save();

  res.status(200).json({ success: true, booking: updatedBooking });
});

module.exports = { createBooking, getMyBookings, updateBookingStatus };
