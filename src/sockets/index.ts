import { Server } from 'socket.io';
import { pool } from '../database';

const socketHandler = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Usuário conectado:', socket.id);

        // Entrar em um grupo
        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`Usuário entrou no grupo ${groupId}`);
        });

        // Atualizar item na lista
        socket.on('updateItem', async ({ groupId, itemId, updates }) => {
            await pool.query(
                'UPDATE shopping_lists SET name = $1, price = $2, category = $3, is_checked = $4 WHERE id = $5',
                [updates.name, updates.price, updates.category, updates.is_checked, itemId]
            );

            // Emitir atualização para o grupo
            io.to(groupId).emit('itemUpdated', { itemId, updates });
        });

        // Remover item da lista
        socket.on('removeItem', async ({ groupId, itemId }) => {
            await pool.query('DELETE FROM shopping_lists WHERE id = $1', [itemId]);

            // Emitir remoção para o grupo
            io.to(groupId).emit('itemRemoved', { itemId });
        });
    });
};

export default socketHandler;