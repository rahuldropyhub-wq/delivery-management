import React from 'react';
import { Check, X, Clock, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeeklyOverviewCard({
  completed = 42,
  cancelled = 3,
  underReview = 2,
  totalEarnings = 4250,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-navy-900">Weekly Overview</h3>
        <span className="text-[11px] font-semibold text-slate-400">Current Cycle</span>
      </div>

      <div className="space-y-2.5">
        {/* Completed */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-slate-700">Completed Orders</span>
          </div>
          <span className="font-bold text-emerald-800 text-sm">{completed}</span>
        </div>

        {/* Cancelled */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 border border-rose-100/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-slate-700">Cancelled Orders</span>
          </div>
          <span className="font-bold text-rose-800 text-sm">{cancelled}</span>
        </div>

        {/* Under Review */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-100/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-slate-700">Under Review</span>
          </div>
          <span className="font-bold text-amber-800 text-sm">{underReview}</span>
        </div>
      </div>

      {/* Total Earnings Banner */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Total Delivery Earnings</span>
        <span className="text-base font-extrabold text-navy-900">
          ₹{totalEarnings.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}
