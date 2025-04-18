import { pool } from '../config/db.js';


export async function getUserById(id){
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}