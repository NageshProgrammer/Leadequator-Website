import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env');
}

const sql = neon(process.env.DATABASE_URL, { 
  fetchOptions: { timeout: 10000 } // 10 seconds timeout
});

export const db = drizzle(sql);

// Optional: test connection immediately
(async () => {
  try {
    await sql.query('SELECT 1');
    console.log('✅ NeonDB connection successful');
  } catch (err) {
    console.error('❌ NeonDB connection failed', err);
  }
})();
