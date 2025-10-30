import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import {
  Package,
  Plus,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  FileText,
  BarChart3,
  Calendar,
  Download
} from "lucide-react";

/**
 * Dashboard.jsx
 * - visual premium (verde/dourado)
 * - responsivo (mobile/tablet/desktop)
 * - cards com hover, grupos e estatísticas rápidas
 */

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: "0,00",
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? "/orders" : "/orders/my-orders";
      const response = await api.get(endpoint);
      const ordersData = response.data.orders || [];

      setOrders(ordersData);

      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter((order) =>
        ["Em análise", "Em andamento"].includes(order.status)
      ).length;
      const completedOrders = ordersData.filter(
        (order) => order.status === "Concluído"
      ).length;

      const totalRevenue = ordersData.reduce(
        (sum, order) => sum + parseFloat(order.estimated_budget || 0),
        0
      );

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ title, value, icon: Icon, trend, description, color = "emerald" }) => {
    const colorMap = {
      emerald: "from-emerald-500 to-amber-500",
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-400 to-orange-500",
    };
    return (
      <div className="metric-card bg-gradient-to-br from-white/90 to-white/80 dark:from-gray-800 dark:to-gray-900 p-5 rounded-2xl transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 truncate">
              {value}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className={`h-4 w-4 ${trend > 0 ? "text-green-500" : "text-red-500"}`} />
                <span className={`text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
                {description && <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">{description}</span>}
              </div>
            )}
          </div>

          <div className={`p-3 rounded-xl text-white shadow-lg bg-gradient-to-r ${colorMap[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bem-vindo de volta, <span className="font-semibold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">{user?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {}}
            className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-xl"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Exportar</span>
          </button>

          <Link to="/new-order" className="btn-primary inline-flex items-center gap-3 px-4 py-2 rounded-xl">
            <Plus className="h-5 w-5" />
            <span className="text-sm font-semibold">Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={Package}
          trend={12}
          color="emerald"
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          trend={-5}
          color="orange"
        />
        <StatCard
          title="Pedidos Concluídos"
          value={stats.completedOrders}
          icon={CheckCircle}
          trend={8}
          color="green"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue}`}
          icon={DollarSign}
          trend={15}
          color="purple"
        />
      </div>

      {/* Main area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders (big) */}
        <div className="xl:col-span-2 card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Package className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Pedidos Recentes</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Últimos pedidos criados</p>
              </div>
            </div>

            <Link to="/orders" className="btn-secondary inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm">
              <Eye className="h-4 w-4" />
              Ver Todos
            </Link>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="card-hover p-4 border border-gray-100 dark:border-gray-800 rounded-xl transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 flex items-start gap-4 min-w-0">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{order.category}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{order.description}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-semibold">R$ {order.estimated_budget}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start sm:items-center gap-3">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Comece criando seu primeiro pedido</p>
                <Link to="/new-order" className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Pedido
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Estatísticas Rápidas</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</span>
                <span className="font-semibold text-gray-900 dark:text-white">3 dias</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Satisfação</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ações Rápidas</h3>
            </div>

            <div className="space-y-3">
              <Link to="/new-order" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Plus className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Novo Pedido</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Criar um novo pedido</p>
                </div>
              </Link>

              <Link to="/orders" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Package className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Ver Pedidos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar todos os pedidos</p>
                </div>
              </Link>

              {isAdmin && (
                <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Painel Admin</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar sistema</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Atividade Recente</h3>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 3).map((order, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">{order.category}</span> criado</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusClass = (status) => {
  const statusMap = {
    "Em análise": "status-pending",
    Aprovado: "status-approved",
    Rejeitado: "status-rejected",
    "Em andamento": "status-progress",
    Concluído: "status-completed",
  };
  return statusMap[status] || "status-pending";
};

export default Dashboard;
