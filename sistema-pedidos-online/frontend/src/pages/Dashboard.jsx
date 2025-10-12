import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, 
  Plus, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Componente de métrica ultra moderno
const MetricCard = ({ title, value, icon: Icon, change, color = 'purple', loading = false }) => {
  const colorConfig = {
    purple: {
      bg: 'bg-purple-500/10',
      icon: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500 to-indigo-600',
      changeColor: 'text-purple-600'
    },
    emerald: {
      bg: 'bg-emerald-500/10', 
      icon: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-teal-600',
      changeColor: 'text-emerald-600'
    },
    amber: {
      bg: 'bg-amber-500/10',
      icon: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-orange-600',
      changeColor: 'text-amber-600'
    },
    sky: {
      bg: 'bg-sky-500/10',
      icon: 'text-sky-600 dark:text-sky-400',
      gradient: 'from-sky-500 to-cyan-600',
      changeColor: 'text-sky-600'
    }
  };

  const config = colorConfig[color];

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-2xl"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group hover-lift hover-glow relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-2xl ${config.bg} backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${config.icon}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
        
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
            change > 0 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' 
              : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
          }`}>
            <TrendingUp className={`h-3 w-3 ${change > 0 ? '' : 'rotate-180'}`} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      {/* Animated gradient border */}
      <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${config.gradient} group-hover:w-full transition-all duration-700 rounded-full`}></div>
    </div>
  );
};

// Componente de card de ação rápida
const QuickActionCard = ({ title, description, icon: Icon, href, color = 'purple' }) => {
  const colorConfig = {
    purple: 'from-purple-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    sky: 'from-sky-500 to-cyan-600'
  };

  return (
    <Link
      to={href}
      className="card card-hover group relative overflow-hidden"
    >
      <div className="flex items-center">
        <div className={`w-14 h-14 bg-gradient-to-br ${colorConfig[color]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gradient transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{description}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
    </Link>
  );
};

// Componente de pedido recente
const RecentOrderItem = ({ order, index }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 group border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
        #{index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
          {order.category}
        </h4>
        <p className="text-gray-500 dark:text-gray-400 text-xs truncate mt-1">
          {order.description}
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(order.created_at).toLocaleDateString('pt-BR')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
    
    <div className={`status-badge ${getStatusClass(order.status)} transform group-hover:scale-105 transition-transform duration-300`}>
      {order.status}
    </div>
  </div>
);

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
      // Simular loading para demonstrar as animações
      await new Promise(resolve => setTimeout(resolve, 1200));
      
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

  const statusData = [
    { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length },
    { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length },
    { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length },
    { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length },
    { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length },
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen pb-8">
      {/* Header Hero */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white mb-8 mx-4 lg:mx-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-shadow-lg">
              Olá, {user?.name}! 👋
            </h1>
          </div>
          <p className="text-purple-100 text-lg mb-6">
            {isAdmin ? 'Painel administrativo completo' : 'Acompanhe seus pedidos em tempo real'}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
              <div className="text-purple-200 text-sm">Total</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{stats.pendingOrders}</div>
              <div className="text-purple-200 text-sm">Pendentes</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{stats.completedOrders}</div>
              <div className="text-purple-200 text-sm">Concluídos</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">R$ {stats.averageBudget}</div>
              <div className="text-purple-200 text-sm">Ticket Médio</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-0">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-animation">
          <MetricCard
            title="Total Pedidos"
            value={stats.totalOrders}
            icon={Package}
            color="purple"
            change={12}
            loading={loading}
          />
          <MetricCard
            title="Pendentes"
            value={stats.pendingOrders}
            icon={Clock}
            color="amber"
            change={-3}
            loading={loading}
          />
          <MetricCard
            title="Concluídos"
            value={stats.completedOrders}
            icon={CheckCircle2}
            color="emerald"
            change={8}
            loading={loading}
          />
          <MetricCard
            title="Ticket Médio"
            value={`R$ ${stats.averageBudget}`}
            icon={BarChart3}
            color="sky"
            change={15}
            loading={loading}
          />
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 stagger-animation">
          <QuickActionCard
            title="Novo Pedido"
            description="Solicitar orçamento"
            icon={Plus}
            href="/new-order"
            color="purple"
          />
          <QuickActionCard
            title="Meus Pedidos"
            description="Acompanhar pedidos"
            icon={Package}
            href="/orders"
            color="emerald"
          />
          {isAdmin && (
            <QuickActionCard
              title="Painel Admin"
              description="Gerenciar pedidos"
              icon={Users}
              href="/admin/orders"
              color="sky"
            />
          )}
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pedidos Recentes */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pedidos Recentes</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Últimos pedidos atualizados</p>
              </div>
              <Link 
                to="/orders" 
                className="btn-secondary flex items-center space-x-2 text-sm"
              >
                <span>Ver Todos</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {orders.slice(0, 5).map((order, index) => (
                <RecentOrderItem key={order.id} order={order} index={index} />
              ))}
              
              {orders.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Nenhum pedido encontrado</p>
                  <Link 
                    to="/new-order" 
                    className="btn-primary inline-flex items-center space-x-2 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Criar Primeiro Pedido</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Status Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Visão Geral</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Distribuição por status</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="space-y-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColorClass(item.label)} group-hover:scale-125 transition-transform duration-300`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{orders.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {orders.filter(o => o.status === 'Concluído').length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Finalizados</div>
                </div>
              </div>
            </div>
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

const getStatusColorClass = (status) => {
  const colorMap = {
    'Em análise': 'bg-amber-400',
    'Aprovado': 'bg-emerald-400',
    'Rejeitado': 'bg-rose-400',
    'Em andamento': 'bg-sky-400',
    'Concluído': 'bg-gray-400'
  };
  return colorMap[status] || 'bg-gray-400';
};

export default Dashboard;