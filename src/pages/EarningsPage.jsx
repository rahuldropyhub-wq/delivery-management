import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import DateFilter from '../components/common/DateFilter';
import { SkeletonCard, SkeletonChart, SkeletonList } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Wallet,
  IndianRupee,
  Gift,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowDownToLine,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-navy-900 text-white p-3 rounded-2xl shadow-xl text-xs border border-navy-800">
        <p className="font-bold text-slate-300">{label}</p>
        <p className="text-emerald-400 font-extrabold text-base mt-1">
          ₹{data.earnings.toLocaleString('en-IN')}
        </p>
        {data.orders && (
          <p className="text-slate-400 text-[11px] mt-0.5">
            {data.orders} Completed Deliveries
          </p>
        )}
        {data.bonus > 0 && (
          <p className="text-amber-400 text-[11px] font-semibold mt-0.5">
            Includes ₹{data.bonus} bonus
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function EarningsPage() {
  const { uiStateMode, setUiStateMode, activeExecutiveId } = useAuth();
  const { data: globalData, getExecutive } = useData();
  const user = getExecutive(activeExecutiveId);
  const earningsSummary = globalData?.earnings?.summary || { total: 0, deliveryEarnings: 0, bonus: 0, referral: 0, currentCycle: "Active Week", nextPayoutDate: "Upcoming Sunday" };
  const payoutHistory = globalData?.earnings?.payoutHistory || [];
  const dailyEarningsBreakdown = globalData?.earnings?.dailyBreakdown || [];
  const earningsChartData = globalData?.earnings?.chartData || {};

  const [selectedPeriod, setSelectedPeriod] = useState("thisWeek");

  const defaultWeekly = [
    { label: "Mon", earnings: 0, orders: 0 },
    { label: "Tue", earnings: 0, orders: 0 },
    { label: "Wed", earnings: 0, orders: 0 },
    { label: "Thu", earnings: 0, orders: 0 },
    { label: "Fri", earnings: 0, orders: 0 },
    { label: "Sat", earnings: 0, orders: 0 },
    { label: "Sun", earnings: 0, orders: 0 }
  ];

  const chartData = Array.isArray(earningsChartData)
    ? (earningsChartData.length > 0 ? earningsChartData : defaultWeekly)
    : (earningsChartData[selectedPeriod] || earningsChartData.thisWeek || defaultWeekly);

  const currentTotal = Array.isArray(chartData)
    ? chartData.reduce((acc, curr) => acc + (Number(curr?.earnings) || 0), 0)
    : 0;

  if (uiStateMode === 'loading') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonChart />
        <SkeletonList count={4} />
      </div>
    );
  }

  if (uiStateMode === 'error') {
    return (
      <div className="py-10">
        <ErrorState
          title="Earnings Ledger Inaccessible"
          description="Failed to load your financial statements from the ledger. Please try again."
          onRetry={() => setUiStateMode('normal')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title & Payout Alert */}
      <div className="bg-gradient-to-r from-brand-700 to-blue-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-1 rounded-lg">
              Payout Status
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
              ₹{(user.stats.totalEarnings || earningsSummary.total).toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-blue-100 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Next transfer scheduled: <strong>{earningsSummary.nextPayoutDate}</strong></span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-xs">
            <span className="text-blue-200 block text-[10px] uppercase font-bold">Transfer To</span>
            <p className="font-bold text-white mt-0.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-200" />
              <span>{user.payoutAccount?.bankName || "HDFC Bank"} ({user.payoutAccount?.accountNumberMasked || "•••• 7821"})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Delivery Earnings"
          value={`₹${(user.stats.deliveryEarnings || earningsSummary.deliveryEarnings).toLocaleString('en-IN')}`}
          subtitle="Trip Base + Surge"
          icon={IndianRupee}
          accentColor="blue"
        />

        <StatCard
          title="Bonus & Incentives"
          value={`₹${(user.stats.bonusEarnings || earningsSummary.bonus).toLocaleString('en-IN')}`}
          subtitle="Milestones Unlocked"
          icon={Gift}
          accentColor="amber"
        />

        <StatCard
          title="Referral Earnings"
          value={`₹${(user.stats.referralEarnings || earningsSummary.referral).toLocaleString('en-IN')}`}
          subtitle="Friends Active"
          icon={Users}
          accentColor="emerald"
        />

        <StatCard
          title="Total Earnings"
          value={`₹${(user.stats.totalEarnings || earningsSummary.total).toLocaleString('en-IN')}`}
          subtitle="This Payout Cycle"
          icon={Wallet}
          accentColor="purple"
        />
      </div>

      {/* Earnings Trend Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Earnings Performance Trend</h3>
            <p className="text-xs text-slate-500">
              Total in period: <strong className="text-navy-900">₹{currentTotal.toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <DateFilter
            selected={selectedPeriod}
            onChange={setSelectedPeriod}
            options={[
              { id: "today", label: "Today" },
              { id: "thisWeek", label: "This Week" },
              { id: "thisMonth", label: "This Month" },
              { id: "custom", label: "Custom Period" }
            ]}
          />
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#earningsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Breakdown List */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card">
        <h3 className="text-sm font-bold text-navy-900 mb-3 pb-2 border-b border-slate-100">
          Daily Earnings Breakdown
        </h3>

        <div className="space-y-3">
          {dailyEarningsBreakdown.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all text-xs"
            >
              <div className="flex items-center justify-between font-bold text-navy-900 pb-2 border-b border-slate-200/60">
                <span className="text-xs">{item.date}</span>
                <span className="text-sm font-extrabold text-navy-900">₹{item.total}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 text-slate-500 text-[11px]">
                <div>
                  <span>Orders: </span>
                  <strong className="text-slate-800">{item.ordersCount}</strong>
                </div>
                <div>
                  <span>Base Pay: </span>
                  <strong className="text-slate-800">₹{item.basePay}</strong>
                </div>
                <div>
                  <span>Surge + Tips: </span>
                  <strong className="text-emerald-700">₹{item.surgePay + item.tips}</strong>
                </div>
                <div>
                  <span>Bonus: </span>
                  <strong className="text-amber-700">₹{item.bonus}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Payout Cycles */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card">
        <h3 className="text-sm font-bold text-navy-900 mb-3 pb-2 border-b border-slate-100">
          Past Payout Cycles
        </h3>

        <div className="divide-y divide-slate-100">
          {payoutHistory.map((payout) => (
            <div key={payout.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-navy-900">{payout.id}</span>
                  <StatusBadge status={payout.status.includes('Credited') ? 'Completed' : 'Pending'} size="sm" />
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Cycle: {payout.period} • {payout.bank}
                </p>
                {payout.utr !== 'Pending' && (
                  <p className="text-slate-400 font-mono text-[10px] mt-0.5">
                    UTR: {payout.utr}
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payout Amount</span>
                <span className="text-base font-extrabold text-navy-900">
                  ₹{payout.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
