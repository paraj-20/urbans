import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

// Secret key for JWT verification (same as in AuthContext/API routes)
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'urbans-secret-key-1234567890-super-safe'
);

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('urbans_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. If user is logged in and tries to access login or signup, redirect to home
    if (token && (pathname === '/login' || pathname === '/signup')) {
        try {
            // Verify token to ensure it's valid before redirecting
            await jose.jwtVerify(token, JWT_SECRET);
            return NextResponse.redirect(new URL('/', request.url));
        } catch (e) {
            // Token is invalid, let them proceed to login/signup
            return NextResponse.next();
        }
    }

    // 2. If user is NOT logged in and tries to access protected routes, redirect to login
    if (!token && (pathname.startsWith('/settings') || pathname === '/checkout')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/signup', '/settings/:path*', '/checkout'],
};
