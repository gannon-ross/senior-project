import { pool } from './config/db.js';

const checkSchema = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Check the schema of the users table
    const [rows] = await connection.query('DESCRIBE users');
    
    console.log('Users table schema:');
    console.log(rows);
    
    connection.release();
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    process.exit(0);
  }
};

checkSchema();
