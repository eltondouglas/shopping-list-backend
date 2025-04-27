import { pool } from '../database';
import fs from 'fs';
import path from 'path';

export async function initializeDatabase() {
    const sqlFilePath = path.join(__dirname, '../../tables.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    try {
        await pool.query(sql);
        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

export async function dropDatabase() {
    const sqlFilePath = path.join(__dirname, '../../drop_tables.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    try {
        await pool.query(sql);
        console.log('Database dropped successfully!');
    }
    catch (error) {
        console.error('Error dropping database:', error);
    }

}