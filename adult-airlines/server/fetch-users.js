import { pool } from './config/db.js';

const fetchUsers = async () => {
  try {
    console.log('Connecting to database...');
    const connection = await pool.getConnection();
    
    console.log('Fetching users from database...');
    const [rows] = await connection.query('SELECT * FROM users');
    
    console.log('Users in database:');
    console.table(rows);
    
    connection.release();
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    process.exit(0);
  }
};

fetchUsers();
