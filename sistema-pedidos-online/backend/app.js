const express = require('express');
// ... outras importações

// 👇 ADICIONA ESTA LINHA:
const uploadRoutes = require('./src/routes/upload');

const app = express();

// ... middlewares e outras configurações

// 👇 ADICIONA ESTA LINHA (depois das outras rotas):
app.use('/api', uploadRoutes);

// ... resto do código