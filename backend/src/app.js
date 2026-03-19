const express = require('express');
const cors = require('cors');
const app = express();
const prisma = require('./config/prisma');
const routes = require('./routes/auth.routes');
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', routes);

// app.get('/', (req, res) => {
//     res.send('Hello check!');
// });

app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.get('/test-db', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection error' });
    }});

// Catch-all for 404s
app.use((req, res) => {
    console.log(`404 ALERT: The frontend tried to reach: ${req.method} ${req.url}`);
    res.status(404).json({ 
        message: `Route ${req.url} not found on this server.`,
        hint: "Check if you missed /api or doubled up on /auth"
    });
});
module.exports = app;