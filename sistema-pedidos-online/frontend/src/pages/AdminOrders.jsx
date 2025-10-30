import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Package, Filter, Settings, Users, Eye, Edit3, 
  Search, Download, BarChart3, ChevronDown, Calendar,
  DollarSign, Mail, User, CheckCircle, Clock, XCircle, PlayCircle
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    'Todos',
    'Em análise',
    'Aprovado',
    'Rejeitado',
    'Em andamento',
    'Concluído'
  ];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = statusFilter && statusFilter !== 'Todos' ? { status: statusFilter } : {};
      const response = await api.get('/orders', { params });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    }
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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} transition-colors duration-200`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const StatCard = ({ label, value, color = 'gray', icon: Icon }) => {
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
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        value: 'text-blue-700 dark:text-blue-300'
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        value: 'text-red-700 dark:text-red-300'
      },
      green: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        value: 'text-emerald-700 dark:text-emerald-300'
      },
      purple: {
        bg: 'bg-violet-50 dark:bg-violet-900/20',
        text: 'text-violet-600 dark:text-violet-400',
        value: 'text-violet-700 dark:text-violet-300'
      }
    };

    const config = colorConfig[color];

    return (
      <div className={`p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${config.bg} transition-all duration-200 hover:shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-2xl font-bold mb-1 ${config.value}`}>
              {value}
            </div>
            <div className={`text-sm font-medium ${config.text}`}>
              {label}
            </div>
          </div>
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <Icon className={`h-5 w-5 ${config.text}`} />
          </div>
        </div>
      </div>
    );
  };

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const filteredOrders = orders.filter(order =>
    order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Carregando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Gerencie todos os pedidos do sistema
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard
          label="Total"
          value={orders.length}
          color="gray"
          icon={Package}
        />
        <StatCard
          label="Em Análise"
          value={getStatusCount('Em análise')}
          color="yellow"
          icon={Clock}
        />
        <StatCard
          label="Aprovados"
          value={getStatusCount('Aprovado')}
          color="blue"
          icon={CheckCircle}
        />
        <StatCard
          label="Rejeitados"
          value={getStatusCount('Rejeitado')}
          color="red"
          icon={XCircle}
        />
        <StatCard
          label="Em Andamento"
          value={getStatusCount('Em andamento')}
          color="purple"
          icon={PlayCircle}
        />
        <StatCard
          label="Concluídos"
          value={getStatusCount('Concluído')}
          color="green"
          icon={CheckCircle}
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, categoria, descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2.5 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-48"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button className="btn-secondary flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-center py-16">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {orders.length === 0 
              ? 'Não há pedidos no sistema.' 
              : 'Não encontramos pedidos com os filtros selecionados.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl transition-all duration-300 group-hover:scale-105"></div>
              <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800 p-6">
                
                {/* Header with status and actions */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <StatusBadge status={order.status} />
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: <span className="font-mono">#{order.id.slice(-8)}</span>
                    </div>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm w-48"
                  >
                    <option value="Em análise">Em análise</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Rejeitado">Rejeitado</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>

                {/* Order content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {order.category}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {order.description}
                    </p>
                  </div>

                  {/* Client and budget info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        <User className="h-4 w-4" />
                        Cliente
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{order.user_name}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white break-all">{order.user_email}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        <DollarSign className="h-4 w-4" />
                        Orçamento
                      </div>
                      <div className="text-lg font-bold text-emerald-600">
                        R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Additional info */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span><strong>Criado em:</strong> {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4 text-green-500" />
                      <span><strong>Atualizado em:</strong> {new Date(order.updated_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
          <p className="text-gray-600 dark:text-gray-300">
            Mostrando <span className="font-semibold text-gray-900 dark:text-white">{filteredOrders.length}</span> de{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{orders.length}</span> pedidos
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm">
              Anterior
            </button>
            <button className="btn-primary text-sm flex items-center gap-2">
              <span>Próximo</span>
              <ChevronDown className="h-4 w-4 rotate-270" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;