import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
  Package, Plus, Clock, CheckCircle, DollarSign,
  FileText, Calendar, Eye, AlertCircle, Users,
  BarChart3, Activity, TrendingUp, Target, Zap,
  ArrowUpRight, ArrowDownRight, Star
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!user) return;

        const endpoint = isAdmin ? '/orders' : '/orders/my-orders';
        const response = await api.get(endpoint);

        let ordersData = [];
        if (Array.isArray(response.data)) ordersData = response.data;
        else if (response.data?.orders) ordersData = response.data.orders;
        else if (response.data?.data) ordersData = response.data.data;

        setOrders(ordersData);

        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(o =>
          ['Em análise', 'Em andamento'].includes(o.status)
        ).length;
        const completedOrders = ordersData.filter(o => o.status === 'Concluído').length;

        const totalRevenue = ordersData.reduce((sum, o) => {
          let v = 0;
          if (typeof o.estimated_budget === 'number') v = o.estimated_budget;
          else if (typeof o.estimated_budget === 'string')
            v = parseFloat(o.estimated_budget.replace(/[^\d,]/g, '').replace(',', '.'));
          return sum + (isNaN(v) ? 0 : v);
        }, 0);

        setStats({ totalOrders, pendingOrders, completedOrders, totalRevenue });
      } catch (err) {
        console.error('Erro no dashboard:', err);
        setError('Erro ao carregar dados, exibindo exemplo.');
        setStats({
          totalOrders: 8,
          pendingOrders: 3,
          completedOrders: 4,
          totalRevenue: 1850.0
        });
        setOrders([
          {
            id: '1',
            category: 'Desenvolvimento Web',
            description: 'Site institucional responsivo',
            status: 'Em andamento',
            estimated_budget: '1200.00',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            category: 'Design Gráfico',
            description: 'Logo e identidade visual',
            status: 'Concluído',
            estimated_budget: '650.00',
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            category: 'Marketing Digital',
            description: 'Campanha nas redes sociais',
            status: 'Em análise',
            estimated_budget: '800.00',
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
    else setLoading(false);
  }, [user, isAdmin]);

  const formatRevenue = (v) =>
    typeof v === 'number'
      ? v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
      : '0,00';

  const completionRate =
    stats.totalOrders > 0
      ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
      : 0;

  const averageOrderValue =
    stats.totalOrders > 0
      ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
      : '0.00';

  const efficiencyScore = Math.min(100, completionRate + stats.completedOrders * 5);
  const growthRate = stats.totalOrders > 5 ? 12 : 25;
  const customerSatisfaction = 92;
  const responseTime = '2.3';

  const StatusBadge = ({ status }) => {
    const colors = {
      Concluído: 'bg-emerald-100 text-emerald-800',
      'Em andamento': 'bg-blue-100 text-blue-800',
      'Em análise': 'bg-amber-100 text-amber-800',
      Rejeitado: 'bg-red-100 text-red-800'
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          colors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-emerald-600 bg-emerald-50',
      orange: 'text-amber-600 bg-amber-50',
      purple: 'text-purple-600 bg-purple-50'
    };
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-3">
          <div className={`p-2 rounded-lg ${colorMap[color]}`}>
            <Icon className={`h-5 w-5`} />
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {change}%
            </div>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          Carregando dashboard...
        </div>
      </div>
    );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Visão Geral
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo,{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {user?.name}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm px-3 py-2">
            <FileText className="h-4 w-4" /> Relatório
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
          >
            <Plus className="h-4 w-4" /> Novo Pedido
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="inline h-4 w-4 mr-1" /> {error}
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          change={12}
          icon={Package}
          color="blue"
          trend="up"
        />
        <MetricCard
          title="Em Andamento"
          value={stats.pendingOrders}
          change={-5}
          icon={Clock}
          color="orange"
          trend="down"
        />
        <MetricCard
          title="Concluídos"
          value={stats.completedOrders}
          change={8}
          icon={CheckCircle}
          color="green"
          trend="up"
        />
        <MetricCard
          title="Receita Total"
          value={`R$ ${formatRevenue(stats.totalRevenue)}`}
          change={15}
          icon={DollarSign}
          color="purple"
          trend="up"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pedidos Recentes */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Pedidos Recentes
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Últimas atividades e status
                  </p>
                </div>
              </div>
              <Link
                to="/orders"
                className="btn-secondary flex items-center gap-2 text-sm self-start sm:self-auto"
              >
                <Eye className="h-4 w-4" /> Ver Todos
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:shadow transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-blue-50 transition">
                      <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {order.category}
                        </h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {order.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> R$ {order.estimated_budget}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Package className="h-8 w-8 mx-auto mb-3 opacity-60" />
                  Nenhum pedido encontrado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-bold text-lg">Performance</h3>
            </div>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">{efficiencyScore}</p>
              <p className="text-blue-100 text-sm">Pontuação Geral</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">{completionRate}%</p>
                <p className="text-blue-100 text-xs">Conclusão</p>
              </div>
              <div>
                <p className="text-lg font-bold">{growthRate}%</p>
                <p className="text-blue-100 text-xs">Crescimento</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-gray-900 dark:text-white">Qualidade</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <span>Satisfação</span>
                <span className="font-semibold text-emerald-600">{customerSatisfaction}%</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <span>Tempo Resposta</span>
                <span className="font-semibold text-blue-600">{responseTime}d</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <span>Ticket Médio</span>
                <span className="font-semibold text-purple-600">R$ {averageOrderValue}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-gray-900 dark:text-white">Ações Rápidas</h3>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/new-order"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              >
                <Plus className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-800 dark:text-white">Novo Pedido</span>
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
              >
                <Package className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-gray-800 dark:text-white">Ver Pedidos</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
                >
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-800 dark:text-white">
                    Painel Admin
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
