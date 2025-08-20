const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  login: `${BASE_URL}/api/login`,
  register: `${BASE_URL}/api/register`,
  logout: `${BASE_URL}/api/logout`,
  refresh: `${BASE_URL}/api/refresh`,
};
