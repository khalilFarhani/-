import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-rouji-project';
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Define paths
  const protectedPaths = [
    '/dashboard',
    '/booklet',
    '/quizzes',
    '/diagnostic',
    '/forum',
    '/chat',
    '/reflections'
  ];

  const authPaths = [
    '/',
    '/login',
    '/register'
  ];

  const isProtected = protectedPaths.some(p => path.startsWith(p));
  const isAuthPath = authPaths.includes(path);

  // If the path is not protected and not an auth path, allow it
  if (!isProtected && !isAuthPath) {
    return NextResponse.next();
  }

  // 2. Get session cookie
  const session = req.cookies.get('session')?.value;

  // 3. Handle protected routes
  if (isProtected) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      await jwtVerify(session, encodedKey);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('session');
      return response;
    }
  }

  // 4. Handle auth paths (landing, login, register)
  if (isAuthPath) {
    if (session) {
      try {
        await jwtVerify(session, encodedKey);
        // If valid session exists, redirect to dashboard automatically
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } catch (error) {
        // Invalid session, clear cookie and let them stay
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/booklet/:path*',
    '/quizzes/:path*',
    '/diagnostic/:path*',
    '/forum/:path*',
    '/chat/:path*',
    '/reflections/:path*',
  ],
};
