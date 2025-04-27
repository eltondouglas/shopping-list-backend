import { Pool } from 'pg';
import config from '../config/config';

export const pool = new Pool({
  connectionString: config.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function saveMessageToDatabase({ userId, groupId, message }: { userId: string; groupId: string; message: string }) {
  // const query = 'INSERT INTO messages (user_id, group_id, message) VALUES ($1, $2, $3)';
  // const values = [userId, groupId, message];
  // await pool.query(query, values);
}