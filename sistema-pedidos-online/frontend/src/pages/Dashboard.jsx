import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Clock, CheckCircle, TrendingUp, 
  Users, DollarSign, ArrowRight, FileText, BarChart3,
  Calendar, Download, Eye, ChevronRight, Activity
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

    const trendColors = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400'
    };

    return (
      <div className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl transition-all duration-500 group-hover:scale-105"></div>
        <div className="relative p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:border-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-4 w-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'} transition-colors duration-300`} />
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'} transition-colors duration-300`}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                </div>
              )}
              {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
                  {description}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <Icon className="h-6 w-6 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Bem-vindo de volta, <span className="font-semibold gradient-text">{user?.name}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-6 lg:mt-0">
          <button className="btn-secondary flex items-center gap-2 transition-all duration-300 hover:gap-3">
            <Download className="h-4 w-4 transition-transform duration-300" />
            <span>Exportar</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-3 transition-all duration-300 hover:gap-4"
          >
            <Plus className="h-5 w-5 transition-transform duration-300" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          trend={12}
          color="blue"
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          trend={-5}
          color="orange"
        />
        <StatCard
          title="Pedidos Concluídos"
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors duration-300">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    Pedidos Recentes
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                    Últimos pedidos criados
                  </p>
                </div>
              </div>
              <Link 
                to="/orders" 
                className="btn-secondary flex items-center gap-2 text-sm transition-all duration-300 hover:gap-3"
              >
                <Eye className="h-4 w-4 transition-transform duration-300" />
                <span>Ver Todos</span>
              </Link>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 6).map((order) => (
                <div 
                  key={order.id} 
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl transition-all duration-500 group-hover:scale-105"></div>
                  <div className="relative p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-transparent transition-all duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                          <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate transition-colors duration-300">
                            {order.category}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm truncate transition-colors duration-300">
                            {order.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 transition-transform duration-300" />
                              <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 transition-transform duration-300" />
                              <span className="font-semibold">R$ {order.estimated_budget}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <span className={`status-badge ${getStatusClass(order.status)} transition-all duration-300 group-hover:scale-105`}>
                          {order.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4 transition-colors duration-300" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6 transition-colors duration-300">
                    Comece criando seu primeiro pedido
                  </p>
                  <Link 
                    to="/new-order" 
                    className="btn-primary inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
                  >
                    <Plus className="h-4 w-4 transition-transform duration-300" />
                    <span>Criar Primeiro Pedido</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl transition-colors duration-300">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Estatísticas Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Taxa de Conclusão</span>
                <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Tempo Médio</span>
                <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">3 dias</span>
              </div>
              <div className="flex justify-between items-center py-2 transition-colors duration-300">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Satisfação</span>
                <span className="font-semibold text-green-600 transition-colors duration-300">94%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl transition-colors duration-300">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Ações Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/new-order"
                className="group relative overflow-hidden flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl transition-all duration-500 hover:border-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform duration-500">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                </div>
                <div className="relative">
                  <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Novo Pedido</span>
                  <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">Criar um novo pedido</p>
                </div>
                <ChevronRight className="relative h-4 w-4 text-gray-400 ml-auto transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </Link>
              
              <Link
                to="/orders"
                className="group relative overflow-hidden flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl transition-all duration-500 hover:border-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform duration-500">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400 transition-colors duration-300" />
                </div>
                <div className="relative">
                  <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Ver Pedidos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">Gerenciar todos os pedidos</p>
                </div>
                <ChevronRight className="relative h-4 w-4 text-gray-400 ml-auto transition-all duration-300 group-hover:translate-x-1 group-hover:text-green-600 dark:group-hover:text-green-400" />
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="group relative overflow-hidden flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl transition-all duration-500 hover:border-transparent"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:scale-110 transition-transform duration-500">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
                  </div>
                  <div className="relative">
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Painel Admin</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">Gerenciar sistema</p>
                  </div>
                  <ChevronRight className="relative h-4 w-4 text-gray-400 ml-auto transition-all duration-300 group-hover:translate-x-1 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl transition-colors duration-300">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Atividade Recente
              </h3>
            </div>
            
            <div className="space-y-3">
              {orders.slice(0, 3).map((order, index) => (
                <div key={index} className="group flex items-center gap-3 py-2 transition-all duration-300 hover:translate-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full transition-colors duration-300 group-hover:bg-blue-600"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white transition-colors duration-300">
                      <span className="font-semibold">{order.category}</span> criado
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
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

export default Dashboard;