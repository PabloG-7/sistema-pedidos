import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, 
  Plus, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  Zap,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageBudget: 0,
    totalRevenue: 0,
    conversionRate: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

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
      const totalRevenue = ordersData.reduce((sum, order) => 
        sum + parseFloat(order.estimated_budget || 0), 0
      );
      const averageBudget = ordersData.length > 0 
        ? totalRevenue / ordersData.length
        : 0;
      const conversionRate = ordersData.length > 0 
        ? (completedOrders / totalOrders) * 100
        : 0;

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        averageBudget,
        totalRevenue,
        conversionRate
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue', prefix = '', suffix = '' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600'
    };

    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
              <div className="flex items-baseline space-x-2 mb-3">
                {prefix && <span className="text-lg text-gray-500">{prefix}</span>}
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                {suffix && <span className="text-lg text-gray-500">{suffix}</span>}
              </div>
              {change && (
                <div className="flex items-center">
                  {change > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs último mês</span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatusChart = () => {
    const statusData = [
      { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'bg-yellow-500', percentage: 0 },
      { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'bg-green-500', percentage: 0 },
      { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'bg-blue-500', percentage: 0 },
      { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'bg-gray-500', percentage: 0 },
      { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'bg-red-500', percentage: 0 },
    ].filter(item => item.value > 0);

    const total = Math.max(1, orders.length);
    statusData.forEach(item => {
      item.percentage = Math.round((item.value / total) * 100);
    });

    return (
      <div className="card group hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Status dos Pedidos</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Total: {orders.length}</span>
          </div>
        </div>
        <div className="space-y-4">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 group/item hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-xl transition-colors">
              <div className={`w-3 h-3 rounded-full ${item.color} ring-2 ring-offset-2 ${item.color.replace('bg-', 'ring-')} ring-opacity-30`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-semibold">
                    {item.value}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${item.color} group-hover/item:scale-y-125`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const QuickActions = () => (
    <div className="card group hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ações Rápidas</h3>
      <div className="space-y-3">
        <Link
          to="/new-order"
          className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-300 group/action hover:scale-105"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <span className="font-bold text-gray-900 dark:text-white">Novo Pedido</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">Criar novo pedido de serviço</p>
          </div>
        </Link>
        
        <Link
          to="/orders"
          className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-300 group/action hover:scale-105"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <span className="font-bold text-gray-900 dark:text-white">Ver Pedidos</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visualizar todos os pedidos</p>
          </div>
        </Link>
        
        {isAdmin && (
          <Link
            to="/admin/orders"
            className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-300 group/action hover:scale-105"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <span className="font-bold text-gray-900 dark:text-white">Painel Admin</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar todos os pedidos</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );

  const RecentOrders = () => (
    <div className="card group hover:shadow-2xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pedidos Recentes</h3>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field text-sm py-2"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este ano</option>
          </select>
          <Link 
            to="/orders" 
            className="btn-secondary flex items-center space-x-2 text-sm py-2"
          >
            <span>Ver todos</span>
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <div className="space-y-4">
        {orders.slice(0, 6).map((order, index) => (
          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 group/item border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                order.status === 'Concluído' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                order.status === 'Em andamento' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                order.status === 'Em análise' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                'bg-gray-100 dark:bg-gray-600 text-gray-600'
              }`}>
                {order.status === 'Concluído' ? <CheckCircle className="h-5 w-5" /> :
                 order.status === 'Em andamento' ? <Clock className="h-5 w-5" /> :
                 <AlertCircle className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                  {order.category}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                  {order.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 ml-4">
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap block">
                  R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className={`status-badge ${getStatusClass(order.status)} opacity-0 group-hover/item:opacity-100 transition-opacity duration-300`}>
                {order.status}
              </div>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Nenhum pedido encontrado
            </h4>
            <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-md mx-auto">
              Você ainda não criou nenhum pedido. Comece criando seu primeiro pedido para ver as estatísticas aqui.
            </p>
            <Link 
              to="/new-order" 
              className="btn-primary inline-flex items-center space-x-3 px-6 py-3 text-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Primeiro Pedido</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4 absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-45"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Carregando Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-400">Preparando suas estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                Olá, {user?.name}! 👋
              </h1>
              <p className="text-blue-100 text-lg opacity-90 max-w-2xl">
                Bem-vindo de volta ao seu painel de controle. Aqui está um resumo das suas atividades.
              </p>
            </div>
            <Link
              to="/new-order"
              className="mt-6 lg:mt-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-3 group"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Pedido</span>
            </Link>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full"></div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          change={12}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          change={-5}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Taxa de Conversão"
          value={stats.conversionRate.toFixed(1)}
          change={8}
          icon={TrendingUp}
          color="green"
          suffix="%"
        />
        <StatCard
          title="Receita Total"
          value={stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          change={15}
          icon={DollarSign}
          color="purple"
          prefix="R$"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Gráfico de Status */}
        <div className="xl:col-span-2">
          <StatusChart />
        </div>

        {/* Ações Rápidas */}
        <div>
          <QuickActions />
        </div>

        {/* Pedidos Recentes */}
        <div className="xl:col-span-3">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

// Helper function
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