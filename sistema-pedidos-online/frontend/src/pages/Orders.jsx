import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Package, Plus, Search, Filter, Download, 
  Calendar, DollarSign, ArrowUpDown 
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.description?.toLowerCase().includes(searchLower) ||
        order.category?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter && statusFilter !== 'Todos') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meus Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie e acompanhe todos os seus pedidos
          </p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center gap-2 mt-4 lg:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-48"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {orders.length === 0 
              ? 'Você ainda não fez nenhum pedido.' 
              : 'Tente ajustar os filtros de busca.'
            }
          </p>
          {orders.length === 0 && (
            <Link
              to="/new-order"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Primeiro Pedido</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {order.category}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {order.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        R$ {order.estimated_budget}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </span>
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

export default Orders;