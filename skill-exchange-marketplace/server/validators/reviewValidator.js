const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');

const createReviewValidator = [
  body('skill')
    .notEmpty()
    .withMessage('Skill ID is required')
    .isMongoId()
    .withMessage('Skill must be a valid ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  validate,
];

module.exports = { createReviewValidator };
