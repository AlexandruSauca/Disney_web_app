import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Find user
        const user = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username);

        // Verify password if user exists
        if (user && bcrypt.compareSync(password, user.password_hash)) {
            const response = NextResponse.json({ success: true });

            // Set auth cookie
            response.cookies.set('auth_token', 'valid_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
