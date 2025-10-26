// pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, ArrowUp, ArrowDown, FileText, Sparkles, Zap, Target } from 'lucide-react';

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

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = 'indigo' }) => (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
      <div className="relative card hover:scale-105 hover:rotate-1 transition-all duration-500 border-0 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/60 mb-3">{title}</p>
            <p className="text-3xl font-bold text-white mb-3">{value}</p>
            {change && (
              <div className="flex items-center">
                {trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-rose-400" />
                )}
                <span className={`text-sm ml-2 ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-white/40 ml-2">vs último mês</span>
              </div>
            )}
          </div>
          <div className={`relative w-14 h-14 bg-gradient-to-br ${getMetricColor(color)} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
            <Icon className="h-6 w-6 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner-premium w-16 h-16 mx-auto mb-4"></div>
          <p className="text-white/60">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-sm"></div>
          <h1 className="text-4xl font-bold gradient-text relative">
            Dashboard
          </h1>
          <p className="text-white/60 mt-3 text-lg">
            Bem-vindo de volta, <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name}</span>!
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-3 mt-6 lg:mt-0 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold">Novo Pedido</span>
          <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </Link>
      </div>

      {/* Grid de Métricas Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          trend="up"
          color="indigo"
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

      {/* Conteúdo Principal Premium */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="xl:col-span-2 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
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
                <div key={index} className="flex items-center justify-between group/item">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className={`status-badge ${getStatusClass(item.label)} min-w-[120px] justify-center glow`}>
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-white min-w-[40px]">
                      {item.value}
                    </span>
                    <div className="flex-1 bg-white/5 rounded-full h-4 shadow-inner backdrop-blur-md">
                      <div
                        className="h-4 rounded-full transition-all duration-1000 ease-out group-hover/item:scale-y-110 relative overflow-hidden"
                        style={{ 
                          width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                          backgroundColor: getStatusColor(item.label)
                        }}
                      >
                        <div className="absolute inset-0 shimmer"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-white/60 min-w-[50px] text-right">
                    {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações Rápidas Premium */}
        <div className="group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                <Zap className="h-5 w-5 text-white" />
              </div>
              Ações Rápidas
            </h3>
            <div className="space-y-4">
              <Link
                to="/new-order"
                className="flex items-center p-5 border-2 border-dashed border-indigo-500/30 rounded-2xl hover:border-indigo-400 hover:bg-indigo-500/10 transition-all duration-500 group/action backdrop-blur-md"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500 shadow-2xl">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-white ml-4">Novo Pedido</span>
              </Link>
              <Link
                to="/orders"
                className="flex items-center p-5 border-2 border-dashed border-blue-500/30 rounded-2xl hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-500 group/action backdrop-blur-md"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500 shadow-2xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-white ml-4">Ver Pedidos</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center p-5 border-2 border-dashed border-purple-500/30 rounded-2xl hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-500 group/action backdrop-blur-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500 shadow-2xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-white ml-4">Painel Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Pedidos Recentes Premium */}
        <div className="xl:col-span-3 group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                Pedidos Recentes
              </h3>
              <Link 
                to="/orders" 
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-300 flex items-center group/link"
              >
                Ver todos
                <ArrowUp className="h-4 w-4 ml-2 rotate-45 group-hover/link:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border border-white/10 rounded-2xl hover:bg-white/5 backdrop-blur-md transition-all duration-500 group/item hover:scale-[1.02]">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-500 shadow-2xl">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate text-base">
                        {order.category}
                      </h4>
                      <p className="text-sm text-white/60 truncate mt-1">
                        {order.description}
                      </p>
                      {order.files && order.files.length > 0 && (
                        <div className="flex items-center mt-2">
                          <FileText className="h-3 w-3 text-indigo-400 mr-2" />
                          <span className="text-xs text-indigo-400">
                            {order.files.length} arquivo(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6 mt-4 lg:mt-0 w-full lg:w-auto">
                    <span className="text-lg font-bold text-white whitespace-nowrap">
                      R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className={`status-badge ${getStatusClass(order.status)} justify-center min-w-[120px] glow`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-white/60 text-lg mb-4">Nenhum pedido encontrado</p>
                  <Link 
                    to="/new-order" 
                    className="btn-primary inline-flex items-center space-x-3 group"
                  >
                    <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Criar primeiro pedido</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions atualizadas
const getMetricColor = (color) => {
  const colorMap = {
    indigo: 'from-indigo-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500',
    emerald: 'from-emerald-500 to-green-500',
    amber: 'from-amber-500 to-orange-500',
    violet: 'from-violet-500 to-purple-500',
    rose: 'from-rose-500 to-pink-500'
  };
  return colorMap[color] || 'from-indigo-500 to-purple-500';
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