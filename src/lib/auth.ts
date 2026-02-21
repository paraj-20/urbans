import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'urbans-secret-key-1234567890-super-safe';
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getUserSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('urbans_token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}
