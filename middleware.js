import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Define paths that are public
    const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];

    // Allow static assets (images, fonts, etc.)
    if (path.startsWith('/_next') || path.startsWith('/static') || path.includes('.')) {
        return NextResponse.next();
    }

    // Check if current path is public
    const isPublicPath = publicPaths.includes(path);

    const token = request.cookies.get('auth_token')?.value;

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optional: Redirect to home if already logged in and trying to access login/register
    if (token && (path === '/login' || path === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
