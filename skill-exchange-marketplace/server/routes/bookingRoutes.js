const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { createBookingValidator } = require('../validators/bookingValidator');

// /my-bookings must come before /:id/status to avoid route conflict
router.get('/my-bookings', protect, getMyBookings);

router.post('/', protect, createBookingValidator, createBooking);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
