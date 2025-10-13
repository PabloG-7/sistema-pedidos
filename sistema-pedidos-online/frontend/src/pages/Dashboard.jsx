import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Zap, Plus, TrendingUp, Activity, Users, Clock, Star, Rocket } from 'lucide-react';

// Holographic Chart Component
const HolographicChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="luxury-card p-8 relative overflow-hidden group">
      <div className="absolute -inset-1 holographic rounded-3xl opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <Activity className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        
        <div className="space-y-6">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const statusClass = getStatusClass(item.label);
            
            return (
              <div key={index} className="flex items-center justify-between group/item p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <span className={`status-badge ${statusClass} group-hover/item:scale-110 transition-transform duration-300`}>
                    {item.label}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {item.value}
                  </span>
                </div>
                <div className="flex items-center space-x-4 w-40">
                  <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        background: getStatusGradient(item.label)
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-black text-cyan-400 w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Cyber Metric Card
const CyberMetricCard = ({ title, value, icon: Icon, change, trend, color = 'cyan' }) => {
  const colorConfig = {
    cyan: { from: 'from-cyan-500', to: 'to-blue-500', glow: 'shadow-cyan-500/30' },
    pink: { from: 'from-pink-500', to: 'to-purple-500', glow: 'shadow-pink-500/30' },
    green: { from: 'from-green-500', to: 'to-emerald-500', glow: 'shadow-green-500/30' },
    yellow: { from: 'from-yellow-500', to: 'to-amber-500', glow: 'shadow-yellow-500/30' }
  };

  const config = colorConfig[color];

  return (
    <div className="metric-card-premium group">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">{title}</p>
            <p className="text-4xl font-black text-white mb-3">{value}</p>
            
            <div className="flex items-center space-x-3">
              {change && (
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black ${
                  trend === 'up' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${trend === 'up' ? '' : 'rotate-180'}`} />
                  <span>{change}%</span>
                </div>
              )}
              <div className="text-xs text-gray-500 font-mono">
                LIVE
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.from} ${config.to} ${config.glow} shadow-2xl`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        
        {/* Animated bar */}
        <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-1 bg-gradient-to-r ${config.from} ${config.to} rounded-full transition-all duration-1000`}
            style={{ width: `${Math.min((change || 0) + 70, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Neon border effect */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${config.from} ${config.to} blur-sm -z-10`}></div>
    </div>
  );
};

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
  };

  // Data for charts
  const statusData = [
    { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length },
    { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length },
    { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length },
    { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length },
    { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center space-y-6">
          <div className="spinner-premium mx-auto"></div>
          <div>
            <p className="text-cyan-400 text-lg font-bold mb-2">INICIALIZANDO SISTEMA</p>
            <p className="text-gray-500 text-sm">Carregando dados premium...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in-luxury">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl blur-lg opacity-30"></div>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
                BEM-VINDO, <span className="neon-text">{user?.name}</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Painel de controle <span className="text-cyan-400 font-bold">NEXUS</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 lg:mt-0">
          <Link
            to="/new-order"
            className="btn-neon-primary flex items-center space-x-3 group"
          >
            <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>NOVO PEDIDO</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <CyberMetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Zap}
          color="cyan"
          change={12}
          trend="up"
        />
        <CyberMetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="yellow"
          change={-3}
          trend="down"
        />
        <CyberMetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={Star}
          color="green"
          change={8}
          trend="up"
        />
        <CyberMetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={TrendingUp}
          color="pink"
          change={15}
          trend="up"
        />
      </div>

      {/* Charts & Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <HolographicChart
          data={statusData}
          title="Status dos Pedidos"
        />
        
        {/* Quick Actions */}
        <div className="luxury-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Ações Rápidas</h3>
              <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/30">
                <Activity className="h-6 w-6 text-pink-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/new-order"
                className="flex items-center justify-between p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                    <Plus className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Novo Pedido</h4>
                    <p className="text-cyan-300 text-sm">Solicitar orçamento</p>
                  </div>
                </div>
                <div className="text-cyan-400 group-hover:scale-110 transition-transform">
                  →
                </div>
              </Link>

              <Link
                to="/orders"
                className="flex items-center justify-between p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Meus Pedidos</h4>
                    <p className="text-green-300 text-sm">Acompanhar pedidos</p>
                  </div>
                </div>
                <div className="text-green-400 group-hover:scale-110 transition-transform">
                  →
                </div>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-pink-500/20 rounded-xl border border-pink-500/30">
                      <Users className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Painel Admin</h4>
                      <p className="text-pink-300 text-sm">Gerenciar pedidos</p>
                    </div>
                  </div>
                  <div className="text-pink-400 group-hover:scale-110 transition-transform">
                    →
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="luxury-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Pedidos Recentes</h2>
          <Link 
            to="/orders" 
            className="btn-neon-secondary flex items-center space-x-2"
          >
            <span>VER TODOS</span>
            <div>→</div>
          </Link>
        </div>
        
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center space-x-6 flex-1 min-w-0">
                <div className={`p-4 rounded-2xl ${getStatusBgClass(order.status)} border ${getStatusBorderClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-lg truncate mb-2">
                    {order.category}
                  </h4>
                  <p className="text-gray-400 text-sm truncate">
                    {order.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <span className="text-xl font-black text-white whitespace-nowrap">
                  R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`status-badge ${getStatusClass(order.status)} group-hover:scale-110 transition-transform`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-16">
              <Zap className="h-20 w-20 text-gray-600 mx-auto mb-6" />
              <p className="text-gray-500 text-xl mb-4">Nenhum pedido encontrado</p>
              <Link 
                to="/new-order" 
                className="btn-neon-primary inline-flex items-center space-x-3"
              >
                <Plus className="h-5 w-5" />
                <span>CRIAR PRIMEIRO PEDIDO</span>
              </Link>
            </div>
          )}
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

const getStatusGradient = (status) => {
  const gradientMap = {
    'Em análise': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'Aprovado': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'Rejeitado': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    'Em andamento': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'Concluído': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
  };
  return gradientMap[status] || 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
};

const getStatusBgClass = (status) => {
  const bgMap = {
    'Em análise': 'bg-yellow-500/10',
    'Aprovado': 'bg-green-500/10',
    'Rejeitado': 'bg-red-500/10',
    'Em andamento': 'bg-blue-500/10',
    'Concluído': 'bg-purple-500/10'
  };
  return bgMap[status] || 'bg-yellow-500/10';
};

const getStatusBorderClass = (status) => {
  const borderMap = {
    'Em análise': 'border-yellow-500/30',
    'Aprovado': 'border-green-500/30',
    'Rejeitado': 'border-red-500/30',
    'Em andamento': 'border-blue-500/30',
    'Concluído': 'border-purple-500/30'
  };
  return borderMap[status] || 'border-yellow-500/30';
};

const getStatusIcon = (status) => {
  const iconClass = "h-6 w-6";
  const icons = {
    'Em análise': <Clock className={`${iconClass} text-yellow-400`} />,
    'Aprovado': <TrendingUp className={`${iconClass} text-green-400`} />,
    'Rejeitado': <div className={`${iconClass} text-red-400 font-black`}>✕</div>,
    'Em andamento': <div className={`${iconClass} text-blue-400 font-black`}>⟳</div>,
    'Concluído': <div className={`${iconClass} text-purple-400 font-black`}>✓</div>
  };
  return icons[status] || <Clock className={`${iconClass} text-yellow-400`} />;
};

export default Dashboard;