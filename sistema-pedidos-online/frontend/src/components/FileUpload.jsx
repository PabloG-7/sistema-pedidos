import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Check } from 'lucide-react';
import { api } from '../services/api';

const FileUpload = ({ onFilesChange, maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return {
          ...response.data.file,
          file: file,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const newFiles = [...files, ...uploadedFiles];
      
      setFiles(newFiles);
      onFilesChange(newFiles);

    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload dos arquivos');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          className="hidden"
        />
        
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400">
          Clique para selecionar ou arraste arquivos aqui
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          PNG, JPG, PDF, DOC (Máx. 5MB por arquivo)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Arquivos anexados ({files.length}/{maxFiles})
          </h4>
          {files.map((file, index) => (
            <div
              key={file.id || index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.mimetype)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Fazendo upload...
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;