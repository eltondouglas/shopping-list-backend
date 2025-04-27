import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../database';
import config from '../config/config';

const router = express.Router();
const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRATION = config.JWT_EXPIRATION;

// Registro de usuário
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        res.json({ userId: result.rows[0].id });
    } catch (err) {
        res.status(400).json({ error: 'Usuário já existe' });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
        jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: Number.parseInt(JWT_EXPIRATION), algorithm: "HS256" }, (err, token) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao gerar token' });
            }
            res.json({ token });
        });

        
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});


router.get('/testdb', async (req, res) => {
    try {
        console.log('Conectando ao banco de dados...');
        const result = await pool.query("SELECT * FROM users");
        res.json({ tables: result.rows });
    } catch (error) {
        console.error('Erro ao acessar o banco de dados:', error);
        res.status(500).json({ error: 'Erro ao acessar o banco de dados' });
    }
}
);

export default router;