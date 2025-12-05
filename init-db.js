const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
  try {
    console.log('Checking database...');
    
    // Check if tables exist
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('Database already initialized.');
      process.exit(0);
    }
    
    console.log('Initializing database...');
    const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error.message);
    console.log('Skipping database initialization - please initialize manually.');
    process.exit(0); // Exit successfully so server can start
  }
}

initializeDatabase();
