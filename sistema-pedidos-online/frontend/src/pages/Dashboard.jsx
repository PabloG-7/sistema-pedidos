import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, BarChart3, Users, TrendingUp, Clock, 
  ArrowUp, ArrowDown, FileText, RefreshCw, Zap, Rocket
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

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = 'purple' }) => (
    <div className="metric-card group hover-3d">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white/60 mb-3">
            {title}
          </p>
          <p className="text-3xl font-black text-white mb-3">
            {value}
          </p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-5 w-5 text-emerald-400" />
              ) : (
                <ArrowDown className="h-5 w-5 text-rose-400" />
              )}
              <span className={`text-lg font-bold ml-2 ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-16 h-16 bg-gradient-to-r ${getMetricColor(color)} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner-modern w-16 h-16 mx-auto mb-4"></div>
          <p className="text-white/60 text-lg font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
              <Rocket className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black gradient-text">
                Dashboard
              </h1>
              <p className="text-xl text-white/60 mt-2">
                Bem-vindo, <span className="font-bold text-white">{user?.name}</span>!
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-6 lg:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center space-x-3 px-6 py-3"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="font-semibold">Atualizar</span>
          </button>
          
          <Link
            to="/new-order"
            className="btn-primary flex items-center space-x-3 px-6 py-3"
          >
            <Plus className="h-5 w-5" />
            <span className="font-bold">Novo Pedido</span>
            <Zap className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          trend="up"
          color="purple"
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          change={5}
          trend="down"
          color="amber"
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={TrendingUp}
          change={8}
          trend="up"
          color="emerald"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          change={15}
          trend="up"
          color="blue"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pedidos Recentes */}
        <div className="xl:col-span-2 card group hover-3d">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black gradient-text flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              Pedidos Recentes
            </h3>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center space-x-2 px-4 py-2"
            >
              <span>Ver todos</span>
              <ArrowUp className="h-4 w-4 rotate-45" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order, index) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate text-lg">
                      {order.category}
                    </h4>
                    <p className="text-white/60 truncate mt-2">
                      {order.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 ml-6">
                  <span className="text-xl font-black text-white whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR')}
                  </span>
                  <span className={`status-badge min-w-[140px] justify-center`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <p className="text-white/60 text-xl mb-6 font-medium">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-3 px-8 py-4"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-bold">Criar primeiro pedido</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card group hover-3d">
          <h3 className="text-2xl font-black gradient-text mb-6 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Ações Rápidas
          </h3>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-5 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-2xl border border-purple-400/30 hover:from-purple-600/30 hover:to-blue-500/30 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-white ml-4 text-lg">Novo Pedido</span>
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center p-5 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl border border-blue-400/30 hover:from-blue-600/30 hover:to-cyan-500/30 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-white ml-4 text-lg">Ver Pedidos</span>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-5 bg-gradient-to-r from-violet-600/20 to-purple-500/20 rounded-2xl border border-violet-400/30 hover:from-violet-600/30 hover:to-purple-500/30 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-white ml-4 text-lg">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getMetricColor = (color) => {
  const colorMap = {
    purple: 'from-purple-600 to-violet-600',
    blue: 'from-blue-600 to-cyan-600',
    emerald: 'from-emerald-600 to-green-600',
    amber: 'from-amber-600 to-orange-600'
  };
  return colorMap[color] || 'from-purple-600 to-violet-600';
};

export default Dashboard;