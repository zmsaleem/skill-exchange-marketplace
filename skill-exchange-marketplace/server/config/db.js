const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not set. Add it to your .env file.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const hasDatabaseName = /mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/.test(mongoUri);

    console.error('MongoDB connection failed.');

    if (!hasDatabaseName) {
      console.error(
        'MONGO_URI does not include a database name. Use mongodb+srv://<user>:<pass>@<cluster>/<dbName>?retryWrites=true&w=majority'
      );
    }

    console.error(
      'If using MongoDB Atlas, verify: Network Access IP allowlist, valid DB user/password, and that your cluster is running.'
    );

    throw error;
  }
};

module.exports = connectDB;
