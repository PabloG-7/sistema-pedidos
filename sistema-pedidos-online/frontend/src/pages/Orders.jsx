import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Package, Plus, Search, Filter, Download, 
  Calendar, DollarSign, Eye, FileText,
  CheckCircle, Clock, XCircle, PlayCircle, ChevronRight
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);

  const statusOptions = ['Todos', 'Em análise', 'Aprovado', 'Rejeitado', 'Em andamento', 'Concluído'];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, statusFilter, sortBy, orders]);

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Tenta diferentes endpoints possíveis
      const endpoints = [
        '/orders',
        '/orders/my-orders',
        '/orders/user',
        '/api/orders'
      ];

      let response = null;
      let lastError = null;

      // Tenta cada endpoint até um funcionar
      for (const endpoint of endpoints) {
        try {
          response = await api.get(endpoint);
          console.log('✅ Sucesso no endpoint:', endpoint, response.data);
          break; // Se deu certo, para o loop
        } catch (err) {
          lastError = err;
          console.log('❌ Erro no endpoint:', endpoint, err.response?.status);
          continue; // Continua para o próximo endpoint
        }
      }

      if (response && response.data) {
        // Tenta diferentes estruturas de resposta
        const ordersData = response.data.orders || response.data.data || response.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        throw new Error(lastError || 'Não foi possível carregar os pedidos');
      }

    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      const errorMessage = error.response?.status === 403 
        ? 'Acesso negado. Verifique suas permissões.'
        : error.response?.status === 404
        ? 'Endpoint não encontrado.'
        : 'Erro ao carregar pedidos. Tente novamente.';
      
      setError(errorMessage);
      setOrders([]); // Garante array vazio
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.description?.toLowerCase().includes(searchLower) ||
        order.category?.toLowerCase().includes(searchLower) ||
        order.id?.toString().toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'Todos') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
        case 'oldest':
          return new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0);
        case 'price-high':
          return parseFloat(b.estimated_budget || b.estimatedBudget || 0) - parseFloat(a.estimated_budget || a.estimatedBudget || 0);
        case 'price-low':
          return parseFloat(a.estimated_budget || a.estimatedBudget || 0) - parseFloat(b.estimated_budget || b.estimatedBudget || 0);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'Em análise': {
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        icon: Clock
      },
      'Aprovado': {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: CheckCircle
      },
      'Rejeitado': {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle
      },
      'Em andamento': {
        color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
        icon: PlayCircle
      },
      'Concluído': {
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        icon: Package
      }
    };

    const config = statusConfig[status] || statusConfig['Em análise'];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} transition-colors duration-200`}>
        <IconComponent className="h-3 w-3" />
        <span className="hidden sm:inline">{status}</span>
        <span className="sm:hidden">
          {status === 'Concluído' ? 'Concl.' : 
           status === 'Em andamento' ? 'Andam.' : 
           status === 'Em análise' ? 'Análise' : status}
        </span>
      </span>
    );
  };

  const StatCard = ({ label, value, color = 'gray' }) => {
    const colorConfig = {
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-300',
        value: 'text-gray-900 dark:text-white'
      },
      yellow: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-600 dark:text-amber-400',
        value: 'text-amber-700 dark:text-amber-300'
      },
      green: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        value: 'text-emerald-700 dark:text-emerald-300'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        value: 'text-blue-700 dark:text-blue-300'
      },
      purple: {
        bg: 'bg-violet-50 dark:bg-violet-900/20',
        text: 'text-violet-600 dark:text-violet-400',
        value: 'text-violet-700 dark:text-violet-300'
      }
    };

    const config = colorConfig[color];

    return (
      <div className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 ${config.bg} transition-all duration-200 hover:shadow-md`}>
        <div className={`text-lg font-bold mb-1 ${config.value}`}>
          {value}
        </div>
        <div className={`text-xs font-medium ${config.text}`}>
          {label}
        </div>
      </div>
    );
  };

  // Dados mock para teste enquanto a API não funciona
  const mockOrders = [
    {
      id: '1',
      category: 'Design Gráfico',
      description: 'Criação de logo para nova marca',
      status: 'Em análise',
      estimated_budget: 1500.00,
      created_at: new Date().toISOString(),
      files: []
    },
    {
      id: '2',
      category: 'Desenvolvimento Web',
      description: 'Site institucional responsivo',
      status: 'Aprovado',
      estimated_budget: 5000.00,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      files: [1, 2]
    },
    {
      id: '3',
      category: 'Marketing Digital',
      description: 'Campanha para redes sociais',
      status: 'Concluído',
      estimated_budget: 3000.00,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      files: [1]
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Carregando pedidos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Erro ao carregar pedidos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={fetchOrders}
              className="btn-primary text-sm px-4 py-2"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => {
                setError(null);
                setOrders(mockOrders);
                setLoading(false);
              }}
              className="btn-secondary text-sm px-4 py-2"
            >
              Usar Dados de Exemplo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Meus Pedidos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Gerencie e acompanhe todos os seus pedidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-xs sm:text-sm px-3 py-2">
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Exportar</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
        <StatCard
          label="Total"
          value={orders.length}
          color="gray"
        />
        <StatCard
          label="Em Análise"
          value={getStatusCount('Em análise')}
          color="yellow"
        />
        <StatCard
          label="Aprovados"
          value={getStatusCount('Aprovado')}
          color="blue"
        />
        <StatCard
          label="Em Andamento"
          value={getStatusCount('Em andamento')}
          color="purple"
        />
        <StatCard
          label="Concluídos"
          value={getStatusCount('Concluído')}
          color="green"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição, categoria ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 sm:py-3.5 pl-10 sm:pl-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base dark:text-white"
            />
          </div>
          
          {/* Filters Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Status Filter */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base dark:text-white"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base dark:text-white"
              >
                <option value="newest">Mais Recentes</option>
                <option value="oldest">Mais Antigos</option>
                <option value="price-high">Maior Preço</option>
                <option value="price-low">Menor Preço</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="xs:col-span-2 lg:col-span-2 flex gap-2 items-end">
              <button 
                onClick={applyFiltersAndSort}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm px-4 py-2.5 min-h-[42px]"
              >
                <Filter className="h-4 w-4" />
                <span>Aplicar Filtros</span>
              </button>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('Todos');
                  setSortBy('newest');
                }}
                className="btn-secondary flex items-center justify-center gap-2 text-sm px-3 py-2.5 min-h-[42px]"
              >
                <span>Limpar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-center py-12 sm:py-16">
          <Package className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Nenhum pedido encontrado
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto px-4">
            {orders.length === 0 
              ? 'Você ainda não fez nenhum pedido. Comece criando seu primeiro pedido agora mesmo.' 
              : 'Não encontramos pedidos com os filtros selecionados. Tente ajustar sua busca.'
            }
          </p>
          {orders.length === 0 && (
            <Link
              to="/new-order"
              className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2.5"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Criar Primeiro Pedido</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800 p-4 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header with status and date */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                    <StatusBadge status={order.status} />
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{new Date(order.created_at || order.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      ID: <span className="font-mono">#{order.id?.toString().slice(-8) || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Order content */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-3">
                    <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        {order.category || 'Sem categoria'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                        {order.description || 'Sem descrição'}
                      </p>
                    </div>
                  </div>

                  {/* Order details */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        R$ {parseFloat(order.estimated_budget || order.estimatedBudget || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{order.files.length} anexo(s)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Prazo:</span>
                      <span>5 dias úteis</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
                  <button className="btn-secondary flex items-center gap-2 text-xs sm:text-sm px-3 py-2">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Detalhes</span>
                  </button>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
            Mostrando {filteredOrders.length} pedido(s)
            {filteredOrders.length !== orders.length && ` de ${orders.length} total`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;