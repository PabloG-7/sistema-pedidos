// pages/AdminOrders.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, Filter, Users, Settings, Eye } from 'lucide-react';

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
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner-premium w-16 h-16 mx-auto mb-4"></div>
          <p className="text-white/60">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-sm"></div>
          <h1 className="text-4xl font-bold gradient-text relative">
            Painel Administrativo
          </h1>
          <p className="text-white/60 mt-3 text-lg">
            Gerencie todos os pedidos do sistema
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
          <Settings className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Filtros Premium */}
      <div className="group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
        <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field w-64"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-white/60 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              Total: <span className="font-semibold text-white">{orders.length}</span> pedido(s)
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos Premium */}
      {orders.length === 0 ? (
        <div className="group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
          <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900 text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Nenhum pedido encontrado</h3>
            <p className="text-white/60">Não há pedidos com os filtros selecionados.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
              <div className="relative card border-0 bg-gradient-to-br from-slate-800 to-slate-900 hover:scale-[1.02] transition-all duration-500">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`status-badge ${getStatusClass(order.status)} glow`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="input-field w-48 text-sm"
                      >
                        <option value="Em análise">Em análise</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Rejeitado">Rejeitado</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{order.category}</h3>
                    <p className="text-white/70 mb-6 leading-relaxed">{order.description}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
                      <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <Users className="h-4 w-4 text-indigo-400" />
                        <div>
                          <div className="font-semibold text-white">Cliente</div>
                          <div className="text-white/60">{order.user_name}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <Eye className="h-4 w-4 text-green-400" />
                        <div>
                          <div className="font-semibold text-white">Email</div>
                          <div className="text-white/60">{order.user_email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <Package className="h-4 w-4 text-amber-400" />
                        <div>
                          <div className="font-semibold text-white">Orçamento</div>
                          <div className="text-green-400 font-semibold">R$ {order.estimated_budget}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6 text-xs text-white/40">
                      <span>Criado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                      <span>Atualizado em: {new Date(order.updated_at).toLocaleDateString('pt-BR')}</span>
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

// Helper function para status
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

export default AdminOrders;