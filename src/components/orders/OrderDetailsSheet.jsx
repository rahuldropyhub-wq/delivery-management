import React from 'react';
import BottomSheet from '../common/BottomSheet';
import StatusBadge from '../common/StatusBadge';
import { MapPin, Clock, IndianRupee, Package, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function OrderDetailsSheet({ order, isOpen, onClose }) {
  if (!order) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={order.id}
      subtitle={`Order placed on ${order.orderDate} at ${order.orderTime}`}
    >
      <div className="space-y-4">
        {/* Status and Earnings Header */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Order Status
            </span>
            <StatusBadge status={order.status} size="md" />
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
              Your Earnings
            </span>
            <span className="text-2xl font-extrabold text-navy-900">
              ₹{order.earnings}
            </span>
          </div>
        </div>

        {/* Notice for Cancelled / Under Review */}
        {order.status === 'Cancelled' && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Cancellation Reason:</p>
              <p className="mt-0.5 text-rose-700">{order.cancelReason || "Order cancelled before fulfillment."}</p>
            </div>
          </div>
        )}

        {order.status === 'Under Review' && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Audit Review Notice:</p>
              <p className="mt-0.5 text-amber-700">{order.reviewReason || "Earnings under verification."}</p>
            </div>
          </div>
        )}

        {/* Drop & Order Type Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Drop Location</span>
              <p className="text-xs font-semibold text-navy-900 mt-0.5">{order.dropArea}</p>
              <p className="text-[11px] text-slate-500">Customer: {order.customerName} • {order.distanceKm} km</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2.5 border-t border-slate-50">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Package Info</span>
              <p className="text-xs font-semibold text-navy-900 mt-0.5">{order.orderType}</p>
              <p className="text-[11px] text-slate-500">{order.itemsCount} package items</p>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-50">
            Earnings Breakdown
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Delivery Pay</span>
              <span className="font-semibold text-navy-900">₹{order.basePay}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Peak Surge Pay</span>
                {order.surgePay > 0 && <Sparkles className="w-3 h-3 text-amber-500" />}
              </span>
              <span className="font-semibold text-navy-900">₹{order.surgePay}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Customer Tip</span>
              <span className="font-semibold text-navy-900">₹{order.tip}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-navy-900 text-sm">
              <span>Total Payout</span>
              <span className="text-emerald-600">₹{order.earnings}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {order.timeline && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-50">
              Delivery Steps
            </h4>
            <div className="space-y-3 relative pl-2">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                    step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200'
                  }`}>
                    {step.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`font-medium ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.step}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
