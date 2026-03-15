/**
 * neon.ts - Production-grade Neon database client
 *
 * WHY @neondatabase/serverless instead of `pg`:
 * - Uses HTTP (fetch) instead of TCP sockets → bypasses ISP DNS blocking
 *   (Jio/Airtel in India block neon.tech via native getaddrinfo)
 * - Dramatically faster cold starts in serverless environments (no TCP handshake)
 * - Automatic connection pooling built into Neon's HTTP endpoint
 * - Works in Node.js, Edge runtime, and browser environments
 */

import { neon, neonConfig } from '@neondatabase/serverless';

// Disable WebSocket for pure HTTP mode - better for serverless cold starts
// and avoids any TCP-level DNS issues
neonConfig.fetchConnectionCache = true;

// Validate the DATABASE_URL is present at startup
if (!process.env.DATABASE_URL) {
    throw new Error(
        '[neon.ts] DATABASE_URL is not set. ' +
        'Add it to your .env.local file as: DATABASE_URL="postgresql://..."'
    );
}

/**
 * `sql` is a tagged-template SQL executor.
 * Usage: await sql`SELECT * FROM users WHERE email = ${email}`
 *
 * It is safe against SQL injection (values are parameterised automatically).
 * It returns rows as an array of typed objects.
 */
export const sql = neon(process.env.DATABASE_URL);
