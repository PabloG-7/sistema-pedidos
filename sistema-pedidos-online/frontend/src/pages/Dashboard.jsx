// pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, ArrowUp, ArrowDown, FileText, Cpu, Zap, Binary } from 'lucide-react';

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

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = 'pink' }) => (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-blue rounded-sm blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
      <div className="relative card-cyber border-2 hover:border-neon-green hover:shadow-[0_0_30px_#00ff00] transition-all duration-500">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <p className="text-sm font-rajdhani font-semibold text-gray-300 mb-3 uppercase tracking-wider">{title}</p>
              <p className="text-4xl font-orbitron font-bold text-white mb-4">{value}</p>
              {change && (
                <div className="flex items-center">
                  {trend === 'up' ? (
                    <ArrowUp className="h-5 w-5 text-neon-green" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-neon-pink" />
                  )}
                  <span className={`text-sm ml-2 font-orbitron ${trend === 'up' ? 'text-neon-green' : 'text-neon-pink'}`}>
                    {Math.abs(change)}%
                  </span>
                  <span className="text-xs text-gray-400 ml-2 font-rajdhani">vs último mês</span>
                </div>
              )}
            </div>
            <div className={`relative w-16 h-16 border-2 ${getMetricBorderColor(color)} flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
              <Icon className="h-8 w-8 text-white" />
              <div className="absolute inset-0 border-2 border-white/20 animate-ping"></div>
            </div>
          </div>
          <div className="scanline"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner-cyber w-20 h-20 mx-auto mb-6"></div>
          <p className="text-neon-blue font-orbitron text-lg">CARREGANDO SISTEMA...</p>
          <div className="mt-4 flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in bg-circuit">
      {/* Header Cyberpunk */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <div className="absolute -left-6 -top-6 w-12 h-12 bg-neon-pink rounded-full blur-xl opacity-50"></div>
          <h1 className="text-5xl font-orbitron font-bold text-white relative glitch-text" data-text="DASHBOARD">
            DASHBOARD
          </h1>
          <p className="text-xl font-rajdhani text-gray-300 mt-4">
            BEM-VINDO, <span className="text-neon-green font-bold">{user?.name?.toUpperCase()}</span>!
          </p>
          <div className="flex items-center mt-3 space-x-4">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400 font-rajdhani">SISTEMA ONLINE</span>
          </div>
        </div>
        <Link
          to="/new-order"
          className="btn-cyber flex items-center space-x-4 mt-6 lg:mt-0 group relative overflow-hidden"
        >
          <Binary className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-orbitron tracking-wider">NOVO PEDIDO</span>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-ping"></div>
          </div>
        </Link>
      </div>

      {/* Grid de Métricas Cyberpunk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="TOTAL DE PEDIDOS"
          value={stats.totalOrders}
          icon={Package}
          change={12}
          trend="up"
          color="pink"
        />
        <MetricCard
          title="PENDENTES"
          value={stats.pendingOrders}
          icon={Clock}
          change={5}
          trend="down"
          color="orange"
        />
        <MetricCard
          title="CONCLUÍDOS"
          value={stats.completedOrders}
          icon={TrendingUp}
          change={8}
          trend="up"
          color="green"
        />
        <MetricCard
          title="TICKET MÉDIO"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          change={15}
          trend="up"
          color="blue"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="xl:col-span-2 group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-green rounded-sm blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card-cyber border-2 border-neon-blue">
            <h3 className="text-2xl font-orbitron font-bold text-neon-blue mb-8 flex items-center">
              <div className="w-12 h-12 border-2 border-neon-blue flex items-center justify-center mr-4">
                <BarChart3 className="h-6 w-6 text-neon-blue" />
              </div>
              DISTRIBUIÇÃO POR STATUS
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'orange' },
                { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'green' },
                { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
                { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'purple' },
                { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'pink' },
              ].filter(item => item.value > 0).map((item, index) => (
                <div key={index} className="flex items-center justify-between group/item">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className={`status-neon ${getStatusClass(item.label)} min-w-[140px] justify-center`}>
                      {item.label}
                    </span>
                    <span className="text-lg font-orbitron text-white min-w-[40px]">
                      {item.value}
                    </span>
                    <div className="flex-1 bg-exotic-300/30 h-4 border border-neon-blue/30">
                      <div
                        className="h-full transition-all duration-1000 ease-out group-hover/item:scale-y-110 relative overflow-hidden"
                        style={{ 
                          width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                          background: `linear-gradient(90deg, ${getStatusColor(item.label)}, ${getStatusColor(item.label)}80)`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-orbitron text-neon-blue min-w-[60px] text-right">
                    {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="scanline"></div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-blue rounded-sm blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card-cyber border-2 border-neon-green">
            <h3 className="text-2xl font-orbitron font-bold text-neon-green mb-8 flex items-center">
              <div className="w-12 h-12 border-2 border-neon-green flex items-center justify-center mr-4">
                <Zap className="h-6 w-6 text-neon-green" />
              </div>
              AÇÕES RÁPIDAS
            </h3>
            <div className="space-y-4">
              <Link
                to="/new-order"
                className="flex items-center p-6 border-2 border-dashed border-neon-pink hover:border-neon-pink hover:bg-neon-pink/10 transition-all duration-500 group/action"
              >
                <div className="w-14 h-14 border-2 border-neon-pink flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500">
                  <Plus className="h-6 w-6 text-neon-pink" />
                </div>
                <span className="font-orbitron text-white ml-6 text-lg">NOVO PEDIDO</span>
              </Link>
              <Link
                to="/orders"
                className="flex items-center p-6 border-2 border-dashed border-neon-blue hover:border-neon-blue hover:bg-neon-blue/10 transition-all duration-500 group/action"
              >
                <div className="w-14 h-14 border-2 border-neon-blue flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500">
                  <Package className="h-6 w-6 text-neon-blue" />
                </div>
                <span className="font-orbitron text-white ml-6 text-lg">VER PEDIDOS</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center p-6 border-2 border-dashed border-neon-purple hover:border-neon-purple hover:bg-neon-purple/10 transition-all duration-500 group/action"
                >
                  <div className="w-14 h-14 border-2 border-neon-purple flex items-center justify-center group-hover/action:scale-110 transition-transform duration-500">
                    <Users className="h-6 w-6 text-neon-purple" />
                  </div>
                  <span className="font-orbitron text-white ml-6 text-lg">PAINEL ADMIN</span>
                </Link>
              )}
            </div>
            <div className="scanline"></div>
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="xl:col-span-3 group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-orange to-neon-pink rounded-sm blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card-cyber border-2 border-neon-orange">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-orbitron font-bold text-neon-orange flex items-center">
                <div className="w-12 h-12 border-2 border-neon-orange flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-neon-orange" />
                </div>
                PEDIDOS RECENTES
              </h3>
              <Link 
                to="/orders" 
                className="btn-cyber-secondary flex items-center space-x-3 group/link"
              >
                <span>VER TODOS</span>
                <ArrowUp className="h-4 w-4 rotate-45 group-hover/link:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-6 border-2 border-neon-blue/30 hover:border-neon-green hover:bg-neon-green/5 transition-all duration-500 group/item">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-14 h-14 border-2 border-neon-blue flex items-center justify-center group-hover/item:scale-110 transition-transform duration-500">
                      <FileText className="h-6 w-6 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-orbitron font-bold text-white text-lg truncate">
                        {order.category}
                      </h4>
                      <p className="font-rajdhani text-gray-300 truncate mt-2">
                        {order.description}
                      </p>
                      {order.files && order.files.length > 0 && (
                        <div className="flex items-center mt-3">
                          <FileText className="h-4 w-4 text-neon-blue mr-2" />
                          <span className="text-sm text-neon-blue font-rajdhani">
                            {order.files.length} ARQUIVO(S)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 mt-4 lg:mt-0 w-full lg:w-auto">
                    <span className="text-xl font-orbitron font-bold text-neon-green whitespace-nowrap">
                      R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className={`status-neon ${getStatusClass(order.status)} justify-center min-w-[140px]`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 border-2 border-neon-blue rounded-full flex items-center justify-center mx-auto mb-8">
                    <Package className="h-10 w-10 text-neon-blue" />
                  </div>
                  <p className="text-gray-400 font-rajdhani text-xl mb-6">NENHUM PEDIDO ENCONTRADO</p>
                  <Link 
                    to="/new-order" 
                    className="btn-cyber inline-flex items-center space-x-4 group"
                  >
                    <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>CRIAR PRIMEIRO PEDIDO</span>
                  </Link>
                </div>
              )}
            </div>
            <div className="scanline"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getMetricBorderColor = (color) => {
  const colorMap = {
    pink: 'border-neon-pink',
    blue: 'border-neon-blue',
    green: 'border-neon-green',
    orange: 'border-neon-orange',
    purple: 'border-neon-purple'
  };
  return colorMap[color] || 'border-neon-pink';
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
    'Em análise': '#ff6b00',
    'Aprovado': '#00ff00',
    'Rejeitado': '#ff00ff',
    'Em andamento': '#00ffff',
    'Concluído': '#bf00ff'
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;