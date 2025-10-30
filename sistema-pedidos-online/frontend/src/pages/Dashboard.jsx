import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Clock, CheckCircle, DollarSign, 
  FileText, Calendar, Eye, AlertCircle, Users,
  BarChart3, Activity
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
        console.log('🔄 Buscando dados do dashboard...');
        
        if (!user) {
          console.log('❌ Usuário não autenticado');
          return;
        }

        // CORREÇÃO: Remover o teste com /auth/me e ir direto para os pedidos
        const endpoint = isAdmin ? '/orders' : '/orders/my-orders';
        console.log('📡 Buscando em:', endpoint);
        
        const response = await api.get(endpoint);
        console.log('✅ Dados recebidos:', response.data);

        // Processar dados - a API pode retornar de formas diferentes
        let ordersData = [];
        
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        } else if (response.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else {
          console.log('⚠️  Formato de dados inesperado:', response.data);
          ordersData = [];
        }

        console.log('📦 Orders processados:', ordersData);
        setOrders(ordersData);

        // Calcular stats com fallbacks seguros
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
          try {
            // Tentar converter o valor para número
            if (typeof order.estimated_budget === 'number') {
              budgetValue = order.estimated_budget;
            } else if (typeof order.estimated_budget === 'string') {
              budgetValue = parseFloat(order.estimated_budget.replace(/[^\d,]/g, '').replace(',', '.'));
            }
          } catch (e) {
            console.warn('Erro ao converter orçamento:', order.estimated_budget);
          }
          
          return sum + (isNaN(budgetValue) ? 0 : budgetValue);
        }, 0);

        console.log('📊 Estatísticas:', { totalOrders, pendingOrders, completedOrders, totalRevenue });

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
        console.error('❌ Erro no dashboard:', error);
        
        // Mensagem de erro mais específica
        let errorMessage = 'Erro ao carregar dados';
        
        if (error.response?.status === 404) {
          errorMessage = 'Rota não encontrada na API';
        } else if (error.response?.status === 401) {
          errorMessage = 'Não autorizado - faça login novamente';
        } else if (error.response?.status === 400) {
          errorMessage = error.response?.data?.message || 'Dados inválidos';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        
        // Dados de exemplo para desenvolvimento
        console.log('📋 Usando dados de exemplo para desenvolvimento');
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Só buscar dados se o usuário estiver autenticado
    if (user) {
      fetchData();
    } else {
      setLoading(false);
      setError('Usuário não autenticado');
    }
  }, [user, isAdmin]);

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Concluído': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'Em andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Em análise': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        case 'Rejeitado': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      }
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
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
            Dashboard
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
              <div className="text-sm mt-1 opacity-80">
                {error.includes('exemplo') && 'Dados de demonstração carregados.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedOrders}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {stats.totalRevenue}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
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
                    Últimos pedidos do sistema
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
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {order.category}
                        </h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Desempenho
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  R$ {stats.totalOrders > 0 ? (parseFloat(stats.totalRevenue.replace('.', '').replace(',', '.')) / stats.totalOrders).toFixed(2) : '0.00'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Satisfação</span>
                <span className="text-sm font-semibold text-green-600">94%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
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
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Novo Pedido</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Criar um novo pedido</p>
                </div>
              </Link>
              
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
              >
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Ver Pedidos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar todos os pedidos</p>
                </div>
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
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