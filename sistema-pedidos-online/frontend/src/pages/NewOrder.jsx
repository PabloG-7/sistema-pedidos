import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import FileUpload from '../components/FileUpload';
import { Plus, ArrowLeft } from 'lucide-react';

const NewOrder = () => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    estimated_budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState([]);

  const navigate = useNavigate();

  const categories = [
    'Desenvolvimento Web',
    'Design Gráfico',
    'Marketing Digital',
    'Consultoria',
    'Outros'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/orders', {
        ...formData,
        estimated_budget: parseFloat(formData.estimated_budget),
        attachments: attachments.map(file => ({
          filename: file.filename,
          originalName: file.originalName,
          path: file.path
        }))
      });
      
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao criar pedido');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Novo Pedido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Preencha os detalhes do seu pedido
          </p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="estimated_budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orçamento Estimado (R$) *
            </label>
            <input
              type="number"
              id="estimated_budget"
              name="estimated_budget"
              min="0"
              step="0.01"
              required
              value={formData.estimated_budget}
              onChange={handleChange}
              className="input"
              placeholder="0.00"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição do Pedido *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              value={formData.description}
              onChange={handleChange}
              className="input resize-none"
              placeholder="Descreva detalhadamente o que você precisa..."
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Mínimo de 10 caracteres</span>
              <span className={formData.description.length < 10 ? 'text-yellow-500' : 'text-green-500'}>
                {formData.description.length}/10
              </span>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Anexos (Opcional)
            </label>
            <FileUpload 
              onFilesChange={setAttachments}
              maxFiles={5}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner h-4 w-4"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Enviar Pedido</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;