import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, TrendingUp, Clock, CheckCircle, 
  Users, DollarSign, ArrowUpRight, Activity 
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

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
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
      
      const totalBudget = ordersData.reduce((sum, order) => 
        sum + parseFloat(order.estimated_budget || 0), 0
      );
      const averageBudget = totalOrders > 0 ? totalBudget / totalOrders : 0;

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
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ title, value, icon: Icon, change, color = 'blue' }) => (
    <div className="card group hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bem-vindo de volta, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>
          </p>
        </div>
        
        <Link
          to="/new-order"
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          color="blue"
        />
        <StatCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          change={-5}
          color="amber"
        />
        <StatCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={CheckCircle}
          change={8}
          color="emerald"
        />
        <StatCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={DollarSign}
          change={15}
          color="purple"
        />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Pedidos Recentes
            </h3>
            <Link 
              to="/orders" 
              className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center gap-1"
            >
              Ver todos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {order.category}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.description.substring(0, 60)}...
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    R$ {order.estimated_budget}
                  </span>
                  <div className={`status-badge mt-1 ${getStatusClass(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Criar primeiro pedido</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              to="/new-order"
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">Novo Pedido</span>
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">Ver Pedidos</span>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300 group"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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