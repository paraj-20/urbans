import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/neon';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const { rows: existingUser } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.length > 0) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const { rows: newUser } = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hash]
        );

        const token = await signToken({ id: newUser[0].id, name: newUser[0].name, email: newUser[0].email });

        const cookieStore = await cookies();
        cookieStore.set('urbans_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return NextResponse.json({ message: 'User created successfully', user: newUser[0] }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
