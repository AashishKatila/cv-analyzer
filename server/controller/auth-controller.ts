import { Request, Response } from 'express';
import * as authModel from '../model/auth-model';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  try {
    await authModel.register(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authModel.login(req.body);
    res
      .cookie('access_token', result.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      .cookie('refresh_token', result.refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      .status(200)
      .json({
        message: 'Login successful',
        userId: result.userId,
      });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token found' });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
      (err: any, user: any) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        } else {
          const accessToken = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET!,
            { expiresIn: '15m' }
          );
          return res.status(200).json({ accessToken });
        }
      }
    );
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Server error while refreshing token' });
  }
};
