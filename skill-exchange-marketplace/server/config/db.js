const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Connect to PostgreSQL using Prisma
 */
const connectDB = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Add it to your .env file or Render environment.');
  }

  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected');
  } catch (error) {
    console.error('PostgreSQL connection failed.');
    console.error(
      'If using Render Postgres, verify DATABASE_URL is set correctly and the database is reachable.'
    );
    throw error;
  }
};

module.exports = { prisma, connectDB };
