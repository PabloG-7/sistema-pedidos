import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, PlayCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusIcons = {
    'Em análise': <Clock className="h-5 w-5 text-yellow-500" />,
    'Aprovado': <CheckCircle className="h-5 w-5 text-green-500" />,
    'Rejeitado': <XCircle className="h-5 w-5 text-red-500" />,
    'Em andamento': <PlayCircle className="h-5 w-5 text-blue-500" />,
    'Concluído': <Package className="h-5 w-5 text-gray-500" />
  };

  const statusColors = {
    'Em análise': 'bg-yellow-100 text-yellow-800',
    'Aprovado': 'bg-green-100 text-green-800',
    'Rejeitado': 'bg-red-100 text-red-800',
    'Em andamento': 'bg-blue-100 text-blue-800',
    'Concluído': 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
        <p className="text-gray-600">Acompanhe todos os seus pedidos</p>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
          <p className="mt-2 text-gray-500">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {statusIcons[order.status]}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{order.category}</h3>
                  <p className="mt-1 text-gray-600">{order.description}</p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
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