import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_JpcDyGC7K4gA@ep-restless-rain-ak6crim4-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require');

try {
    const rows = await sql`SELECT COUNT(*) as n FROM users`;
    console.log('✅ SUCCESS! Connected to Neon via HTTP. Users count:', rows[0].n);
} catch (e) {
    console.error('❌ FAILED:', e.message);
    process.exit(1);
}
