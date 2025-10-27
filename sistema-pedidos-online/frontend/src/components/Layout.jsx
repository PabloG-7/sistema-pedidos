import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, X, BarChart3, Package, Plus, Settings, LogOut, User, Moon, Sun, Sparkles
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 flex transition-colors duration-500">
      {/* Sidebar Desktop Premium */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 border-r border-white/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-white/20 dark:border-slate-700/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  PGSystem
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-500 group ${
                      isActive 
                        ? 'nav-item-active shadow-2xl transform scale-105' 
                        : 'nav-item hover:scale-105'
                    }`}
                  >
                    <Icon className="mr-4 h-5 w-5" />
                    <span className="text-lg font-semibold">{item.name}</span>
                    {isActive && <Sparkles className="h-4 w-4 ml-auto text-white/80" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info Premium */}
          <div className="flex-shrink-0 border-t border-white/20 dark:border-slate-700/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-all duration-500 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl transition-all duration-500 hover:scale-110 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-80 flex flex-col flex-1 min-w-0">
        {/* Header Mobile Premium */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/20 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-xl transition-all duration-500 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">
                  PGSystem
                </span>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-xl transition-all duration-500 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Sidebar Mobile Premium */}
        <div className={`lg:hidden fixed inset-0 z-50 flex transition-transform duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-600/75 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm transform transition-transform duration-500 ease-in-out border-r border-white/20 dark:border-slate-700/20">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-slate-900 dark:text-white">
                    PGSystem
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-all duration-500 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Navigation */}
              <nav className="px-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-500 ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl transform scale-105' 
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-4 h-5 w-5" />
                      <span className="text-lg font-semibold">{item.name}</span>
                      {isActive && <Sparkles className="h-4 w-4 ml-auto text-white/80" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User Info */}
            <div className="flex-shrink-0 border-t border-white/20 dark:border-slate-700/20 p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className="flex items-center text-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-500 hover:scale-105"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-5 w-5 mr-3" />
                      Modo Claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-3" />
                      Modo Escuro
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-lg text-slate-600 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-all duration-500 hover:scale-105"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
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