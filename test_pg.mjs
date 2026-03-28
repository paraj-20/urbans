import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_JpcDyGC7K4gA@ep-restless-rain-ak6crim4-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require'
});

try {
  const result = await pool.query('SELECT COUNT(*) as n FROM users');
  console.log('✅ SUCCESS! Connected to Neon via TCP (pg). Users count:', result.rows[0].n);
} catch (e) {
  console.error('❌ FAILED via pg:', e.message);
} finally {
  await pool.end();
}
