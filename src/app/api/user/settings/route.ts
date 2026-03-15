import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import { getUserSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const users = await sql`
            SELECT id, name, email FROM users WHERE id = ${session.id as string} LIMIT 1
        `;

        if (users.length === 0) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        return NextResponse.json({ user: users[0] });
    } catch (error: any) {
        console.error('[settings GET] Error:', error?.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await req.json();
        const { name, password } = body;

        if (!name && !password) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
        }

        if (name) {
            await sql`
                UPDATE users SET name = ${name.trim()} WHERE id = ${session.id as string}
            `;
        }

        if (password) {
            if (password.length < 6) {
                return NextResponse.json(
                    { error: 'Password must be at least 6 characters' },
                    { status: 400 }
                );
            }
            const hash = await bcrypt.hash(password, 12);
            await sql`
                UPDATE users SET password_hash = ${hash} WHERE id = ${session.id as string}
            `;
        }

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error: any) {
        console.error('[settings PUT] Error:', error?.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await sql`DELETE FROM users WHERE id = ${session.id as string}`;

        return NextResponse.json({ message: 'Account deleted' });
    } catch (error: any) {
        console.error('[settings DELETE] Error:', error?.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
