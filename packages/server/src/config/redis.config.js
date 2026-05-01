import Redis from 'ioredis';
import { env } from './env.config.js';
import { logger } from '../utils/logger.js';

let redisClient = null;

/**
 * Initialize Redis client (stub for MVP)
 * Post-MVP: enable actual caching and rate limiting.
 */
export const initRedis = async () => {
  if (!env.REDIS_URL) {
    logger.info('Redis URL not set - skipping Redis initialization (MVP stub)');
    return;
  }

  try {
    redisClient = new Redis(env.REDIS_URL);

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
    // Do not crash the app for MVP; Redis is optional
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