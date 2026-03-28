import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const users = await sql`
            SELECT provider
            FROM users
            WHERE email = ${email.toLowerCase().trim()}
            LIMIT 1
        `;

        if (users.length === 0) {
            return NextResponse.json({ exists: false, provider: null });
        }

        return NextResponse.json({
            exists: true,
            provider: users[0].provider
        });
    } catch (error: any) {
        console.error('[check-email] Error:', error);
        return NextResponse.json(
            { error: 'Failed to verify email' },
            { status: 500 }
        );
    }
}
