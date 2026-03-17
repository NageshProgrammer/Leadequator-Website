import 'dotenv/config'

import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import { neon } from '@neondatabase/serverless'
import pg from 'pg'

const { Pool } = pg

// ---- toggle ----
const DEV = true
// ----------------

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env')
}

let db : any;

if (DEV) {

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  db = drizzlePg(pool)

  ;(async () => {
    try {
      await pool.query('SELECT 1')
      console.log('✅ Local Postgres connection successful')
    } catch (err) {
      console.error('❌ Local Postgres connection failed', err)
    }
  })()

} else {

  const sql = neon(process.env.DATABASE_URL, {
    fetchOptions: { timeout: 10000 }
  })

  db = drizzleNeon(sql)

  ;(async () => {
    try {
      await sql.query('SELECT 1')
      console.log('✅ NeonDB connection successful')
    } catch (err) {
      console.error('❌ NeonDB connection failed', err)
    }
  })()

}

export { db }