const asyncHandler = require('../utils/asyncHandler');
const { prisma } = require('../config/db');

const formatSkill = (skill) => ({
  _id: skill.id,
  title: skill.title,
  description: skill.description,
  category: skill.category,
  availability: skill.availability,
  instructor: skill.instructor
    ? {
        _id: skill.instructor.id,
        name: skill.instructor.name,
        email: skill.instructor.email,
        profilePicture: skill.instructor.profilePicture,
      }
    : null,
  createdAt: skill.createdAt,
  updatedAt: skill.updatedAt,
});

const getSkills = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const where = {};

  if (search) {
    const normalizedSearch = String(search);
    where.OR = [
      { title: { contains: normalizedSearch, mode: 'insensitive' } },
      { description: { contains: normalizedSearch, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = String(category);
  }

  const skills = await prisma.skill.findMany({
    where,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
        },
      },
    },
  });

  res.status(200).json({ success: true, count: skills.length, skills: skills.map(formatSkill) });
});

const getSkillById = asyncHandler(async (req, res) => {
  const skill = await prisma.skill.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          profilePicture: true,
          skillsToTeach: true,
        },
      },
    },
  });

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  res.status(200).json({ success: true, skill: formatSkill(skill) });
});

const createSkill = asyncHandler(async (req, res) => {
  const { title, description, category, availability } = req.body;
  const skill = await prisma.skill.create({
    data: {
      title,
      description,
      category,
      availability,
      instructorId: Number(req.user._id),
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true, profilePicture: true },
      },
    },
  });

  res.status(201).json({ success: true, skill: formatSkill(skill) });
});

const updateSkill = asyncHandler(async (req, res) => {
  const existingSkill = await prisma.skill.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existingSkill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (existingSkill.instructorId !== Number(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update this skill');
  }

  const { title, description, category, availability } = req.body;
  const skill = await prisma.skill.update({
    where: { id: existingSkill.id },
    data: {
      title: title !== undefined ? title : existingSkill.title,
      description: description !== undefined ? description : existingSkill.description,
      category: category !== undefined ? category : existingSkill.category,
      availability: availability !== undefined ? availability : existingSkill.availability,
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true, profilePicture: true },
      },
    },
  });

  res.status(200).json({ success: true, skill: formatSkill(skill) });
});

const deleteSkill = asyncHandler(async (req, res) => {
  const existingSkill = await prisma.skill.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existingSkill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (existingSkill.instructorId !== Number(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete this skill');
  }

  await prisma.skill.delete({ where: { id: existingSkill.id } });

  res.status(200).json({ success: true, message: 'Skill removed' });
});

const getMySkills = asyncHandler(async (req, res) => {
  const skills = await prisma.skill.findMany({
    where: { instructorId: Number(req.user._id) },
    include: {
      instructor: {
        select: { id: true, name: true, email: true, profilePicture: true },
      },
    },
  });

  res.status(200).json({ success: true, count: skills.length, skills: skills.map(formatSkill) });
});

module.exports = { getSkills, getSkillById, createSkill, updateSkill, deleteSkill, getMySkills };
