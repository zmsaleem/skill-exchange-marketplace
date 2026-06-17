const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { getAllBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { createBookingValidator } = require('../validators/bookingValidator');

// /my-bookings must come before /:id/status to avoid route conflict
router.get('/my-bookings', protect, getMyBookings);

// admin-only: list all bookings
router.get('/all', protect, getAllBookings);

router.post('/', protect, createBookingValidator, createBooking);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
