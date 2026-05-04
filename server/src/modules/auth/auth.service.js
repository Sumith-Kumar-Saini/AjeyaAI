import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getRedisClient } from '../../config/redis.config.js';
import { AppError } from '../../utils/AppError.js';
import { User } from './user.model.js';

const SALT_ROUNDS = 12;
const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const toPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role || 'User',
  createdAt: user.createdAt,
});

const createAccessToken = (user) => {
  const accessSecret = process.env.ACCESS_SECRET || process.env.JWT_SECRET;

  if (!accessSecret) {
    throw new AppError('Access token secret is not configured', 500, 'ACCESS_SECRET_MISSING');
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessSecret,
    { expiresIn: DEFAULT_ACCESS_TOKEN_EXPIRES_IN },
  );
};

const createAndStoreRefreshToken = async (user) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const hashedRefreshToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  await getRedisClient().set(
    `refresh:${hashedRefreshToken}`,
    user._id.toString(),
    'EX',
    7 * 24 * 60 * 60,
  );

  return refreshToken;
};

const createTokenPair = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = await createAndStoreRefreshToken(user);

  return { accessToken, refreshToken };
};

const hashRefreshToken = (refreshToken) => crypto
  .createHash('sha256')
  .update(refreshToken)
  .digest('hex');

export const signupUser = async ({ name, email, password }) => {
  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw new AppError('Email is already registered', 409, 'EMAIL_ALREADY_REGISTERED');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    return {
      user: toPublicUser(user),
      tokens: await createTokenPair(user),
    };
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError('Email is already registered', 409, 'EMAIL_ALREADY_REGISTERED');
    }

    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (user.authProvider === 'google' && !user.passwordHash) {
    throw new AppError(
      'This account uses Google login. Please continue with Google.',
      401,
      'GOOGLE_AUTH_REQUIRED',
    );
  }

  if (!user.passwordHash) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return {
    user: toPublicUser(user),
    tokens: await createTokenPair(user),
  };
};

export const googleAuthUser = async ({ googleId, email, name, avatarUrl, emailVerified }) => {
  if (!googleId || !email) {
    throw new AppError('Google profile is missing required data', 400, 'GOOGLE_PROFILE_INVALID');
  }

  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ $or: [{ googleId }, { email: normalizedEmail }] });

  if (user) {
    const shouldUpdateGoogleFields = !user.googleId
      || user.authProvider !== 'google'
      || user.avatarUrl !== avatarUrl
      || user.emailVerified !== Boolean(emailVerified);

    if (shouldUpdateGoogleFields) {
      user.googleId = googleId;
      user.authProvider = 'google';
      user.avatarUrl = avatarUrl || '';
      user.emailVerified = Boolean(emailVerified);
      await user.save();
    }
  } else {
    user = await User.create({
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      authProvider: 'google',
      googleId,
      avatarUrl: avatarUrl || '',
      emailVerified: Boolean(emailVerified),
    });
  }

  return {
    user: toPublicUser(user),
    tokens: await createTokenPair(user),
  };
};


export const refreshUserTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Unauthorized', 401, 'REFRESH_TOKEN_MISSING');
  }

  const hashedRefreshToken = hashRefreshToken(refreshToken);
  const redisClient = getRedisClient();
  const userId = await redisClient.get(`refresh:${hashedRefreshToken}`);

  if (!userId) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  await redisClient.del(`refresh:${hashedRefreshToken}`);

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return {
    user: toPublicUser(user),
    tokens: await createTokenPair(user),
  };
};

export const logoutUser = async (refreshToken, accessToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token required', 400, 'REFRESH_TOKEN_MISSING');
  }

  const hashedRefreshToken = hashRefreshToken(refreshToken);

  await getRedisClient().del(`refresh:${hashedRefreshToken}`);

  if (accessToken) {
    // Blacklist the access token for 15 minutes
    await getRedisClient().set(
      `blacklist:access:${accessToken}`,
      'blacklisted',
      'EX',
      15 * 60,
    );
  }
};
