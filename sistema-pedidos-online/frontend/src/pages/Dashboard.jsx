// pages/Dashboard.tsx - ATUALIZADO
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, ArrowUp, ArrowDown, FileText, Sparkles, Zap, Rocket } from 'lucide-react';

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

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = 'purple' }) => (
    <div className="metric-card group relative overflow-hidden bg-animated">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/70 mb-3">{title}</p>
            <p className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {value}
            </p>
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
                <span className="text-xs text-white/50 ml-2">vs último mês</span>
              </div>
            )}
          </div>
          <div className={`metric-icon bg-gradient-to-br ${getMetricColor(color)} group-hover:shadow-2xl`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="spinner-premium mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl pulse-glow">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-lg text-white/70">
            Bem-vindo de volta, <span className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{user?.name}</span>!
          </p>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-3 mt-6 sm:mt-0 px-8 py-4 rounded-2xl group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
          <Plus className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-500 z-10" />
          <span className="font-bold z-10">Novo Pedido</span>
          <Zap className="h-4 w-4 text-yellow-300 ml-2 z-10" />
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
        {/* Distribuição de Status Premium */}
        <div className="xl:col-span-2 card hover-3d group">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Distribuição por Status</h3>
          </div>
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
                  <span className={`status-badge min-w-[120px] justify-center hover:scale-105 transition-transform duration-300 ${getStatusClass(item.label)}`}>
                    {item.label}
                  </span>
                  <span className="text-lg font-bold text-white min-w-[50px]">
                    {item.value}
                  </span>
                  <div className="flex-1 progress-bar">
                    <div
                      className="progress-fill"
                      style={{ 
                        width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-lg font-bold text-white/80 min-w-[70px] text-right">
                  {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas Premium */}
        <div className="card hover-3d">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Ações Rápidas</h3>
          </div>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-5 border-2 border-dashed border-purple-500/30 rounded-2xl hover:border-purple-500/60 hover:bg-purple-500/10 transition-all duration-500 group/action glow-effect"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500 shadow-2xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-white ml-4 text-lg">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-5 border-2 border-dashed border-blue-500/30 rounded-2xl hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-500 group/action glow-effect"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500 shadow-2xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-white ml-4 text-lg">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-5 border-2 border-dashed border-indigo-500/30 rounded-2xl hover:border-indigo-500/60 hover:bg-indigo-500/10 transition-all duration-500 group/action glow-effect"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500 shadow-2xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-white ml-4 text-lg">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes Premium */}
        <div className="xl:col-span-3 card hover-3d">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Pedidos Recentes</h3>
            </div>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center space-x-2 group/link"
            >
              <span>Ver todos</span>
              <ArrowUp className="h-4 w-4 rotate-45 group-hover/link:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order, index) => (
              <div 
                key={order.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/5 transition-all duration-500 group/card glow-effect"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center group-hover/card:scale-110 transition-transform duration-500 shadow-2xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-lg truncate">
                      {order.category}
                    </h4>
                    <p className="text-white/70 truncate mt-1">
                      {order.description}
                    </p>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center mt-2">
                        <FileText className="h-4 w-4 text-purple-400 mr-2" />
                        <span className="text-sm text-purple-400">
                          {order.files.length} arquivo(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 ml-0 sm:ml-4 w-full sm:w-auto mt-4 sm:mt-0">
                  <span className="text-xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`status-badge justify-center text-sm min-w-[120px] hover:scale-105 transition-transform duration-300 ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <p className="text-white/70 text-xl mb-6">Nenhum pedido encontrado</p>
                <Link 
                  to="/new-order" 
                  className="btn-primary inline-flex items-center space-x-3 px-8 py-4 rounded-2xl group"
                >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="font-bold">Criar primeiro pedido</span>
                </Link>
              </div>
            )}
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
    rose: 'from-rose-500 to-pink-500',
    purple: 'from-purple-500 to-pink-500'
  };
  return colorMap[color] || 'from-purple-500 to-pink-500';
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