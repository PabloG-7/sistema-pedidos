import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, 
  PlusCircle, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  ArrowUpRight,
  FileText,
  CheckCircle2
} from 'lucide-react';

// Componente de gráfico moderno
const StatusChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {total}
        </div>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const statusClass = getStatusClass(item.label);
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`status-badge ${statusClass} status-badge-hover`}>
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
              <div className="flex items-center space-x-3 w-32">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      background: getStatusGradient(item.label)
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-12 text-right">
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

// Componente de métrica moderno
const MetricCard = ({ title, value, icon: Icon, change, color = 'indigo' }) => {
  const colorConfig = {
    indigo: {
      bg: 'from-indigo-500/10 to-purple-500/10',
      icon: 'text-indigo-600 dark:text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-teal-500'
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/10',
      icon: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-orange-500'
    },
    rose: {
      bg: 'from-rose-500/10 to-pink-500/10',
      icon: 'text-rose-600 dark:text-rose-400',
      gradient: 'from-rose-500 to-pink-500'
    }
  };

  const config = colorConfig[color];

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.bg} inline-block mb-4 hover-scale transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${config.icon}`} />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
          {change && (
            <div className={`inline-flex items-center space-x-1 text-sm font-medium ${
              change > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              <TrendingUp className={`h-4 w-4 ${change > 0 ? '' : 'rotate-180'}`} />
              <span>{Math.abs(change)}% vs último mês</span>
            </div>
          )}
        </div>
        {change && (
          <div className={`p-2 rounded-lg ${
            change > 0 
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            <ArrowUpRight className={`h-4 w-4 ${change > 0 ? '' : 'rotate-180'}`} />
          </div>
        )}
      </div>
    </div>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner"></div>
          <p className="text-gray-500 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Olá, <span className="gradient-text">{user?.name}</span>! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Hoje é</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/50 dark:border-gray-700/50">
            <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          color="indigo"
          change={5}
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="amber"
          change={-2}
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={CheckCircle2}
          color="emerald"
          change={8}
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          color="rose"
          change={12}
        />
      </div>

      {/* Ações Rápidas e Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Ações Rápidas */}
        <div className="xl:col-span-1 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Link
                to="/new-order"
                className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100 dark:border-indigo-500/20 hover:shadow-md transition-all duration-300"
              >
                <div className="p-2 bg-indigo-500 rounded-lg group-hover-scale transition-transform duration-300">
                  <PlusCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Novo Pedido</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Solicitar orçamento</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-indigo-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <Link
                to="/orders"
                className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-100 dark:border-emerald-500/20 hover:shadow-md transition-all duration-300"
              >
                <div className="p-2 bg-emerald-500 rounded-lg group-hover-scale transition-transform duration-300">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Meus Pedidos</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhar pedidos</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-100 dark:border-amber-500/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2 bg-amber-500 rounded-lg group-hover-scale transition-transform duration-300">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Painel Admin</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar pedidos</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="xl:col-span-2">
          <StatusChart
            data={statusData}
            title="Distribuição por Status"
          />
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pedidos Recentes</h2>
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
            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${
                  order.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  order.status === 'Em andamento' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                  order.status === 'Em análise' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                  'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                }`}>
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {order.category}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {order.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`status-badge ${getStatusClass(order.status)} status-badge-hover`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl inline-block mb-4">
                <Package className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum pedido encontrado</p>
              <Link 
                to="/new-order" 
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
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
    'Em análise': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'Aprovado': 'linear-gradient(135deg, #10b981, #059669)',
    'Rejeitado': 'linear-gradient(135deg, #ef4444, #dc2626)',
    'Em andamento': 'linear-gradient(135deg, #3b82f6, #2563eb)',
    'Concluído': 'linear-gradient(135deg, #6b7280, #4b5563)'
  };
  return gradientMap[status] || 'linear-gradient(135deg, #6b7280, #4b5563)';
};

export default Dashboard;