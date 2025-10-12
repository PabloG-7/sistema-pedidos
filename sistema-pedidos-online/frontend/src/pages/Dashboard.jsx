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
  CheckCircle2
} from 'lucide-react';

// Componente de gráfico clean
const StatusChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="card-elegant">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          Total: {total}
        </div>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const statusClass = getStatusClass(item.label);
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`status-badge ${statusClass}`}>
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {item.value}
                </span>
              </div>
              <div className="flex items-center space-x-3 w-32">
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getStatusColor(item.label)
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 w-12 text-right">
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

// Componente de métrica clean
const MetricCard = ({ title, value, icon: Icon, change, color = 'gray' }) => {
  const colorConfig = {
    gray: {
      bg: 'bg-gray-100',
      icon: 'text-gray-600',
      text: 'text-gray-600'
    },
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    emerald: {
      bg: 'bg-emerald-100',
      icon: 'text-emerald-600',
      text: 'text-emerald-600'
    },
    amber: {
      bg: 'bg-amber-100',
      icon: 'text-amber-600',
      text: 'text-amber-600'
    }
  };

  const config = colorConfig[color];

  return (
    <div className="metric-card hover-lift">
      <div className={`p-3 ${config.bg} rounded-xl inline-block mb-4`}>
        <Icon className={`h-6 w-6 ${config.icon}`} />
      </div>
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      {change && (
        <div className={`inline-flex items-center space-x-1 text-sm font-medium ${config.text}`}>
          <TrendingUp className={`h-4 w-4 ${change > 0 ? '' : 'rotate-180'}`} />
          <span>{Math.abs(change)}% vs último mês</span>
        </div>
      )}
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
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner"></div>
          <p className="text-gray-500">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-2">
            Olá, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-lg text-gray-600">
            Bem-vindo ao painel de controle
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-500">Hoje é</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          <div className="p-3 bg-gray-100 rounded-xl">
            <Calendar className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          color="gray"
          change={5}
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="amber"
          change={-2}
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          icon={CheckCircle2}
          color="emerald"
          change={8}
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${stats.averageBudget}`}
          icon={BarChart3}
          color="blue"
          change={12}
        />
      </div>

      {/* Ações Rápidas e Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Ações Rápidas */}
        <div className="xl:col-span-1 space-y-6">
          <div className="card-elegant">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Link
                to="/new-order"
                className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover-lift group"
              >
                <div className="p-2 bg-gray-900 rounded-lg">
                  <PlusCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Novo Pedido</h4>
                  <p className="text-sm text-gray-600">Solicitar orçamento</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>

              <Link
                to="/orders"
                className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover-lift group"
              >
                <div className="p-2 bg-gray-900 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Meus Pedidos</h4>
                  <p className="text-sm text-gray-600">Acompanhar pedidos</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover-lift group"
                >
                  <div className="p-2 bg-gray-900 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Painel Admin</h4>
                    <p className="text-sm text-gray-600">Gerenciar pedidos</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="xl:col-span-2">
          <StatusChart
            data={statusData}
            title="Distribuição por Status"
          />
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="card-elegant">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Pedidos Recentes</h2>
          <Link 
            to="/orders" 
            className="btn-ghost flex items-center space-x-2"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${
                  order.status === 'Concluído' ? 'bg-emerald-100 text-emerald-600' :
                  order.status === 'Em andamento' ? 'bg-blue-100 text-blue-600' :
                  order.status === 'Em análise' ? 'bg-amber-100 text-amber-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{order.category}</h4>
                  <p className="text-sm text-gray-600 truncate mt-1">{order.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                  R$ {parseFloat(order.estimated_budget).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Nenhum pedido encontrado</p>
              <Link 
                to="/new-order" 
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Criar primeiro pedido</span>
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

const getStatusColor = (status) => {
  const colorMap = {
    'Em análise': '#f59e0b',
    'Aprovado': '#10b981',
    'Rejeitado': '#ef4444',
    'Em andamento': '#3b82f6',
    'Concluído': '#6b7280'
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;