import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ CORREÇÃO: Importações com caminhos relativos CORRETOS
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORREÇÃO: CORS simplificado e funcional
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sistema-pedidos-production-bba4.up.railway.app',
    'https://sistema-pedidos-online.netlify.app',
    'https://sistema-pedidos-backend.onrender.com',
    'https://sistema-pedidos-online.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORREÇÃO: Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sistema de Pedidos Online API',
    timestamp: new Date().toISOString()
  });
});

// ✅ CORREÇÃO: Rotas API
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
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
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Host: 0.0.0.0`);
});