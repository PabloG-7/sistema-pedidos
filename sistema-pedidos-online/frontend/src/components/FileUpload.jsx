import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Check, AlertCircle, Loader, Download } from 'lucide-react';
import { api } from '../services/api';

const FileUpload = ({ onFilesChange, maxFiles = 5, existingFiles = [] }) => {
  const [files, setFiles] = useState(existingFiles || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

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
        });

        return {
          ...response.data.file,
          originalName: file.name,
          size: file.size,
          type: file.type,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const newFiles = [...files, ...uploadedFiles];
      
      setFiles(newFiles);
      onFilesChange(newFiles);

    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Erro ao fazer upload. Tente novamente.');
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
    if (type?.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (type?.includes('pdf')) return <File className="h-4 w-4 text-red-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
          className="hidden"
        />
        
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400">
          Clique para selecionar arquivos
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          PNG, JPG, PDF, DOC (Máx. 5MB)
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Arquivos ({files.length}/{maxFiles})
          </h4>
          {files.map((file, index) => (
            <div
              key={file.filename || file.id || index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.type || file.mimetype)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.originalName || file.filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => downloadFile(file)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  type="button"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  type="button"
                  title="Remover"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center py-4 space-x-2">
          <Loader className="h-4 w-4 text-blue-500 animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Enviando...
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;