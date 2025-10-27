import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import FileUpload from '../components/FileUpload';
import { Plus, Upload, Target, DollarSign, FileText, Sparkles } from 'lucide-react';

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
      {/* Header Premium */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Novo Pedido</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Preencha os detalhes do seu pedido abaixo
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 group hover-3d">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-6 py-4 rounded-2xl text-lg font-medium backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Categoria */}
          <div className="space-y-3">
            <label htmlFor="category" className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
              <Target className="h-6 w-6 text-indigo-500 mr-3" />
              Categoria *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="input-field text-lg py-4 bg-white/80 backdrop-blur-sm"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Orçamento */}
          <div className="space-y-3">
            <label htmlFor="estimated_budget" className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
              <DollarSign className="h-6 w-6 text-green-500 mr-3" />
              Orçamento Estimado (R$) *
            </label>
            <div className="relative">
              <input
                type="number"
                id="estimated_budget"
                name="estimated_budget"
                min="0"
                step="0.01"
                required
                value={formData.estimated_budget}
                onChange={handleChange}
                className="input-field text-lg py-4 pl-12 bg-white/80 backdrop-blur-sm"
                placeholder="0.00"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">R$</span>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-3">
            <label htmlFor="description" className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
              <FileText className="h-6 w-6 text-blue-500 mr-3" />
              Descrição do Pedido *
            </label>
            <textarea
              id="description"
              name="description"
              rows={8}
              required
              value={formData.description}
              onChange={handleChange}
              className="input-field text-lg py-4 bg-white/80 backdrop-blur-sm resize-none"
              placeholder="Descreva detalhadamente o que você precisa... Seja específico sobre requisitos, prazos e expectativas para obter um orçamento mais preciso."
            />
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Mínimo de 10 caracteres. Quanto mais detalhes, melhor o orçamento.
              </p>
              <span className={`font-semibold ${
                formData.description.length < 10 ? 'text-amber-500' : 'text-green-500'
              }`}>
                {formData.description.length}/10
              </span>
            </div>
          </div>

          {/* Upload de Arquivos */}
          <div className="space-y-4">
            <label className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
              <Upload className="h-6 w-6 text-purple-500 mr-3" />
              Anexos do Pedido (Opcional)
            </label>
            <div className="card bg-white/60 dark:bg-slate-700/60 border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-2xl">
              <FileUpload 
                onFilesChange={setAttachments}
                maxFiles={5}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Adicione imagens, PDFs ou documentos para melhorar seu orçamento (Máx. 5MB por arquivo)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="btn-secondary flex items-center space-x-3 px-8 py-4 rounded-2xl"
            >
              <span className="font-bold">Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-3 px-8 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="spinner-premium h-6 w-6 border-2"></div>
                  <span className="font-bold">Enviando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6" />
                  <span className="font-bold">Enviar Pedido</span>
                  <Plus className="h-5 w-5" />
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