import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import FileUpload from "../components/FileUpload";
import { ArrowLeft, CheckCircle, Calendar, DollarSign, Folder } from "lucide-react";

const NewOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    estimated_budget: "",
    deadline: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef({});

  // ✅ Corrige bug do teclado (input não perde foco)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 5) return; // Limite de 5 letras
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e) => (inputRefs.current[e.target.name] = e.target);
  const handleBlur = (e) => {
    setTimeout(() => {
      if (document.activeElement === document.body)
        inputRefs.current[e.target.name]?.focus();
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      files.forEach((file) => form.append("files", file));
      await api.post("/orders", form, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar pedido!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-amber-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black p-4 sm:p-8 transition-all duration-500">
      {/* Header */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Voltar</span>
        </button>
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
          Novo Pedido
        </h1>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 border border-emerald-200/50 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-amber-300 mb-2 flex items-center gap-2">
              <Folder className="h-4 w-4" /> Categoria
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              value={formData.category}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Ex: Desenvolvimento Web"
              className="input w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-400 outline-none transition-all"
            />
          </div>

          {/* Orçamento */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-amber-300 mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Orçamento Estimado
            </label>
            <input
              id="estimated_budget"
              name="estimated_budget"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.estimated_budget}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="R$ 0,00"
              className="input w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-400 outline-none transition-all"
            />
          </div>

          {/* Prazo */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-amber-300 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Prazo Desejado
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="input w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-400 outline-none transition-all"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-amber-300 mb-2">
              Descrição (máx. 5 letras)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              onInput={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Digite até 5 letras..."
              className="input w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 resize-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-400 outline-none transition-all"
            />
            <p className="text-right text-xs text-gray-500 mt-1">
              {formData.description.length}/5
            </p>
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-amber-300 mb-2">
              Anexos (opcional)
            </label>
            <FileUpload files={files} setFiles={setFiles} />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-amber-500 hover:scale-[1.02] hover:shadow-lg text-white"
            }`}
          >
            {loading ? (
              <>
                <div className="spinner h-5 w-5 border-t-2 border-white rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Finalizar Pedido
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;
