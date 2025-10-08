import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';

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
      {/* Barra de Busca Principal */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por descrição, categoria..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center space-x-2 ${
            hasActiveFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn-secondary flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <div className="card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

          {/* Filtro por Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Inicial
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Final
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="input-field pl-10"
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