import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { sql } from '@/lib/neon';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { credential } = body;

        if (!credential) {
            return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
        }

        // Verify the Google ID Token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return NextResponse.json({ error: 'Invalid Google token' }, { status: 400 });
        }

        const email = payload.email.toLowerCase().trim();
        const name = payload.name || 'Google User';

        // Check if user already exists
        const existingUsers = await sql`
            SELECT id, name, email, provider FROM users WHERE email = ${email} LIMIT 1
        `;

        let user;

        if (existingUsers.length > 0) {
            // User exists, just log them in
            user = existingUsers[0];

            // Safeguard: Automatically link their provider correctly if they decide to use Google
            if (user.provider !== 'google') {
                await sql`UPDATE users SET provider = 'google' WHERE id = ${user.id}`;
            }
        } else {
            // Create user
            // We use a dummy password hash since Google users don't use passwords.
            // This avoids an unnecessary, expensive bcrypt hashing operation.
            const passwordHash = '[GOOGLE_AUTH_NO_PASSWORD]';

            const newUsers = await sql`
                INSERT INTO users (name, email, password_hash, provider)
                VALUES (${name}, ${email}, ${passwordHash}, 'google')
                RETURNING id, name, email
            `;
            user = newUsers[0];
        }

        // Generate JWT token
        const token = await signToken({
            id: user.id,
            name: user.name,
            email: user.email,
        });

        // Set HttpOnly auth cookie
        const cookieStore = await cookies();
        cookieStore.set('Al-Urbans_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return NextResponse.json(
            {
                message: 'Logged in successfully',
                user: { id: user.id, name: user.name, email: user.email },
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('[google_auth] Error:', error);
        return NextResponse.json(
            { error: 'Authentication failed. Please try again.' },
            { status: 500 }
        );
    }
}
