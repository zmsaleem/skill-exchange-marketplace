const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a user
 * @param {string} id - MongoDB user _id
 * @returns {string} Signed JWT token valid for 30 days
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;
