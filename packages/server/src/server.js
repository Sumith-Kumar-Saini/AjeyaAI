import http from 'http';
import { app } from './app.js';
import { connectDB } from './config/db.config.js';
import { initRedis } from './config/redis.config.js';
import { env } from './config/env.config.js';
import { logger } from './utils/logger.js';

const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('MongoDB connected successfully');

    // Initialize Redis stub
    await initRedis();
    logger.info('Redis client initialized (stub)');

    const port = env.PORT;
    server.listen(port, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${port}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

void startServer();