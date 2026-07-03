import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('Al-Urbans_token');
    return NextResponse.json({ message: 'Logged out successfully' });
}
