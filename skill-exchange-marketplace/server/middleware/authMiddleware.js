const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { prisma } = require('../config/db');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: Number(decoded.id) },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          bio: true,
          profilePicture: true,
          skillsToTeach: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }

      req.user = { ...user, _id: user.id };
      return next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
