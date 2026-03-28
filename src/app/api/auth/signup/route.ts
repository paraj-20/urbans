import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/neon';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUsers = await sql`
            SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
        `;

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password with bcrypt (cost factor 12 for production security)
        const passwordHash = await bcrypt.hash(password, 12);

        // Insert new user with explicit provider tag
        const newUsers = await sql`
            INSERT INTO users (name, email, password_hash, provider)
            VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${passwordHash}, 'credentials')
            RETURNING id, name, email
        `;

        const newUser = newUsers[0];

        // Generate JWT token
        const token = await signToken({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
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

        return NextResponse.json(
            {
                message: 'Account created successfully',
                user: { id: newUser.id, name: newUser.name, email: newUser.email },
            },
            { status: 201 }
        );
    } catch (error: any) {
        // Log the real error for debugging (visible in Next.js terminal / Vercel logs)
        console.error('[signup] Error:', {
            message: error?.message ?? 'Unknown error',
            code: error?.code,
            detail: error?.detail,
        });

        // Surface DB constraint errors as user-friendly messages
        if (error?.code === '23505') {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
