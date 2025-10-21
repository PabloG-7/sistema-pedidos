const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar onde salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    
    // Criar pasta se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + random + extensão
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use: JPG, PNG, PDF, DOC, DOCX, TXT'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Controller principal
const uploadFile = async (req, res) => {
  try {
    console.log('📤 Recebendo upload...', req.file);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum arquivo enviado' 
      });
    }

    // Informações do arquivo
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/api/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    };

    console.log('✅ Upload realizado:', fileInfo.originalName);

    res.json({
      success: true,
      message: 'Upload realizado com sucesso',
      file: fileInfo
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno no servidor: ' + error.message 
    });
  }
};

// Listar arquivos (opcional)
const getFiles = async (req, res) => {
  try {
    const uploadDir = 'uploads/';
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(uploadDir).map(filename => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        uploadedAt: stats.birthtime
      };
    });

    res.json({ files });
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
};

module.exports = {
  upload,
  uploadFile,
  getFiles
};