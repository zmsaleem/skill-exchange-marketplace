const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');

const CATEGORIES = ['Programming', 'Design', 'Music', 'Language', 'Business', 'Science', 'Other'];
const AVAILABILITIES = ['Weekdays', 'Weekends', 'Evenings', 'Flexible'];

const createSkillValidator = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('availability')
    .isIn(AVAILABILITIES)
    .withMessage(`Availability must be one of: ${AVAILABILITIES.join(', ')}`),
  validate,
];

const updateSkillValidator = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('availability')
    .optional()
    .isIn(AVAILABILITIES)
    .withMessage(`Availability must be one of: ${AVAILABILITIES.join(', ')}`),
  validate,
];

module.exports = { createSkillValidator, updateSkillValidator };
