import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initialNotifications } from '../../data/notifications';
import StatusBadge from '../common/StatusBadge';

export default function DesktopHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const unreadCount = initialNotifications.filter((n) => !n.isRead).length;

  const pageTitles = {
    '/app/dashboard': 'Performance Dashboard',
    '/app/profile': 'Executive Profile',
    '/app/orders': 'Orders History',
    '/app/earnings': 'Earnings & Payouts',
    '/app/milestones': 'Weekly Milestones',
    '/app/weekly-contest': 'Weekly Contest',
    '/app/leaderboard': 'Zone Leaderboard',
    '/app/rewards': 'My Rewards',
    '/app/referrals': 'Referral Program',
    '/app/notifications': 'Notifications Center',
    '/app/financial-services': 'Partner Financial Services',
    '/app/support': 'Support & Complaints',
  };

  const currentTitle = pageTitles[location.pathname] || 'Delivery Executive Portal';

  return (
    <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200/80 px-8 py-4 sticky top-0 z-30 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-navy-900 leading-tight">
          {currentTitle}
        </h1>
        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            {user.zone}
          </span>
          <span>•</span>
          <span className="font-mono text-slate-400">ID: {user.id}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <StatusBadge status="Active" size="md" />
          <StatusBadge status="Verified" size="md" />
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Notifications */}
        <Link
          to="/app/notifications"
          className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center relative transition-colors border border-slate-200/80"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </Link>

        {/* Profile Card */}
        <Link
          to="/app/profile"
          className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-100"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-navy-900 leading-none">{user.name}</p>
            <p className="text-[10px] font-medium text-emerald-600 mt-1">★ {user.rating} Rating</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
