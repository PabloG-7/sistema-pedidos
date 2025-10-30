import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Package, Plus, Clock, CheckCircle, DollarSign, 
  FileText, Calendar, Eye, AlertCircle 
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

        // TESTE: Primeiro vamos tentar uma requisição simples
        const testResponse = await api.get('/auth/me').catch(err => {
          console.log('❌ Erro na requisição de teste:', err.response?.data);
          throw err;
        });
        
        console.log('✅ Teste de autenticação OK:', testResponse.data);

        // Agora buscar os pedidos
        const endpoint = isAdmin ? '/orders' : '/orders/my-orders';
        console.log('📡 Buscando em:', endpoint);
        
        const response = await api.get(endpoint);
        console.log('✅ Dados recebidos:', response.data);

        // Processar dados
        const ordersData = Array.isArray(response.data) ? response.data : 
                          response.data?.orders || response.data?.data || [];

        setOrders(ordersData);

        // Calcular stats
        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(order => 
          ['Em análise', 'Em andamento'].includes(order?.status)
        ).length;
        const completedOrders = ordersData.filter(order => 
          order?.status === 'Concluído'
        ).length;

        const totalRevenue = ordersData.reduce((sum, order) => {
          const budget = order?.estimated_budget ? Number(order.estimated_budget) : 0;
          return sum + (isNaN(budget) ? 0 : budget);
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
        console.error('❌ Erro no dashboard:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Erro ao carregar dados';
        setError(errorMessage);
        
        // Dados de exemplo para desenvolvimento
        setStats({
          totalOrders: 12,
          pendingOrders: 3,
          completedOrders: 7,
          totalRevenue: '2.450,00'
        });
        
        setOrders([
          {
            id: '1',
            category: 'Desenvolvimento Web',
            description: 'Site institucional',
            status: 'Em andamento',
            estimated_budget: '1500.00',
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            category: 'Design Gráfico',
            description: 'Logo e identidade visual',
            status: 'Concluído',
            estimated_budget: '800.00',
            created_at: new Date().toISOString()
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
            Bem-vindo, {user?.name}
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingOrders}
              </p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedOrders}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receita</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {stats.totalRevenue}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Pedidos Recentes
          </h2>
          <Link to="/orders" className="text-blue-600 hover:text-blue-700 text-sm">
            Ver todos
          </Link>
        </div>

        <div className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  R$ {order.estimated_budget}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de Debug - Adicione temporariamente no Dashboard
const ApiDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const testApi = async () => {
      const info = {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        apiUrl: import.meta.env.VITE_API_URL,
        timestamp: new Date().toISOString()
      };

      try {
        const test = await api.get('/auth/me');
        info.authTest = '✅ OK';
        info.userData = test.data;
      } catch (error) {
        info.authTest = '❌ Falhou';
        info.authError = error.response?.data || error.message;
      }

      try {
        const orders = await api.get('/orders/my-orders');
        info.ordersTest = '✅ OK';
        info.ordersData = orders.data;
      } catch (error) {
        info.ordersTest = '❌ Falhou';
        info.ordersError = error.response?.data || error.message;
      }

      setDebugInfo(info);
    };

    testApi();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};

// Adicione no return do Dashboard, antes do fechamento:
{/* <ApiDebug /> */}

export default Dashboard;