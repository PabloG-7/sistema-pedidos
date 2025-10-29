import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Package, Plus, Search, Filter, Download, 
  Calendar, DollarSign, Eye, FileText, SortAsc,
  CheckCircle, Clock, XCircle, PlayCircle
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('newest');

  const statusOptions = ['Todos', 'Em análise', 'Aprovado', 'Rejeitado', 'Em andamento', 'Concluído'];

  const statusIcons = {
    'Em análise': <Clock className="h-4 w-4" />,
    'Aprovado': <CheckCircle className="h-4 w-4" />,
    'Rejeitado': <XCircle className="h-4 w-4" />,
    'Em andamento': <PlayCircle className="h-4 w-4" />,
    'Concluído': <Package className="h-4 w-4" />
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Carregando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meus Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Gerencie e acompanhe todos os seus pedidos
          </p>
        </div>
        <div className="flex items-center gap-4 mt-6 lg:mt-0">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-3"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: orders.length, color: 'gray' },
          { label: 'Em Análise', value: getStatusCount('Em análise'), color: 'yellow' },
          { label: 'Aprovados', value: getStatusCount('Aprovado'), color: 'green' },
          { label: 'Em Andamento', value: getStatusCount('Em andamento'), color: 'blue' },
          { label: 'Concluídos', value: getStatusCount('Concluído'), color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="card text-center">
            <div className={`text-2xl font-bold mb-1 ${
              stat.color === 'gray' ? 'text-gray-600 dark:text-gray-400' :
              stat.color === 'yellow' ? 'text-yellow-600' :
              stat.color === 'green' ? 'text-green-600' :
              stat.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
            }`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição, categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-48"
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
              className="input w-40"
            >
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="price-high">Maior Preço</option>
              <option value="price-low">Menor Preço</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center py-16">
          <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-lg mb-8 max-w-md mx-auto">
            {orders.length === 0 
              ? 'Você ainda não fez nenhum pedido. Comece criando seu primeiro pedido agora mesmo.' 
              : 'Não encontramos pedidos com os filtros selecionados. Tente ajustar sua busca.'
            }
          </p>
          {orders.length === 0 && (
            <Link
              to="/new-order"
              className="btn-primary inline-flex items-center gap-3"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Primeiro Pedido</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card-hover group">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {statusIcons[order.status]}
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {order.category}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {order.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">
                        R$ {order.estimated_budget}
                      </span>
                    </div>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{order.files.length} anexo(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 lg:mt-0 lg:ml-6">
                  <button className="btn-secondary flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Detalhes</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-between items-center card">
          <p className="text-gray-600 dark:text-gray-400">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm">Anterior</button>
            <button className="btn-primary text-sm">Próximo</button>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusClass = (status) => {
  const statusMap = {
    'Em análise': 'status-pending',
    'Aprovado': 'status-approved',
    'Rejeitado': 'status-rejected',
    'Em andamento': 'status-progress',
    'Concluído': 'status-completed'
  };
  return statusMap[status] || 'status-pending';
};

export default Orders;