import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Check, AlertCircle, Loader, Eye, Download } from 'lucide-react';
import { api } from '../services/api';

const FileUpload = ({ onFilesChange, maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Validar tamanho (5MB)
    const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Alguns arquivos excedem 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });

        return {
          ...response.data.file,
          originalName: file.name,
          size: file.size,
          type: file.type,
          localUrl: URL.createObjectURL(file) // Para preview
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const newFiles = [...files, ...uploadedFiles];
      
      setFiles(newFiles);
      onFilesChange(newFiles);

    } catch (error) {
      console.error('Erro no upload:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Timeout - servidor demorou muito para responder');
      } else if (error.response?.status === 413) {
        setError('Arquivo muito grande');
      } else if (error.response?.status === 415) {
        setError('Tipo de arquivo não permitido');
      } else {
        setError('Erro ao fazer upload. Tente novamente.');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
    setError('');
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (type.includes('pdf')) return <File className="h-5 w-5 text-red-500" />;
    if (type.includes('word') || type.includes('document')) {
      return <File className="h-5 w-5 text-blue-600" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const event = { target: { files: e.dataTransfer.files } };
      handleFileSelect(event);
    }
  };

  const openPreview = (file) => {
    if (file.type.startsWith('image/') && file.localUrl) {
      setPreviewFile(file);
    } else {
      // Para outros tipos de arquivo, fazer download
      const link = document.createElement('a');
      link.href = file.localUrl || file.url;
      link.download = file.originalName;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer bg-gray-50/50 dark:bg-gray-800/50"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
          className="hidden"
        />
        
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
          Arraste arquivos ou clique para selecionar
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          PNG, JPG, PDF, DOC (Máx. 5MB por arquivo) • Máximo {maxFiles} arquivos
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
            Arquivos Anexados ({files.length}/{maxFiles})
          </h4>
          <div className="grid gap-3">
            {files.map((file, index) => (
              <div
                key={file.filename || index}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type || file.mimetype)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  
                  <button
                    onClick={() => openPreview(file)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title={file.type.startsWith('image/') ? 'Visualizar' : 'Download'}
                  >
                    {file.type.startsWith('image/') ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {uploading && (
        <div className="flex items-center justify-center py-6 space-x-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <Loader className="h-6 w-6 text-blue-500 animate-spin" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            Fazendo upload dos arquivos...
          </span>
        </div>
      )}

      {/* Modal de Preview */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {previewFile.originalName}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              <img 
                src={previewFile.localUrl || previewFile.url} 
                alt={previewFile.originalName}
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;