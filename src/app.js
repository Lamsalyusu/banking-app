const express = require('express');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'../client')));
app.use('/api/auth',authRoutes);
app.use('/api/account',accountRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Banking server running smoothly' });
});

module.exports = app;