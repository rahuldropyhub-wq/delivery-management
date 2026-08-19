import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Package, Wallet, Gift, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav({ onOpenMore }) {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/app/dashboard', icon: Home },
    { label: 'Orders', path: '/app/orders', icon: Package },
    { label: 'Earnings', path: '/app/earnings', icon: Wallet },
    { label: 'Rewards', path: '/app/rewards', icon: Gift },
  ];

  const isMoreActive = [
    '/app/profile',
    '/app/milestones',
    '/app/weekly-contest',
    '/app/leaderboard',
    '/app/referrals',
    '/app/notifications',
    '/app/financial-services',
    '/app/support'
  ].some((p) => location.pathname.startsWith(p));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 shadow-nav lg:hidden pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl tap-active transition-all relative ${
                isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active-pill"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-600 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight font-medium ${isActive ? 'font-bold text-brand-600' : ''}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* More Tab Button */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl tap-active transition-all relative ${
            isMoreActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Open full menu"
        >
          <div className="relative">
            <MoreHorizontal className={`w-5 h-5 transition-transform ${isMoreActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
            {isMoreActive && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-600 rounded-full" />
            )}
          </div>
          <span className={`text-[11px] mt-1 tracking-tight font-medium ${isMoreActive ? 'font-bold text-brand-600' : ''}`}>
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
