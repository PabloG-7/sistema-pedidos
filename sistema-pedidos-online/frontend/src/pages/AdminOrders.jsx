import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, Filter, Settings, Users, Eye, Edit3 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    'Todos',
    'Em análise',
    'Aprovado',
    'Rejeitado',
    'Em andamento',
    'Concluído'
  ];

  const statusColors = {
    'Em análise': 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border-amber-200/50',
    'Aprovado': 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/50',
    'Rejeitado': 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-700 dark:text-rose-300 border-rose-200/50',
    'Em andamento': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-300 border-blue-200/50',
    'Concluído': 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-700 dark:text-violet-300 border-violet-200/50'
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
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
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="spinner-premium w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium animate-pulse">
            Carregando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Painel Administrativo
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                Gerencie todos os pedidos do sistema
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-green-500/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-xl border border-green-200/50 backdrop-blur-sm">
            <span className="font-bold">{orders.length}</span> pedidos
          </div>
        </div>
      </div>

      {/* Filtros Premium */}
      <div className="card bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-64 bg-white/80 backdrop-blur-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 backdrop-blur-sm px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5">
            Total: <span className="text-indigo-600 dark:text-indigo-400">{orders.length}</span> pedido(s)
          </div>
        </div>
      </div>

      {/* Lista de Pedidos Premium */}
      {orders.length === 0 ? (
        <div className="card text-center py-20 bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-lg">
            Não há pedidos com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="card group hover-3d bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border backdrop-blur-sm ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {order.user_name}
                  </span>
                </div>
                
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="input-field w-48 bg-white/80 backdrop-blur-sm text-sm"
                >
                  <option value="Em análise">Em análise</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Rejeitado">Rejeitado</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {order.category}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {order.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-black/5 dark:bg-white/5 rounded-2xl backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Cliente</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{order.user_name}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Email</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{order.user_email}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Orçamento</div>
                    <div className="text-2xl font-bold text-green-600">R$ {order.estimated_budget}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span><strong>Criado em:</strong> {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Edit3 className="h-4 w-4 text-green-500" />
                    <span><strong>Atualizado em:</strong> {new Date(order.updated_at).toLocaleDateString('pt-BR')}</span>
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