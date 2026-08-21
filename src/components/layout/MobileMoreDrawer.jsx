import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Target,
  Trophy,
  Award,
  Users,
  Bell,
  CreditCard,
  Headphones,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import BottomSheet from '../common/BottomSheet';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function MobileMoreDrawer({ isOpen, onClose }) {
  const { activeExecutiveId, logout } = useAuth();
  const { getExecutive, data } = useData();
  const user = getExecutive(activeExecutiveId);
  const navigate = useNavigate();
  const unreadNotifs = data.notifications.filter((n) => !n.isRead).length;

  const menuSections = [
    {
      title: "Performance & Contests",
      items: [
        { label: "My Profile", path: "/app/profile", icon: User, badge: user.kycStatus || "Verified", badgeColor: "bg-blue-50 text-brand-700" },
        { label: "Milestones", path: "/app/milestones", icon: Target, badge: `${user.stats.progressPercentage}%`, badgeColor: "bg-amber-50 text-amber-700" },
        { label: "Weekly Contest", path: "/app/weekly-contest", icon: Trophy, badge: "₹1,000 Prize", badgeColor: "bg-amber-100 text-amber-800" },
        { label: "Leaderboard", path: "/app/leaderboard", icon: Award, badge: `#${user.stats.rank || 7} Rank`, badgeColor: "bg-purple-50 text-purple-700" },
      ]
    },
    {
      title: "Rewards & Services",
      items: [
        { label: "Referral Program", path: "/app/referrals", icon: Users, badge: "Earn ₹300", badgeColor: "bg-emerald-50 text-emerald-700" },
        { label: "Notifications", path: "/app/notifications", icon: Bell, badge: unreadNotifs > 0 ? `${unreadNotifs} New` : null, badgeColor: "bg-rose-500 text-white" },
        { label: "Financial Services", path: "/app/financial-services", icon: CreditCard, badge: "Pre-Approved", badgeColor: "bg-indigo-50 text-indigo-700" },
        { label: "Support & Complaints", path: "/app/support", icon: Headphones },
      ]
    }
  ];

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="All Portal Features"
      subtitle="Quick access to your performance and services"
    >
      {/* Executive Quick Profile Snippet */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-brand-100"
          />
          <div>
            <h4 className="text-sm font-bold text-navy-900 leading-snug">{user.name}</h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span className="font-mono">{user.id}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {user.kycStatus || "Verified"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleNavigate('/app/profile')}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm"
        >
          View
        </button>
      </div>

      {/* Menu Categories */}
      <div className="space-y-4">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
              {section.title}
            </h5>
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left tap-active"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Action */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors tap-active"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Executive Portal</span>
        </button>
      </div>
    </BottomSheet>
  );
}
