import { Pool } from 'pg';
import dns from 'dns';

// Fix for strict local ISP DNS blocking (e.g. Jio/Airtel blocking neon.tech)
// We intercept Node's native dns.lookup and force it to use Google/Cloudflare DNS for Neon.
const originalLookup = dns.lookup;
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

(dns as any).lookup = function (hostname: string, options: any, callback: any) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    if (hostname && hostname.includes('.neon.tech')) {
        dns.resolve4(hostname, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                return originalLookup(hostname, options, callback);
            }
            if (options && options.all) {
                // If the caller requested all addresses (like `pg` package does), format properly:
                const results = addresses.map(addr => ({ address: addr, family: 4 }));
                callback(null, results);
            } else {
                // Return single address if all: true wasn't specified
                callback(null, addresses[0], 4);
            }
        });
    } else {
        originalLookup(hostname, options, callback);
    }
};

const globalForPg = globalThis as unknown as {
    pgPool: Pool | undefined;
};

export const pool =
    globalForPg.pgPool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false, // For Neon.tech
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;
