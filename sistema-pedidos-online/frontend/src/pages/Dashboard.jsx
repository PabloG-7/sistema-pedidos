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
        
        if (!user) {
          return;
        }

        const endpoint = isAdmin ? '/orders' : '/orders/my-orders';
        const response = await api.get(endpoint);

        let ordersData = [];
        
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        } else if (response.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        }

        setOrders(ordersData);

        // Calcular stats
        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(order => 
          order && ['Em análise', 'Em andamento'].includes(order.status)
        ).length;
        const completedOrders = ordersData.filter(order => 
          order && order.status === 'Concluído'
        ).length;

        const totalRevenue = ordersData.reduce((sum, order) => {
          if (!order || !order.estimated_budget) return sum;
          
          let budgetValue = 0;
          if (typeof order.estimated_budget === 'number') {
            budgetValue = order.estimated_budget;
          } else if (typeof order.estimated_budget === 'string') {
            budgetValue = parseFloat(order.estimated_budget.replace(/[^\d,]/g, '').replace(',', '.'));
          }
          
          return sum + (isNaN(budgetValue) ? 0 : budgetValue);
        }, 0);

        setStats({
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue: totalRevenue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        });

      } catch (error) {
        console.error('Erro no dashboard:', error);
        
        let errorMessage = 'Erro ao carregar dados';
        
        if (error.response?.status === 404) {
          errorMessage = 'Rota não encontrada na API';
        } else if (error.response?.status === 401) {
          errorMessage = 'Não autorizado - faça login novamente';
        } else if (error.response?.status === 400) {
          errorMessage = error.response?.data?.message || 'Dados inválidos';
        }
        
        setError(errorMessage);
        
        // Dados de exemplo
        setStats({
          totalOrders: 8,
          pendingOrders: 3,
          completedOrders: 4,
          totalRevenue: '1.850,00'
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

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Calcular métricas avançadas
  const completionRate = stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;
  const revenueNumber = parseFloat(stats.totalRevenue.replace(/\./g, '').replace(',', '.')) || 0;
  const averageOrderValue = stats.totalOrders > 0 ? (revenueNumber / stats.totalOrders).toFixed(2) : '0.00';
  const urgentOrders = orders.filter(order => order && order.status === 'Em análise').length;
  
  // Novas métricas úteis
  const efficiencyScore = Math.min(100, completionRate + (stats.completedOrders * 5));
  const growthRate = stats.totalOrders > 5 ? 12 : 25; // Simulado
  const customerSatisfaction = 92; // Simulado
  const responseTime = '2.3'; // Dias médios - Simulado

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Concluído': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        case 'Em andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Em análise': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        case 'Rejeitado': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue', trend = 'up' }) => {
    const colorConfig = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400' },
      green: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400' },
      orange: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400' }
    };

    const config = colorConfig[color];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <Icon className={`h-5 w-5 ${config.icon}`} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {change}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Visão Geral
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo de volta, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
            <FileText className="h-4 w-4" />
            <span>Relatório</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <div>
              <span className="font-medium">Aviso: </span>
              <span>{error}</span>
              {error.includes('exemplo') && (
                <div className="text-sm mt-1 opacity-80">Dados de demonstração carregados.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          value={`R$ ${stats.totalRevenue}`}
          change={15}
          icon={DollarSign}
          color="purple"
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos Recentes */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pedidos Recentes
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acompanhe os últimos pedidos
                  </p>
                </div>
              </div>
              <Link 
                to="/orders" 
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Eye className="h-4 w-4" />
                <span>Ver Todos</span>
              </Link>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div 
                  key={order.id} 
                  className="group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {order.category}
                        </h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-semibold">R$ {order.estimated_budget}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Comece criando seu primeiro pedido
                  </p>
                  <Link 
                    to="/new-order" 
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Criar Primeiro Pedido</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Métricas Avançadas */}
        <div className="space-y-6">
          {/* Score de Performance */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Performance</h3>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold mb-2">{efficiencyScore}</div>
              <div className="text-blue-100 text-sm">Pontuação Geral</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{completionRate}%</div>
                <div className="text-blue-100 text-xs">Taxa Conclusão</div>
              </div>
              <div>
                <div className="text-lg font-bold">{growthRate}%</div>
                <div className="text-blue-100 text-xs">Crescimento</div>
              </div>
            </div>
          </div>

          {/* Métricas de Qualidade */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Qualidade
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800 rounded">
                    <Target className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Satisfação</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">{customerSatisfaction}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded">
                    <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempo Resposta</span>
                </div>
                <span className="text-sm font-bold text-blue-600">{responseTime}d</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-800 rounded">
                    <DollarSign className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ticket Médio</span>
                </div>
                <span className="text-sm font-bold text-purple-600">R$ {averageOrderValue}</span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Ações Rápidas
              </h3>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/new-order"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg group-hover:scale-110 transition-transform">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Novo Pedido</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Criar um novo pedido</p>
                </div>
              </Link>
              
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 group"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg group-hover:scale-110 transition-transform">
                  <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Ver Pedidos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar todos os pedidos</p>
                </div>
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Painel Admin</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar sistema</p>
                  </div>
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