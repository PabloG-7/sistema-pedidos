// components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, BarChart3, Package, Plus, Settings, LogOut, User, 
  Cpu, Terminal, Binary, Zap 
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
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
    { name: 'DASHBOARD', href: '/', icon: BarChart3 },
    { name: 'PEDIDOS', href: '/orders', icon: Package },
    { name: 'NOVO PEDIDO', href: '/new-order', icon: Plus },
  ];

  if (isAdmin) {
    navigation.push({ name: 'ADMIN', href: '/admin/orders', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-exotic-100 flex relative overflow-hidden bg-circuit">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-matrix"></div>
      
      {/* Sidebar Desktop Cyberpunk */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 border-r-2 border-neon-blue bg-exotic-200/80 backdrop-blur-lg">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center h-20 flex-shrink-0 px-8 border-b-2 border-neon-pink">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-pink rounded-sm blur-md"></div>
                <div className="relative w-12 h-12 border-2 border-neon-pink flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-neon-pink" />
                </div>
              </div>
              <span className="ml-4 text-2xl font-orbitron font-bold rgb-text">
                PGSYSTEM
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
                    className={`flex items-center px-6 py-4 font-orbitron text-sm uppercase tracking-wider transition-all duration-300 ${
                      isActive 
                        ? 'nav-cyber-active' 
                        : 'nav-cyber'
                    }`}
                  >
                    <Icon className="mr-4 h-5 w-5" />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info Cyberpunk */}
          <div className="flex-shrink-0 border-t-2 border-neon-blue p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 border-2 border-neon-green flex items-center justify-center">
                    <User className="h-6 w-6 text-neon-green" />
                  </div>
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <p className="text-sm font-orbitron text-white truncate uppercase">
                    {user?.name}
                  </p>
                  <p className="text-xs font-rajdhani text-gray-400 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-neon-green rounded-full mr-2"></div>
                    <span className="text-xs text-neon-green font-rajdhani">ONLINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-exotic-100 transition-all duration-300"
                title="SAIR"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-80 flex flex-col flex-1 min-w-0 relative">
        {/* Header Mobile Cyberpunk */}
        <header className="sticky top-0 z-50 bg-exotic-200/90 backdrop-blur-lg border-b-2 border-neon-pink lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-3 border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-exotic-100 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center ml-4">
                <div className="w-10 h-10 border-2 border-neon-pink flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-neon-pink" />
                </div>
                <span className="ml-3 text-lg font-orbitron text-white">
                  PGSYSTEM
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-xs font-rajdhani text-neon-green">LIVE</span>
            </div>
          </div>
        </header>

        {/* Sidebar Mobile Cyberpunk */}
        <div className={`lg:hidden fixed inset-0 z-50 flex transition-transform duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-exotic-100/80 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-exotic-200 border-r-2 border-neon-blue transform transition-transform duration-500 ease-in-out">
            <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 border-2 border-neon-pink flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-neon-pink" />
                  </div>
                  <span className="ml-3 text-xl font-orbitron text-white">
                    PGSYSTEM
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-exotic-100 transition-all duration-300"
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
                      className={`flex items-center px-4 py-4 font-orbitron text-sm uppercase tracking-wider transition-all duration-300 ${
                        isActive 
                          ? 'bg-exotic-300 text-white border-l-4 border-neon-green shadow-[0_0_20px_#00ff00]' 
                          : 'text-gray-300 hover:text-white hover:bg-exotic-300/50 border-l-4 border-transparent hover:border-neon-pink'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User Info */}
            <div className="flex-shrink-0 border-t-2 border-neon-blue p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 border-2 border-neon-green flex items-center justify-center">
                    <User className="h-6 w-6 text-neon-green" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-orbitron text-white uppercase">{user?.name}</p>
                  <p className="text-xs font-rajdhani text-gray-400">{user?.email}</p>
                </div>
              </div>
              
              {/* Actions */}
              <button
                onClick={handleLogout}
                className="w-full btn-cyber-secondary flex items-center justify-center py-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>SAIR DO SISTEMA</span>
              </button>
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

        {/* System Status Footer */}
        <footer className="border-t-2 border-neon-blue/30 bg-exotic-200/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span className="text-xs font-rajdhani text-neon-green">SISTEMA OPERACIONAL</span>
                </div>
                <div className="text-xs font-rajdhani text-gray-400">
                  v2.0.4 | {new Date().toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="text-xs font-orbitron text-neon-blue mt-2 lg:mt-0">
                TERMINAL ATIVO • PRONTIDÃO MÁXIMA
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="scanline"></div>
      </div>
    </div>
  );
};

export default Layout;