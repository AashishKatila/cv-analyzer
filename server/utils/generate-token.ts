import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;
const refeshKey = process.env.JWT_REFRESH_SECRET;

if (!secretKey) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export const generateAccessToken = (payload: object) => {
  const token = jwt.sign({ payload }, secretKey, {
    expiresIn: '15m',
  });
  return token;
};

export const generateRefreshToken = (payload: object) => {
  const refreshToken = jwt.sign({ payload }, refeshKey || secretKey, {
    expiresIn: '7d',
  });
  return refreshToken;
};
