const express = require('express');
const router = express.Router();
const { upload, uploadFile, getFiles } = require('../controllers/uploadController');
const auth = require('../middleware/auth'); // Se tiver autenticação
const path = require('path');
const fs = require('fs');

// Rota de upload (protegida por auth se quiser)
router.post('/upload', upload.single('file'), uploadFile);

// Rota para listar arquivos (opcional)
router.get('/uploads', getFiles);

// Rota para servir arquivos estáticos
router.use('/uploads', express.static('uploads'));

// Rota para download de arquivo específico
router.get('/uploads/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Erro ao servir arquivo:', error);
    res.status(500).json({ error: 'Erro ao baixar arquivo' });
  }
});

module.exports = router;