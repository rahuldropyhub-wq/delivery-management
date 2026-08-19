import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Package } from 'lucide-react';
import { mockOrders } from '../../data/orders';
import StatusBadge from '../common/StatusBadge';
import OrderDetailsSheet from '../orders/OrderDetailsSheet';

export default function RecentOrdersList({ limit = 4, className = "" }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const recentOrders = mockOrders.slice(0, limit);

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-navy-900">Recent Orders</h3>
        <Link
          to="/app/orders"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 group"
        >
          <span>View All ({mockOrders.length})</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Orders Cards List */}
      <div className="divide-y divide-slate-100">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="py-3 first:pt-1 last:pb-1 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors tap-active"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-navy-900">
                    {order.id}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {order.orderDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {order.dropArea}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-2">
              <div className="text-right">
                <p className="text-xs font-extrabold text-navy-900">
                  ₹{order.earnings}
                </p>
                <div className="mt-0.5">
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <Link
          to="/app/orders"
          className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>See all past orders and history</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Details Sheet Modal */}
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
