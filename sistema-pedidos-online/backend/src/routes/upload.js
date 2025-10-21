const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// Rota de upload (protegida)
router.post('/upload', auth, upload.single('file'), uploadFile);

// Rota para servir arquivos estáticos
router.use('/uploads', express.static('uploads'));

module.exports = router;