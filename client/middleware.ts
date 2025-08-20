// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from './helper/cookie-handler';

export async function middleware(req: NextRequest) {
  const token = await getCookie('access_token');
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Redirect if no token
  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // protect these routes
};
