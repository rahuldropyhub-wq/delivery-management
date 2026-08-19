import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Wallet, Sparkles, Users } from 'lucide-react';
import { earningsSummary } from '../../data/earnings';

export default function EarningsSummaryCard({ summary = earningsSummary, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-navy-900">Earnings Summary</h3>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          Active Week
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        {/* Delivery Earnings */}
        <div className="flex items-center justify-between py-1 text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            Delivery Earnings
          </span>
          <span className="font-bold text-navy-900">
            ₹{summary.deliveryEarnings.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Bonus */}
        <div className="flex items-center justify-between py-1 text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Milestone & Incentive Bonus
          </span>
          <span className="font-bold text-navy-900">
            ₹{summary.bonus.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Referral Earnings */}
        <div className="flex items-center justify-between py-1 text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Referral Earnings
          </span>
          <span className="font-bold text-navy-900">
            ₹{summary.referral.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Total Earnings */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            Total Earnings
          </span>
          <span className="text-lg font-extrabold text-brand-600">
            ₹{summary.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to="/app/earnings"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-between group"
        >
          <span>View Full Earnings Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
