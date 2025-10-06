import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, PlusCircle, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {user?.name}!
        </h1>
        <p className="text-gray-600">Bem-vindo ao Sistema de Pedidos Online</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Novo Pedido */}
        <Link
          to="/new-order"
          className="card hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlusCircle className="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Novo Pedido</h3>
              <p className="text-gray-500">Solicite um novo orçamento</p>
            </div>
          </div>
        </Link>

        {/* Card Meus Pedidos */}
        <Link
          to="/orders"
          className="card hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Meus Pedidos</h3>
              <p className="text-gray-500">Acompanhe seus pedidos</p>
            </div>
          </div>
        </Link>

        {/* Card Admin */}
        {isAdmin && (
          <Link
            to="/admin/orders"
            className="card hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Painel Admin</h3>
                <p className="text-gray-500">Gerencie todos os pedidos</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Status Guide */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Status dos Pedidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { status: 'Em análise', color: 'bg-yellow-100 text-yellow-800' },
            { status: 'Aprovado', color: 'bg-green-100 text-green-800' },
            { status: 'Rejeitado', color: 'bg-red-100 text-red-800' },
            { status: 'Em andamento', color: 'bg-blue-100 text-blue-800' },
            { status: 'Concluído', color: 'bg-gray-100 text-gray-800' }
          ].map((item) => (
            <div key={item.status} className="text-center p-4 rounded-lg">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;