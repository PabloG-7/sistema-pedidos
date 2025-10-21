// 👇 IMPORTE ISSO (no topo com outros imports)
const uploadRoutes = require('./routes/upload');

// 👇 E ISSO (depois de outros app.use)
app.use('/api', uploadRoutes);