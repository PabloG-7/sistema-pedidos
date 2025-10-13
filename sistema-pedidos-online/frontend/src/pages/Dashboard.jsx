import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, PlusCircle, BarChart3, Users, TrendingUp, Clock, Calendar, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

// Componente de gráfico moderno
const StatusChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="card group hover:transform hover:scale-105 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
          <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const statusClass = getStatusClass(item.label);
          
          return (
            <div key={index} className="flex items-center justify-between group/item hover:bg-white/50 dark:hover:bg-gray-700/50 p-2 rounded-xl transition-all duration-300">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`status-badge transform group-hover/item:scale-105 transition-transform duration-300 ${statusClass}`}>
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.value}
                </span>
              </div>
              <div className="flex items-center space-x-3 w-28">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getStatusColor(item.label)
                    }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-10 text-right">
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
const MetricCard = ({ title, value, icon: Icon, change, color = 'indigo', loading = false }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-600',
    green: 'from-emerald-500 to-green-600',
    yellow: 'from-amber-500 to-yellow-600',
    blue: 'from-blue-500 to-cyan-600',
    pink: 'from-pink-500 to-rose-600'
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
          <div className="ml-4 flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group hover:transform hover:scale-105 transition-all duration-500 cursor-pointer">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
          {change !== undefined && (
            <div className="flex items-center space-x-1 mt-1">
              {change > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              )}
              <span className={`text-xs font-semibold ${change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(change)}% vs último mês
              </span>
            </div>
          )}
        </div>
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
    <div className="space-y-6 animate-slide-in">
      {/* Header Moderno */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:to-indigo-400">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>{orders.filter(o => o.status === 'Em andamento').length} projetos ativos</span>
          </div>
        </div>
      </div>

      {/* Métricas em Grid Responsiva */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
          change={-2}
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
          color="blue"
          change={15}
          loading={loading}
        />
      </div>

      {/* Ações Rápidas Modernas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Link
          to="/new-order"
          className="card group hover:transform hover:scale-105 transition-all duration-500 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlusCircle className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Novo Pedido</h3>
              <p className="text-gray-500 dark:text-gray-400">Solicitar orçamento</p>
            </div>
          </div>
        </Link>

        <Link
          to="/orders"
          className="card group hover:transform hover:scale-105 transition-all duration-500"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-400 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meus Pedidos</h3>
              <p className="text-gray-500 dark:text-gray-400">Acompanhar pedidos</p>
            </div>
          </div>
        </Link>

        {isAdmin && (
          <Link
            to="/admin/orders"
            className="card group hover:transform hover:scale-105 transition-all duration-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600 group-hover:text-purple-700 dark:text-purple-400 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Painel Admin</h3>
                <p className="text-gray-500 dark:text-gray-400">Gerenciar pedidos</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Gráficos Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart
          data={statusData}
          title="Distribuição por Status"
        />
        
        {/* Gráfico de Categorias */}
        <div className="card group hover:transform hover:scale-105 transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Categorias</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          
          <div className="space-y-4">
            {categoryData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between group/item hover:bg-white/50 dark:hover:bg-gray-700/50 p-2 rounded-xl transition-all duration-300">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1 pr-4">
                  {item.label}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.min(item.value * 20, 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white w-6 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
            
            {categoryData.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Nenhuma categoria com pedidos</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pedidos Recentes Moderno */}
      <div className="card group hover:transform hover:scale-105 transition-all duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pedidos Recentes</h2>
          <Link 
            to="/orders" 
            className="btn-secondary flex items-center space-x-2 text-sm"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 group/item">
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusBgClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                      {order.category}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {order.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span>R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <span className={`status-badge transform group-hover/item:scale-105 transition-transform duration-300 ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl inline-block mb-4">
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

const getStatusBgClass = (status) => {
  const statusMap = {
    'Em análise': 'bg-amber-50 dark:bg-amber-500/10',
    'Aprovado': 'bg-emerald-50 dark:bg-emerald-500/10',
    'Rejeitado': 'bg-rose-50 dark:bg-rose-500/10',
    'Em andamento': 'bg-blue-50 dark:bg-blue-500/10',
    'Concluído': 'bg-gray-50 dark:bg-gray-500/10'
  };
  return statusMap[status] || 'bg-amber-50 dark:bg-amber-500/10';
};

const getStatusIcon = (status) => {
  const Icon = status === 'Em análise' ? Clock :
               status === 'Aprovado' ? TrendingUp :
               status === 'Em andamento' ? Zap :
               status === 'Concluído' ? Package : Clock;
  
  const color = status === 'Em análise' ? 'text-amber-600 dark:text-amber-400' :
                status === 'Aprovado' ? 'text-emerald-600 dark:text-emerald-400' :
                status === 'Em andamento' ? 'text-blue-600 dark:text-blue-400' :
                status === 'Concluído' ? 'text-gray-600 dark:text-gray-400' : 'text-amber-600 dark:text-amber-400';
  
  return <Icon className={`h-5 w-5 ${color}`} />;
};

const getStatusColor = (status) => {
  const colorMap = {
    'Em análise': '#eab308', // amber-500
    'Aprovado': '#22c55e',   // emerald-500
    'Rejeitado': '#ef4444',  // rose-500
    'Em andamento': '#3b82f6', // blue-500
    'Concluído': '#6b7280'   // gray-500
  };
  return colorMap[status] || '#eab308';
};

export default Dashboard;