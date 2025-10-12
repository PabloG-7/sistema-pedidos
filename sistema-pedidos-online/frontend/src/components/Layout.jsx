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
  Zap
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
    <div className="min-h-screen bg-slate-950 particles relative overflow-hidden">
      {/* Efeitos de Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-cyan-900/20 pointer-events-none"></div>
      
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 flex z-50 lg:hidden transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="relative flex-1 flex flex-col max-w-sm w-full neo-glass border-r border-cyan-400/20">
          <div className="flex-1 h-0 pt-10 pb-6 overflow-y-auto scrollbar-cyber">
            <div className="flex items-center justify-between px-8 mb-12">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl shadow-2xl animate-glow">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold gradient-text-animated">
                    NEXUS
                  </span>
                  <p className="text-xs text-cyan-400/80 mt-1">ORDER SYSTEM</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors duration-300 hover-lift"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="mt-8 px-6 space-y-3">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-holo ${isActive ? 'nav-holo-active' : ''} animate-slide-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-4 h-6 w-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-semibold">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-slate-700/50 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
                  <p className="text-xs text-cyan-400/80 truncate">{user?.email}</p>
                  <p className="text-xs text-purple-400 font-medium mt-1">
                    {user?.role === 'admin' ? 'ADMINISTRADOR' : 'USUÁRIO'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-3 text-slate-400 hover:text-rose-400 rounded-xl transition-all duration-300 hover-lift border border-slate-600 hover:border-rose-400/50"
                title="Sair do Sistema"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:w-96 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 neo-glass border-r border-cyan-400/20">
          <div className="flex-1 flex flex-col pt-12 pb-8 overflow-y-auto scrollbar-cyber">
            <div className="flex items-center space-x-4 px-10 mb-16">
              <div className="p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl shadow-2xl animate-float">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-3xl font-black gradient-text-animated">
                  NEXUS
                </span>
                <p className="text-sm text-cyan-400/80 mt-2">ORDER MANAGEMENT SYSTEM</p>
              </div>
            </div>
            
            <nav className="mt-8 flex-1 px-8 space-y-4">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-holo ${isActive ? 'nav-holo-active' : ''} hover-lift`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-r-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <Icon className={`mr-4 h-6 w-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-bold text-lg">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-glow"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-slate-700/50 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl hover-lift">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
                  <p className="text-xs text-cyan-400/80 truncate">{user?.email}</p>
                  <p className="text-xs text-purple-400 font-bold mt-1 tracking-wider">
                    {user?.role === 'admin' ? 'ADMINISTRATOR' : 'USER'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-96 flex flex-col flex-1">
        {/* Header mobile */}
        <div className="sticky top-0 z-40 lg:hidden neo-glass border-b border-cyan-400/20">
          <div className="flex items-center justify-between px-6 h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-3 text-slate-400 hover:text-cyan-400 rounded-xl transition-all duration-300 hover-lift border border-slate-600 hover:border-cyan-400/50"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <Zap className="h-7 w-7 text-cyan-400 animate-pulse" />
                <span className="text-xl font-black text-slate-100">NEXUS</span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="animate-slide-in">
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