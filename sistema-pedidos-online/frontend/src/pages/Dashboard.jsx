import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, PlusCircle, BarChart3, Users, TrendingUp, Clock, Calendar } from 'lucide-react';

// Componente de gráfico melhorado
const StatusChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const statusClass = getStatusClass(item.label);
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`status-badge ${statusClass} shrink-0`}>
                  {item.label}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.value}
                </span>
              </div>
              <div className="flex items-center space-x-2 w-24">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getStatusColor(item.label)
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
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

// Componente de categorias melhorado
const CategoryChart = ({ data, title }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1 pr-2">
              {item.label}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(item.value * 20, 100)}%` // Escala para melhor visualização
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-6 text-right">
                {item.value}
              </span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
            Nenhuma categoria com pedidos
          </p>
        )}
      </div>
    </div>
  );
};

// Componente de métrica
const MetricCard = ({ title, value, icon: Icon, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    green: 'text-green-600 bg-green-50 dark:bg-green-500/10', 
    yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10'
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
          {change && (
            <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}% vs último mês
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Olá, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
          Bem-vindo ao painel de controle
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <MetricCard
          title="Total Pedidos"
          value={stats.totalOrders}
          icon={Package}
          color="blue"
          change={5}
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="yellow"
          change={-2}
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          color="green"
          change={8}
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          color="purple"
          change={12}
        />
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Link
          to="/new-order"
          className="card hover:shadow-lg transition-shadow duration-300 group border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlusCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-600 group-hover:text-blue-700 dark:text-blue-400" />
            </div>
            <div className="ml-3 md:ml-4">
              <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">Novo Pedido</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Solicitar orçamento</p>
            </div>
          </div>
        </Link>

        <Link
          to="/orders"
          className="card hover:shadow-lg transition-shadow duration-300 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-6 w-6 md:h-8 md:w-8 text-green-600 group-hover:text-green-700 dark:text-green-400" />
            </div>
            <div className="ml-3 md:ml-4">
              <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">Meus Pedidos</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Acompanhar pedidos</p>
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
                <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-600 group-hover:text-purple-700 dark:text-purple-400" />
              </div>
              <div className="ml-3 md:ml-4">
                <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">Painel Admin</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Gerenciar pedidos</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Gráficos - Em coluna no mobile, lado a lado no desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <StatusChart
          data={statusData}
          title="Distribuição por Status"
        />
        <CategoryChart
          data={categoryData}
          title="Top Categorias"
        />
      </div>

      {/* Pedidos Recentes - Melhorado para mobile */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Pedidos Recentes</h2>
          <Link 
            to="/orders" 
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Ver todos
          </Link>
        </div>
        
        <div className="card p-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate">
                      {order.category}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {order.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`status-badge ${getStatusClass(order.status)} shrink-0`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-6">
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
    'Em análise': '#eab308', // yellow-500
    'Aprovado': '#22c55e',   // green-500
    'Rejeitado': '#ef4444',  // red-500
    'Em andamento': '#3b82f6', // blue-500
    'Concluído': '#6b7280'   // gray-500
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;