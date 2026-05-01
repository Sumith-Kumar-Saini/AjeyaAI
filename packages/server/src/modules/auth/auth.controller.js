import { getCurrentUser, loginUser, signupUser } from './auth.service.js';

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

export const signup = async (req, res) => {
    const { user, tokens } = await signupUser(req.body);

    res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

    return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user,
            accessToken: tokens.accessToken,
        },
    });
};

export const login = async (req, res) => {
    const { user, tokens } = await loginUser(req.body);

    res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user,
            accessToken: tokens.accessToken,
        },
    });
};

export const getMe = async (req, res) => {
    const user = await getCurrentUser(req.user.id);

    return res.status(200).json({
        success: true,
        data: user,
    });
};
