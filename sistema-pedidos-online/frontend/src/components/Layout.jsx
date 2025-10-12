import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  Package,
  PlusCircle,
  BarChart3,
  LogOut,
  User,
  Settings,
  Search
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Pedidos', href: '/orders', icon: Package },
    { name: 'Novo Pedido', href: '/new-order', icon: PlusCircle },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin/orders', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 flex z-50 lg:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
          className="fixed inset-0 bg-black/20" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-gray-100">
          <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto scrollbar-minimal">
            <div className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-900 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-900">
                    OrderSystem
                  </span>
                  <p className="text-xs text-gray-500">Gestão de Pedidos</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="mt-8 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-100">
          <div className="flex-1 flex flex-col pt-10 pb-4 overflow-y-auto scrollbar-minimal">
            <div className="flex items-center space-x-3 px-8 mb-10">
              <div className="p-2 bg-gray-900 rounded-xl">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-semibold text-gray-900">
                  OrderSystem
                </span>
                <p className="text-sm text-gray-500 mt-1">Sistema de Pedidos</p>
              </div>
            </div>
            
            <nav className="mt-8 flex-1 px-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item ${isActive ? 'nav-item-active' : ''} hover-lift`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-80 flex flex-col flex-1">
        {/* Header mobile */}
        <div className="sticky top-0 z-40 lg:hidden bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-gray-900" />
                <span className="text-lg font-semibold text-gray-900">OrderSystem</span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="section-padding">
            <div className="container-elegant">
              <div className="animate-fade-in-up">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;