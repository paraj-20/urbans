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

import { neon } from '@neondatabase/serverless';

/**
 * `sql` is a tagged-template SQL executor using lazy evaluation.
 * 
 * WHY: During `next build` on Vercel, setting up clients at the top level 
 * crashes module collection if DATABASE_URL is not set. Wrapping it prevents 
 * build-time crashes and defers verification to runtime execution.
 */
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
    if (!process.env.DATABASE_URL) {
        throw new Error(
            '[neon.ts] DATABASE_URL is not set. ' +
            'Please configure it in your Vercel/environment settings.'
        );
    }
    const client = neon(process.env.DATABASE_URL);
    return client(strings, ...values);
};

"// trigger deploy" 
