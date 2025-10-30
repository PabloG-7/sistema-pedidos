import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import FileUpload from "../components/FileUpload";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Target,
  Calendar,
  Upload,
  CheckCircle,
} from "lucide-react";

const NewOrder = () => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    estimated_budget: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();
  const activeInputRef = useRef(null); // garante foco contínuo

  const categories = [
    "Desenvolvimento Web",
    "Design Gráfico",
    "Marketing Digital",
    "Consultoria TI",
    "Desenvolvimento Mobile",
    "Infraestrutura Cloud",
    "Análise de Dados",
    "Outros",
  ];

  // =======================
  // CORREÇÃO DE FOCO / BUG DO TECLADO
  // =======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (e) => {
    activeInputRef.current = e.target;
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (activeInputRef.current) {
        activeInputRef.current.focus();
        activeInputRef.current = null;
      }
    }, 0);
  };

  // =======================
  // ENVIO DO FORMULÁRIO
  // =======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.description.trim().length < 10) {
      setError("A descrição deve ter pelo menos 10 caracteres.");
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setError("Selecione uma categoria para continuar.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/orders", {
        ...formData,
        estimated_budget: parseFloat(formData.estimated_budget),
        attachments: attachments.map((file) => ({
          filename: file.filename,
          originalName: file.originalName,
          path: file.path,
        })),
      });

      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar pedido.");
    }

    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  // =======================
  // COMPONENTES DE ETAPAS
  // =======================
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              step === currentStep
                ? "bg-emerald-600 border-emerald-600 text-white scale-110 shadow-lg"
                : step < currentStep
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
            }`}
          >
            {step < currentStep ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div
              className={`w-20 h-1 transition-all ${
                step < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
          <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Informações Básicas
        </h3>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Categoria do Projeto *
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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

      <div>
        <label
          htmlFor="estimated_budget"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
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
            onInput={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="input pl-10"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
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
            onInput={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="input pl-10"
          />
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
          <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Descrição do Projeto
        </h3>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Descrição Detalhada *
        </label>
        <textarea
          id="description"
          name="description"
          rows={8}
          required
          value={formData.description}
          onChange={handleChange}
          onInput={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input resize-none"
          placeholder="Descreva detalhadamente o que você precisa..."
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quanto mais detalhes, melhor será o orçamento
          </p>
          <span
            className={`text-sm font-medium ${
              formData.description.length < 10
                ? "text-red-500"
                : formData.description.length < 50
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {formData.description.length}/50 caracteres mínimos
          </span>
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Anexos e Documentos
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Adicione arquivos, imagens ou documentos que possam ajudar na elaboração
        do orçamento.
      </p>

      <FileUpload onFilesChange={setAttachments} maxFiles={5} />

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
        <p>• Formatos aceitos: PDF, JPG, PNG, DOC, XLS</p>
        <p>• Tamanho máximo: 5MB por arquivo</p>
        <p>• Máximo de 5 arquivos</p>
      </div>
    </div>
  );

  // =======================
  // RENDER FINAL
  // =======================
  return (
    <div className="max-w-4xl mx-auto fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/orders")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Novo Pedido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Preencha as informações do seu projeto
          </p>
        </div>
      </div>

      <div className="card shadow-lg hover:shadow-xl transition-all duration-300">
        <StepIndicator />

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}

          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex items-center gap-2"
              >
                <span>Continuar</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="spinner h-5 w-5"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Finalizar Pedido</span>
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
