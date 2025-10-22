import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, X, Home, Package, Plus, Settings, LogOut, User, Moon, Sun
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
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Pedidos', href: '/orders', icon: Package },
    { name: 'Novo Pedido', href: '/new-order', icon: Plus },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin/orders', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center dark:bg-white">
                <Package className="h-4 w-4 text-white dark:text-gray-900" />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                Sistema
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-600">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center ml-3">
                <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center dark:bg-white">
                  <Package className="h-3 w-3 text-white dark:text-gray-900" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Sistema
                </span>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center justify-between px-4 mb-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center dark:bg-white">
                      <Package className="h-4 w-4 text-white dark:text-gray-900" />
                    </div>
                    <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Sistema
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
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
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-600">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto">
          <div className="py-6">
            <div className="container-custom">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;