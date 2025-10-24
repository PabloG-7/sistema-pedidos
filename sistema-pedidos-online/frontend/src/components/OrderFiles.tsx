// components/OrderFiles.tsx
import React from 'react';
import { File, FileText, FileImage, Download, Eye } from 'lucide-react';
import { api } from '../services/api';

// Definir tipos TypeScript
interface FileData {
  id?: string;
  filename: string;
  originalName?: string;
  size?: number;
  type?: string;
  mimetype?: string;
  uploadedAt?: string;
}

interface OrderFilesProps {
  files?: FileData[];
  compact?: boolean;
}

const OrderFiles: React.FC<OrderFilesProps> = ({ files = [], compact = false }) => {
  if (!files || files.length === 0) {
    return null;
  }

  const getFileIcon = (type?: string) => {
    if (type?.startsWith('image/')) {
      return <FileImage className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
    }
    if (type?.includes('pdf')) {
      return <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
    }
    return <File className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const downloadFile = async (file: FileData) => {
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
    }
  };

  const previewFile = async (file: FileData) => {
    if (file.type?.startsWith('image/')) {
      try {
        const response = await api.get(`/download/${file.filename}`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        window.open(url, '_blank');
      } catch (error) {
        console.error('Erro ao visualizar arquivo:', error);
      }
    } else {
      downloadFile(file);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2 mt-2">
        <File className="h-3 w-3 text-indigo-500" />
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          {files.length} arquivo(s) anexado(s)
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center space-x-2">
        <File className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Arquivos Anexados ({files.length})
        </span>
      </div>
      
      <div className="grid gap-2">
        {files.map((file, index) => (
          <div
            key={file.filename || file.id || `file-${index}`}
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
            </div>
            
            <div className="flex items-center space-x-2 ml-3">
              {file.type?.startsWith('image/') && (
                <button
                  onClick={() => previewFile(file)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors duration-200 rounded"
                  title="Visualizar"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              )}
              <button
                onClick={() => downloadFile(file)}
                className="p-1.5 text-gray-400 hover:text-green-500 transition-colors duration-200 rounded"
                title="Download"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderFiles;