const uploadRoutes = require('./routes/upload');

// ... outras configurações

// 👇 ESTA LINHA É ESSENCIAL:
app.use('/api', uploadRoutes);