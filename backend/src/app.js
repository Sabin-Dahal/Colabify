const express = require('express');
const cors = require('cors');
const app = express();
const prisma = require('./config/prisma');
const routes = require('./routes/auth.routes');
app.use(cors());
app.use(express.json);

app.use('/api/auth', routes);

app.get('/', (req, res) => {
    res.send('Hello check!');
});

app.get('/test-db', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection error' });
    }});
module.exports = app;