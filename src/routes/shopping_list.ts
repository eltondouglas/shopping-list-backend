import express, {Request, Response, NextFunction} from 'express';
import { pool } from '../database';
import jwt from 'jsonwebtoken';
import { io } from '../server';

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload;
            userId?: string;
        }
    }
}


const router = express.Router();

// Middleware de autenticação
const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Token ausente' });
        return;
    }

    try {
        const user = jwt.verify(token, 'your_jwt_secret_key');
        req.user = user as string | jwt.JwtPayload;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
};

router.post('/shopping-list', authenticate, async (req, res) => {
    const { name } = req.body;
    const userId = req.userId;

    try {
        const result = await pool.query(
            'INSERT INTO shopping_list (name, modified_by_user_id) VALUES ($1, $2) RETURNING id',
            [name, userId]
        );
        res.status(201).json({ listId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar lista de compras' });
    }
});

// Adicionar usuário à lista
router.post('/shopping-list/:listId/users', authenticate, async (req, res): Promise<void> => {
    const { listId } = req.params;
    const { username } = req.body;

    try {
        const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (userResult.rowCount === 0) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        const userId = userResult.rows[0].id;
        await pool.query(
            'INSERT INTO shopping_list_users (shopping_list_id, user_id) VALUES ($1, $2)',
            [listId, userId]
        );
        res.status(200).json({ message: 'Usuário adicionado à lista' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar usuário à lista' });
    }
});

// Adicionar item à lista
router.post('/shopping-list/:listId/items', authenticate, async (req, res) => {
    const { listId } = req.params;
    const { name, price, category } = req.body;
    const userId = req.userId;

    try {
        const result = await pool.query(
            'INSERT INTO itens (shopping_list_id, name, price, category, modified_by_user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [listId, name, price, category, userId]
        );
        const itemId = result.rows[0].id;

        // Emitir evento via WebSocket
        io.to(`shopping_list_${listId}`).emit('item_added', { itemId, listId });

        res.status(201).json({ itemId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar item à lista' });
    }
});

export default router;