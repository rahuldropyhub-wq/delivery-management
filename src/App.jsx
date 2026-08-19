import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Layout
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';

// Portal Feature Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import EarningsPage from './pages/EarningsPage';
import MilestonesPage from './pages/MilestonesPage';
import WeeklyContestPage from './pages/WeeklyContestPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RewardsPage from './pages/RewardsPage';
import ReferralsPage from './pages/ReferralsPage';
import NotificationsPage from './pages/NotificationsPage';
import FinancialServicesPage from './pages/FinancialServicesPage';
import SupportPage from './pages/SupportPage';
import TicketDetailPage from './pages/TicketDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />

            {/* Protected Portal Layout */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="earnings" element={<EarningsPage />} />
              <Route path="milestones" element={<MilestonesPage />} />
              <Route path="weekly-contest" element={<WeeklyContestPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="rewards" element={<RewardsPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="financial-services" element={<FinancialServicesPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="support/:ticketId" element={<TicketDetailPage />} />
            </Route>

            {/* Direct alias redirects for convenience */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
            <Route path="/orders" element={<Navigate to="/app/orders" replace />} />
            <Route path="/earnings" element={<Navigate to="/app/earnings" replace />} />
            <Route path="/milestones" element={<Navigate to="/app/milestones" replace />} />
            <Route path="/weekly-contest" element={<Navigate to="/app/weekly-contest" replace />} />
            <Route path="/leaderboard" element={<Navigate to="/app/leaderboard" replace />} />
            <Route path="/rewards" element={<Navigate to="/app/rewards" replace />} />
            <Route path="/referrals" element={<Navigate to="/app/referrals" replace />} />
            <Route path="/notifications" element={<Navigate to="/app/notifications" replace />} />
            <Route path="/financial-services" element={<Navigate to="/app/financial-services" replace />} />
            <Route path="/support" element={<Navigate to="/app/support" replace />} />
            <Route path="/support/:ticketId" element={<Navigate to="/app/support/:ticketId" replace />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Analytics />
          <SpeedInsights />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
