import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, FileText } from 'lucide-react';

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

  const MetricCard = ({ title, value, icon: Icon, subtitle }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

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
            Bem-vindo, {user?.name}
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

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          subtitle="Todos os pedidos"
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          subtitle="Em análise/andamento"
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          subtitle="Finalizados"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          subtitle="Valor médio"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição de Status */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição por Status
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'yellow' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'green' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'gray' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'red' },
            ].filter(item => item.value > 0).map((item, index) => (
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
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                      backgroundColor: getStatusColor(item.label)
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                  {((item.value / Math.max(1, orders.length)) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              to="/new-order"
              className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <span className="font-medium text-gray-900 dark:text-white">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pedidos Recentes</h3>
            <Link 
              to="/orders" 
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {order.category}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {order.description}
                    </p>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center mt-1">
                        <FileText className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {order.files.length} arquivo(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
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
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-2 inline-block"
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