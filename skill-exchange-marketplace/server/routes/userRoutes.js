const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUsers);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.put('/profile', protect, updateProfile);
router.get('/:id', getUserById);

module.exports = router;
