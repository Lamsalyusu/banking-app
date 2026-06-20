const express = require('express');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/account',accountRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Banking server running smoothly' });
});

module.exports = app;