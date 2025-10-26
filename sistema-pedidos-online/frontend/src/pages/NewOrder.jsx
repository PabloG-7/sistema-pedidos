// pages/NewOrder.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import FileUpload from '../components/FileUpload';
import { Sparkles, ArrowLeft } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-8">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-sm"></div>
          <h1 className="text-4xl font-bold gradient-text relative">
            Novo Pedido
          </h1>
          <p className="text-white/60 mt-3 text-lg">
            Preencha os detalhes do seu pedido abaixo
          </p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="btn-secondary flex items-center space-x-3 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Voltar</span>
        </button>
      </div>

      <div className="group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
        <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-6 py-4 rounded-2xl text-sm backdrop-blur-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-3">
                  Categoria *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="estimated_budget" className="block text-sm font-medium text-white/80 mb-3">
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
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-3">
                Descrição do Pedido *
              </label>
              <textarea
                id="description"
                name="description"
                rows={8}
                required
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Descreva detalhadamente o que você precisa..."
              />
              <p className="mt-3 text-sm text-white/40">
                Mínimo de 10 caracteres. Seja o mais detalhado possível para obter um orçamento preciso.
              </p>
            </div>

            {/* SEÇÃO DE UPLOAD PREMIUM */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">
                Anexos do Pedido (Opcional)
              </label>
              <FileUpload 
                onFilesChange={setAttachments}
                maxFiles={5}
              />
              <p className="mt-3 text-sm text-white/40">
                Adicione imagens, PDFs ou documentos para melhorar seu orçamento (Máx. 5MB por arquivo)
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="btn-secondary flex items-center space-x-3 group"
              >
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-3 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="spinner-premium h-5 w-5 border-2"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Pedido</span>
                    <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;