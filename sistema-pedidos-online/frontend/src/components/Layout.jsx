import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, X, BarChart3, Package, Plus, Settings, LogOut, User, Moon, Sun, Zap, Cpu
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 cyber-grid particles">
      {/* Scan Line Effect */}
      <div className="scan-line fixed inset-0 pointer-events-none z-50"></div>
      
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 card-glow border-r border-slate-700/50 m-6 rounded-2xl">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            {/* Logo Area */}
            <div className="flex items-center space-x-3 px-6 mb-8">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25 animate-cyber-float">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold cyber-text glow-text">
                  PGSystem
                </span>
                <p className="text-xs text-slate-400 mt-1">v2.0.1</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="px-6 mb-6">
              <div className="flex items-center space-x-3 p-3 border border-slate-700/50 rounded-lg bg-slate-800/30">
                <div className="h-10 w-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  <p className="text-xs text-cyan-400 font-mono mt-1">
                    {user?.role === 'admin' ? '#ADMIN' : '#USER'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'nav-item-active animate-cyber-glow' 
                        : 'nav-item'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-cyan-300' : 'text-current'}`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 border-t border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500 font-mono">
                SYSTEM ONLINE
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-400 hover:text-cyan-300 rounded-lg transition-all duration-300 hover:bg-slate-700/50"
                  title="Toggle theme"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-300 rounded-lg transition-all duration-300 hover:bg-slate-700/50"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-96 flex flex-col flex-1">
        {/* Header Mobile */}
        <div className="lg:hidden card-glow m-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-cyan-300 rounded-lg transition-all duration-300 hover:bg-slate-700/50"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Cpu className="h-6 w-6 text-cyan-400" />
                <span className="text-lg font-bold cyber-text">PGSystem</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-400 hover:text-cyan-300 rounded-lg transition-all duration-300 hover:bg-slate-700/50"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full card-glow border border-slate-700/50">
              <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
                <div className="flex items-center justify-between px-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-6 w-6 text-cyan-400" />
                    <span className="text-xl font-bold cyber-text">PGSystem</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className="px-4 space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'nav-item-active' 
                            : 'nav-item'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
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