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
  Bell,
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
    { name: 'Meus Pedidos', href: '/orders', icon: Package },
    { name: 'Novo Pedido', href: '/new-order', icon: PlusCircle },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin - Pedidos', href: '/admin/orders', icon: Settings });
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sidebar para mobile */}
      <div className={`fixed inset-0 flex z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/90 backdrop-blur-xl border-r border-white/40">
          <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-gradient">PedidosOnline</span>
              </div>
            </div>
            <nav className="mt-5 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={isActive ? 'nav-item-active' : 'nav-item'}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User area mobile */}
          <div className="flex-shrink-0 flex border-t border-white/30 p-6">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-900 truncate">{user?.name}</p>
                <p className="text-xs text-dark-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl border-r border-white/60">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-display font-bold text-gradient">PedidosOnline</span>
                  <p className="text-xs text-dark-500 mt-1">Sistema de Gestão</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={isActive ? 'nav-item-active' : 'nav-item'}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User area desktop */}
          <div className="flex-shrink-0 border-t border-white/40 p-6">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-900 truncate">{user?.name}</p>
                <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                <p className="text-xs text-primary-600 font-medium mt-1">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-40 lg:hidden pl-4 pt-4 sm:pl-6 sm:pt-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-md border-b border-white/40">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="-ml-2 -mt-2 h-12 w-12 inline-flex items-center justify-center rounded-2xl text-dark-500 hover:text-primary-600 hover:bg-white/80 transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/80 rounded-xl">
                <span className="text-sm font-medium text-gradient">PedidosOnline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 pb-8">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-in">
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