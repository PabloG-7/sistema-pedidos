import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, Cpu, Activity, Zap } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageBudget: 0,
    revenue: 0
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
      const revenue = ordersData.reduce((sum, order) => sum + parseFloat(order.estimated_budget || 0), 0);

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        averageBudget: averageBudget.toFixed(2),
        revenue: revenue.toFixed(2)
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, change, color = 'cyan' }) => {
    const colorClasses = {
      cyan: 'from-cyan-500 to-blue-600',
      green: 'from-emerald-500 to-green-600',
      yellow: 'from-amber-500 to-yellow-600',
      purple: 'from-purple-500 to-violet-600'
    };

    return (
      <div className="metric-card group hover:animate-cyber-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="metric-value mt-2">{value}</p>
            {change && (
              <div className="flex items-center mt-3">
                <div className={`px-2 py-1 rounded text-xs font-mono ${
                  change > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                </div>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="cyber-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold cyber-text glow-text">Dashboard</h1>
          <p className="text-slate-400 mt-2 font-mono">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-2 mt-4 lg:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Pedido</span>
          <Zap className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="TOTAL DE PEDIDOS"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          color="cyan"
        />
        <MetricCard
          title="PENDENTES"
          value={stats.pendingOrders}
          icon={Clock}
          change={-5}
          color="yellow"
        />
        <MetricCard
          title="CONCLUÍDOS"
          value={stats.completedOrders}
          icon={TrendingUp}
          change={8}
          color="green"
        />
        <MetricCard
          title="TICKET MÉDIO"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          change={15}
          color="purple"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <div className="lg:col-span-2 card-glow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold cyber-text">Distribuição por Status</h3>
            <Activity className="h-5 w-5 text-cyan-400" />
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'amber' },
              { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'emerald' },
              { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'cyan' },
              { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'slate' },
              { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'rose' },
            ].filter(item => item.value > 0).map((item, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-slate-700/20 p-3 rounded-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <span className={`status-badge ${getStatusClass(item.label)} group-hover:scale-105 transition-transform duration-300`}>
                    {item.label}
                  </span>
                  <span className="text-slate-300 font-mono text-sm">
                    {item.value}
                  </span>
                </div>
                <div className="w-32 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                      backgroundColor: getStatusColor(item.label)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-glow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold cyber-text">Ações Rápidas</h3>
            <Zap className="h-5 w-5 text-cyan-400" />
          </div>
          
          <div className="space-y-3">
            <Link
              to="/new-order"
              className="flex items-center p-4 border border-slate-700/50 rounded-xl hover:border-cyan-500/30 hover:bg-slate-700/20 transition-all duration-300 group"
            >
              <Plus className="h-5 w-5 text-cyan-400 mr-3" />
              <span className="font-medium text-slate-200">Novo Pedido</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-4 border border-slate-700/50 rounded-xl hover:border-cyan-500/30 hover:bg-slate-700/20 transition-all duration-300 group"
            >
              <Package className="h-5 w-5 text-cyan-400 mr-3" />
              <span className="font-medium text-slate-200">Ver Pedidos</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-4 border border-slate-700/50 rounded-xl hover:border-cyan-500/30 hover:bg-slate-700/20 transition-all duration-300 group"
              >
                <Users className="h-5 w-5 text-cyan-400 mr-3" />
                <span className="font-medium text-slate-200">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 card-glow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold cyber-text">Pedidos Recentes</h3>
            <Link 
              to="/orders" 
              className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors duration-300"
            >
              VER_TUDO
            </Link>
          </div>
          
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-slate-700/30 rounded-xl hover:border-slate-600/50 hover:bg-slate-700/10 transition-all duration-300 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-4 w-4 text-cyan-400" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors duration-300">
                        {order.category}
                      </h4>
                      <p className="text-sm text-slate-400 truncate mt-1 font-mono">
                        {order.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm font-bold text-slate-200 whitespace-nowrap font-mono">
                    R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR')}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)} group-hover:scale-105 transition-transform duration-300`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-mono">NENHUM_PEDIDO_ENCONTRADO</p>
                <Link 
                  to="/new-order" 
                  className="text-cyan-400 hover:text-cyan-300 text-sm mt-3 inline-block font-mono transition-colors duration-300"
                >
                  CRIAR_PRIMEIRO_PEDIDO
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
    'Em andamento': '#22d3ee',
    'Concluído': '#64748b'
  };
  return colorMap[status] || '#f59e0b';
};

export default Dashboard;