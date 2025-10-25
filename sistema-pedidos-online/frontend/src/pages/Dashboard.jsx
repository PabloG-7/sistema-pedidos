import React, { useState } from 'react';
import { Package, Plus, BarChart3, Users, TrendingUp, Clock, ArrowUp, ArrowDown, FileText, Sparkles } from 'lucide-react';

// Simulando dados para preview
const mockUser = { name: 'João Silva' };
const mockIsAdmin = true;
const mockOrders = [
  { id: 1, category: 'Desenvolvimento Web', description: 'Site institucional responsivo', status: 'Em análise', estimated_budget: '5000.00', files: [{}, {}] },
  { id: 2, category: 'Design Gráfico', description: 'Identidade visual completa', status: 'Aprovado', estimated_budget: '3500.00', files: [{}] },
  { id: 3, category: 'Marketing Digital', description: 'Campanha de mídia social', status: 'Em andamento', estimated_budget: '2800.00', files: [] },
  { id: 4, category: 'Consultoria', description: 'Análise de processos', status: 'Concluído', estimated_budget: '8000.00', files: [{}, {}, {}] },
  { id: 5, category: 'E-commerce', description: 'Loja virtual personalizada', status: 'Em análise', estimated_budget: '12000.00', files: [{}] },
];

const Dashboard = () => {
  const user = mockUser;
  const isAdmin = mockIsAdmin;
  const [stats] = useState({
    totalOrders: 5,
    pendingOrders: 3,
    completedOrders: 1,
    averageBudget: '6.260,00'
  });
  const [orders] = useState(mockOrders);

  const MetricCard = ({ title, value, icon: Icon, change, trend, color = 'blue' }) => (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] group border border-gray-100 dark:border-gray-700">
      <div className={`absolute inset-0 bg-gradient-to-br ${getMetricColor(color)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
          {change && (
            <div className="flex items-center space-x-2">
              <div className={`flex items-center px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
                {trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                )}
                <span className={`text-xs font-bold ml-1 ${trend === 'up' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                  {Math.abs(change)}%
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">vs último mês</span>
            </div>
          )}
        </div>
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${getMetricColor(color)} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
          <div className={`relative w-16 h-16 bg-gradient-to-br ${getMetricColor(color)} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            <Icon className="h-7 w-7 text-white drop-shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg flex items-center">
              <span className="mr-2 text-2xl">👋</span>
              Bem-vindo de volta, <span className="font-bold text-indigo-600 dark:text-indigo-400 ml-1">{user?.name}</span>!
            </p>
          </div>
          <button className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center space-x-3 mt-4 sm:mt-0 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Plus className="relative h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
            <span className="relative font-bold">Novo Pedido</span>
          </button>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Pedidos"
            value={stats.totalOrders}
            icon={Package}
            change={12}
            trend="up"
            color="indigo"
          />
          <MetricCard
            title="Pendentes"
            value={stats.pendingOrders}
            icon={Clock}
            change={5}
            trend="down"
            color="amber"
          />
          <MetricCard
            title="Concluídos"
            value={stats.completedOrders}
            icon={TrendingUp}
            change={8}
            trend="up"
            color="emerald"
          />
          <MetricCard
            title="Ticket Médio"
            value={`R$ ${stats.averageBudget}`}
            icon={BarChart3}
            change={15}
            trend="up"
            color="violet"
          />
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Distribuição de Status */}
          <div className="xl:col-span-2 relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-lg opacity-40"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </div>
              Distribuição por Status
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Em análise', value: orders.filter(o => o.status === 'Em análise').length, color: 'amber' },
                { label: 'Aprovado', value: orders.filter(o => o.status === 'Aprovado').length, color: 'emerald' },
                { label: 'Em andamento', value: orders.filter(o => o.status === 'Em andamento').length, color: 'blue' },
                { label: 'Concluído', value: orders.filter(o => o.status === 'Concluído').length, color: 'violet' },
                { label: 'Rejeitado', value: orders.filter(o => o.status === 'Rejeitado').length, color: 'rose' },
              ].filter(item => item.value > 0).map((item, index) => (
                <div key={index} className="flex items-center justify-between group/item">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className={`px-3 py-1.5 rounded-lg font-semibold shadow-sm text-sm min-w-[110px] text-center ${getStatusBadgeClass(item.label)}`}>
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[50px] text-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {item.value}
                    </span>
                    <div className="flex-1 relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                        style={{ 
                          width: `${(item.value / Math.max(1, orders.length)) * 100}%`,
                          backgroundColor: getStatusColor(item.label)
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300 min-w-[60px] text-right px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {((item.value / Math.max(1, orders.length)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -z-10"></div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-lg opacity-40"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
              Ações Rápidas
            </h3>
            
            <div className="space-y-4">
              <button className="w-full relative overflow-hidden flex items-center p-5 border-2 border-indigo-200/50 dark:border-indigo-800/50 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-500 group shadow-sm hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="relative font-bold text-gray-900 dark:text-white ml-4 text-base">Novo Pedido</span>
              </button>
              
              <button className="w-full relative overflow-hidden flex items-center p-5 border-2 border-blue-200/50 dark:border-blue-800/50 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all duration-500 group shadow-sm hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="relative font-bold text-gray-900 dark:text-white ml-4 text-base">Ver Pedidos</span>
              </button>
              
              {isAdmin && (
                <button className="w-full relative overflow-hidden flex items-center p-5 border-2 border-purple-200/50 dark:border-purple-800/50 rounded-2xl hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-500 group shadow-sm hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="relative font-bold text-gray-900 dark:text-white ml-4 text-base">Painel Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Pedidos Recentes */}
          <div className="xl:col-span-3 relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 blur-lg opacity-40"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </div>
                Pedidos Recentes
              </h3>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center group px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                Ver todos
                <ArrowUp className="h-4 w-4 ml-1 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-5 border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 dark:hover:from-gray-700/50 dark:hover:to-indigo-900/10 transition-all duration-500 group gap-4 sm:gap-6 shadow-sm hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative flex items-center space-x-4 flex-1 min-w-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0 shadow-md">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">
                        {order.category}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {order.description}
                      </p>
                      {order.files && order.files.length > 0 && (
                        <div className="flex items-center mt-2">
                          <div className="flex items-center px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <FileText className="h-3 w-3 text-indigo-600 dark:text-indigo-400 mr-1" />
                            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                              {order.files.length} arquivo(s)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 ml-0 sm:ml-4 w-full sm:w-auto">
                    <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                      R$ {parseFloat(order.estimated_budget || 0).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className={`px-4 py-2 rounded-xl font-bold text-sm min-w-[120px] text-center shadow-sm ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-16">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 blur-xl opacity-40"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
                      <Package className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xl mb-6 font-medium">Nenhum pedido encontrado</p>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white inline-flex items-center space-x-2 px-8 py-4 rounded-2xl group shadow-xl hover:shadow-2xl transition-all duration-500">
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-bold">Criar primeiro pedido</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getMetricColor = (color) => {
  const colorMap = {
    indigo: 'from-indigo-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500',
    emerald: 'from-emerald-500 to-green-500',
    amber: 'from-amber-500 to-orange-500',
    violet: 'from-violet-500 to-purple-500',
    rose: 'from-rose-500 to-pink-500'
  };
  return colorMap[color] || 'from-indigo-500 to-purple-500';
};

const getStatusBadgeClass = (status) => {
  const statusMap = {
    'Em análise': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Aprovado': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Rejeitado': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Em andamento': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Concluído': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
};

const getStatusColor = (status) => {
  const colorMap = {
    'Em análise': '#f59e0b',
    'Aprovado': '#10b981',
    'Rejeitado': '#ef4444',
    'Em andamento': '#3b82f6',
    'Concluído': '#8b5cf6'
  };
  return colorMap[status] || '#6b7280';
};

export default Dashboard;