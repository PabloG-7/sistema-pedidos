import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Clock, CheckCircle, TrendingUp, 
  Users, DollarSign, ArrowRight, FileText, BarChart3,
  Calendar, Download, Eye
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
      <div className="metric-card group hover:scale-105 transition-transform duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1">
                <TrendingUp className={`h-4 w-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
            )}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {description}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`}>
            <Icon className="h-6 w-6" />
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
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pedidos Recentes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Últimos pedidos criados
                </p>
              </div>
            </div>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Eye className="h-4 w-4" />
              <span>Ver Todos</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 6).map((order) => (
              <div 
                key={order.id} 
                className="card-hover p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {order.category}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
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

                  <div className="text-right">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Comece criando seu primeiro pedido
                </p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Criar Primeiro Pedido</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Estatísticas Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Tempo Médio</span>
                <span className="font-semibold text-gray-900 dark:text-white">3 dias</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Satisfação</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Ações Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/new-order"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Novo Pedido</span>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Criar um novo pedido</p>
                </div>
              </Link>
              
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Ver Pedidos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Gerenciar todos os pedidos</p>
                </div>
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Painel Admin</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Gerenciar sistema</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Atividade Recente
              </h3>
            </div>
            
            <div className="space-y-3">
              {orders.slice(0, 3).map((order, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">{order.category}</span> criado
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
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