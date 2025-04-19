import express, {Request, Response, NextFunction} from 'express';

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload;
        }
    }
}

import { pool } from '../database';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware de autenticação
const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Token ausente' });
        return;
    }

    try {
        const user = jwt.verify(token, 'seu_segredo_jwt');
        req.user = user as string | jwt.JwtPayload;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// Criar grupo
router.post('/groups', authenticate, async (req, res) => {
    const { name } = req.body;

    const result = await pool.query(
        'INSERT INTO groups (name) VALUES ($1) RETURNING id',
        [name]
    );
    const groupId = result.rows[0].id;

    // Adicionar o criador ao grupo
    await pool.query(
        'INSERT INTO group_users (group_id, user_id) VALUES ($1, $2)',
        [groupId, req.user && typeof req.user === 'object' && 'id' in req.user ? req.user.id : null]
    );

    res.json({ groupId });
});

// Adicionar usuário ao grupo
router.post('/groups/:groupId/users', authenticate, async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    await pool.query(
        'INSERT INTO group_users (group_id, user_id) VALUES ($1, $2)',
        [groupId, userId]
    );

    res.json({ message: 'Usuário adicionado ao grupo' });
});

// Adicionar item à lista de compras
router.post('/groups/:groupId/items', authenticate, async (req, res) => {
    const { groupId } = req.params;
    const { name, price, category } = req.body;

    const result = await pool.query(
        'INSERT INTO shopping_lists (group_id, name, price, category) VALUES ($1, $2, $3, $4) RETURNING id',
        [groupId, name, price, category]
    );

    res.json({ itemId: result.rows[0].id });
});

// Obter itens da lista de compras
router.get('/groups/:groupId/items', authenticate, async (req, res) => {
    const { groupId } = req.params;

    const result = await pool.query(
        'SELECT * FROM shopping_lists WHERE group_id = $1',
        [groupId]
    );

    res.json(result.rows);
});

export default router;