import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

let redisClient = null;

const getRedisOptions = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    return null;
  }

  return {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
  };
};

/**
 * Initialize Redis client.
 */
export const initRedis = async () => {
  const redisOptions = getRedisOptions();

  if (!redisOptions) {
    logger.info('Redis config not set - skipping Redis initialization');
    return;
  }

  try {
    redisClient = new Redis(redisOptions);

    redisClient.on('error', (err) => {
      logger.error({ err }, 'Redis client error');
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready to use');
    });

    // Optional: check connection by pinging Redis
    await redisClient.ping();
    logger.info('Redis ping successful');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Redis client');
  }
};

/**
 * Get the Redis client instance
 * Throws if accessed before initialization
 */
export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return redisClient;
};
