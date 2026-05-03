import "dotenv/config"
import http from 'http';
import { app } from './src/app.js';
import { connectDB } from './src/config/db.config.js';
import { initRedis } from './src/config/redis.config.js';
import { logger } from './src/utils/logger.js';


// for the dotenv

const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('MongoDB connected successfully');

    // Initialize Redis stub
    await initRedis();
    logger.info('Redis client initialized (stub)');

    const port = process.env.PORT;
    server.listen(port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
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