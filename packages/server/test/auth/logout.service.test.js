import crypto from 'crypto';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const redisDel = jest.fn();
const redisSet = jest.fn();

jest.unstable_mockModule('../../src/config/redis.config.js', () => ({
    getRedisClient: () => ({
        del: redisDel,
        set: redisSet,
    }),
}));

const { logoutUser } = await import('../../src/modules/auth/auth.service.js');

describe('logoutUser', () => {
    beforeEach(() => {
        redisDel.mockReset();
        redisSet.mockReset();
    });

    test('deletes the refresh token and blacklists the access token', async () => {
        await logoutUser('refresh-token', 'access-token');

        const hashedRefreshToken = crypto
            .createHash('sha256')
            .update('refresh-token')
            .digest('hex');

        expect(redisDel).toHaveBeenCalledWith(`refresh:${hashedRefreshToken}`);
        expect(redisSet).toHaveBeenCalledWith(
            'blacklist:access:access-token',
            'blacklisted',
            'EX',
            15 * 60,
        );
    });

    test('deletes the refresh token without blacklisting when no access token is provided', async () => {
        await logoutUser('refresh-token');

        const hashedRefreshToken = crypto
            .createHash('sha256')
            .update('refresh-token')
            .digest('hex');

        expect(redisDel).toHaveBeenCalledWith(`refresh:${hashedRefreshToken}`);
        expect(redisSet).not.toHaveBeenCalled();
    });

    test('throws when refresh token is missing', async () => {
        await expect(logoutUser()).rejects.toMatchObject({
            statusCode: 400,
            code: 'REFRESH_TOKEN_MISSING',
        });

        expect(redisDel).not.toHaveBeenCalled();
        expect(redisSet).not.toHaveBeenCalled();
    });
});