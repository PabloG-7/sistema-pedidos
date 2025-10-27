import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Check, AlertCircle, Loader, Download, Cloud, Zap } from 'lucide-react';
import { api } from '../services/api';

const FileUpload = ({ onFilesChange, maxFiles = 5, existingFiles = [] }) => {
  const [files, setFiles] = useState(existingFiles || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFiles) => {
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
          uploadedAt: new Date().toISOString()
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
    setError('');
  };

  const downloadFile = async (file) => {
    try {
      const response = await api.get(`/download/${file.filename}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName || file.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      setError('Erro ao baixar arquivo');
    }
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <Image className="h-6 w-6 text-blue-500" />;
    if (type?.includes('pdf')) return <File className="h-6 w-6 text-red-500" />;
    if (type?.includes('word') || type?.includes('document')) {
      return <File className="h-6 w-6 text-blue-600" />;
    }
    if (type?.includes('sheet') || type?.includes('excel')) {
      return <File className="h-6 w-6 text-green-500" />;
    }
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer backdrop-blur-sm ${
          dragOver 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105' 
            : 'border-gray-300/50 dark:border-gray-600/50 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileSelect(Array.from(e.target.files))}
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.xls,.xlsx"
          className="hidden"
        />
        
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <Cloud className="h-8 w-8 text-white" />
        </div>
        
        <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">
          {dragOver ? 'Solte os arquivos aqui!' : 'Clique ou arraste arquivos aqui'}
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          PNG, JPG, PDF, DOC, XLS (Máx. 5MB por arquivo) • Máximo {maxFiles} arquivos
        </p>
        <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-gray-400">
          <Zap className="h-4 w-4" />
          <span>Upload rápido e seguro</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-4 text-red-600 dark:text-red-400 text-lg bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-800 backdrop-blur-sm">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white text-xl flex items-center space-x-3">
            <Check className="h-6 w-6 text-green-500" />
            <span>Arquivos Anexados ({files.length}/{maxFiles})</span>
          </h4>
          <div className="grid gap-4">
            {files.map((file, index) => (
              <div
                key={file.filename || file.id || index}
                className="flex items-center justify-between p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-500 backdrop-blur-sm group hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-6 flex-1 min-w-0">
                  <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-500">
                    {getFileIcon(file.type || file.mimetype)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {file.originalName || file.filename}
                      </p>
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 animate-bounce" />
                    </div>
                    <div className="flex items-center space-x-6">
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                      {file.uploadedAt && (
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {formatDate(file.uploadedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-6">
                  <button
                    onClick={() => downloadFile(file)}
                    className="p-3 text-gray-400 hover:text-blue-500 transition-all duration-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group/download"
                    type="button"
                    title="Download"
                  >
                    <Download className="h-5 w-5 group-hover/download:scale-110" />
                  </button>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-3 text-gray-400 hover:text-red-500 transition-all duration-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 group/remove"
                    type="button"
                    title="Remover"
                  >
                    <X className="h-5 w-5 group-hover/remove:scale-110" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center py-8 space-x-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Fazendo upload dos arquivos...
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;