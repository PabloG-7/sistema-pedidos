import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, X, BarChart3, Package, Plus, Settings, LogOut, User, Moon, Sun, ChevronRight
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
    { name: 'Pedidos', href: '/orders', icon: Package },
    { name: 'Novo Pedido', href: '/new-order', icon: Plus },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin/orders', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex">
      {/* Sidebar Desktop - Compacta */}
      <div className="hidden lg:flex lg:w-20 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex-1 flex flex-col items-center py-6">
          {/* Logo */}
          <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-emerald-600 rounded-lg flex items-center justify-center mb-8">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>

          {/* Navigation Icons */}
          <nav className="flex-1 space-y-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 group relative ${
                    isActive 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-gray-900 dark:bg-emerald-600 rounded-r-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-20 flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  PGSystem
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 text-sm">
                <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
                </div>
              </div>
              
              <button
                onClick={toggleTheme}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900">
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center justify-between px-4 mb-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-900 dark:bg-emerald-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                      PGSystem
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className="px-4 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                          isActive 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                        {isActive && (
                          <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-slide-up">
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