import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Clock, CheckCircle, TrendingUp, 
  Users, DollarSign, ArrowRight, FileText, BarChart3,
  Calendar, Download, Eye, ChevronRight, Activity,
  Search, Filter, ShoppingCart, Truck, CheckSquare
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/orders' : '/orders/my-orders';
      const response = await api.get(endpoint);
      const ordersData = response.data.orders || [];
      
      setOrders(ordersData);

      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(order => 
        ['Em análise', 'Em andamento'].includes(order.status)
      ).length;
      const completedOrders = ordersData.filter(order => 
        order.status === 'Concluído'
      ).length;
      
      const totalRevenue = ordersData.reduce((sum, order) => 
        sum + parseFloat(order.estimated_budget || 0), 0
      );

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredOrders = orders.filter(order =>
    order.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon: Icon, trend, description, color = 'primary' }) => {
    const colorConfig = {
      primary: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        gradient: 'from-blue-500 to-blue-600',
        trend: 'text-blue-600'
      },
      warning: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        icon: 'text-amber-600 dark:text-amber-400',
        gradient: 'from-amber-500 to-amber-600',
        trend: 'text-amber-600'
      },
      success: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        icon: 'text-emerald-600 dark:text-emerald-400',
        gradient: 'from-emerald-500 to-emerald-600',
        trend: 'text-emerald-600'
      },
      purple: {
        bg: 'bg-violet-50 dark:bg-violet-900/20',
        icon: 'text-violet-600 dark:text-violet-400',
        gradient: 'from-violet-500 to-violet-600',
        trend: 'text-violet-600'
      }
    };

    const config = colorConfig[color];

    return (
      <div className="group relative">
        <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-4 w-4 ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs último mês</span>
                </div>
              )}
              {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {description}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${config.bg} transition-all duration-300 group-hover:scale-110`}>
              <Icon className={`h-6 w-6 ${config.icon}`} />
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`bg-gradient-to-r ${config.gradient} h-1.5 rounded-full transition-all duration-1000`}
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderStatus = ({ status }) => {
    const statusConfig = {
      'Em análise': {
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        icon: Clock
      },
      'Aprovado': {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: CheckSquare
      },
      'Rejeitado': {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: Clock
      },
      'Em andamento': {
        color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
        icon: Truck
      },
      'Concluído': {
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        icon: CheckCircle
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Carregando dashboard...
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Painel de Controle
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Bem-vindo de volta, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filtrar</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={12}
          color="primary"
        />
        <StatCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          trend={-5}
          color="warning"
        />
        <StatCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={CheckCircle}
          trend={8}
          color="success"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue}`}
          icon={DollarSign}
          trend={15}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Pedidos Recentes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {filteredOrders.length} pedidos encontrados
                    </p>
                  </div>
                </div>
                <Link 
                  to="/orders" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors duration-200"
                >
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Orders List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.slice(0, 6).map((order) => (
                <div 
                  key={order.id} 
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {order.category}
                          </h3>
                          <OrderStatus status={order.status} />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm truncate mb-2">
                          {order.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="font-semibold">R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">ID:</span>
                            <span className="font-mono">#{order.id.slice(-8)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              ))}
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm ? 'Tente ajustar os termos da busca' : 'Comece criando seu primeiro pedido'}
                  </p>
                  {!searchTerm && (
                    <Link 
                      to="/new-order" 
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Criar Primeiro Pedido</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Estatísticas
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-300">Taxa de Conclusão</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-300">Tempo Médio</span>
                <span className="font-semibold text-gray-900 dark:text-white">2.3 dias</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-300">Satisfação</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600">96%</span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ações Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/new-order"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white">Novo Pedido</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Criar um novo pedido</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
              
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 group"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white">Ver Pedidos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar todos os pedidos</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200 group"
                >
                  <div className="p-2 bg-violet-100 dark:bg-violet-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-white">Painel Admin</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar sistema</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Atividade Recente
              </h3>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 4).map((order, index) => (
                <div key={index} className="flex items-start gap-3 py-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">{order.category}</span> - {order.status.toLowerCase()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;