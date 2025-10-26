// components/SearchFilters.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, Sparkles } from 'lucide-react';

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
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por descrição, categoria..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-3 group ${
              hasActiveFilters ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : ''
            }`}
          >
            <Filter className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary flex items-center space-x-3 group"
            >
              <X className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Filtros Avançados Premium */}
      {showFilters && (
        <div className="group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <Sparkles className="h-5 w-5 text-indigo-400 mr-3" />
                Filtros Avançados
              </h4>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-white/40 hover:text-white transition-colors duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input-field"
                >
                  <option value="">Todos os status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Categoria */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">Todas categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Orçamento Mínimo */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Orçamento Mínimo
                </label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={filters.minBudget}
                  onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Filtro por Orçamento Máximo */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Orçamento Máximo
                </label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={filters.maxBudget}
                  onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Filtro por Data Premium */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Data Inicial
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Data Final
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;