import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu,
  X,
  Package,
  PlusCircle,
  BarChart3,
  LogOut,
  User,
  Settings,
  Sun,
  Moon
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
    navigation.push({ name: 'Painel Admin', href: '/admin/orders', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 flex z-50 lg:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full glass border-r border-white/20 dark:border-gray-700/30">
          <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    OrderFlow
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Pedidos</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
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
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-white/80 shadow-md border border-white/50 text-indigo-700 dark:bg-gray-700/80 dark:text-indigo-300' 
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover-scale'
                    }`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-white/20 dark:border-gray-700/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg transition-colors duration-200"
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
        <div className="flex-1 flex flex-col min-h-0 glass border-r border-white/20 dark:border-gray-700/30">
          <div className="flex-1 flex flex-col pt-10 pb-4 overflow-y-auto scrollbar-thin">
            <div className="flex items-center space-x-3 px-8 mb-10">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  OrderFlow
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sistema de Pedidos</p>
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
                    className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-white/80 shadow-lg border border-white/50 text-indigo-700 dark:bg-gray-700/80 dark:text-indigo-300' 
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'group-hover:opacity-100'
                    }`} />
                    <Icon className={`mr-3 h-5 w-5 relative z-10 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover-scale'
                    }`} />
                    <span className="font-semibold relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-white/20 dark:border-gray-700/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
                  title={isDark ? 'Modo claro' : 'Modo escuro'}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg transition-colors duration-200"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-80 flex flex-col flex-1">
        {/* Header mobile */}
        <div className="sticky top-0 z-40 lg:hidden glass border-b border-white/20 dark:border-gray-700/30">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">OrderFlow</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors duration-200"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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