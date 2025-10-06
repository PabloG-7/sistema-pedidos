import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL no Neon.tech');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com o PostgreSQL:', err);
});

export default pool;