import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import FilterTabs from '../../components/common/FilterTabs';
import Modal from '../../components/common/Modal';
import {
  Package,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Save,
  MapPin,
  Calendar
} from 'lucide-react';

export default function ManagerOrdersPage() {
  const { data, addOrder, updateOrder, deleteOrder } = useData();
  const { showToast } = useToast();

  const orders = data.orders || [];
  const executives = data.executives || [];

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExecutiveFilter, setSelectedExecutiveFilter] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [orderForm, setOrderForm] = useState({
    executiveId: "EXE12345",
    orderId: "",
    orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    orderTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    customerName: "Suresh Reddy",
    dropArea: "Gandhi Nagar, Nellore",
    distanceKm: 3.5,
    orderType: "Instant Delivery",
    basePay: 80,
    surgePay: 20,
    tip: 0,
    status: "Completed"
  });

  const filterCounts = useMemo(() => {
    return {
      all: orders.length,
      completed: orders.filter((o) => o.status === 'Completed').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
      underReview: orders.filter((o) => o.status === 'Under Review').length
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeFilter === 'completed' && order.status !== 'Completed') return false;
      if (activeFilter === 'cancelled' && order.status !== 'Cancelled') return false;
      if (activeFilter === 'underReview' && order.status !== 'Under Review') return false;

      if (selectedExecutiveFilter !== 'all' && order.executiveId !== selectedExecutiveFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = order.id.toLowerCase().includes(q);
        const matchArea = order.dropArea?.toLowerCase().includes(q);
        const matchCustomer = order.customerName?.toLowerCase().includes(q);
        const matchExec = order.executiveName?.toLowerCase().includes(q);
        return matchId || matchArea || matchCustomer || matchExec;
      }

      return true;
    });
  }, [orders, activeFilter, selectedExecutiveFilter, searchQuery]);

  const handleOpenAdd = () => {
    setOrderForm({
      executiveId: "EXE12345",
      orderId: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      orderTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      customerName: "Kavitha R.",
      dropArea: "Trunk Road, Nellore",
      distanceKm: 2.5,
      orderType: "Instant Delivery",
      basePay: 90,
      surgePay: 25,
      tip: 15,
      status: "Completed"
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const exec = executives.find((e) => e.id === orderForm.executiveId);
    
    addOrder({
      id: orderForm.orderId || `ORD${Math.floor(100000 + Math.random() * 900000)}`,
      executiveId: orderForm.executiveId,
      executiveName: exec ? exec.name : "Rahul Sharma",
      orderDate: orderForm.orderDate,
      orderTime: orderForm.orderTime,
      customerName: orderForm.customerName,
      dropArea: orderForm.dropArea,
      distanceKm: Number(orderForm.distanceKm),
      orderType: orderForm.orderType,
      basePay: Number(orderForm.basePay),
      surgePay: Number(orderForm.surgePay),
      tip: Number(orderForm.tip),
      status: orderForm.status
    });

    showToast(`Order ${orderForm.orderId} added to ${exec ? exec.name : "Executive"}!`, "success");
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setOrderForm({
      executiveId: order.executiveId || "EXE12345",
      orderId: order.id,
      orderDate: order.orderDate,
      orderTime: order.orderTime,
      customerName: order.customerName || "Customer",
      dropArea: order.dropArea || "Nellore",
      distanceKm: order.distanceKm || 3.0,
      orderType: order.orderType || "Standard Delivery",
      basePay: order.basePay || 80,
      surgePay: order.surgePay || 20,
      tip: order.tip || 0,
      status: order.status || "Completed"
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    updateOrder(editingOrder.id, {
      orderDate: orderForm.orderDate,
      orderTime: orderForm.orderTime,
      customerName: orderForm.customerName,
      dropArea: orderForm.dropArea,
      distanceKm: Number(orderForm.distanceKm),
      orderType: orderForm.orderType,
      basePay: Number(orderForm.basePay),
      surgePay: Number(orderForm.surgePay),
      tip: Number(orderForm.tip),
      status: orderForm.status
    });

    showToast(`Updated order ${editingOrder.id}`, "success");
    setEditingOrder(null);
  };

  const handleDelete = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteOrder(orderId);
      showToast(`Order ${orderId} deleted`, "info");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Orders Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add or update historical delivery trips. Changes immediately update executive stats and payout ledger.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Historical Order</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Executive Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter Executive:</span>
            <select
              value={selectedExecutiveFilter}
              onChange={(e) => setSelectedExecutiveFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none"
            >
              <option value="all">All Executives</option>
              {executives.map((exec) => (
                <option key={exec.id} value={exec.id}>{exec.name} ({exec.id})</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, area, customer..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <FilterTabs
          tabs={[
            { id: "all", label: "All Orders", count: filterCounts.all },
            { id: "completed", label: "Completed", count: filterCounts.completed },
            { id: "cancelled", label: "Cancelled", count: filterCounts.cancelled },
            { id: "underReview", label: "Under Review", count: filterCounts.underReview },
          ]}
          activeTab={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Executive</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Area</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Base / Surge / Tip</th>
                <th className="px-5 py-3.5 text-right">Total Earnings</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-navy-900">0 Orders in Hub Record</p>
                    <p className="text-xs text-slate-400 mt-0.5 mb-3">Your database has no orders recorded yet.</p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create First Order</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const exec = executives.find((e) => e.id === order.executiveId);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-navy-900">
                        {order.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-navy-900">{order.executiveName || exec?.name || "Delivery Executive"}</div>
                        <div className="text-[10px] font-mono text-slate-400">{order.executiveId || "EXE12345"}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {order.orderDate}, {order.orderTime}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {order.dropArea}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-500 text-[11px]">
                        ₹{order.basePay || 80} + ₹{order.surgePay || 0} + ₹{order.tip || 0}
                      </td>
                      <td className="px-5 py-3.5 text-right font-extrabold text-navy-900 text-sm">
                        ₹{order.earnings}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(order)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Edit Order"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Order */}
      <Modal
        isOpen={isAddModalOpen || Boolean(editingOrder)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingOrder(null);
        }}
        title={isAddModalOpen ? "Add Historical Order" : `Edit Order ${editingOrder?.id}`}
        subtitle="Saved data will immediately reflect on the delivery executive's panel"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4 text-xs">
          {isAddModalOpen && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Delivery Executive *
              </label>
              <select
                value={orderForm.executiveId}
                onChange={(e) => setOrderForm({ ...orderForm, executiveId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              >
                {executives.map((exec) => (
                  <option key={exec.id} value={exec.id}>{exec.name} ({exec.id})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={orderForm.orderId}
                onChange={(e) => setOrderForm({ ...orderForm, orderId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Order Status
              </label>
              <select
                value={orderForm.status}
                onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              >
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Date (e.g. 12 Aug 2024)
              </label>
              <input
                type="text"
                value={orderForm.orderDate}
                onChange={(e) => setOrderForm({ ...orderForm, orderDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Time (e.g. 02:45 PM)
              </label>
              <input
                type="text"
                value={orderForm.orderTime}
                onChange={(e) => setOrderForm({ ...orderForm, orderTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Customer Area / Drop
              </label>
              <input
                type="text"
                value={orderForm.dropArea}
                onChange={(e) => setOrderForm({ ...orderForm, dropArea: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={orderForm.distanceKm}
                onChange={(e) => setOrderForm({ ...orderForm, distanceKm: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Base Pay (₹)
              </label>
              <input
                type="number"
                value={orderForm.basePay}
                onChange={(e) => setOrderForm({ ...orderForm, basePay: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-navy-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Surge Pay (₹)
              </label>
              <input
                type="number"
                value={orderForm.surgePay}
                onChange={(e) => setOrderForm({ ...orderForm, surgePay: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-navy-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Customer Tip (₹)
              </label>
              <input
                type="number"
                value={orderForm.tip}
                onChange={(e) => setOrderForm({ ...orderForm, tip: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-navy-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingOrder(null);
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Order</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
