import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileMoreDrawer from './MobileMoreDrawer';
import DesktopSidebar from './DesktopSidebar';
import DesktopHeader from './DesktopHeader';
import DevStateSwitcher from '../common/DevStateSwitcher';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Fixed Sidebar */}
      <DesktopSidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header */}
        <MobileHeader onOpenMenu={() => setIsMoreOpen(true)} />

        {/* Desktop Header */}
        <DesktopHeader />

        {/* Dynamic Page Outlet with smooth fade transition */}
        <main className="flex-1 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 py-5 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav onOpenMore={() => setIsMoreOpen(true)} />

        {/* Mobile Slide-Up More Drawer */}
        <MobileMoreDrawer
          isOpen={isMoreOpen}
          onClose={() => setIsMoreOpen(false)}
        />

        {/* Quick State Simulation Switcher (Loading/Empty/Error previewer) */}
        <DevStateSwitcher />
      </div>
    </div>
  );
}
