import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import socketHandler from './sockets';
import authRoutes from './routes/auth'
import groupRoutes from './routes/groups'


const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', groupRoutes);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Configure conforme necessário
        methods: ['GET', 'POST'],
    },
});

// Middleware de autenticação para WebSocket
socketHandler(io);

app.get('/', (req, res) => {
    res.sendFile('E:\\shopping_list\\shopping-list-backend\\src\\index.html');
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});