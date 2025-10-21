const uploadRoutes = require('./routes/upload');

// ... outras configurações

// 👇 ESTA LINHA É ESSENCIAL:
app.use('/api', uploadRoutes);

// Rota de teste para upload
app.post('/api/upload', (req, res) => {
  console.log('📤 Upload recebido!');
  res.json({ 
    success: true, 
    message: 'Upload funcionando!',
    file: { filename: 'teste.jpg' }
  });
});