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
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Componente para Stat Cards responsivos
  const StatCard = ({ title, value, change, icon: Icon, color = 'blue', prefix = '', suffix = '' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 truncate">
              {title}
            </p>
            <div className="flex items-baseline space-x-1 mb-2">
              {prefix && <span className="text-sm sm:text-lg text-gray-500">{prefix}</span>}
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {value}
              </p>
              {suffix && <span className="text-sm sm:text-lg text-gray-500">{suffix}</span>}
            </div>
            {change && (
              <div className="flex items-center">
                {change > 0 ? (
                  <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                )}
                <span className={`text-xs sm:text-sm font-medium ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-gray-500 ml-2 hidden xs:inline">vs mês passado</span>
              </div>
            )}
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ml-3 flex-shrink-0`}>
            <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  // Componente para gráfico de status responsivo
  const StatusChart = () => {
    const statusData = [
      { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'bg-yellow-500' },
      { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'bg-green-500' },
      { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'bg-blue-500' },
      { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'bg-gray-500' },
      { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'bg-red-500' },
    ].filter(item => item.value > 0);

    const total = Math.max(1, orders.length);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Status dos Pedidos
          </h3>
          <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Total: {orders.length}</span>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {statusData.map((item, index) => {
            const percentage = Math.round((item.value / total) * 100);
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${item.color} flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {item.label}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-semibold ml-2">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-1000 ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-8 sm:min-w-12 text-right flex-shrink-0">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Componente para ações rápidas responsivo
  const QuickActions = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Ações Rápidas
      </h3>
      <div className="space-y-3">
        <Link
          to="/new-order"
          className="flex items-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="ml-3 min-w-0">
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white block truncate">
              Novo Pedido
            </span>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              Criar novo pedido
            </p>
          </div>
        </Link>
        
        <Link
          to="/orders"
          className="flex items-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="ml-3 min-w-0">
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white block truncate">
              Ver Pedidos
            </span>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              Todos os pedidos
            </p>
          </div>
        </Link>
        
        {isAdmin && (
          <Link
            to="/admin/orders"
            className="flex items-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl hover:bg-green-100 dark:hover:bg-green-800/30 transition-all duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="ml-3 min-w-0">
              <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white block truncate">
                Painel Admin
              </span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Gerenciar pedidos
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );

  // Componente para pedidos recentes responsivo
  const RecentOrders = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
          Pedidos Recentes
        </h3>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este ano</option>
          </select>
          <Link 
            to="/orders" 
            className="btn-secondary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 hidden xs:inline">Ver todos</span>
          </Link>
        </div>
      </div>
      
      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                order.status === 'Concluído' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                order.status === 'Em andamento' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                order.status === 'Em análise' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                'bg-gray-100 dark:bg-gray-600 text-gray-600'
              }`}>
                {order.status === 'Concluído' ? <CheckCircle className="h-4 w-4" /> :
                 order.status === 'Em andamento' ? <Clock className="h-4 w-4" /> :
                 <AlertCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {order.category}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                  {order.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            <div className={`status-badge text-xs ml-2 hidden sm:inline-block ${getStatusClass(order.status)}`}>
              {order.status}
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Nenhum pedido encontrado
            </h4>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Comece criando seu primeiro pedido
            </p>
            <Link 
              to="/new-order" 
              className="btn-primary inline-flex items-center space-x-2 text-sm py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Pedido</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  // Loading state responsivo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Carregando</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Preparando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Mobile */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bem-vindo, {user?.name}</p>
            </div>
          </div>
          <Link
            to="/new-order"
            className="btn-primary text-sm py-2 px-3"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Desktop */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Olá, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Bem-vindo de volta ao seu painel
              </p>
            </div>
            <Link
              to="/new-order"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Novo Pedido</span>
            </Link>
          </div>
        </div>

        {/* Grid de Métricas - Layout responsivo */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total de Pedidos"
            value={stats.totalOrders}
            change={12}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Pendentes"
            value={stats.pendingOrders}
            change={-5}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Conversão"
            value={stats.conversionRate.toFixed(1)}
            change={8}
            icon={TrendingUp}
            color="green"
            suffix="%"
          />
          <StatCard
            title="Receita Total"
            value={stats.totalRevenue > 1000 
              ? `${(stats.totalRevenue / 1000).toFixed(1)}k`
              : stats.totalRevenue.toFixed(0)
            }
            change={15}
            icon={DollarSign}
            color="purple"
            prefix="R$"
          />
        </div>

        {/* Layout Principal Responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Coluna 1 - Gráfico de Status */}
          <div className="lg:col-span-2">
            <StatusChart />
          </div>

          {/* Coluna 2 - Ações Rápidas */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          {/* Coluna 3 - Pedidos Recentes (full width) */}
          <div className="lg:col-span-3">
            <RecentOrders />
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-2">
              <Link to="/" className="nav-item-active" onClick={() => setMobileMenuOpen(false)}>
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/orders" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Package className="h-5 w-5" />
                <span>Pedidos</span>
              </Link>
              <Link to="/new-order" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Plus className="h-5 w-5" />
                <span>Novo Pedido</span>
              </Link>
              {isAdmin && (
                <Link to="/admin/orders" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <Users className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
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