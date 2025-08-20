import bcrypt from 'bcrypt';
import { pool } from '../db/db';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generate-token';

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export const register = async (data: RegisterData) => {
  const { email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [
      email,
      hashedPassword,
    ]);
  } catch (error: any) {
    console.log('Error during registration:', error);
    if (error.code === '23505') {
      // unique violation
      throw new Error('Email already exists');
    }
    throw new Error('Internal server error');
  }
};

export const login = async (data: LoginData): Promise<LoginResult> => {
  const { email, password } = data;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const expiresAt = new Date(Date.now());
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, expiresAt]
  );

  return { accessToken, refreshToken, userId: user.id };
};
