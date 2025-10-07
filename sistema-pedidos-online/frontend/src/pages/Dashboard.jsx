import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, PlusCircle, BarChart3, Users, TrendingUp, Clock } from 'lucide-react';

// Componente de gráfico simples (sem biblioteca externa)
const SimpleBarChart = ({ data, title, color = 'bg-blue-500' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300 w-20 truncate">{item.label}</span>
            <div className="flex-1 mx-2">
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de métrica
const MetricCard = ({ title, value, icon: Icon, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% em relação ao mês anterior
            </p>
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
      // Buscar pedidos do usuário (ou todos se for admin)
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
        averageBudget: averageBudget.toFixed(2)
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
  ];

  const categoryData = Object.entries(
    orders.reduce((acc, order) => {
      acc[order.category] = (acc[order.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({
    label: category,
    value: count
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Olá, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bem-vindo ao painel de controle do sistema
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          color="blue"
          change={5}
        />
        <MetricCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="yellow"
          change={-2}
        />
        <MetricCard
          title="Pedidos Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          color="green"
          change={8}
        />
        <MetricCard
          title="Ticket Médio (R$)"
          value={stats.averageBudget}
          icon={BarChart3}
          color="purple"
          change={12}
        />
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/new-order"
          className="card hover:shadow-lg transition-shadow duration-300 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlusCircle className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Novo Pedido</h3>
              <p className="text-gray-500 dark:text-gray-400">Solicite um novo orçamento</p>
            </div>
          </div>
        </Link>

        <Link
          to="/orders"
          className="card hover:shadow-lg transition-shadow duration-300 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-green-600 group-hover:text-green-700" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Meus Pedidos</h3>
              <p className="text-gray-500 dark:text-gray-400">Acompanhe seus pedidos</p>
            </div>
          </div>
        </Link>

        {isAdmin && (
          <Link
            to="/admin/orders"
            className="card hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Painel Admin</h3>
                <p className="text-gray-500 dark:text-gray-400">Gerencie todos os pedidos</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart
          data={statusData}
          title="Pedidos por Status"
          color="bg-blue-500"
        />
        <SimpleBarChart
          data={categoryData}
          title="Pedidos por Categoria"
          color="bg-green-500"
        />
      </div>

      {/* Pedidos Recentes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pedidos Recentes</h2>
        <div className="card">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{order.category}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{order.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  R$ {order.estimated_budget}
                </span>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhum pedido encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function para classes de status
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