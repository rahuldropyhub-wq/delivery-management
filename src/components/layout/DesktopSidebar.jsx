import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Package,
  Wallet,
  Target,
  Trophy,
  Award,
  Gift,
  Users,
  Bell,
  CreditCard,
  Headphones,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function DesktopSidebar() {
  const { activeExecutiveId, logout } = useAuth();
  const { getExecutive, data } = useData();
  const user = getExecutive(activeExecutiveId);
  const navigate = useNavigate();
  const unreadCount = data.notifications.filter((n) => !n.isRead).length;

  const links = [
    { label: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
    { label: "My Profile", path: "/app/profile", icon: User },
    { label: "Orders Count", path: "/app/orders", icon: Package, badge: `${user.stats?.weeklyOrders || 0}` },
    { label: "Earnings", path: "/app/earnings", icon: Wallet },
    { label: "Milestones", path: "/app/milestones", icon: Target, badge: user.stats?.progressPercentage > 0 ? `${user.stats.progressPercentage}%` : null },
    { label: "Weekly Contest", path: "/app/weekly-contest", icon: Trophy },
    { label: "Leaderboard", path: "/app/leaderboard", icon: Award },
    { label: "My Rewards", path: "/app/rewards", icon: Gift },
    { label: "Referral Program", path: "/app/referrals", icon: Users, badge: "₹300" },
    { label: "Notifications", path: "/app/notifications", icon: Bell, badge: unreadCount > 0 ? `${unreadCount}` : null },
    { label: "Financial Services", path: "/app/financial-services", icon: CreditCard },
    { label: "Support / Complaints", path: "/app/support", icon: Headphones },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-navy-900 text-slate-300 border-r border-navy-800 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-navy-800/80 flex items-center justify-between">
        <NavLink to="/app/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-blue-400 flex items-center justify-center text-white font-black text-lg shadow-glow-brand">
            D
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white leading-none block">
              Delivery<span className="text-brand-400">Pro</span>
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Executive Portal
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-800 text-brand-300 border border-navy-700">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>



      {/* Bottom Profile / Logout Footer */}
      <div className="p-3 border-t border-navy-800/80 bg-navy-950/40">
        <div className="flex items-center justify-between p-2 rounded-xl bg-navy-800/60 border border-navy-700/50 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-brand-400/40 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] font-mono text-slate-400 truncate">{user.id}</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-navy-900 shrink-0" title="Active Partner" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
