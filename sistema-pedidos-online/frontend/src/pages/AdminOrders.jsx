// pages/AdminOrders.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, Filter, Users, Settings, Eye, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const statusOptions = [
    'Todos',
    'Em análise',
    'Aprovado',
    'Rejeitado',
    'Em andamento',
    'Concluído'
  ];

  const statusColors = {
    'Em análise': 'status-em-analise',
    'Aprovado': 'status-aprovado',
    'Rejeitado': 'status-rejeitado',
    'Em andamento': 'status-andamento',
    'Concluído': 'status-concluido'
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter && statusFilter !== 'Todos' ? { status: statusFilter } : {};
      const response = await api.get('/orders', { params });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
              Gerencie todos os pedidos do sistema
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-6 lg:mt-0">
          <button
            onClick={fetchOrders}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-64 text-lg"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">
            Total: <span className="text-indigo-600 dark:text-indigo-400">{orders.length}</span> pedido(s)
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {orders.length === 0 ? (
        <div className="card text-center py-16">
          <Package className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-6" />
          <h3 className="text-2xl font-bold text-slate-500 dark:text-slate-400 mb-4">
            Nenhum pedido encontrado
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-lg">
            Não há pedidos com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card group hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`status-badge ${statusColors[order.status]} text-sm`}>
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingOrder === order.id}
                      className="input-field w-48 text-sm disabled:opacity-50"
                    >
                      <option value="Em análise">Em análise</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Rejeitado">Rejeitado</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {order.category}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                    {order.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Cliente</div>
                        <div className="text-slate-600 dark:text-slate-400">{order.user_name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Email</div>
                        <div className="text-slate-600 dark:text-slate-400">{order.user_email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                      <Package className="h-5 w-5 text-emerald-500" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Orçamento</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                          R$ {order.estimated_budget}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                      <RefreshCw className="h-5 w-5 text-violet-500" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Atualizado em</div>
                        <div className="text-slate-600 dark:text-slate-400">
                          {new Date(order.updated_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;