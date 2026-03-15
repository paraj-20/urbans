import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/neon';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Fetch user (normalise email to lowercase)
        const users = await sql`
            SELECT id, name, email, password_hash
            FROM users
            WHERE email = ${email.toLowerCase().trim()}
            LIMIT 1
        `;

        if (users.length === 0) {
            // Generic message to prevent email enumeration attacks
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = await signToken({
            id: user.id,
            name: user.name,
            email: user.email,
        });

        // Set HttpOnly auth cookie
        const cookieStore = await cookies();
        cookieStore.set('urbans_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return NextResponse.json({
            message: 'Logged in successfully',
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error: any) {
        console.error('[login] Error:', {
            message: error?.message ?? 'Unknown error',
            code: error?.code,
        });

        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
