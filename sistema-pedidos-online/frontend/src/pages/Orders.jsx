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

  const statusOptions = ['Todos', 'Em análise', 'Aprovado', 'Rejeitado', 'Em andamento', 'Concluído'];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, statusFilter, sortBy, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
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
        order.category?.toLowerCase().includes(searchLower)
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
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'price-high':
          return parseFloat(b.estimated_budget) - parseFloat(a.estimated_budget);
        case 'price-low':
          return parseFloat(a.estimated_budget) - parseFloat(b.estimated_budget);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Carregando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Meus Pedidos
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Gerencie e acompanhe todos os seus pedidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-xs px-3 py-2">
            <Download className="h-3 w-3" />
            <span className="hidden xs:inline">Exportar</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-2 text-xs px-3 py-2"
          >
            <Plus className="h-3 w-3" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
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

      {/* Filters and Search - Melhorado */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm"
            />
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-col xs:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            >
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="price-high">Maior Preço</option>
              <option value="price-low">Menor Preço</option>
            </select>

            <button className="btn-secondary flex items-center justify-center gap-2 text-xs px-3 py-2 min-w-[100px]">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Nenhum pedido encontrado
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto px-4">
            {orders.length === 0 
              ? 'Você ainda não fez nenhum pedido. Comece criando seu primeiro pedido agora mesmo.' 
              : 'Não encontramos pedidos com os filtros selecionados. Tente ajustar sua busca.'
            }
          </p>
          {orders.length === 0 && (
            <Link
              to="/new-order"
              className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Primeiro Pedido</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800 p-4"
            >
              <div className="flex flex-col gap-3">
                {/* Header with status and date */}
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={order.status} />
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: <span className="font-mono">#{order.id.slice(-8)}</span>
                  </div>
                </div>
                
                {/* Order content */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {order.category}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                      {order.description}
                    </p>
                  </div>
                </div>

                {/* Order details */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {order.files && order.files.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <FileText className="h-3 w-3" />
                      <span>{order.files.length} anexo(s)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Prazo:</span>
                    <span>5 dias úteis</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button className="btn-secondary flex items-center gap-2 text-xs px-3 py-1">
                    <Eye className="h-3 w-3" />
                    <span>Detalhes</span>
                  </button>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count - Simples e limpo */}
      {filteredOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Mostrando {filteredOrders.length} pedido(s)
            {filteredOrders.length !== orders.length && ` de ${orders.length} total`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;