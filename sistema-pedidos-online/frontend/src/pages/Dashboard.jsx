import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, BarChart3, Users, TrendingUp, Clock, 
  ArrowUp, ArrowDown, FileText, Sparkles, Zap 
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
    <div className="metric-card group hover-3d relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 dark:from-slate-800/0 dark:to-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
            {value}
          </p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-emerald-500 animate-bounce" />
              ) : (
                <ArrowDown className="h-4 w-4 text-rose-500 animate-pulse" />
              )}
              <span className={`text-sm font-medium ml-2 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs último mês</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${getMetricColor(color)} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-12 scale-150"></div>
          <Icon className="h-7 w-7 text-white relative z-10" />
        </div>
      </div>
      
      {/* Efeito de brilho */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="spinner-premium w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium animate-pulse">
            Carregando dashboard...
          </p>
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
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl glow-effect">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                Bem-vindo de volta, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name}</span>!
              </p>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
        </div>
        
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-3 mt-4 sm:mt-0 px-8 py-4 rounded-2xl group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-bold text-lg">Novo Pedido</span>
          <Zap className="h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
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

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribuição de Status */}
        <div className="xl:col-span-2 card group hover-3d">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center">
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
                  <span className={`status-badge ${getStatusClass(item.label)} min-w-[120px] justify-center group-hover/item:scale-105 transition-transform duration-300`}>
                    {item.label}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[50px]">
                    {item.value}
                  </span>
                  <div className="progress-bar flex-1">
                    <div
                      className="progress-fill group-hover/item:scale-y-110 transition-all duration-700"
                      style={{ 
                        width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                        background: `linear-gradient(90deg, ${getStatusGradient(item.label)})`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 min-w-[60px] text-right">
                  {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card group hover-3d">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Ações Rápidas
          </h3>
          <div className="space-y-4">
            <Link
              to="/new-order"
              className="flex items-center p-5 border-2 border-dashed border-indigo-200/50 dark:border-indigo-800/50 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 transition-all duration-500 group/link backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover/link:scale-110 group-hover/link:rotate-12 transition-all duration-500 shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white ml-4 text-lg">Novo Pedido</span>
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center p-5 border-2 border-dashed border-blue-200/50 dark:border-blue-800/50 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition-all duration-500 group/link backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover/link:scale-110 group-hover/link:rotate-12 transition-all duration-500 shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white ml-4 text-lg">Ver Pedidos</span>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/orders"
                className="flex items-center p-5 border-2 border-dashed border-purple-200/50 dark:border-purple-800/50 rounded-2xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/30 transition-all duration-500 group/link backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover/link:scale-110 group-hover/link:rotate-12 transition-all duration-500 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white ml-4 text-lg">Painel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="xl:col-span-3 card group hover-3d">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold gradient-text flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              Pedidos Recentes
            </h3>
            <Link 
              to="/orders" 
              className="btn-secondary flex items-center space-x-2 group/link px-6 py-3 rounded-xl"
            >
              <span>Ver todos</span>
              <ArrowUp className="h-4 w-4 rotate-45 group-hover/link:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 5).map((order, index) => (
              <div 
                key={order.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-2 border-gray-100/50 dark:border-gray-700/50 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/30 transition-all duration-500 group/item backdrop-blur-sm hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-500 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                      {order.category}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 truncate mt-2 leading-relaxed">
                      {order.description}
                    </p>
                    {order.files && order.files.length > 0 && (
                      <div className="flex items-center mt-3">
                        <FileText className="h-4 w-4 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {order.files.length} arquivo(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 ml-0 sm:ml-6 w-full sm:w-auto mt-4 sm:mt-0">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                    R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status)} justify-center text-sm min-w-[140px] group-hover/item:scale-105 transition-transform duration-300`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xl mb-6 font-medium">Nenhum pedido encontrado</p>
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

const getStatusGradient = (status) => {
  const gradientMap = {
    'Em análise': '#f59e0b, #f97316',
    'Aprovado': '#10b981, #22c55e',
    'Rejeitado': '#ef4444, #ec4899',
    'Em andamento': '#3b82f6, #06b6d4',
    'Concluído': '#8b5cf6, #a855f7'
  };
  return gradientMap[status] || '#6b7280, #9ca3af';
};

export default Dashboard;