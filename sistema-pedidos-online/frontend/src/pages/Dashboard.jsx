import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, TrendingUp, Clock, 
  CheckCircle, Users, FileText 
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Olá, {user?.name}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Package className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalOrders}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>

        <div className="card text-center">
          <Clock className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.pendingOrders}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
        </div>

        <div className="card text-center">
          <CheckCircle className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completedOrders}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Concluídos</div>
        </div>

        <div className="card text-center">
          <TrendingUp className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {stats.averageBudget.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status dos Pedidos
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, badge: 'badge-pending' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, badge: 'badge-approved' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, badge: 'badge-progress' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, badge: 'badge-completed' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, badge: 'badge-rejected' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                  <span className={item.badge}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-2">
            <Link
              to="/new-order"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Plus className="h-5 w-5 mr-3" />
              <span>Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FileText className="h-5 w-5 mr-3" />
              <span>Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Users className="h-5 w-5 mr-3" />
                <span>Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Orders */}
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
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {order.category}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {order.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    R$ {order.estimated_budget}
                  </span>
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Nenhum pedido encontrado</p>
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