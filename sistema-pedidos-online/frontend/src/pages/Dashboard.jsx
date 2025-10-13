import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, Crown, Sparkles, Zap } from 'lucide-react';

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
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
      const averageBudget = ordersData.length > 0 
        ? ordersData.reduce((sum, order) => sum + parseFloat(order.estimated_budget || 0), 0) / ordersData.length
        : 0;

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
  };

  const MetricCard = ({ title, value, icon: Icon, change, color = 'purple' }) => {
    const colorClasses = {
      purple: 'from-purple-500 to-purple-700',
      gold: 'from-gold-500 to-gold-700',
      emerald: 'from-emerald-500 to-emerald-700',
      blue: 'from-blue-500 to-blue-700'
    };

    return (
      <div className="metric-card group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <p className="metric-value mt-2">{value}</p>
            {change && (
              <div className="flex items-center mt-3">
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  change > 0 
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                }`}>
                  {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
                </div>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-2xl transform group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="premium-spinner border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold premium-text font-serif glow-text">
            Bem-vindo, {user?.name}! 👑
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Seu painel de controle premium
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-2 mt-4 lg:mt-0 group"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Pedido</span>
          <Sparkles className="h-4 w-4 group-hover:animate-spin" />
        </Link>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          color="purple"
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          change={-5}
          color="gold"
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          change={8}
          color="emerald"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          change={15}
          color="blue"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="lg:col-span-2 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold premium-text font-serif">Distribuição por Status</h3>
            <BarChart3 className="h-6 w-6 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'amber' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'emerald' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'slate' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'rose' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/20 transition-all duration-500">
                <div className="flex items-center space-x-4">
                  <span className={`status-badge group-hover:scale-105 transition-transform duration-500 ${getStatusClass(item.label)}`}>
                    {item.label}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    {item.value}
                  </span>
                </div>
                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                      backgroundColor: getStatusColor(item.label)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold premium-text font-serif">Ações Rápidas</h3>
            <Zap className="h-6 w-6 text-gold-500" />
          </div>
          
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-purple-500/30 hover:bg-white/50 dark:hover:bg-slate-700/20 transition-all duration-500 group hover-lift"
            >
              <Plus className="h-5 w-5 text-purple-500 mr-3" />
              <span className="font-semibold text-slate-900 dark:text-white">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-purple-500/30 hover:bg-white/50 dark:hover:bg-slate-700/20 transition-all duration-500 group hover-lift"
            >
              <Package className="h-5 w-5 text-purple-500 mr-3" />
              <span className="font-semibold text-slate-900 dark:text-white">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-purple-500/30 hover:bg-white/50 dark:hover:bg-slate-700/20 transition-all duration-500 group hover-lift"
              >
                <Users className="h-5 w-5 text-purple-500 mr-3" />
                <span className="font-semibold text-slate-900 dark:text-white">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="lg:col-span-3 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold premium-text font-serif">Pedidos Recentes</h3>
            <Link 
              to="/orders" 
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-semibold transition-colors duration-500 flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <TrendingUp className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-purple-500/30 hover:bg-white/50 dark:hover:bg-slate-700/20 transition-all duration-500 group hover-lift">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Package className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-500">
                        {order.category}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                        {order.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR')}
                  </span>
                  <span className={`status-badge group-hover:scale-105 transition-transform duration-500 ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mb-4">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
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

// Helper functions
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
    'Concluído': '#64748b'
  };
  return colorMap[status] || '#f59e0b';
};

export default Dashboard;