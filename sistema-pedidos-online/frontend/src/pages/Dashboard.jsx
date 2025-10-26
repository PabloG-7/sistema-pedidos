// pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, BarChart3, Users, TrendingUp, Clock, 
  ArrowUp, ArrowDown, FileText, Sparkles, Zap,
  Target, DollarSign, CheckCircle2
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
    <div className="metric-card group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50 rounded-3xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{value}</p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-rose-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">vs último mês</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${getMetricColor(color)} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/20 rounded-2xl" />
          <Icon className="h-7 w-7 text-white relative z-10" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
              Bem-vindo de volta, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name}</span>!
            </p>
          </div>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-3 mt-6 lg:mt-0 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Plus className="h-5 w-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold relative z-10">Novo Pedido</span>
        </Link>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          icon={CheckCircle2}
          change={8}
          trend="up"
          color="emerald"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={DollarSign}
          change={15}
          trend="up"
          color="violet"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="xl:col-span-2 card group">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Distribuição por Status
            </h3>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'amber' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'emerald' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'violet' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'rose' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between group-item">
                <div className="flex items-center space-x-4 flex-1">
                  <span className={`status-badge ${getStatusClass(item.label)} min-w-[120px] justify-center text-xs`}>
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white min-w-[40px]">
                    {item.value}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-3 shadow-inner overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out group-hover:scale-y-110 relative overflow-hidden"
                      style={{ 
                        width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                        backgroundColor: getStatusColor(item.label)
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 min-w-[60px] text-right">
                  {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card group">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ações Rápidas
            </h3>
          </div>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-5 border-2 border-dashed border-indigo-200/80 dark:border-indigo-800/50 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-300 group/action backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300 shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <span className="font-bold text-slate-900 dark:text-white block">Novo Pedido</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Solicitar novo serviço</span>
              </div>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-5 border-2 border-dashed border-blue-200/80 dark:border-blue-800/50 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 group/action backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300 shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <span className="font-bold text-slate-900 dark:text-white block">Ver Pedidos</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Acompanhar todos</span>
              </div>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-5 border-2 border-dashed border-purple-200/80 dark:border-purple-800/50 rounded-2xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-300 group/action backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <span className="font-bold text-slate-900 dark:text-white block">Painel Admin</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Gerenciar sistema</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="xl:col-span-3 card group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Pedidos Recentes
              </h3>
            </div>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center space-x-2 group/link"
            >
              <span>Ver todos</span>
              <ArrowUp className="h-4 w-4 transform rotate-45 group-hover/link:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-6 border-2 border-slate-100/80 dark:border-slate-700/50 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-300 group/item backdrop-blur-sm hover:scale-[1.02]">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate text-lg">
                      {order.category}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 truncate mt-1 leading-relaxed">
                      {order.description}
                    </p>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center mt-3">
                        <FileText className="h-4 w-4 text-indigo-500 mr-2" />
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                          {order.files.length} arquivo(s) anexado(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 mt-4 lg:mt-0 lg:ml-6">
                  <span className="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)} justify-center min-w-[140px] text-sm`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xl mb-4 font-medium">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-3 px-8 py-4 rounded-2xl group"
                >
                  <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-bold">Criar primeiro pedido</span>
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