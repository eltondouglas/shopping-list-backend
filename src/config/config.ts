import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });


const config = {
  DB_URL: process.env.DB_URL || 'postgres://user:password@localhost:5432/mydb',
  JWT_SECRET: process.env.JWT_SECRET || 'seu_segredo_jwt',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '3600',
  SERVER_PORT: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000,
  SERVER_HOST: process.env.SERVER_HOST || 'localhost',
};

export default config;