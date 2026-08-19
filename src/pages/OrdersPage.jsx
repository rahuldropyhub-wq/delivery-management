import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockOrders } from '../data/orders';
import FilterTabs from '../components/common/FilterTabs';
import StatusBadge from '../components/common/StatusBadge';
import OrderDetailsSheet from '../components/orders/OrderDetailsSheet';
import { SkeletonList } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { Search, Package, ChevronRight, Filter, Calendar, MapPin } from 'lucide-react';

export default function OrdersPage() {
  const { uiStateMode, setUiStateMode } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filterCounts = useMemo(() => {
    return {
      all: mockOrders.length,
      completed: mockOrders.filter((o) => o.status === 'Completed').length,
      cancelled: mockOrders.filter((o) => o.status === 'Cancelled').length,
      underReview: mockOrders.filter((o) => o.status === 'Under Review').length
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      // Status filter
      if (activeFilter === 'completed' && order.status !== 'Completed') return false;
      if (activeFilter === 'cancelled' && order.status !== 'Cancelled') return false;
      if (activeFilter === 'underReview' && order.status !== 'Under Review') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesArea = order.dropArea.toLowerCase().includes(q);
        const matchesCustomer = order.customerName.toLowerCase().includes(q);
        return matchesId || matchesArea || matchesCustomer;
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  if (uiStateMode === 'loading') {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl w-full" />
        <SkeletonList count={6} />
      </div>
    );
  }

  if (uiStateMode === 'error') {
    return (
      <div className="py-10">
        <ErrorState
          title="Failed to Load Orders History"
          description="Could not retrieve your completed trips from the system. Tap below to retry."
          onRetry={() => setUiStateMode('normal')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-navy-900">My Orders History</h2>
            <p className="text-xs text-slate-500">
              Showing {filteredOrders.length} of {mockOrders.length} total deliveries
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or area..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>
        </div>

        {/* Filter Tabs */}
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

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="No delivery orders match your current filter or search criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setActiveFilter('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <>
          {/* Mobile Card View (hidden on lg screens) */}
          <div className="space-y-3 lg:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card hover:shadow-card-hover cursor-pointer transition-all tap-active"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-navy-900 block">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.orderDate} • {order.orderTime}
                    </span>
                  </div>
                  <StatusBadge status={order.status} size="sm" />
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[200px]">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="truncate">{order.dropArea}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Earnings</span>
                    <span className="font-extrabold text-navy-900 text-sm">
                      ₹{order.earnings}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (visible on lg screens) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Drop Area</th>
                  <th className="px-5 py-3.5">Distance</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Earnings</th>
                  <th className="px-4 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-navy-900">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {order.orderDate}, {order.orderTime}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-semibold">
                      {order.dropArea}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {order.distanceKm} km
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-navy-900 text-sm">
                      ₹{order.earnings}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button className="text-brand-600 font-semibold text-xs hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Order Details Bottom Sheet Drawer */}
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
