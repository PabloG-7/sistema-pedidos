import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageBudget: 0,
    revenue: 0
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
      const revenue = ordersData.reduce((sum, order) => sum + parseFloat(order.estimated_budget || 0), 0);

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        averageBudget: averageBudget.toFixed(2),
        revenue: revenue.toFixed(2)
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusData = [
    { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'yellow' },
    { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'green' },
    { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
    { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'gray' },
    { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'red' },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do sistema
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Métricas em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalOrders}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400 ml-1">+12%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingOrders}</p>
              <div className="flex items-center mt-2">
                <ArrowDown className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600 dark:text-amber-400 ml-1">-5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completedOrders}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400 ml-1">+8%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">R$ {stats.averageBudget}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400 ml-1">+15%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição de Status */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Status</h3>
          <div className="space-y-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`status-badge ${getStatusClass(item.label)}`}>
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.value}
                  </span>
                </div>
                <div className="w-32 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
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
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link
              to="/new-order"
              className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <span className="font-medium text-gray-900 dark:text-white">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pedidos Recentes</h3>
            <Link 
              to="/orders" 
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {order.category}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {order.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR')}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm mt-2 inline-block"
                >
                  Criar primeiro pedido
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
    'Em análise': '#eab308',
    'Aprovado': '#22c55e',
    'Rejeitado': '#ef4444',
    'Em andamento': '#3b82f6',
    'Concluído': '#6b7280'
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;