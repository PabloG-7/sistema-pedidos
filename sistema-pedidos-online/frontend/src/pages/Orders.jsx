import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import {
  Package,
  Plus,
  Search,
  Download,
  Calendar,
  DollarSign,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Orders.jsx
 * - Lista com filtros, busca, ordenação
 * - Visual premium + animações Framer Motion
 */

const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("newest");

  const statusOptions = ["Todos", "Em análise", "Aprovado", "Rejeitado", "Em andamento", "Concluído"];

  const statusIcons = {
    "Em análise": <Clock className="h-4 w-4" />,
    Aprovado: <CheckCircle className="h-4 w-4" />,
    Rejeitado: <XCircle className="h-4 w-4" />,
    "Em andamento": <PlayCircle className="h-4 w-4" />,
    Concluído: <Package className="h-4 w-4" />
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => { applyFiltersAndSort(); /* eslint-disable-next-line */ }, [searchTerm, statusFilter, sortBy, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my-orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...orders];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter((o) => o.description?.toLowerCase().includes(s) || o.category?.toLowerCase().includes(s));
    }

    if (statusFilter && statusFilter !== "Todos") filtered = filtered.filter((o) => o.status === statusFilter);

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at) - new Date(a.created_at);
        case "oldest": return new Date(a.created_at) - new Date(b.created_at);
        case "price-high": return parseFloat(b.estimated_budget || 0) - parseFloat(a.estimated_budget || 0);
        case "price-low": return parseFloat(a.estimated_budget || 0) - parseFloat(b.estimated_budget || 0);
        default: return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusCount = (status) => orders.filter((o) => o.status === status).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.03 } } }} className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Meus Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Gerencie e acompanhe todos os seus pedidos</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.98 }} className="btn-secondary inline-flex items-center gap-2 px-3 py-2 rounded-xl">
            <Download className="h-4 w-4" />
            <span className="text-sm">Exportar</span>
          </motion.button>

          <Link to="/new-order" className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl">
            <Plus className="h-5 w-5" />
            <span className="text-sm font-semibold">Novo Pedido</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: orders.length, color: "gray" },
          { label: "Em Análise", value: getStatusCount("Em análise"), color: "yellow" },
          { label: "Aprovados", value: getStatusCount("Aprovado"), color: "green" },
          { label: "Em Andamento", value: getStatusCount("Em andamento"), color: "blue" },
          { label: "Concluídos", value: getStatusCount("Concluído"), color: "purple" }
        ].map((s, i) => (
          <div key={i} className="card text-center p-4 rounded-xl">
            <div className={`text-2xl font-bold mb-1 ${s.color === "gray" ? "text-gray-700 dark:text-gray-300" : s.color === "yellow" ? "text-yellow-600" : s.color === "green" ? "text-green-600" : s.color === "blue" ? "text-blue-600" : "text-purple-600"}`}>
              {s.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="card p-4 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar por descrição, categoria..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" />
          </div>

          <div className="flex gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-44">
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-40">
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="price-high">Maior Preço</option>
              <option value="price-low">Menor Preço</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <motion.div variants={itemVariants} className="card text-center py-16 rounded-2xl">
          <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nenhum pedido encontrado</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {orders.length === 0 ? "Você ainda não fez nenhum pedido. Comece criando seu primeiro pedido agora mesmo." : "Não encontramos pedidos com os filtros selecionados. Tente ajustar sua busca."}
          </p>

          {orders.length === 0 && <Link to="/new-order" className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl"><Plus className="h-5 w-5" /> Criar Primeiro Pedido</Link>}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid gap-4">
          {filteredOrders.map((order) => (
            <motion.div key={order.id} variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ duration: 0.16 }} className="card-hover group p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {statusIcons[order.status]}
                      <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ml-4">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{order.category}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed truncate">{order.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /><span className="font-semibold text-gray-900 dark:text-white">R$ {order.estimated_budget}</span></div>
                    {order.files && order.files.length > 0 && (<div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>{order.files.length} anexo(s)</span></div>)}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 lg:mt-0">
                  <button className="btn-secondary inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"><Eye className="h-4 w-4" /><span>Detalhes</span></button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <motion.div variants={itemVariants} className="flex justify-between items-center card p-4 rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400">Mostrando {filteredOrders.length} de {orders.length} pedidos</p>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-3 py-2 rounded-lg">Anterior</button>
            <button className="btn-primary px-3 py-2 rounded-lg">Próximo</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const getStatusClass = (status) => {
  const statusMap = {
    "Em análise": "status-pending",
    Aprovado: "status-approved",
    Rejeitado: "status-rejected",
    "Em andamento": "status-progress",
    Concluído: "status-completed"
  };
  return statusMap[status] || "status-pending";
};

export default Orders;
