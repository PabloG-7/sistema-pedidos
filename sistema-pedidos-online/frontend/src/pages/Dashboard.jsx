import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, 
  PlusCircle, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  Zap,
  Cpu
} from 'lucide-react';

// Componente de gráfico cyberpunk
const StatusChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="neo-card group hover-lift">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-100">{title}</h3>
        <div className="text-cyan-400 font-bold">
          TOTAL: {total}
        </div>
      </div>
      <div className="space-y-6">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const statusClass = getStatusClass(item.label);
          
          return (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <span className={`status-glow ${statusClass} hover-lift`}>
                  {item.label}
                </span>
                <span className="text-lg font-bold text-slate-100 min-w-12">
                  {item.value}
                </span>
              </div>
              <div className="flex items-center space-x-4 w-40">
                <div className="flex-1 bg-slate-700/50 rounded-full h-3 overflow-hidden layered-shadow">
                  <div
                    className="h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      background: getStatusGradient(item.label),
                      boxShadow: `0 0 20px ${getStatusColor(item.label)}`
                    }}
                  ></div>
                </div>
                <span className="text-cyan-400 font-bold text-lg min-w-16 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente de métrica cyberpunk
const MetricCard = ({ title, value, icon: Icon, change, color = 'cyan' }) => {
  const colorConfig = {
    cyan: {
      gradient: 'from-cyan-500 to-cyan-600',
      glow: 'shadow-cyan-500/30',
      text: 'text-cyan-400'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/30',
      text: 'text-purple-400'
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      glow: 'shadow-pink-500/30',
      text: 'text-pink-400'
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/30',
      text: 'text-emerald-400'
    }
  };

  const config = colorConfig[color];

  return (
    <div className="metric-matrix hover-lift group">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className={`p-4 bg-gradient-to-br ${config.gradient} rounded-3xl inline-block mb-6 shadow-2xl ${config.glow} hover-lift`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-400 font-medium mb-3 text-lg">{title}</p>
          <p className="text-4xl font-black text-slate-100 mb-4">{value}</p>
          {change && (
            <div className={`inline-flex items-center space-x-3 text-lg font-bold ${change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp className={`h-6 w-6 ${change > 0 ? '' : 'rotate-180'}`} />
              <span>{Math.abs(change)}% VS MÊS PASSADO</span>
            </div>
          )}
        </div>
        {change && (
          <div className={`p-3 rounded-2xl border ${change > 0 ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-rose-400/50 bg-rose-500/10'} shadow-2xl`}>
            <ArrowUpRight className={`h-6 w-6 ${change > 0 ? 'text-emerald-400' : 'text-rose-400'} ${change > 0 ? '' : 'rotate-180'}`} />
          </div>
        )}
      </div>
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
        <div className="flex flex-col items-center space-y-6">
          <div className="loading-cyber"></div>
          <p className="text-cyan-400 font-bold text-lg">CARREGANDO SISTEMA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-100 mb-4">
            OLÁ, <span className="gradient-text-animated">{user?.name?.toUpperCase()}</span>! ⚡
          </h1>
          <p className="text-xl text-cyan-400/80 font-medium">
            BEM-VINDO AO PAINEL DE CONTROLE NEXUS
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-6 lg:mt-0">
          <div className="text-right">
            <p className="text-cyan-400/80 font-medium">DATA DO SISTEMA</p>
            <p className="text-2xl font-bold text-slate-100">
              {new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).toUpperCase()}
            </p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-3xl border border-cyan-400/30 shadow-2xl">
            <Cpu className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        <MetricCard
          title="TOTAL DE PEDIDOS"
          value={stats.totalOrders}
          icon={Package}
          color="cyan"
          change={5}
        />
        <MetricCard
          title="PENDENTES"
          value={stats.pendingOrders}
          icon={Clock}
          color="purple"
          change={-2}
        />
        <MetricCard
          title="CONCLUÍDOS"
          value={stats.completedOrders}
          icon={CheckCircle2}
          color="emerald"
          change={8}
        />
        <MetricCard
          title="TICKET MÉDIO"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          color="pink"
          change={12}
        />
      </div>

      {/* Ações Rápidas e Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Ações Rápidas */}
        <div className="xl:col-span-1 space-y-6">
          <div className="neo-card">
            <h3 className="text-xl font-black text-slate-100 mb-6">
              AÇÕES RÁPIDAS
            </h3>
            <div className="space-y-4">
              <Link
                to="/new-order"
                className="flex items-center space-x-5 p-6 rounded-3xl bg-slate-800/50 border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-500 hover-lift group"
              >
                <div className="p-3 bg-cyan-500 rounded-2xl shadow-2xl group-hover-glow-item">
                  <PlusCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-100 text-lg">NOVO PEDIDO</h4>
                  <p className="text-cyan-400/80 text-sm">SOLICITAR ORÇAMENTO</p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <Link
                to="/orders"
                className="flex items-center space-x-5 p-6 rounded-3xl bg-slate-800/50 border border-purple-400/20 hover:border-purple-400/50 transition-all duration-500 hover-lift group"
              >
                <div className="p-3 bg-purple-500 rounded-2xl shadow-2xl group-hover-glow-item">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-100 text-lg">MEUS PEDIDOS</h4>
                  <p className="text-purple-400/80 text-sm">ACOMPANHAR PEDIDOS</p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-purple-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center space-x-5 p-6 rounded-3xl bg-slate-800/50 border border-pink-400/20 hover:border-pink-400/50 transition-all duration-500 hover-lift group"
                >
                  <div className="p-3 bg-pink-500 rounded-2xl shadow-2xl group-hover-glow-item">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-100 text-lg">PAINEL ADMIN</h4>
                    <p className="text-pink-400/80 text-sm">GERENCIAR PEDIDOS</p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-pink-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="xl:col-span-2">
          <StatusChart
            data={statusData}
            title="DISTRIBUIÇÃO POR STATUS"
          />
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="neo-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-100">PEDIDOS RECENTES</h2>
          <Link 
            to="/orders" 
            className="btn-ghost-neon flex items-center space-x-3 font-bold"
          >
            <span>VER TODOS</span>
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-800/30 border border-slate-600/30 hover:border-cyan-400/30 transition-all duration-500 hover-lift group">
              <div className="flex items-center space-x-5 flex-1 min-w-0">
                <div className={`p-3 rounded-2xl ${
                  order.status === 'Concluído' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  order.status === 'Em andamento' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                  order.status === 'Em análise' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                } shadow-2xl`}>
                  <Package className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-100 truncate text-lg group-hover:text-cyan-400 transition-colors">
                    {order.category}
                  </h4>
                  <p className="text-cyan-400/80 truncate mt-2 text-sm">
                    {order.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <span className="text-2xl font-black text-slate-100 whitespace-nowrap">
                  R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`status-glow ${getStatusClass(order.status)} hover-lift`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-16">
              <div className="p-6 bg-slate-800/50 rounded-3xl inline-block mb-6 border border-cyan-400/20">
                <Zap className="h-16 w-16 text-cyan-400" />
              </div>
              <p className="text-cyan-400/80 text-xl mb-6">NENHUM PEDIDO ENCONTRADO</p>
              <Link 
                to="/new-order" 
                className="btn-neon inline-flex items-center space-x-3 text-lg"
              >
                <PlusCircle className="h-6 w-6" />
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
    'Em análise': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'Aprovado': 'linear-gradient(135deg, #10b981, #059669)',
    'Rejeitado': 'linear-gradient(135deg, #ef4444, #dc2626)',
    'Em andamento': 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
    'Concluído': 'linear-gradient(135deg, #64748b, #475569)'
  };
  return gradientMap[status] || 'linear-gradient(135deg, #64748b, #475569)';
};

const getStatusColor = (status) => {
  const colorMap = {
    'Em análise': 'rgba(245, 158, 11, 0.5)',
    'Aprovado': 'rgba(16, 185, 129, 0.5)',
    'Rejeitado': 'rgba(239, 68, 68, 0.5)',
    'Em andamento': 'rgba(34, 211, 238, 0.5)',
    'Concluído': 'rgba(100, 116, 139, 0.5)'
  };
  return colorMap[status] || 'rgba(100, 116, 139, 0.5)';
};

export default Dashboard;