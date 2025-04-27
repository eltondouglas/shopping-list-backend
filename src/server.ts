import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import socketHandler from './sockets';
import authRoutes from './routes/auth'
import groupRoutes from './routes/shopping_list'
import config from './config/config';
import { initializeDatabase } from './config/initialize';
import path from 'path';

const app = express();

const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Middleware de autenticação para WebSocket
socketHandler(io);

initializeDatabase();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', groupRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

server.listen(config.SERVER_PORT, config.SERVER_HOST, () => {
    console.log(`Server is running on http://${config.SERVER_HOST}:${config.SERVER_PORT}`);
});