import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import FileUpload from "../components/FileUpload";
import { ArrowLeft, CheckCircle } from "lucide-react";

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

  // Corrige bug do teclado: input não perde foco
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limite de 5 letras na descrição
    if (name === "description" && value.length > 5) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (e) => {
    inputRefs.current[e.target.name] = e.target;
  };

  const handleBlur = (e) => {
    // Restaura foco se o teclado fechar por bug do re-render
    setTimeout(() => {
      if (document.activeElement === document.body) {
        inputRefs.current[e.target.name]?.focus();
      }
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("estimated_budget", formData.estimated_budget);
      form.append("deadline", formData.deadline);

      files.forEach((file) => form.append("files", file));

      await api.post("/orders", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/orders");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Novo Pedido
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
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
            className="input resize-none"
          />
          <p className="text-right text-xs text-gray-500 mt-1">
            {formData.description.length}/5
          </p>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Categoria
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
            placeholder="Ex: Design, Programação..."
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="estimated_budget"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Orçamento Estimado
          </label>
          <input
            id="estimated_budget"
            name="estimated_budget"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.estimated_budget}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="R$"
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Prazo
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            required
            value={formData.deadline}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Anexos (opcional)
          </label>
          <FileUpload files={files} setFiles={setFiles} />
        </div>

        <button
          type="submit"
          className={`btn-primary w-full flex items-center justify-center gap-3 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          <CheckCircle className="h-5 w-5" />
          {loading ? "Enviando..." : "Enviar Pedido"}
        </button>
      </form>
    </div>
  );
};

export default NewOrder;
