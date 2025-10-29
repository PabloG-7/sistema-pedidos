import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Clock, CheckCircle, TrendingUp, 
  Users, DollarSign, ArrowRight, FileText, BarChart3,
  Calendar, Download, Eye, Sparkles, Zap, Rocket,
  Target, Award, Star
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

  const StatCard = ({ title, value, icon: Icon, trend, description, color = 'blue', delay = 0 }) => {
    const colorClasses = {
      blue: 'from-blue-500 via-blue-600 to-purple-600',
      green: 'from-green-500 via-green-600 to-emerald-600',
      purple: 'from-purple-500 via-purple-600 to-pink-600',
      orange: 'from-orange-500 via-orange-600 to-red-600',
      indigo: 'from-indigo-500 via-indigo-600 to-blue-600'
    };

    return (
      <div 
        className="metric-card group hover:scale-105 transition-all duration-500 cursor-pointer relative overflow-hidden"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 group-hover:animate-shimmer"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-4 w-4 ${trend > 0 ? 'text-green-500 animate-bounce' : 'text-red-500 animate-pulse'}`} />
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                  <span className="text-xs text-gray-500">desde o último mês</span>
                </div>
              )}
              {description && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                  {description}
                </p>
              )}
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-12 scale-150"></div>
              <Icon className="h-6 w-6 relative z-10" />
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
        <div className="relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                Bem-vindo de volta, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>! 
                <span className="ml-2">🎉</span>
              </p>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
        </div>
        
        <div className="flex items-center gap-4 mt-6 lg:mt-0">
          <button className="btn-secondary flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
            <Download className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-300" />
            <span>Exportar</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-4 group hover:scale-105 transition-transform duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-bold">Novo Pedido</span>
            <Zap className="h-5 w-5 group-hover:scale-125 group-hover:text-yellow-300 transition-all duration-300" />
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
          delay={0}
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          trend={-5}
          color="orange"
          delay={100}
        />
        <StatCard
          title="Pedidos Concluídos"
          value={stats.completedOrders}
          icon={CheckCircle}
          trend={8}
          color="green"
          delay={200}
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue}`}
          icon={DollarSign}
          trend={15}
          color="purple"
          delay={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2 card group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pedidos Recentes
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Últimos pedidos criados no sistema
                </p>
              </div>
            </div>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center gap-3 group/link hover:scale-105 transition-transform duration-300"
            >
              <Eye className="h-5 w-5 group-hover/link:text-blue-500 transition-colors duration-300" />
              <span>Ver Todos</span>
              <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 6).map((order, index) => (
              <div 
                key={order.id} 
                className="card-hover p-4 border border-gray-200 dark:border-gray-700 group/item hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-500">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover/item:text-blue-500 transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-300">
                        {order.category}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm truncate group-hover/item:text-gray-700 dark:group-hover/item:text-gray-300 transition-colors duration-300">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-2 group/date">
                          <Calendar className="h-3 w-3 group-hover/date:text-purple-500 transition-colors duration-300" />
                          <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2 group/price">
                          <DollarSign className="h-3 w-3 group-hover/price:text-green-500 transition-colors duration-300" />
                          <span className="font-semibold">R$ {order.estimated_budget}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`status-badge group-hover/item:scale-110 transition-transform duration-300 ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto">
                  Comece criando seu primeiro pedido e transforme suas ideias em realidade
                </p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
                >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="font-bold">Criar Primeiro Pedido</span>
                  <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Estatísticas Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Taxa de Conclusão', value: `${stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%`, color: 'text-green-600', icon: Target },
                { label: 'Tempo Médio', value: '3 dias', color: 'text-blue-600', icon: Clock },
                { label: 'Satisfação', value: '94%', color: 'text-purple-600', icon: Star },
                { label: 'Recomendação', value: '98%', color: 'text-orange-600', icon: Award }
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 group/stat hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg group-hover/stat:scale-110 transition-transform duration-300">
                      <stat.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 group-hover/stat:text-gray-700 dark:group-hover/stat:text-gray-300 transition-colors duration-300">
                      {stat.label}
                    </span>
                  </div>
                  <span className={`font-bold ${stat.color} group-hover/stat:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Ações Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              {[
                { 
                  title: 'Novo Pedido', 
                  description: 'Criar um novo projeto',
                  icon: Plus, 
                  color: 'from-blue-500 to-cyan-500',
                  href: '/new-order'
                },
                { 
                  title: 'Ver Pedidos', 
                  description: 'Gerenciar todos os pedidos',
                  icon: Package, 
                  color: 'from-green-500 to-emerald-500',
                  href: '/orders'
                },
                ...(isAdmin ? [{
                  title: 'Painel Admin', 
                  description: 'Gerenciar sistema',
                  icon: Users, 
                  color: 'from-purple-500 to-pink-500',
                  href: '/admin/orders'
                }] : [])
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-500 group/action hover:scale-105"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg group-hover/action:scale-110 group-hover/action:rotate-12 transition-all duration-500`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-white group-hover/action:text-blue-600 dark:group-hover/action:text-blue-400 transition-colors duration-300">
                      {action.title}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 group-hover/action:text-gray-600 dark:group-hover/action:text-gray-400 transition-colors duration-300">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover/action:text-blue-500 group-hover/action:translate-x-1 transition-all duration-300" />
                </Link>
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