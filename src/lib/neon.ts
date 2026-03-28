import { Pool } from 'pg';

/**
 * neon.ts - Ultimate DNS-over-HTTPS Bypassing TCP Client
 * 
 * WHY THIS CHANGE:
 * You encountered `getaddrinfo ENOTFOUND api.c...neon.tech`.
 * This happens because local Indian ISPs (specifically Jio/Airtel) 
 * are aggressively sinkholing DNS lookups over Port 53.
 * 
 * This module actively intercepts the DATABASE_URL, parses it, and safely
 * proxies the DNS lookup to actual Google Public DNS natively over HTTPS (Port 443).
 * It dynamically forces `pg` to connect explicitly to the direct IP.
 * The TLS `servername` SNI enforces proper routing in Neon DB.
 */

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

async function getPool(): Promise<Pool> {
    if (pool) return pool;

    if (!initPromise) {
        initPromise = (async () => {
            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) {
                throw new Error('[neon.ts] DATABASE_URL is not set.');
            }

            try {
                // To bypass Indian ISP DNS blocking of Neon endpoints via port 53:
                // We resolve the domain over HTTPS using Google DNS natively.
                const url = new URL(dbUrl);
                const hostname = url.hostname;
                
                const dnsRes = await fetch(`https://dns.google/resolve?name=${hostname}`);
                const data = await dnsRes.json();
                
                // Seek the first IPv4 A record (type 1) from the resolution chain
                const aRecord = data.Answer?.find((a: any) => a.type === 1);
                
                if (!aRecord || !aRecord.data) {
                    console.warn('[neon.ts] DoH missing type-1 record, yielding to system dns...');
                    pool = new Pool({
                        connectionString: dbUrl,
                        ssl: { rejectUnauthorized: false }
                    });
                    return;
                }

                const resolvedIp = aRecord.data;

                // Link standard Postgre TCP pool natively directly overriding system lookup
                pool = new Pool({
                    host: resolvedIp,
                    port: parseInt(url.port || '5432', 10),
                    database: url.pathname.slice(1),
                    user: url.username,
                    password: url.password,
                    ssl: { 
                        rejectUnauthorized: false,
                        servername: hostname // CRITICAL: Forces Neon Database Proxy Router
                    }
                });
            } catch (err) {
                console.error('[neon.ts] DoH resolve totally failed, falling back safely:', err);
                pool = new Pool({
                    connectionString: dbUrl,
                    ssl: { rejectUnauthorized: false }
                });
            }
        })();
    }

    await initPromise;
    return pool!;
}

export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
    const activePool = await getPool();
    
    // Efficiently convert tagged templates (await sql`SELECT ${email}`) 
    // to PostgreSQL parameterized queries (SELECT $1) 
    let text = strings[0];
    for (let i = 0; i < values.length; i++) {
        text += `$${i + 1}${strings[i + 1]}`;
    }
    
    // Execute and return rows directly to flawlessly match standard arrays
    const res = await activePool.query(text, values);
    return res.rows;
}; 
