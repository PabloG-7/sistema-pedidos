import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, X, BarChart3, Package, Plus, Settings, LogOut, User, Moon, Sun,
  ChevronRight, Home, ShoppingCart, Users as UsersIcon
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
    { name: 'Dashboard', href: '/', icon: BarChart3, description: 'Visão geral' },
    { name: 'Pedidos', href: '/orders', icon: Package, description: 'Meus pedidos' },
    { name: 'Novo Pedido', href: '/new-order', icon: Plus, description: 'Criar pedido' },
  ];

  if (isAdmin) {
    navigation.push({ 
      name: 'Admin', 
      href: '/admin/orders', 
      icon: Settings, 
      description: 'Painel administrativo' 
    });
  }

  const NavItem = ({ item, isActive, isMobile = false }) => {
    const Icon = item.icon;
    
    if (isMobile) {
      return (
        <Link
          to={item.href}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className={`p-2 rounded-lg transition-colors duration-200 ${
            isActive 
              ? 'bg-blue-700' 
              : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
          }`}>
            <Icon className={`h-5 w-5 transition-colors duration-200 ${
              isActive 
                ? 'text-white' 
                : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
            }`} />
          </div>
          <div className="flex-1">
            <span className="font-semibold">{item.name}</span>
            <p className="text-sm opacity-80">{item.description}</p>
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
            isActive ? 'text-white' : 'text-gray-400 group-hover:translate-x-1'
          }`} />
        </Link>
      );
    }

    return (
      <Link
        to={item.href}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <div className={`p-2 rounded-lg transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-700' 
            : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
        }`}>
          <Icon className={`h-5 w-5 transition-colors duration-200 ${
            isActive 
              ? 'text-white' 
              : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`} />
        </div>
        <div className="flex-1">
          <span className="font-semibold">{item.name}</span>
          <p className="text-sm opacity-80">{item.description}</p>
        </div>
        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
          isActive ? 'text-white' : 'text-gray-400 group-hover:translate-x-1'
        }`} />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  OrderSystem
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {user?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavItem 
                    key={item.name} 
                    item={item} 
                    isActive={isActive}
                  />
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="lg:pl-80 flex flex-col flex-1 min-w-0">
        {/* Header Mobile */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center ml-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                  OrderSystem
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar Mobile */}
        <div className={`lg:hidden fixed inset-0 z-50 flex transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-600/75 transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out border-r border-gray-200 dark:border-gray-700">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-3 text-lg font-bold text-gray-900 dark:text-white">
                    OrderSystem
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Navigation */}
              <nav className="px-3 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavItem 
                      key={item.name} 
                      item={item} 
                      isActive={isActive}
                      isMobile={true}
                    />
                  );
                })}
              </nav>
            </div>
            
            {/* User Info */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-200"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Escuro
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-all duration-200"
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
              <div className="fade-in">
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