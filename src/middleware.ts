import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-rouji-project';
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Define protected paths
  const protectedPaths = [
    '/dashboard',
    '/booklet',
    '/quizzes',
    '/diagnostic',
    '/forum',
    '/chat',
    '/reflections'
  ];

  const isProtected = protectedPaths.some(p => path.startsWith(p));

  // If the path is not protected, allow it
  if (!isProtected) {
    return NextResponse.next();
  }

  // 2. Get session cookie for protected paths
  const session = req.cookies.get('session')?.value;

  // 3. If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 4. Verify session
  try {
    await jwtVerify(session, encodedKey);
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/booklet/:path*',
    '/quizzes/:path*',
    '/diagnostic/:path*',
    '/forum/:path*',
    '/chat/:path*',
    '/reflections/:path*',
  ],
};
