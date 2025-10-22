import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, X, BarChart3, Package, Plus, Settings, LogOut, User, Moon, Sun
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Fechar sidebar quando a rota mudar (em mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-slate-900 dark:text-white">
                PGSystem
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'nav-item-active' 
                        : 'nav-item'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Header Mobile */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 lg:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center ml-3">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-slate-900 dark:text-white">
                  PGSystem
                </span>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Sidebar Mobile */}
        <div className={`lg:hidden fixed inset-0 z-50 flex transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-600/75 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-800 transform transition-transform duration-300 ease-in-out">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-2 text-lg font-semibold text-slate-900 dark:text-white">
                    PGSystem
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Navigation */}
              <nav className="px-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-inner' 
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User Info */}
            <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Modo Claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Modo Escuro
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-fade-in">
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