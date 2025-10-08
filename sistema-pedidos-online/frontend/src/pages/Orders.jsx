import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, PlayCircle, Plus } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const statusIcons = {
    'Em análise': <Clock className="h-5 w-5 text-yellow-500" />,
    'Aprovado': <CheckCircle className="h-5 w-5 text-green-500" />,
    'Rejeitado': <XCircle className="h-5 w-5 text-red-500" />,
    'Em andamento': <PlayCircle className="h-5 w-5 text-blue-500" />,
    'Concluído': <Package className="h-5 w-5 text-gray-500" />
  };

  const statusColors = {
    'Em análise': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    'Aprovado': 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    'Rejeitado': 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    'Em andamento': 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    'Concluído': 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300'
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

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

    // Filtro de busca textual
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.description.toLowerCase().includes(searchLower) ||
        order.category.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filtro por categoria
    if (filters.category) {
      filtered = filtered.filter(order => order.category === filters.category);
    }

    // Filtro por orçamento mínimo
    if (filters.minBudget) {
      filtered = filtered.filter(order => 
        parseFloat(order.estimated_budget) >= parseFloat(filters.minBudget)
      );
    }

    // Filtro por orçamento máximo
    if (filters.maxBudget) {
      filtered = filtered.filter(order => 
        parseFloat(order.estimated_budget) <= parseFloat(filters.maxBudget)
      );
    }

    // Filtro por data
    if (filters.startDate) {
      filtered = filtered.filter(order => 
        new Date(order.created_at) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => 
        new Date(order.created_at) <= endDate
      );
    }

    setFilteredOrders(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe todos os seus pedidos</p>
        </div>
        <Link
          to="/new-order"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Pedido</span>
        </Link>
      </div>

      {/* Busca e Filtros */}
      <SearchFilters 
        onFiltersChange={setFilters}
        orders={orders}
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {orders.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'Em análise').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Em Análise</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'Aprovado').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Aprovados</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">
            {filteredOrders.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Filtrados</div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {orders.length === 0 ? 'Nenhum pedido encontrado' : 'Nenhum pedido com esses filtros'}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {orders.length === 0 
              ? 'Você ainda não fez nenhum pedido.' 
              : 'Tente ajustar os filtros de busca.'
            }
          </p>
          {orders.length === 0 && (
            <Link
              to="/new-order"
              className="btn-primary inline-flex items-center space-x-2 mt-4"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Primeiro Pedido</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {statusIcons[order.status]}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{order.category}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{order.description}</p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Orçamento: R$ {order.estimated_budget}</span>
                    <span>Criado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
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

export default Orders;