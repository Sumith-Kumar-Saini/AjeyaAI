import crypto from 'crypto';
import {
    loginUser,
    logoutUser,
    googleAuthUser,
    refreshUserTokens,
    signupUser,
} from './auth.service.js';
import { AppError } from '../../utils/AppError.js';
import { logAudit } from '../audit-logs/auditLogger.js';

const isProduction = process.env.NODE_ENV === 'production';

const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const oauthStateCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
};

const getGoogleOAuthConfig = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;


    if (!clientId || !clientSecret || !callbackUrl) {
        throw new AppError('Google auth is not configured', 500, 'GOOGLE_AUTH_NOT_CONFIGURED');
    }

    return { clientId, clientSecret, callbackUrl };
};

const appendQueryParam = (url, key, value) => {
    const redirectUrl = new URL(url);
    redirectUrl.searchParams.set(key, value);
    return redirectUrl.toString();
};

const buildGoogleAuthUrl = (state) => {
    const { clientId, callbackUrl } = getGoogleOAuthConfig();
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
        state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const exchangeGoogleCode = async (code) => {
    const { clientId, clientSecret, callbackUrl } = getGoogleOAuthConfig();
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: callbackUrl,
            grant_type: 'authorization_code',
        }),
    });

    if (!response.ok) {
        throw new AppError('Unable to verify Google login', 401, 'GOOGLE_TOKEN_EXCHANGE_FAILED');
    }

    return response.json();
};

const fetchGoogleProfile = async (accessToken) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new AppError('Unable to fetch Google profile', 401, 'GOOGLE_PROFILE_FETCH_FAILED');
    }

    return response.json();
};

export const signup = async (req, res, next) => {
    try {
        const { user, tokens } = await signupUser(req.body);

        res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

        logAudit({
            action: 'USER_CREATED',
            userId: user.id,
            targetId: user.id,
            targetType: 'User',
            details: {
                email: user.email,
                name: user.name,
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                accessToken: tokens.accessToken,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

export const login = async (req, res, next) => {
    try {
        const { user, tokens } = await loginUser(req.body);

        res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

        logAudit({
            action: user.role === 'Admin' ? 'ADMIN_LOGIN' : 'USER_LOGIN',
            userId: user.id,
            targetId: user.id,
            targetType: 'User',
            details: {
                method: 'local',
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                accessToken: tokens.accessToken,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

export const googleLogin = (req, res, next) => {
    try {
        const state = crypto.randomBytes(16).toString('hex');

        res.cookie('oauth_state', state, oauthStateCookieOptions);

        return res.redirect(buildGoogleAuthUrl(state));
    } catch (error) {
        return next(error);
    }
};

export const googleCallback = async (req, res, next) => {
    try {
        const { code, state } = req.query;

        if (!code) {
            throw new AppError('Google authorization code is required', 400, 'GOOGLE_CODE_MISSING');
        }

        if (!state || state !== req.cookies.oauth_state) {
            throw new AppError('Invalid OAuth state', 401, 'INVALID_OAUTH_STATE');
        }

        res.clearCookie('oauth_state', oauthStateCookieOptions);

        const googleTokens = await exchangeGoogleCode(code);
        const profile = await fetchGoogleProfile(googleTokens.access_token);
        const { user, tokens } = await googleAuthUser({
            googleId: profile.sub,
            email: profile.email,
            name: profile.name,
            avatarUrl: profile.picture,
            emailVerified: profile.email_verified,
        });

        res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

        logAudit({
            action: user.role === 'Admin' ? 'ADMIN_LOGIN' : 'USER_LOGIN',
            userId: user.id,
            targetId: user.id,
            targetType: 'User',
            details: {
                method: 'google',
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });



        const redirectUrl = process.env.GOOGLE_AUTH_SUCCESS_REDIRECT_URL;

        if (redirectUrl) {
            return res.redirect(appendQueryParam(redirectUrl, 'success', 'true'));
        }


        return res.status(200).json({
            success: true,
            message: 'Google login successful',
            data: {
                user,
                accessToken: tokens.accessToken,
            },
        });
    } catch (error) {
        res.clearCookie('oauth_state', oauthStateCookieOptions);

        const errorRedirect = process.env.GOOGLE_AUTH_ERROR_REDIRECT_URL;

        if (errorRedirect) {
            return res.redirect(appendQueryParam(errorRedirect, 'error', 'true'));
        }

        return next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const accessToken = req.cookies.accessToken;

        if (!refreshToken) {
            throw new AppError('Refresh token required', 400, 'REFRESH_TOKEN_MISSING');
        }

        await logoutUser(refreshToken, accessToken);
        // Clear cookies
        res.clearCookie('accessToken', accessCookieOptions);
        res.clearCookie('refreshToken', refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken;
        const { tokens } = await refreshUserTokens(refreshTokenFromCookie);

        res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: 'Token refreshed',
            data: {
                accessToken: tokens.accessToken,
            },
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Internal server error',
            code: error.code,
        });
    }
};

export const getMe = async (req, res, next) => {
    try {

        if (!req.user?.id) {
            throw new AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        return res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};