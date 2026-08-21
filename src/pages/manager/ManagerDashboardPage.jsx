import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Users,
  Package,
  Wallet,
  Target,
  Trophy,
  Headphones,
  Bell,
  ArrowRight,
  PlusCircle,
  UserPlus,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

export default function ManagerDashboardPage() {
  const { activeManager } = useAuth();
  const { data } = useData();
  const navigate = useNavigate();

  const executives = data.executives || [];
  const orders = data.orders || [];
  const tickets = data.tickets || [];
  const milestone = data.milestone;
  const contest = data.contest;

  const totalOrdersCount = orders.length;
  const activeExecutivesCount = executives.filter((e) => e.accountStatus === 'Active').length;
  const openTickets = tickets.filter((t) => t.status === 'Open');
  const totalEarningsDistributed = executives.reduce((acc, curr) => acc + (curr.stats?.totalEarnings || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-navy-900 text-white rounded-3xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
              Hub Operations Control
            </span>
            <span className="text-xs text-slate-400">
              Active: <strong className="text-white">{activeManager}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Hyderabad Operations Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Maintain operational records, orders history, milestones, earnings, rewards, and support tickets for all delivery executives.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-200 font-semibold">Live System Status: <strong className="text-emerald-400">Online</strong></span>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Executives */}
        <Link
          to="/manager/executives"
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Executives</span>
          <p className="text-xl font-extrabold text-navy-900 mt-0.5">{executives.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{activeExecutivesCount} Active Today</span>
        </Link>

        {/* Card 2: Orders */}
        <Link
          to="/manager/orders"
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Orders</span>
          <p className="text-xl font-extrabold text-navy-900 mt-0.5">{totalOrdersCount}</p>
          <span className="text-[10px] text-slate-500">Historical Log</span>
        </Link>

        {/* Card 3: Total Earnings */}
        <Link
          to="/manager/earnings"
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Payouts</span>
          <p className="text-xl font-extrabold text-navy-900 mt-0.5">₹{totalEarningsDistributed.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500">This Cycle</span>
        </Link>

        {/* Card 4: Milestones */}
        <Link
          to="/manager/milestones"
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Milestone Target</span>
          <p className="text-xl font-extrabold text-navy-900 mt-0.5">{milestone.targetOrders} Orders</p>
          <span className="text-[10px] text-purple-600 font-bold">{milestone.reward}</span>
        </Link>

        {/* Card 5: Weekly Contest */}
        <Link
          to="/manager/contest"
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Contest Status</span>
          <p className="text-base font-extrabold text-navy-900 mt-0.5 truncate">Live (4d left)</p>
          <span className="text-[10px] text-orange-600 font-bold">1st: ₹1,000</span>
        </Link>

        {/* Card 6: Open Tickets */}
        <Link
          to="/manager/support"
          className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all group text-left ${
            openTickets.length > 0
              ? 'bg-rose-50/60 border-rose-200 ring-2 ring-rose-100'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              openTickets.length > 0 ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Headphones className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Open Tickets</span>
          <p className={`text-xl font-extrabold mt-0.5 ${openTickets.length > 0 ? 'text-rose-700' : 'text-navy-900'}`}>
            {openTickets.length}
          </p>
          <span className="text-[10px] text-slate-500">{openTickets.length > 0 ? 'Action required' : 'All resolved'}</span>
        </Link>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Link
            to="/manager/executives"
            className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-300/80 text-amber-950 transition-colors flex items-center gap-2.5 text-xs font-bold"
          >
            <UserPlus className="w-4 h-4 text-amber-700 shrink-0" />
            <span>+ Onboard Executive</span>
          </Link>

          <Link
            to="/manager/orders"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 text-slate-800 hover:text-brand-700 transition-colors flex items-center gap-2.5 text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Add / Edit Order</span>
          </Link>

          <Link
            to="/manager/notifications"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-800 hover:text-amber-800 transition-colors flex items-center gap-2.5 text-xs font-bold"
          >
            <Bell className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Broadcast Message</span>
          </Link>

          <Link
            to="/manager/milestones"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-slate-800 hover:text-purple-800 transition-colors flex items-center gap-2.5 text-xs font-bold"
          >
            <Target className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Update Milestone</span>
          </Link>

          <Link
            to="/manager/support"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-800 hover:text-rose-800 transition-colors flex items-center gap-2.5 text-xs font-bold"
          >
            <Headphones className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Support ({openTickets.length})</span>
          </Link>
        </div>
      </div>

      {/* Grid: Delivery Executives Roster & Open Support Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Executives Performance Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Delivery Executives Roster ({executives.length})
              </h3>
              <p className="text-xs text-slate-500">Live operational stats maintained by hub</p>
            </div>
            <Link
              to="/manager/executives"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {executives.map((exec) => (
              <div
                key={exec.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={exec.avatar}
                    alt={exec.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900 text-sm truncate">{exec.name}</span>
                      <StatusBadge status={exec.accountStatus || "Active"} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {exec.id} • {exec.zone?.split('(')[0] || exec.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Weekly Orders</span>
                    <span className="font-extrabold text-navy-900 text-sm">
                      {exec.stats?.weeklyOrders || 0} / {exec.stats?.weeklyTarget || 50}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Earnings</span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ₹{exec.stats?.weeklyEarnings?.toLocaleString('en-IN') || 0}
                    </span>
                  </div>

                  <Link
                    to={`/manager/executives?edit=${exec.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-bold text-xs transition-colors shrink-0"
                  >
                    Edit Data
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets Queue (1 col) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Support Queue
              </h3>
              <p className="text-xs text-slate-500">{openTickets.length} pending tickets</p>
            </div>
            <Link
              to="/manager/support"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {tickets.slice(0, 4).map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/manager/support?ticket=${ticket.id}`)}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-colors space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-navy-900">{ticket.id}</span>
                  <StatusBadge status={ticket.status} size="sm" />
                </div>
                <h4 className="font-bold text-slate-800 leading-snug line-clamp-1">
                  {ticket.subject}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  From: {ticket.executiveName || "Rahul Sharma"} • {ticket.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
