import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, BarChart3, Users, TrendingUp, Clock, 
  ArrowUp, ArrowDown, FileText, Sparkles, Zap 
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageBudget: 0
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
      
      const totalBudget = ordersData.reduce((sum, order) => 
        sum + parseFloat(order.estimated_budget || 0), 0
      );
      const averageBudget = totalOrders > 0 ? totalBudget / totalOrders : 0;

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        averageBudget: averageBudget.toLocaleString('pt-BR', {
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

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = 'indigo' }) => (
    <div className="metric-card group hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-emerald-500 animate-bounce" />
              ) : (
                <ArrowDown className="h-4 w-4 text-rose-500 animate-bounce" />
              )}
              <span className={`text-sm ml-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs último mês</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${getMetricColor(color)} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 icon-3d`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-modern w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Bem-vindo de volta, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name}</span>!
            <Sparkles className="inline h-5 w-5 text-yellow-500 ml-2 animate-float" />
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-3 mt-4 sm:mt-0 px-6 py-3 rounded-xl group"
        >
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
          <span className="font-semibold">Novo Pedido</span>
          <Zap className="h-4 w-4 animate-pulse" />
        </Link>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          trend="up"
          color="indigo"
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          change={5}
          trend="down"
          color="amber"
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          change={8}
          trend="up"
          color="emerald"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          change={15}
          trend="up"
          color="violet"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="xl:col-span-2 card particle-effect">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg icon-3d">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Distribuição por Status
          </h3>
          <div className="space-y-5">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'amber' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'emerald' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'violet' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'rose' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4 flex-1">
                  <span className={`status-badge ${getStatusClass(item.label)} min-w-[100px] justify-center hover-lift`}>
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[40px]">
                    {item.value}
                  </span>
                  <div className="progress-bar flex-1">
                    <div
                      className="progress-fill"
                      style={{ 
                        width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                        backgroundColor: getStatusColor(item.label)
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[50px] text-right">
                  {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg icon-3d">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Ações Rápidas
          </h3>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-4 glass-card border-2 border-indigo-200/50 dark:border-indigo-800/50 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-500 group hover-lift"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 icon-3d">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white ml-4">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-4 glass-card border-2 border-blue-200/50 dark:border-blue-800/50 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-500 group hover-lift"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 icon-3d">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white ml-4">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-4 glass-card border-2 border-purple-200/50 dark:border-purple-800/50 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-500 group hover-lift"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 icon-3d">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white ml-4">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="xl:col-span-3 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg icon-3d">
                <Clock className="h-5 w-5 text-white" />
              </div>
              Pedidos Recentes
            </h3>
            <Link 
              to="/orders" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center group"
            >
              Ver todos
              <ArrowUp className="h-4 w-4 ml-1 rotate-45 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-card border border-gray-100/50 dark:border-gray-700/50 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-500 group hover-lift gap-4 sm:gap-6">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 icon-3d flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                      {order.category}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {order.description}
                    </p>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center mt-2">
                        <FileText className="h-3 w-3 text-indigo-500 mr-1" />
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">
                          {order.files.length} arquivo(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 ml-0 sm:ml-4 w-full sm:w-auto">
                  <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap text-sm sm:text-base">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)} justify-center text-xs sm:text-sm min-w-[100px] sm:min-w-[120px] hover-lift`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg icon-3d">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-2 px-6 py-3 rounded-xl group"
                >
                  <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-500" />
                  <span>Criar primeiro pedido</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions atualizadas
const getMetricColor = (color) => {
  const colorMap = {
    indigo: 'from-indigo-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500',
    emerald: 'from-emerald-500 to-green-500',
    amber: 'from-amber-500 to-orange-500',
    violet: 'from-violet-500 to-purple-500',
    rose: 'from-rose-500 to-pink-500'
  };
  return colorMap[color] || 'from-indigo-500 to-purple-500';
};

const getStatusClass = (status) => {
  const statusMap = {
    'Em análise': 'status-em-analise',
    'Aprovado': 'status-aprovado',
    'Rejeitado': 'status-rejeitado',
    'Em andamento': 'status-andamento',
    'Concluído': 'status-concluido'
  };
  return statusMap[status] || 'status-em-analise';
};

const getStatusColor = (status) => {
  const colorMap = {
    'Em análise': '#f59e0b',
    'Aprovado': '#10b981',
    'Rejeitado': '#ef4444',
    'Em andamento': '#3b82f6',
    'Concluído': '#8b5cf6'
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;