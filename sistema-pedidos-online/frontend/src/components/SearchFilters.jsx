import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, Sliders } from 'lucide-react';

const SearchFilters = ({ onFiltersChange, orders = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    startDate: '',
    endDate: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Extrair categorias únicas dos pedidos
  const categories = [...new Set(orders.map(order => order.category))];
  
  const statusOptions = [
    'Em análise',
    'Aprovado', 
    'Rejeitado',
    'Em andamento',
    'Concluído'
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      minBudget: '',
      maxBudget: '',
      startDate: '',
      endDate: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-4">
      {/* Barra de Busca Premium */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por descrição, categoria..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field pl-12 text-lg py-4 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center space-x-3 px-6 py-4 rounded-xl ${
            hasActiveFilters ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' : ''
          }`}
        >
          <Sliders className="h-5 w-5" />
          <span className="font-semibold">Filtros</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn-secondary flex items-center space-x-3 px-6 py-4 rounded-xl"
          >
            <X className="h-5 w-5" />
            <span className="font-semibold">Limpar</span>
          </button>
        )}
      </div>

      {/* Filtros Avançados Premium */}
      {showFilters && (
        <div className="card p-6 space-y-6 bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filtros Avançados</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Filtro por Status */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field bg-white/80 backdrop-blur-sm"
              >
                <option value="">Todos os status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Categoria */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field bg-white/80 backdrop-blur-sm"
              >
                <option value="">Todas categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Orçamento Mínimo */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Orçamento Mínimo
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  value={filters.minBudget}
                  onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                  className="input-field pl-12 bg-white/80 backdrop-blur-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Filtro por Orçamento Máximo */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Orçamento Máximo
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  value={filters.maxBudget}
                  onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                  className="input-field pl-12 bg-white/80 backdrop-blur-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Filtro por Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Data Inicial
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="input-field pl-12 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Data Final
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="input-field pl-12 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;