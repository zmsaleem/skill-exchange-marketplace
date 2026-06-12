const express = require('express');
const router = express.Router();
const { getUserById, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateProfile);
router.get('/:id', getUserById);

module.exports = router;
