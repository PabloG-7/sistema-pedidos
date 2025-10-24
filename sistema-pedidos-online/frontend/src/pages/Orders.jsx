import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, PlayCircle, Plus, Search, Filter, Download } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import OrderFiles from '../components/OrderFiles';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [exporting, setExporting] = useState(false);

  const statusIcons = {
    'Em análise': <Clock className="h-5 w-5 text-yellow-500" />,
    'Aprovado': <CheckCircle className="h-5 w-5 text-green-500" />,
    'Rejeitado': <XCircle className="h-5 w-5 text-red-500" />,
    'Em andamento': <PlayCircle className="h-5 w-5 text-blue-500" />,
    'Concluído': <Package className="h-5 w-5 text-gray-500" />
  };

  const statusColors = {
    'Em análise': 'status-em-analise',
    'Aprovado': 'status-aprovado',
    'Rejeitado': 'status-rejeitado',
    'Em andamento': 'status-andamento',
    'Concluído': 'status-concluido'
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

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.description?.toLowerCase().includes(searchLower) ||
        order.category?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(order => order.category === filters.category);
    }

    if (filters.minBudget) {
      filtered = filtered.filter(order => 
        parseFloat(order.estimated_budget) >= parseFloat(filters.minBudget)
      );
    }

    if (filters.maxBudget) {
      filtered = filtered.filter(order => 
        parseFloat(order.estimated_budget) <= parseFloat(filters.maxBudget)
      );
    }

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

  const exportToCSV = async () => {
    setExporting(true);
    try {
      const csvContent = [
        ['Categoria', 'Descrição', 'Status', 'Orçamento', 'Data Criação'],
        ...filteredOrders.map(order => [
          order.category,
          order.description,
          order.status,
          `R$ ${order.estimated_budget}`,
          new Date(order.created_at).toLocaleDateString('pt-BR')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pedidos-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Gerencie e acompanhe todos os seus pedidos
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-6 lg:mt-0">
          <button
            onClick={exportToCSV}
            disabled={exporting || filteredOrders.length === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{exporting ? 'Exportando...' : 'Exportar CSV'}</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Busca e Filtros */}
      <SearchFilters 
        onFiltersChange={setFilters}
        orders={orders}
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="metric-card text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {orders.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total</div>
        </div>
        <div className="metric-card text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'Em análise').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Em Análise</div>
        </div>
        <div className="metric-card text-center">
          <div className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'Aprovado').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Aprovados</div>
        </div>
        <div className="metric-card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {filteredOrders.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Filtrados</div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center py-16">
          <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {orders.length === 0 ? 'Nenhum pedido encontrado' : 'Nenhum pedido com esses filtros'}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-6">
            {orders.length === 0 
              ? 'Você ainda não fez nenhum pedido.' 
              : 'Tente ajustar os filtros de busca.'
            }
          </p>
          {orders.length === 0 && (
            <Link
              to="/new-order"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Primeiro Pedido</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {statusIcons[order.status]}
                    <span className={`status-badge ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {order.category}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {order.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Orçamento: <span className="text-green-600">R$ {order.estimated_budget}</span>
                    </span>
                    <span>•</span>
                    <span>Criado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span>{new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
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

// No mapa dos pedidos:
{orders.map((order) => (
  <div key={order.id} className="card hover:shadow-lg transition-all duration-300">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {order.category}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {order.description}
            </p>
            
            {/* MOSTRAR ARQUIVOS COMPLETOS AQUI */}
            {order.files && order.files.length > 0 && (
              <div className="mt-3">
                <OrderFiles files={order.files} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 lg:gap-2">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR')}
        </span>
        <span className={`status-badge ${getStatusClass(order.status)}`}>
          {order.status}
        </span>
      </div>
    </div>
  </div>
))}

export default Orders;