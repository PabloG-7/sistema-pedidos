// components/Layout.tsx
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
    <div className="min-h-screen bg-slate-950 flex relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-20"></div>
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      {/* Sidebar Desktop Premium */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 border-r border-white/10 bg-slate-900/80 backdrop-blur-2xl">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center h-20 flex-shrink-0 px-8 border-b border-white/10">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-md"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                PGSystem
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8">
            <div className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-6 py-4 rounded-2xl transition-all duration-500 group ${
                      isActive 
                        ? 'nav-item-active shadow-2xl' 
                        : 'nav-item hover:scale-105'
                    }`}
                  >
                    <Icon className="mr-4 h-5 w-5" />
                    <span className="font-semibold">{item.name}</span>
                    {isActive && (
                      <Sparkles className="h-4 w-4 ml-auto text-white/60" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info Premium */}
          <div className="flex-shrink-0 border-t border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-2xl">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 text-white/60 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-md border border-transparent hover:border-white/20"
                  title="Alternar tema"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-white/60 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-md border border-transparent hover:border-white/20"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-80 flex flex-col flex-1 min-w-0 relative">
        {/* Header Mobile Premium */}
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center ml-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-white">
                  PGSystem
                </span>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Sidebar Mobile Premium */}
        <div className={`lg:hidden fixed inset-0 z-50 flex transition-transform duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-500 ease-in-out">
            <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-semibold text-white">
                    PGSystem
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
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
                      className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-2xl' 
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User Info */}
            <div className="flex-shrink-0 border-t border-white/10 p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-white/60">{user?.email}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className="flex items-center text-sm text-white/60 hover:text-white transition-colors duration-300"
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
                  className="flex items-center text-sm text-white/60 hover:text-white transition-colors duration-300"
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
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
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