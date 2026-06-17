const asyncHandler = require('../utils/asyncHandler');
const { prisma } = require('../config/db');

const formatBooking = (booking) => ({
  _id: booking.id,
  skill: booking.skill
    ? {
        _id: booking.skill.id,
        title: booking.skill.title,
        category: booking.skill.category,
      }
    : null,
  learner: booking.learner
    ? {
        _id: booking.learner.id,
        name: booking.learner.name,
        email: booking.learner.email,
      }
    : null,
  instructor: booking.instructor
    ? {
        _id: booking.instructor.id,
        name: booking.instructor.name,
        email: booking.instructor.email,
      }
    : null,
  date: booking.date,
  status: booking.status,
  message: booking.message,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

const createBooking = asyncHandler(async (req, res) => {
  const { skill: skillId, date, message } = req.body;

  const skill = await prisma.skill.findUnique({
    where: { id: Number(skillId) },
  });

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (skill.instructorId === Number(req.user._id)) {
    res.status(400);
    throw new Error('You cannot book your own skill');
  }

  const booking = await prisma.booking.create({
    data: {
      skillId: skill.id,
      learnerId: Number(req.user._id),
      instructorId: skill.instructorId,
      date: new Date(date),
      message: message || '',
    },
    include: {
      skill: { select: { id: true, title: true, category: true } },
      instructor: { select: { id: true, name: true, email: true } },
      learner: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(201).json({ success: true, booking: formatBooking(booking) });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [{ learnerId: Number(req.user._id) }, { instructorId: Number(req.user._id) }],
    },
    include: {
      skill: { select: { id: true, title: true, category: true } },
      learner: { select: { id: true, name: true, email: true } },
      instructor: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, count: bookings.length, bookings: bookings.map(formatBooking) });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.instructorId !== Number(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  const validStatuses = ['accepted', 'rejected', 'completed'];
  if (!validStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: req.body.status },
    include: {
      skill: { select: { id: true, title: true, category: true } },
      learner: { select: { id: true, name: true, email: true } },
      instructor: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(200).json({ success: true, booking: formatBooking(updatedBooking) });
});

const getAllBookings = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const bookings = await prisma.booking.findMany({
    include: {
      skill: { select: { id: true, title: true, category: true } },
      learner: { select: { id: true, name: true, email: true } },
      instructor: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, count: bookings.length, bookings: bookings.map(formatBooking) });
});

module.exports = { createBooking, getMyBookings, updateBookingStatus, getAllBookings };
