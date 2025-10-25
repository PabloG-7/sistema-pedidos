import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/orders' : '/orders/my-orders';
      const response = await api.get(endpoint);
      const ordersData = response.data.orders || [];
      
      setOrders(ordersData);

      // Cálculos otimizados
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

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = 'blue' }) => (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{value}</p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-rose-500" />
              )}
              <span className={`text-sm ml-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">vs último mês</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${getMetricColor(color)} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-xl">
            Bem-vindo de volta, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>!
          </p>
        </div>
        <Link
          to="/new-order"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-500 hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3 mt-4 sm:mt-0 group"
        >
          <Plus className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-lg">Novo Pedido</span>
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
          color="blue"
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
          color="violet"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="xl:col-span-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Distribuição por Status
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'amber' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'emerald' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'violet' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'rose' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4 flex-1">
                  <span className={`status-badge ${getStatusClass(item.label)} min-w-[120px] justify-center text-sm`}>
                    {item.label}
                  </span>
                  <span className="text-base font-semibold text-slate-900 dark:text-white min-w-[50px]">
                    {item.value}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-4 shadow-inner">
                    <div
                      className="h-4 rounded-full transition-all duration-1000 ease-out group-hover:scale-y-110"
                      style={{ 
                        width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                        backgroundColor: getStatusColor(item.label)
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-base font-medium text-slate-600 dark:text-slate-400 min-w-[60px] text-right">
                  {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mr-4">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Ações Rápidas
          </h3>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-5 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-500 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white ml-4 text-lg">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-5 border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all duration-500 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white ml-4 text-lg">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-5 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-500 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white ml-4 text-lg">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="xl:col-span-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-white" />
              </div>
              Pedidos Recentes
            </h3>
            <Link 
              to="/orders" 
              className="text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 flex items-center group"
            >
              Ver todos
              <ArrowUp className="h-5 w-5 ml-2 rotate-45 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-500 group gap-4 sm:gap-6">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white truncate text-base sm:text-lg">
                      {order.category}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 truncate mt-2">
                      {order.description}
                    </p>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center mt-3">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {order.files.length} arquivo(s) anexado(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 ml-0 sm:ml-4 w-full sm:w-auto">
                  <span className="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap text-base sm:text-lg">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)} justify-center text-sm min-w-[140px]`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xl mb-6">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-500 hover:shadow-2xl transform hover:scale-105 inline-flex items-center space-x-3 group"
                >
                  <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-lg">Criar primeiro pedido</span>
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
const getMetricColor = (color) => {
  const colorMap = {
    blue: 'from-blue-500 to-indigo-500',
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-green-500',
    violet: 'from-violet-500 to-purple-500',
    rose: 'from-rose-500 to-pink-500'
  };
  return colorMap[color] || 'from-blue-500 to-indigo-500';
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

const getStatusColor = (status) => {
  const colorMap = {
    'Em análise': '#f59e0b',
    'Aprovado': '#10b981',
    'Rejeitado': '#ef4444',
    'Em andamento': '#3b82f6',
    'Concluído': '#8b5cf6'
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;