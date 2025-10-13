import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Rocket, PlusCircle, BarChart3, Users, TrendingUp, Clock, Calendar, ArrowUpRight, Sparkles } from 'lucide-react';

// Componente de gráfico moderno
const StatusChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="card group hover-lift">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
          <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const statusClass = getStatusClass(item.label);
          
          return (
            <div key={index} className="flex items-center justify-between group/item hover:bg-white/50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-300">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`status-badge ${statusClass} group-hover/item:scale-105 transition-transform duration-300`}>
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {item.value}
                </span>
              </div>
              <div className="flex items-center space-x-3 w-32">
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      background: getStatusGradient(item.label)
                    }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente de métricas premium
const MetricCard = ({ title, value, icon: Icon, change, color = 'indigo', link }) => {
  const colorConfig = {
    indigo: {
      bg: 'from-indigo-500/10 to-purple-500/10',
      icon: 'text-indigo-600 dark:text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-green-500/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-green-500'
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/10',
      icon: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-orange-500'
    },
    blue: {
      bg: 'from-blue-500/10 to-cyan-500/10',
      icon: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-cyan-500'
    }
  };

  const config = colorConfig[color];

  return (
    <Link to={link} className="block">
      <div className="metric-card group cursor-pointer hover-lift">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{title}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{value}</p>
              
              {change && (
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  change > 0 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' 
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${change > 0 ? '' : 'rotate-180'}`} />
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.bg}`}>
              <Icon className={`h-6 w-6 ${config.icon}`} />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Clique para ver detalhes
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl from-indigo-500/5 to-purple-500/5"></div>
      </div>
    </Link>
  );
};

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

      // Calcular estatísticas
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

  // Dados para gráficos
  const statusData = [
    { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length },
    { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length },
    { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length },
    { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length },
    { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length },
  ].filter(item => item.value > 0);

  const categoryData = Object.entries(
    orders.reduce((acc, order) => {
      acc[order.category] = (acc[order.category] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([category, count]) => ({
      label: category,
      value: count
    }))
    .sort((a, b) => b.value - a.value);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center space-y-4">
          <div className="spinner border-3 border-indigo-500 border-r-transparent mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header com Welcome */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                Olá, {user?.name}! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Bem-vindo ao painel de controle Orion
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <Link
            to="/new-order"
            className="btn-primary flex items-center space-x-2 group"
          >
            <PlusCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Rocket}
          color="indigo"
          change={12}
          link="/orders"
        />
        <MetricCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="amber"
          change={-3}
          link="/orders"
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          color="emerald"
          change={8}
          link="/orders"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          color="blue"
          change={15}
          link="/orders"
        />
      </div>

      {/* Gráficos e Dados */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <StatusChart
          data={statusData}
          title="Distribuição por Status"
        />
        
        {/* Quick Actions */}
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ações Rápidas</h3>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Link
              to="/new-order"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <PlusCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Novo Pedido</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Solicitar orçamento</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </Link>

            <Link
              to="/orders"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Meus Pedidos</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acompanhar pedidos</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </Link>

            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Painel Admin</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Gerenciar pedidos</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pedidos Recentes</h2>
          <Link 
            to="/orders" 
            className="btn-ghost flex items-center space-x-2"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 group">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className={`p-3 rounded-xl ${getStatusBgClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                    {order.category}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                    {order.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <span className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`status-badge ${getStatusClass(order.status)} group-hover:scale-105 transition-transform`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Rocket className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">Nenhum pedido encontrado</p>
              <Link 
                to="/new-order" 
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Criar primeiro pedido</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions atualizadas
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

const getStatusGradient = (status) => {
  const gradientMap = {
    'Em análise': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'Aprovado': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'Rejeitado': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    'Em andamento': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'Concluído': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
  };
  return gradientMap[status] || 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
};

const getStatusBgClass = (status) => {
  const bgMap = {
    'Em análise': 'bg-amber-100 dark:bg-amber-500/20',
    'Aprovado': 'bg-emerald-100 dark:bg-emerald-500/20',
    'Rejeitado': 'bg-rose-100 dark:bg-rose-500/20',
    'Em andamento': 'bg-blue-100 dark:bg-blue-500/20',
    'Concluído': 'bg-slate-100 dark:bg-slate-500/20'
  };
  return bgMap[status] || 'bg-amber-100 dark:bg-amber-500/20';
};

const getStatusIcon = (status) => {
  const iconClass = "h-6 w-6";
  const icons = {
    'Em análise': <Clock className={`${iconClass} text-amber-600 dark:text-amber-400`} />,
    'Aprovado': <TrendingUp className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />,
    'Rejeitado': <div className={`${iconClass} text-rose-600 dark:text-rose-400`}>✕</div>,
    'Em andamento': <div className={`${iconClass} text-blue-600 dark:text-blue-400`}>⟳</div>,
    'Concluído': <div className={`${iconClass} text-slate-600 dark:text-slate-400`}>✓</div>
  };
  return icons[status] || <Clock className={`${iconClass} text-amber-600 dark:text-amber-400`} />;
};

export default Dashboard;