import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, ArrowUp, ArrowDown, FileText } from 'lucide-react';

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

  const MetricCard = ({ title, value, icon: Icon, change, trend }) => (
    <div className="card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs último mês</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center shadow-inner">
          <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Bem-vindo de volta, {user?.name}!
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-3 mt-4 sm:mt-0 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Novo Pedido</span>
        </Link>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          trend="up"
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          change={5}
          trend="down"
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          change={8}
          trend="up"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          change={15}
          trend="up"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="xl:col-span-2 card hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Distribuição por Status
          </h3>
          <div className="space-y-5">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'yellow' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'green' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'gray' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'red' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4 flex-1">
                  <span className={`status-badge ${getStatusClass(item.label)} min-w-[100px] justify-center`}>
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[40px]">
                    {item.value}
                  </span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out group-hover:scale-y-110"
                      style={{ 
                        width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                        backgroundColor: getStatusColor(item.label)
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[50px] text-right">
                  {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Ações Rápidas
          </h3>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white ml-4">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white ml-4">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white ml-4">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="xl:col-span-3 card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-500" />
              Pedidos Recentes
            </h3>
            <Link 
              to="/orders" 
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 flex items-center"
            >
              Ver todos
              <ArrowUp className="h-4 w-4 ml-1 rotate-45" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {order.category}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {order.description}
                    </p>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center mt-2">
                        <FileText className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {order.files.length} arquivo(s) anexado(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-6 ml-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)} min-w-[120px] justify-center`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
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
    'Em análise': '#eab308',
    'Aprovado': '#22c55e',
    'Rejeitado': '#ef4444',
    'Em andamento': '#3b82f6',
    'Concluído': '#6b7280'
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;