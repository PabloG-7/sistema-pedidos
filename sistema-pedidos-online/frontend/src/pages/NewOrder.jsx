import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import FileUpload from '../components/FileUpload';
import { 
  Plus, ArrowLeft, FileText, DollarSign, 
  Target, Calendar, Upload, CheckCircle,
  Sparkles, Zap, Rocket
} from 'lucide-react';

const NewOrder = () => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    estimated_budget: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  const categories = [
    'Desenvolvimento Web',
    'Design Gráfico',
    'Marketing Digital',
    'Consultoria TI',
    'Desenvolvimento Mobile',
    'Infraestrutura Cloud',
    'Análise de Dados',
    'Outros'
  ];

  // CORREÇÃO: Função correta para handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.description.length < 10) {
      setError('A descrição deve ter pelo menos 10 caracteres');
      setLoading(false);
      return;
    }

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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 transform ${
            step === currentStep 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white scale-110 shadow-lg' 
              : step < currentStep 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent text-white scale-100 shadow-md'
              : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400 scale-100'
          }`}>
            {step < currentStep ? <CheckCircle className="h-6 w-6" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-24 h-1 transition-all duration-500 ${
              step < currentStep 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Informações Básicas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Comece com as informações principais do seu projeto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Categoria do Projeto *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="input hover:scale-105 transition-transform duration-300"
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
          <label htmlFor="estimated_budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Orçamento Estimado (R$) *
          </label>
          <div className="relative group">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            <input
              type="number"
              id="estimated_budget"
              name="estimated_budget"
              min="0"
              step="0.01"
              required
              value={formData.estimated_budget}
              onChange={handleChange}
              className="input pl-12 hover:scale-105 transition-transform duration-300"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Prazo Desejado
          </label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input pl-12 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Descrição do Projeto
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Descreva detalhadamente o que você precisa
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Descrição Detalhada *
        </label>
        <div className="relative group">
          <textarea
            id="description"
            name="description"
            rows={8}
            required
            value={formData.description}
            onChange={handleChange}
            className="input resize-none hover:scale-105 transition-transform duration-300"
            placeholder="Descreva detalhadamente o que você precisa...
• Objetivos do projeto
• Funcionalidades necessárias  
• Requisitos técnicos
• Expectativas e prazos"
          />
          <div className="absolute bottom-3 right-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              formData.description.length < 10 
                ? 'bg-red-100 text-red-600' 
                : formData.description.length < 50 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-green-100 text-green-600'
            }`}>
              {formData.description.length}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quanto mais detalhes, melhor será o orçamento
          </p>
          <span className={`text-sm font-medium ${
            formData.description.length < 10 ? 'text-red-500' : 
            formData.description.length < 50 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {formData.description.length}/50 caracteres mínimos
          </span>
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
          <Upload className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Anexos e Documentos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione arquivos para melhorar seu orçamento
          </p>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-0">
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
          Adicione arquivos, imagens ou documentos que possam ajudar na elaboração do orçamento.
        </p>
        <FileUpload 
          onFilesChange={setAttachments}
          maxFiles={5}
        />
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-500 grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <FileText className="h-4 w-4" />
            <span>PDF, JPG, PNG, DOC</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Zap className="h-4 w-4" />
            <span>Máx. 5MB por arquivo</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Até 5 arquivos</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-300" />
        </button>
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            Novo Pedido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Crie um novo projeto incrível
          </p>
        </div>
        <div className="ml-auto">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <Rocket className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <StepIndicator />

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-6 py-4 rounded-xl text-lg mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}

          {/* Navigation */}
          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary flex items-center gap-3 disabled:opacity-50 hover:scale-105 transition-transform duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
              >
                <span>Continuar</span>
                <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
              >
                {loading ? (
                  <>
                    <div className="spinner h-5 w-5"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Finalizar Pedido</span>
                    <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;