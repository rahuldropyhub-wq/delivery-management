import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Wallet,
  Target,
  Trophy,
  Award,
  Gift,
  Share2,
  Bell,
  Headphones,
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

export default function ManagerLayout() {
  const { isManagerAuthenticated, activeManager, setActiveManager, logoutManager } = useAuth();
  const { data } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openTicketsCount = (data.tickets || []).filter((t) => t.status === 'Open').length;

  if (!isManagerAuthenticated) {
    return <Navigate to="/manager/login" replace />;
  }

  const managerLinks = [
    { label: "Overview", path: "/manager/dashboard", icon: LayoutDashboard },
    { label: "Executives", path: "/manager/executives", icon: Users, badge: `${data.executives?.length ?? 0}` },
    { label: "Orders History", path: "/manager/orders", icon: Package, badge: `${data.orders?.length ?? 0}` },
    { label: "Earnings & Payouts", path: "/manager/earnings", icon: Wallet },
    { label: "Milestones", path: "/manager/milestones", icon: Target },
    { label: "Weekly Contest", path: "/manager/contest", icon: Trophy },
    { label: "Leaderboard", path: "/manager/leaderboard", icon: Award },
    { label: "Rewards & Dispatch", path: "/manager/rewards", icon: Gift },
    { label: "Referrals", path: "/manager/referrals", icon: Share2 },
    { label: "Broadcast Center", path: "/manager/notifications", icon: Bell },
    { label: "Support Helpdesk", path: "/manager/support", icon: Headphones, badge: openTicketsCount > 0 ? `${openTicketsCount} Open` : null, badgeColor: "bg-rose-500 text-white" },
  ];

  const handleLogout = () => {
    logoutManager();
    navigate('/manager/login');
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Manager Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 h-screen sticky top-0">
        {/* Brand & Manager Profile */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-md">
              M
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white leading-none block">
                Manager<span className="text-amber-400">Portal</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Hyderabad Hub Control
              </span>
            </div>
          </div>

          {/* Active Manager Selector Toggle */}
          <div className="mt-4 p-2 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">{activeManager}</span>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveManager("Manager 1")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                  activeManager === "Manager 1" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                M1
              </button>
              <button
                type="button"
                onClick={() => setActiveManager("Manager 2")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                  activeManager === "Manager 2" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                M2
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 no-scrollbar text-xs">
          {managerLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    link.badgeColor || "bg-slate-800 text-amber-300 border border-slate-700"
                  }`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>



        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-left text-xs">
            <p className="font-bold text-white leading-none">{activeManager}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Hub Operations Admin</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            title="Sign Out of Manager Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Manager Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 pt-4 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200"
              aria-label="Toggle Manager Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
                M
              </div>
              <span className="font-bold text-sm">Manager Portal ({activeManager})</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-slate-300 border-b border-slate-800 p-4 space-y-1 z-20">
            <div className="p-2 bg-slate-800 rounded-xl mb-3 flex justify-between items-center text-xs">
              <span className="font-bold text-white">Active: {activeManager}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveManager("Manager 1")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeManager === "Manager 1" ? "bg-amber-500 text-slate-950" : "bg-slate-700 text-slate-300"}`}
                >
                  M1
                </button>
                <button
                  onClick={() => setActiveManager("Manager 2")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeManager === "Manager 2" ? "bg-amber-500 text-slate-950" : "bg-slate-700 text-slate-300"}`}
                >
                  M2
                </button>
              </div>
            </div>

            {managerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-rose-400 text-xs font-bold bg-rose-500/10 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200/80 px-8 py-3.5 sticky top-0 z-20 shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Operational Management
            </span>
            <h1 className="text-lg font-bold text-navy-900 mt-0.5">
              Hub Performance & Data Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">Data Store: <strong>Synchronized</strong></span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
