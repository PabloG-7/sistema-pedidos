import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Shield, TrendingUp, Clock, 
  CheckCircle, Users, FileText, Rocket 
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600 dark:text-blue-400">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
                Bem-vindo, {user?.name}!
              </h1>
              <p className="text-blue-600 dark:text-blue-400 mt-1">
                Aqui está o resumo dos seus pedidos
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Rocket className="h-4 w-4" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {stats.totalOrders}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Total de Pedidos</div>
        </div>

        <div className="metric-card text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {stats.pendingOrders}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Pendentes</div>
        </div>

        <div className="metric-card text-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {stats.completedOrders}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Concluídos</div>
        </div>

        <div className="metric-card text-center">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            R$ {stats.averageBudget.toFixed(2)}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Ticket Médio</div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status dos Pedidos */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Status dos Pedidos
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'bg-blue-500' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'bg-emerald-500' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'bg-orange-500' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'bg-gray-500' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'bg-rose-500' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {item.value}
                  </span>
                  <div className="w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
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

        {/* Ações Rápidas */}
        <div className="card">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              to="/new-order"
              className="flex items-center p-3 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-3 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-3 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Pedidos Recentes</h3>
            <Link 
              to="/orders" 
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-blue-100 dark:border-blue-700/50 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    {order.category}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400 truncate">
                    {order.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    R$ {order.estimated_budget}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-blue-300 dark:text-blue-600 mx-auto mb-3" />
                <p className="text-blue-500 dark:text-blue-400">Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
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