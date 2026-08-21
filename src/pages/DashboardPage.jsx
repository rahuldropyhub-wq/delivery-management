import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Package, IndianRupee, Gift, Trophy, ShieldCheck, Sparkles } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import NextMilestoneCard from '../components/dashboard/NextMilestoneCard';
import WeeklyOverviewCard from '../components/dashboard/WeeklyOverviewCard';
import EarningsPreviewChart from '../components/dashboard/EarningsPreviewChart';
import RecentOrdersList from '../components/dashboard/RecentOrdersList';
import EarningsSummaryCard from '../components/dashboard/EarningsSummaryCard';
import { SkeletonCard, SkeletonChart, SkeletonList } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export default function DashboardPage() {
  const { activeExecutiveId, uiStateMode, setUiStateMode } = useAuth();
  const { getExecutive } = useData();
  const user = getExecutive(activeExecutiveId);

  // Loading state simulation
  if (uiStateMode === 'loading') {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-16 bg-slate-200 rounded-2xl w-2/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <SkeletonChart />
        <SkeletonList count={3} />
      </div>
    );
  }

  // Error state simulation
  if (uiStateMode === 'error') {
    return (
      <div className="py-10">
        <ErrorState
          title="Dashboard Data Unavailable"
          description="We could not sync your real-time stats from the hub. Please tap below to retry."
          onRetry={() => setUiStateMode('normal')}
        />
      </div>
    );
  }

  // Empty state simulation
  if (uiStateMode === 'empty') {
    return (
      <div className="py-10">
        <EmptyState
          title="No Active Orders or Performance Data"
          description="You have not started deliveries for this week yet. Once you complete deliveries, your KPIs will appear here."
          actionLabel="Reset Preview Mode"
          onAction={() => setUiStateMode('normal')}
        />
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Welcome Header & Status Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
              {getGreeting()}, {user.name.split(' ')[0]} 👋
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's your performance overview for this week.
          </p>
        </div>

        {/* Informational Badges (KYC & Account Status) */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 font-normal">KYC:</span>
            <StatusBadge status={user.kycStatus || "Verified"} size="sm" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 font-normal">Status:</span>
            <StatusBadge status={user.accountStatus || "Active"} size="sm" />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Mobile 2x2, Desktop 4x1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Orders"
          value={user.stats.weeklyOrders}
          subtitle="This Week"
          icon={Package}
          accentColor="blue"
          trend="+8 today"
        />

        <StatCard
          title="Earnings"
          value={`₹${user.stats.weeklyEarnings.toLocaleString('en-IN')}`}
          subtitle="This Week"
          icon={IndianRupee}
          accentColor="emerald"
          trend="+12%"
        />

        <StatCard
          title="Bonus"
          value={`₹${user.stats.bonusEarnings}`}
          subtitle="This Week"
          icon={Gift}
          accentColor="amber"
          trend="Unlocked"
        />

        <StatCard
          title="Rank"
          value={`#${user.stats.rank || 7}`}
          subtitle="Zone Standing"
          icon={Trophy}
          accentColor="purple"
          trend="Top 10%"
        />
      </div>

      {/* Next Milestone Card */}
      <NextMilestoneCard />

      {/* Grid for Charts & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <WeeklyOverviewCard
          completed={user.stats.completedOrders}
          cancelled={user.stats.cancelledOrders}
          underReview={user.stats.underReviewOrders}
          totalEarnings={user.stats.weeklyEarnings}
        />

        <EarningsSummaryCard />
      </div>

      {/* Earnings Chart Section */}
      <EarningsPreviewChart />

      {/* Recent Orders List */}
      <RecentOrdersList limit={4} />
    </div>
  );
}
