const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/uploadController');

// Rota de upload
router.post('/upload', upload.single('file'), uploadFile);

// Rota para servir arquivos
router.use('/uploads', express.static('uploads'));

module.exports = router;