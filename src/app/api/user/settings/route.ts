import { NextResponse } from 'next/server';
import { pool } from '@/lib/neon';
import { getUserSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const user = await getUserSession();
        if (!user) return NextResponse.json({ user: null }, { status: 401 });

        // Fetch latest user info
        const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [user.id]);
        if (rows.length === 0) return NextResponse.json({ user: null }, { status: 404 });

        return NextResponse.json({ user: rows[0] });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const user = await getUserSession();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { name, password } = await req.json();

        if (name) {
            await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, user.id]);
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, user.id]);
        }

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const user = await getUserSession();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        await pool.query('DELETE FROM users WHERE id = $1', [user.id]);

        return NextResponse.json({ message: 'Account deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
