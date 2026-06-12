const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all skills with optional filtering by search query and category
 * @route   GET /api/skills
 * @access  Public
 */
const getSkills = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (search) {
    // Escape special regex characters to prevent ReDoS
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: escapedSearch, $options: 'i' } },
      { description: { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = String(category);
  }

  const skills = await Skill.find(filter).populate('instructor', 'name email profilePicture');

  res.status(200).json({ success: true, count: skills.length, skills });
});

/**
 * @desc    Get a single skill by ID
 * @route   GET /api/skills/:id
 * @access  Public
 */
const getSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate(
    'instructor',
    'name email bio profilePicture skillsToTeach'
  );

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  res.status(200).json({ success: true, skill });
});

/**
 * @desc    Create a new skill listing
 * @route   POST /api/skills
 * @access  Private
 */
const createSkill = asyncHandler(async (req, res) => {
  const { title, description, category, availability } = req.body;

  const skill = await Skill.create({
    title,
    description,
    category,
    availability,
    instructor: req.user._id,
  });

  res.status(201).json({ success: true, skill });
});

/**
 * @desc    Update a skill listing
 * @route   PUT /api/skills/:id
 * @access  Private (owner only)
 */
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (skill.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this skill');
  }

  const { title, description, category, availability } = req.body;

  if (title !== undefined) skill.title = title;
  if (description !== undefined) skill.description = description;
  if (category !== undefined) skill.category = category;
  if (availability !== undefined) skill.availability = availability;

  const updatedSkill = await skill.save();

  res.status(200).json({ success: true, skill: updatedSkill });
});

/**
 * @desc    Delete a skill listing
 * @route   DELETE /api/skills/:id
 * @access  Private (owner only)
 */
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (skill.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this skill');
  }

  await skill.deleteOne();

  res.status(200).json({ success: true, message: 'Skill removed' });
});

/**
 * @desc    Get all skills posted by the authenticated user
 * @route   GET /api/skills/my-skills
 * @access  Private
 */
const getMySkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ instructor: req.user._id });

  res.status(200).json({ success: true, count: skills.length, skills });
});

module.exports = { getSkills, getSkillById, createSkill, updateSkill, deleteSkill, getMySkills };
