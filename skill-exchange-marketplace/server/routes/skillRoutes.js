const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getMySkills,
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');
const { createSkillValidator, updateSkillValidator } = require('../validators/skillValidator');

// /my-skills must come before /:id to avoid route conflict
router.get('/my-skills', protect, getMySkills);

router.get('/', getSkills);
router.post('/', protect, createSkillValidator, createSkill);
router.get('/:id', getSkillById);
router.put('/:id', protect, updateSkillValidator, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
