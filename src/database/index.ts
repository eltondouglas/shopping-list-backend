import { Pool } from 'pg'; 

export const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'shopping_list',
  password: 'sua_senha',
  port: 5432,
});

export async function saveMessageToDatabase({ userId, groupId, message }: { userId: string; groupId: string; message: string }) {
  // const query = 'INSERT INTO messages (user_id, group_id, message) VALUES ($1, $2, $3)';
  // const values = [userId, groupId, message];
  // await pool.query(query, values);
}