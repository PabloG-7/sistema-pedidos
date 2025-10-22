import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, ArrowUp, ArrowDown, FileText, Zap } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageBudget: 0,
    totalRevenue: 0
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
      const totalRevenue = ordersData.reduce((sum, order) => 
        sum + parseFloat(order.estimated_budget || 0), 0
      );
      const averageBudget = ordersData.length > 0 
        ? totalRevenue / ordersData.length
        : 0;

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        averageBudget,
        totalRevenue
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, change, prefix = '', suffix = '' }) => (
    <div className="metric-card group hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            {prefix && <span className="text-lg text-gray-500">{prefix}</span>}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {suffix && <span className="text-lg text-gray-500">{suffix}</span>}
          </div>
          {change && (
            <div className="flex items-center mt-3">
              {change > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs último mês</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const StatusChart = () => {
    const statusData = [
      { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'bg-yellow-500' },
      { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'bg-green-500' },
      { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'bg-blue-500' },
      { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'bg-gray-500' },
      { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'bg-red-500' },
    ].filter(item => item.value > 0);

    const total = statusData.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Distribuição por Status</h3>
        <div className="space-y-4">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-20">
                  {item.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.value}
                </span>
              </div>
              <div className="w-32 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                  style={{ 
                    width: `${(item.value / Math.max(1, total)) * 100}%`
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 min-w-12 text-right">
                {Math.round((item.value / Math.max(1, total)) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com Welcome */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Olá, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Bem-vindo de volta ao seu painel de controle
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-3 mt-6 lg:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          change={12}
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          change={-5}
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          change={8}
        />
        <MetricCard
          title="Ticket Médio"
          value={stats.averageBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          icon={BarChart3}
          change={15}
          prefix="R$"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Status */}
        <div className="lg:col-span-2">
          <StatusChart />
        </div>

        {/* Ações Rápidas */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ações Rápidas</h3>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <span className="font-semibold text-gray-900 dark:text-white">Novo Pedido</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Criar novo pedido</p>
              </div>
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <span className="font-semibold text-gray-900 dark:text-white">Ver Pedidos</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Todos os seus pedidos</p>
              </div>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <span className="font-semibold text-gray-900 dark:text-white">Painel Admin</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gerenciar pedidos</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Pedidos Recentes</h3>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Ver todos</span>
              <Zap className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-300 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {order.category}
                    </h4>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {order.description}
                  </p>
                </div>
                <div className="flex items-center space-x-6 ml-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Nenhum pedido encontrado
                </h4>
                <p className="text-gray-400 dark:text-gray-500 mb-4">
                  Comece criando seu primeiro pedido
                </p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Criar Primeiro Pedido</span>
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

export default Dashboard;