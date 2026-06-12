const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');

const createBookingValidator = [
  body('skill')
    .notEmpty()
    .withMessage('Skill ID is required')
    .isMongoId()
    .withMessage('Skill must be a valid ID'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  validate,
];

module.exports = { createBookingValidator };
