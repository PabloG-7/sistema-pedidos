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
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

// Componente de gráfico moderno
const StatusChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="card group hover-lift">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
          <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-3 h-3 rounded-full ${getStatusColorClass(item.label)}`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {item.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.value}
                </span>
              </div>
              <div className="flex items-center space-x-3 w-32">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      background: getStatusGradient(item.label)
                    }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">
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

// Componente de métrica premium
const MetricCard = ({ title, value, icon: Icon, change, color = 'indigo', loading = false }) => {
  const colorConfig = {
    indigo: {
      bg: 'bg-indigo-500/10',
      icon: 'text-indigo-600 dark:text-indigo-400',
      gradient: 'from-indigo-500 to-purple-600'
    },
    green: {
      bg: 'bg-green-500/10', 
      icon: 'text-green-600 dark:text-green-400',
      gradient: 'from-green-500 to-teal-600'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      icon: 'text-yellow-600 dark:text-yellow-400',
      gradient: 'from-yellow-500 to-orange-600'
    },
    purple: {
      bg: 'bg-purple-500/10',
      icon: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500 to-pink-600'
    }
  };

  const config = colorConfig[color];

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group hover-lift hover-glow relative overflow-hidden">
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${config.bg} backdrop-blur-sm`}>
            <Icon className={`h-6 w-6 ${config.icon}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
        
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
            change > 0 
              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
          }`}>
            <TrendingUp className={`h-3 w-3 ${change > 0 ? '' : 'rotate-180'}`} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      {/* Animated border */}
      <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${config.gradient} group-hover:w-full transition-all duration-500`}></div>
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
      // Simular loading para demonstrar as animações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header Premium */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-shadow-lg">
              Bem-vindo, {user?.name}! 👋
            </h1>
          </div>
          <p className="text-indigo-100 text-lg">
            {isAdmin ? 'Painel administrativo completo' : 'Acompanhe seus pedidos em tempo real'}
          </p>
          
          {/* Stats overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
              <div className="text-indigo-200 text-sm">Total Pedidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.pendingOrders}</div>
              <div className="text-indigo-200 text-sm">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.completedOrders}</div>
              <div className="text-indigo-200 text-sm">Concluídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">R$ {stats.averageBudget}</div>
              <div className="text-indigo-200 text-sm">Ticket Médio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pedidos"
          value={stats.totalOrders}
          icon={Package}
          color="indigo"
          change={12}
          loading={loading}
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="yellow"
          change={-3}
          loading={loading}
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          color="green"
          change={8}
          loading={loading}
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          color="purple"
          change={15}
          loading={loading}
        />
      </div>

      {/* Ações Rápidas Modernas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/new-order"
          className="card card-hover group relative overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Novo Pedido</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Solicitar orçamento</p>
            </div>
          </div>
          <ArrowUpRight className="absolute top-4 right-4 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </Link>

        <Link
          to="/orders"
          className="card card-hover group relative overflow-hidden"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meus Pedidos</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Acompanhar pedidos</p>
            </div>
          </div>
          <ArrowUpRight className="absolute top-4 right-4 h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
        </Link>

        {isAdmin && (
          <Link
            to="/admin/orders"
            className="card card-hover group relative overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Painel Admin</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Gerenciar pedidos</p>
              </div>
            </div>
            <ArrowUpRight className="absolute top-4 right-4 h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
          </Link>
        )}
      </div>

      {/* Gráficos e Visualizações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StatusChart
          data={statusData}
          title="Distribuição por Status"
        />
        
        {/* Top Categories */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Categorias</h3>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-4">
            {categoryData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(item.value * 20, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white min-w-8 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedidos Recentes - Design Premium */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pedidos Recentes</h2>
            <p className="text-gray-500 dark:text-gray-400">Últimos pedidos atualizados</p>
          </div>
          <Link 
            to="/orders" 
            className="btn-secondary flex items-center space-x-2"
          >
            <span>Ver Todos</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {orders.slice(0, 5).map((order, index) => (
            <div 
              key={order.id} 
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 group border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  #{orders.length - index}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {order.category}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate mt-1">
                    {order.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className={`status-badge ${getStatusClass(order.status)} transform group-hover:scale-105 transition-transform duration-300`}>
                  {order.status}
                </div>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Nenhum pedido encontrado</p>
              <Link 
                to="/new-order" 
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Criar Primeiro Pedido</span>
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

const getStatusColorClass = (status) => {
  const colorMap = {
    'Em análise': 'bg-yellow-400',
    'Aprovado': 'bg-green-400',
    'Rejeitado': 'bg-red-400',
    'Em andamento': 'bg-blue-400',
    'Concluído': 'bg-gray-400'
  };
  return colorMap[status] || 'bg-gray-400';
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