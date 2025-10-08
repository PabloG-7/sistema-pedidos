import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DEFINIÇÃO DA VARIÁVEL allowedOrigins - ESTAVA FALTANDO!
const allowedOrigins = [
  'http://localhost:3000',
  'https://sistema-pedidos-production-bba4.up.railway.app',
  'https://sistema-pedidos-online.netlify.app',
  'https://*.netlify.app'
];

// Configuração CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sistema de Pedidos Online API',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sistema de Pedidos Online API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota para teste do CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS está funcionando!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ 
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Adicionar após outras importações de rotas
const uploadRoutes = require('./routes/uploadRoutes');

// Adicionar após outros app.use de rotas
app.use('/api/upload', uploadRoutes);

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ↓↓↓ ADICIONAR ESTES IMPORTS NO TOPO DO ARQUIVO ↓↓↓
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');

// ↓↓↓ ADICIONAR ESTAS LINHAS APÓS OUTROS app.use() ↓↓↓
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS configurado para: ${allowedOrigins.join(', ')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});