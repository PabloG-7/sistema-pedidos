import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Clock, CheckCircle, TrendingUp, 
  Users, DollarSign, ArrowRight, FileText, BarChart3,
  Calendar, Download, Eye, ChevronRight, Activity,
  ShoppingCart, Truck, CheckSquare, AlertCircle
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

  const StatCard = ({ title, value, icon: Icon, trend, description, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };

    return (
      <div className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl transition-all duration-300 group-hover:scale-105"></div>
        <div className="relative p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 truncate">
                {title}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 truncate">
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-3 w-3 sm:h-4 sm:w-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                </div>
              )}
              {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 hidden xs:block">
                  {description}
                </p>
              )}
            </div>
            <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110 ml-3 flex-shrink-0`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
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
        icon: AlertCircle
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
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        <span className="hidden xs:inline">{status}</span>
      </span>
    );
  };

  // Calcular métricas úteis
  const completionRate = stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;
  const averageOrderValue = stats.totalOrders > 0 ? (parseFloat(stats.totalRevenue.replace('.', '').replace(',', '.')) / stats.totalOrders).toFixed(2) : 0;
  const urgentOrders = orders.filter(order => order.status === 'Em análise').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 sm:min-h-96">
        <div className="text-center">
          <div className="spinner h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 truncate">
            Bem-vindo de volta, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="btn-secondary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Pedidos"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={12}
          color="blue"
        />
        <StatCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          trend={-5}
          color="orange"
        />
        <StatCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={CheckCircle}
          trend={8}
          color="green"
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Pedidos Recentes
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden xs:block">
                    Últimos pedidos criados
                  </p>
                </div>
              </div>
              <Link 
                to="/orders" 
                className="btn-secondary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Ver Todos</span>
              </Link>
            </div>
            
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div 
                  key={order.id} 
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg transition-all duration-300 group-hover:scale-105"></div>
                  <div className="relative p-3 sm:p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-transparent transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex-shrink-0">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {order.category}
                            </h3>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">
                            {order.description}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-semibold">R$ {order.estimated_budget}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 ml-2 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-4 sm:mb-6">
                    Comece criando seu primeiro pedido
                  </p>
                  <Link 
                    to="/new-order" 
                    className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Criar Primeiro Pedido</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Desempenho
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  R$ {averageOrderValue}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pedidos Urgentes</span>
                <span className="text-sm font-semibold text-amber-600">{urgentOrders}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
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
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white block truncate">Novo Pedido</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Criar um novo pedido</p>
                </div>
              </Link>
              
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 group"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white block truncate">Ver Pedidos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Gerenciar todos os pedidos</p>
                </div>
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200 group"
                >
                  <div className="p-2 bg-violet-100 dark:bg-violet-800 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white block truncate">Painel Admin</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Gerenciar sistema</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Priority Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Alertas
              </h3>
            </div>
            
            <div className="space-y-3">
              {urgentOrders > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                      {urgentOrders} pedido(s) em análise
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Necessitam de atenção imediata
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Tudo sob controle
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Nenhum pedido urgente
                    </p>
                  </div>
                </div>
              )}

              {stats.pendingOrders > 2 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                      {stats.pendingOrders} pedidos pendentes
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Acompanhe o andamento
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;