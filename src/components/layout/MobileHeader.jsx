import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function MobileHeader({ onOpenMenu }) {
  const { activeExecutiveId } = useAuth();
  const { getExecutive, data } = useData();
  const user = getExecutive(activeExecutiveId);
  const unreadCount = data.notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-4 pb-3 flex items-center justify-between lg:hidden shadow-xs">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMenu}
          className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 tap-active"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/app/dashboard" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white font-black text-base shadow-sm">
            D
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-navy-900 leading-none block">
              Delivery<span className="text-brand-600">Pro</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 leading-none">
              Partner Portal
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/app/notifications"
          className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center relative tap-active transition-colors border border-slate-100"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </Link>

        <Link
          to="/app/profile"
          className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-brand-100 tap-active shrink-0"
          aria-label="View Profile"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
        </Link>
      </div>
    </header>
  );
}
