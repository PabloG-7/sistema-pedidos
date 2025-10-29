import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, BarChart3, Users, TrendingUp, Clock, 
  ArrowUp, ArrowDown, FileText, RefreshCw
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      
      const totalBudget = ordersData.reduce((sum, order) => 
        sum + parseFloat(order.estimated_budget || 0), 0
      );
      const averageBudget = totalOrders > 0 ? totalBudget / totalOrders : 0;

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        averageBudget: averageBudget.toFixed(2)
      });

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const MetricCard = ({ title, value, icon: Icon, change, trend }) => (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {value}
          </p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-rose-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        </div>
      </div>
    </div>
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Bem-vindo, <span className="font-medium text-slate-900 dark:text-white">{user?.name}</span>!
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center space-x-2 px-3 py-2 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          
          <Link
            to="/new-order"
            className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos Recentes */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pedidos Recentes
            </h3>
            <Link 
              to="/orders" 
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium"
            >
              Ver todos →
            </Link>
          </div>
          
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 dark:text-white truncate">
                      {order.category}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {order.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR')}
                  </span>
                  <span className={`status-badge text-xs`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-2 px-4 py-2 text-sm mt-3"
                >
                  <Plus className="h-4 w-4" />
                  <span>Criar primeiro pedido</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              to="/new-order"
              className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white ml-3">Novo Pedido</span>
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white ml-3">Ver Pedidos</span>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white ml-3">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;