import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import FileUpload from '../components/FileUpload';
import { 
  Plus, ArrowLeft, FileText, DollarSign, 
  Target, Calendar, Upload, CheckCircle,
  ChevronRight, Package, Clock
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'description'
        ? value.slice(0, 5) // 🔒 máximo de 5 letras
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 🔒 Exige pelo menos 5 letras
    if (formData.description.length < 5) {
      setError('A descrição deve ter no mínimo 5 caracteres.');
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

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
      {[
        { number: 1, label: 'Informações', icon: Target },
        { number: 2, label: 'Descrição', icon: FileText },
        { number: 3, label: 'Anexos', icon: Upload }
      ].map((step, index) => {
        const IconComponent = step.icon;
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        
        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                    : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <IconComponent className="h-5 w-5" />
                )}
              </div>
              <span className={`text-xs font-medium mt-2 transition-colors duration-300 ${
                isCurrent || isCompleted
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < 2 && (
              <div
                className={`flex-1 h-1 mx-4 transition-all duration-500 ${
                  step.number < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informações Básicas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Informações principais do seu projeto
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria do Projeto *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2.5 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prazo Desejado
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2.5 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
          <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Descrição do Projeto
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detalhes importantes sobre o que precisa
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descrição Detalhada (máx. 5 caracteres) *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          maxLength={5}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          placeholder="Descreva brevemente seu projeto..."
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Informe os detalhes principais do seu pedido
          </span>
          <span
            className={`text-sm font-medium ${
              formData.description.length < 5
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            {formData.description.length}/5
          </span>
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <Upload className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Anexos e Documentos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Arquivos que ajudam no entendimento do projeto
          </p>
        </div>
      </div>

      <div>
        <FileUpload 
          onFilesChange={setAttachments}
          maxFiles={5}
        />
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Informações sobre anexos:
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Formatos aceitos: PDF, JPG, PNG, DOC, XLS
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Tamanho máximo por arquivo: 5MB
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Máximo de 5 arquivos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const StepPreview = () => (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-blue-600" />
        Resumo do Pedido
      </h4>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Categoria:</span>
          <span className="font-medium text-gray-900 dark:text-white">{formData.category || 'Não informado'}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Orçamento:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formData.estimated_budget ? `R$ ${parseFloat(formData.estimated_budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informado'}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Prazo:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formData.deadline ? new Date(formData.deadline).toLocaleDateString('pt-BR') : 'Não definido'}
          </span>
        </div>
        
        <div className="flex justify-between items-start py-2">
          <span className="text-gray-600 dark:text-gray-400">Descrição:</span>
          <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs">
            {formData.description || 'Não informada'}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 dark:text-gray-400">Anexos:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {attachments.length} arquivo(s)
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Novo Pedido
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Preencha as informações do seu projeto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <StepIndicator />

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
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
                  className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  <span>Voltar</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex items-center gap-2 group"
                  >
                    <span>Continuar</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <div className="spinner h-5 w-5 border-2"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        <span>Finalizar Pedido</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Preview */}
        <div className="lg:col-span-1">
          <StepPreview />
          
          {/* Help Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mt-6">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Dicas Importantes
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-2">
              <li>• Preencha todas as informações com cuidado</li>
              <li>• A descrição deve ser clara e objetiva</li>
              <li>• Anexe documentos relevantes</li>
              <li>• Revise antes de finalizar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;