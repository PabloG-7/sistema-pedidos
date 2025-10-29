import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Package, Clock, CheckCircle, XCircle, PlayCircle, 
  Plus, Search, Filter, Download, BarChart3, Sparkles 
} from 'lucide-react';
import SearchFilters from '../components/SearchFilters';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [exporting, setExporting] = useState(false);

  const statusIcons = {
    'Em análise': <Clock className="h-6 w-6 text-amber-500 animate-pulse" />,
    'Aprovado': <CheckCircle className="h-6 w-6 text-emerald-500 animate-bounce" />,
    'Rejeitado': <XCircle className="h-6 w-6 text-rose-500 animate-pulse" />,
    'Em andamento': <PlayCircle className="h-6 w-6 text-blue-500 animate-pulse" />,
    'Concluído': <Package className="h-6 w-6 text-violet-500" />
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Meus Pedidos</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Gerencie e acompanhe todos os seus pedidos
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-6 lg:mt-0">
          <button
            onClick={exportToCSV}
            disabled={exporting || filteredOrders.length === 0}
            className="btn-secondary flex items-center space-x-3 px-6 py-3 rounded-xl disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            <span className="font-semibold">{exporting ? 'Exportando...' : 'Exportar CSV'}</span>
          </button>
          <Link
            to="/new-order"
            className="btn-primary flex items-center space-x-3 px-6 py-3 rounded-xl"
          >
            <Plus className="h-5 w-5" />
            <span className="font-bold">Novo Pedido</span>
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Busca e Filtros */}
      <SearchFilters 
        onFiltersChange={setFilters}
        orders={orders}
      />

      {/* Estatísticas Premium */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total', value: orders.length, color: 'from-gray-500 to-gray-600' },
          { label: 'Em Análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'from-amber-500 to-orange-500' },
          { label: 'Aprovados', value: orders.filter(o => o.status === 'Aprovado').length, color: 'from-emerald-500 to-green-500' },
          { label: 'Filtrados', value: filteredOrders.length, color: 'from-blue-500 to-cyan-500' },
        ].map((stat, index) => (
          <div key={index} className="metric-card text-center group hover-3d">
            <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-400 mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Lista de Pedidos Premium */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center py-20 bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
            {orders.length === 0 ? 'Nenhum pedido encontrado' : 'Nenhum pedido com esses filtros'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-lg mb-8">
            {orders.length === 0 
              ? 'Você ainda não fez nenhum pedido.' 
              : 'Tente ajustar os filtros de busca.'
            }
          </p>
          {orders.length === 0 && (
            <Link
              to="/new-order"
              className="btn-primary inline-flex items-center space-x-3 px-8 py-4 rounded-2xl"
            >
              <Plus className="h-5 w-5" />
              <span className="font-bold">Criar Primeiro Pedido</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="card group hover-3d bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="transform group-hover:scale-110 transition-transform duration-500">
                      {statusIcons[order.status]}
                    </div>
                    <span className={`status-badge ${statusColors[order.status]} group-hover:scale-105 transition-transform duration-300`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {order.category}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                    {order.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-lg text-gray-500 dark:text-gray-400">
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Orçamento: <span className="text-2xl text-green-600">R$ {order.estimated_budget}</span>
                    </span>
                    <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <span>Criado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
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

export default Orders;