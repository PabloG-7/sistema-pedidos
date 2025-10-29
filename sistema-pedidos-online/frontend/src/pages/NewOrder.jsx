import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import FileUpload from '../components/FileUpload';
import { Plus, Target, DollarSign, FileText, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Novo Pedido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Preencha os detalhes do seu pedido abaixo
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
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field pl-10 w-full"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="estimated_budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orçamento Estimado (R$) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="estimated_budget"
                name="estimated_budget"
                min="0"
                step="0.01"
                required
                value={formData.estimated_budget}
                onChange={handleChange}
                className="input-field pl-10 w-full"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição do Pedido *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                value={formData.description}
                onChange={handleChange}
                className="input-field pl-10 w-full resize-none"
                placeholder="Descreva detalhadamente o que você precisa..."
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Mínimo de 10 caracteres</span>
              <span className={formData.description.length < 10 ? 'text-amber-500' : 'text-green-500'}>
                {formData.description.length}/10
              </span>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Anexos do Pedido (Opcional)
            </label>
            <FileUpload 
              onFilesChange={setAttachments}
              maxFiles={5}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
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
                  <Plus className="h-5 w-5" />
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