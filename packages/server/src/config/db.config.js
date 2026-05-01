import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../utils/logger.js';

const MONGO_OPTIONS = {
  autoIndex: true, // build indexes automatically
  maxPoolSize: 10, // maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // timeout after 5s
  socketTimeoutMS: 45000, // close sockets after 45s of inactivity
};

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, MONGO_OPTIONS);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error({ error }, 'MongoDB connection failed');
    process.exit(1); // crash app if DB fails to connect
  }

  // Handle disconnections gracefully
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting reconnect...');
  });

  // Handle SIGINT for graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed due to app termination');
    process.exit(0);
  });
};