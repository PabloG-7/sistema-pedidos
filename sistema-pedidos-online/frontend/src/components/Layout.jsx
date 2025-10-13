import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, X, BarChart3, Package, Plus, Settings, LogOut, User, Moon, Sun, Crown, Sparkles
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
    { name: 'Novo Pedido', href: '/new-order', icon: Plus },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Administração', href: '/admin/orders', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/20 gold-particles">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 flex z-50 lg:hidden transition-opacity duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-lg" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full card transform transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-premium-gradient rounded-xl shadow-2xl shadow-purple-500/30 animate-float">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold premium-text font-serif">
                    PGSystem
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Premium Edition</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all duration-500 hover:bg-white/50 dark:hover:bg-slate-700/50"
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
                    className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-500 group hover-lift ${
                      isActive 
                        ? 'nav-item-active animate-glow' 
                        : 'nav-item'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-purple-600 dark:text-white' : 'text-current'}`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <Sparkles className="ml-auto h-4 w-4 text-purple-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-slate-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-premium-gradient rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-all duration-500 hover:bg-white/50 dark:hover:bg-slate-700/50"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 card border-r border-slate-200/50 dark:border-slate-700/50 m-6 rounded-2xl">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center space-x-3 px-6 mb-8">
              <div className="p-2 bg-premium-gradient rounded-xl shadow-2xl shadow-purple-500/30 animate-float">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold premium-text font-serif">
                  PGSystem
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sistema Premium</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="px-6 mb-6">
              <div className="flex items-center space-x-3 p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm">
                <div className="h-12 w-12 bg-premium-gradient rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  <p className="text-xs premium-text font-medium mt-1">
                    {user?.role === 'admin' ? '👑 Administrador' : '💎 Usuário Premium'}
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-4 flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-500 group hover-lift ${
                      isActive 
                        ? 'nav-item-active animate-glow' 
                        : 'nav-item hover-glow'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-purple-600 dark:text-white' : 'text-current'}`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <Sparkles className="ml-auto h-4 w-4 text-purple-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-slate-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all duration-500 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  title={isDark ? 'Modo claro' : 'Modo escuro'}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center space-x-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-96 flex flex-col flex-1">
        {/* Header Mobile */}
        <div className="lg:hidden card m-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all duration-500 hover:bg-white/50 dark:hover:bg-slate-700/50"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-bold premium-text font-serif">PGSystem</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all duration-500 hover:bg-white/50 dark:hover:bg-slate-700/50"
                title={isDark ? 'Modo claro' : 'Modo escuro'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-in-up">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;