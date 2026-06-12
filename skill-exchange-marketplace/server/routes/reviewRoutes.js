const express = require('express');
const router = express.Router();
const { createReview, getSkillReviews, getInstructorReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { createReviewValidator } = require('../validators/reviewValidator');

router.post('/', protect, createReviewValidator, createReview);
router.get('/skill/:skillId', getSkillReviews);
router.get('/instructor/:instructorId', getInstructorReviews);

module.exports = router;
