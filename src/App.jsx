import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Layouts
import AppLayout from './components/layout/AppLayout';
import ManagerLayout from './components/layout/ManagerLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';
import ManagerLoginPage from './pages/manager/ManagerLoginPage';

// Executive Portal Feature Pages (Phase 1)
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

// Manager Portal Pages (Phase 2)
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import ManagerExecutivesPage from './pages/manager/ManagerExecutivesPage';
import ManagerOrdersPage from './pages/manager/ManagerOrdersPage';
import ManagerEarningsPage from './pages/manager/ManagerEarningsPage';
import ManagerMilestonesPage from './pages/manager/ManagerMilestonesPage';
import ManagerContestPage from './pages/manager/ManagerContestPage';
import ManagerLeaderboardPage from './pages/manager/ManagerLeaderboardPage';
import ManagerRewardsPage from './pages/manager/ManagerRewardsPage';
import ManagerReferralsPage from './pages/manager/ManagerReferralsPage';
import ManagerNotificationsPage from './pages/manager/ManagerNotificationsPage';
import ManagerSupportPage from './pages/manager/ManagerSupportPage';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

              {/* Public Executive Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-otp" element={<OtpVerificationPage />} />

              {/* Public Manager Auth Route */}
              <Route path="/manager/login" element={<ManagerLoginPage />} />

              {/* Protected Executive Portal Layout */}
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

              {/* Protected Manager Portal Layout */}
              <Route path="/manager" element={<ManagerLayout />}>
                <Route index element={<Navigate to="/manager/dashboard" replace />} />
                <Route path="dashboard" element={<ManagerDashboardPage />} />
                <Route path="executives" element={<ManagerExecutivesPage />} />
                <Route path="orders" element={<ManagerOrdersPage />} />
                <Route path="earnings" element={<ManagerEarningsPage />} />
                <Route path="milestones" element={<ManagerMilestonesPage />} />
                <Route path="contest" element={<ManagerContestPage />} />
                <Route path="leaderboard" element={<ManagerLeaderboardPage />} />
                <Route path="rewards" element={<ManagerRewardsPage />} />
                <Route path="referrals" element={<ManagerReferralsPage />} />
                <Route path="notifications" element={<ManagerNotificationsPage />} />
                <Route path="support" element={<ManagerSupportPage />} />
              </Route>

              {/* Direct alias redirects */}
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
      </DataProvider>
    </BrowserRouter>
  );
}
