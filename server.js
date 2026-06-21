require('dotenv').config();
const app = require('./src/app');
require('./config/db');

// require('dotenv').config();
// const express = require('express');

const PORT = process.env.PORT || 5000;
// connectDB();

app.listen(PORT,()=>{
    console.log(`Banking server currently running at ${PORT}`);
});

// app.get('/health',(req,res)=>{
//     res.status(200).json({status:'UP',message:'Banking server runnnig smoothly'})
// });