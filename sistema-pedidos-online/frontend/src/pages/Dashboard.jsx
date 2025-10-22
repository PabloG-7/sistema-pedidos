import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, TrendingUp, Clock, 
  CheckCircle, Users, FileText, Rocket,
  ArrowUp, ArrowDown
} from 'lucide-react';

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
        averageBudget
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600', 
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };

    return (
      <div className="metric-card group hover-glow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
            <div className="flex items-baseline space-x-2 mb-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
              {change && (
                <div className={`flex items-center text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span className="ml-1">{Math.abs(change)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-slide-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-2 mt-6 sm:mt-0 animate-slide-in"
          style={{animationDelay: '0.1s'}}
        >
          <Rocket className="h-5 w-5" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          change={12}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Pendentes"
          value={stats.pendingOrders}
          change={-5}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Concluídos"
          value={stats.completedOrders}
          change={8}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget.toFixed(2)}`}
          change={15}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <div className="lg:col-span-2 card animate-slide-in" style={{animationDelay: '0.2s'}}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Status dos Pedidos
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'bg-blue-500' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'bg-green-500' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'bg-orange-500' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'bg-gray-500' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'bg-red-500' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${item.color} group-hover:scale-125 transition-transform duration-300`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                  <div className="w-32 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${item.color} group-hover:scale-y-125`}
                      style={{ 
                        width: `${(item.value / Math.max(1, orders.length)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card animate-slide-in" style={{animationDelay: '0.3s'}}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              to="/new-order"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl hover:scale-105 transition-all duration-300 group"
            >
              <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Novo Pedido</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Criar novo pedido</p>
              </div>
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-xl hover:scale-105 transition-all duration-300 group"
            >
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Ver Pedidos</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Todos os pedidos</p>
              </div>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl hover:scale-105 transition-all duration-300 group"
              >
                <Users className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Painel Admin</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar pedidos</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 card animate-slide-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Pedidos Recentes</h3>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Ver todos</span>
              <FileText className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order, index) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:scale-105 hover:shadow-lg transition-all duration-300 group"
                style={{animationDelay: `${0.5 + index * 0.1}s`}}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    order.status === 'Concluído' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    order.status === 'Em andamento' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                    order.status === 'Em análise' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                    'bg-gray-100 dark:bg-gray-600 text-gray-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {order.status === 'Concluído' ? <CheckCircle className="h-5 w-5" /> :
                     order.status === 'Em andamento' ? <Clock className="h-5 w-5" /> :
                     <Package className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {order.category}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {order.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 ml-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Nenhum pedido encontrado
                </h4>
                <p className="text-gray-400 dark:text-gray-500 mb-6">
                  Comece criando seu primeiro pedido
                </p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Rocket className="h-4 w-4" />
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

const getStatusBadge = (status) => {
  const statusMap = {
    'Em análise': 'badge-pending',
    'Aprovado': 'badge-approved',
    'Rejeitado': 'badge-rejected',
    'Em andamento': 'badge-progress',
    'Concluído': 'badge-completed'
  };
  return statusMap[status] || 'badge-pending';
};

export default Dashboard;