import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Zap,
  ShieldCheck
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { SkeletonCard, SkeletonList } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';

export default function OrdersPage() {
  const { uiStateMode, setUiStateMode, activeExecutiveId } = useAuth();
  const { getExecutive } = useData();
  const user = getExecutive(activeExecutiveId);
  const stats = user.stats || {};

  const weeklyOrders = stats.weeklyOrders || 42;
  const weeklyTarget = stats.weeklyTarget || 50;
  const completedOrders = stats.completedOrders || 42;
  const cancelledOrders = stats.cancelledOrders || 3;
  const underReviewOrders = stats.underReviewOrders || 2;
  const remainingOrders = Math.max(0, weeklyTarget - weeklyOrders);
  const progressPercent = Math.min(100, Math.round((weeklyOrders / weeklyTarget) * 100));

  // Daily order count distribution
  const dailyCounts = [
    { day: "Monday", date: "Aug 17", count: 8, status: "Completed", earnings: 800 },
    { day: "Tuesday", date: "Aug 18", count: 7, status: "Completed", earnings: 700 },
    { day: "Wednesday", date: "Aug 19", count: 9, status: "Completed", earnings: 900 },
    { day: "Thursday", date: "Aug 20", count: 6, status: "Completed", earnings: 600 },
    { day: "Friday", date: "Aug 21", count: 8, status: "In Progress", earnings: 800 },
    { day: "Saturday", date: "Aug 22", count: 4, status: "Scheduled", earnings: 400 },
    { day: "Sunday", date: "Aug 23", count: 0, status: "Upcoming", earnings: 0 }
  ];

  if (uiStateMode === 'loading') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-slate-200 rounded-2xl w-2/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <SkeletonList count={4} />
      </div>
    );
  }

  if (uiStateMode === 'error') {
    return (
      <div className="py-10">
        <ErrorState
          title="Orders Count Data Unavailable"
          description="Could not sync your orders count metrics from the hub. Please tap below to retry."
          onRetry={() => setUiStateMode('normal')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
              Order Volume & Counts
            </span>
            <span className="text-xs text-slate-400">Cycle: Current Week</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 mt-1.5 tracking-tight">
            Orders Count & Fulfillment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time delivery volume counts, daily tally, and target progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Lifetime Orders</span>
            <span className="text-lg font-black text-navy-900">{weeklyOrders + 480}</span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total This Week"
          value={weeklyOrders}
          subtitle={`Target: ${weeklyTarget}`}
          icon={Package}
          accentColor="blue"
          trend={`${progressPercent}% met`}
        />

        <StatCard
          title="Completed"
          value={completedOrders}
          subtitle="Delivered & Verified"
          icon={CheckCircle2}
          accentColor="emerald"
          trend="100% payout"
        />

        <StatCard
          title="Under Review"
          value={underReviewOrders}
          subtitle="Pending Hub Check"
          icon={Clock}
          accentColor="amber"
          trend="Within 24h"
        />

        <StatCard
          title="Cancelled"
          value={cancelledOrders}
          subtitle="Customer / Store"
          icon={XCircle}
          accentColor="rose"
          trend="No penalty"
        />
      </div>

      {/* Target Progress Card */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-card border border-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                Weekly Target Fulfillment
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {weeklyOrders} of {weeklyTarget} Orders Completed
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right">
            {remainingOrders > 0 ? (
              <span className="inline-block px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                🎯 {remainingOrders} more orders needed for ₹700 Bonus
              </span>
            ) : (
              <span className="inline-block px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                🎉 Weekly Target Achieved!
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Progress: {progressPercent}%</span>
            <span>{weeklyOrders} / {weeklyTarget} Orders</span>
          </div>
          <div className="w-full h-3.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-blue-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Order Count Breakdown */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Daily Order Count Tally</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily volume counts recorded for this payout cycle.
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-xl">
            {weeklyOrders} Orders Total
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {dailyCounts.map((item, idx) => {
            const isToday = item.day === "Friday";
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isToday
                    ? "bg-brand-50/60 border-brand-300 ring-2 ring-brand-400/20 shadow-sm"
                    : item.count > 0
                    ? "bg-slate-50/70 border-slate-200/80"
                    : "bg-slate-50/30 border-dashed border-slate-200 opacity-60"
                }`}
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {item.day.slice(0, 3)}
                </span>
                <span className="text-[10px] text-slate-400 block mb-1">
                  {item.date}
                </span>

                <div className="my-2">
                  <span className={`text-2xl font-black block ${
                    item.count > 0 ? "text-navy-900" : "text-slate-400"
                  }`}>
                    {item.count}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    orders
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : isToday
                      ? 'bg-brand-100 text-brand-800 font-extrabold'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fleet Efficiency & Delivery Quality Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              On-Time Rate
            </span>
            <p className="text-lg font-black text-navy-900 mt-0.5">98.4%</p>
            <p className="text-[10px] text-emerald-600 font-medium">Above Hub Avg (95%)</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Acceptance Rate
            </span>
            <p className="text-lg font-black text-navy-900 mt-0.5">99.1%</p>
            <p className="text-[10px] text-brand-600 font-medium">Gold Tier Standard</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Customer Rating
            </span>
            <p className="text-lg font-black text-navy-900 mt-0.5">★ {user.rating || "4.88"}</p>
            <p className="text-[10px] text-purple-600 font-medium">Based on 42 orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
