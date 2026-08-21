import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  Bell,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export default function ManagerNotificationsPage() {
  const { data, addNotification } = useData();
  const { showToast } = useToast();

  const notifications = data.notifications || [];
  const executives = data.executives || [];

  const [broadcastForm, setBroadcastForm] = useState({
    title: "Surge Pay Active in Zone 3",
    message: "Earn an extra ₹30 bonus per order tonight between 7 PM and 10 PM in Nellore Central.",
    recipientExecutiveId: "all",
    tag: "Surge",
    emoji: "⚡",
    actionUrl: "/app/orders"
  });

  const handleSendBroadcast = (e) => {
    e.preventDefault();

    addNotification({
      title: broadcastForm.title,
      message: broadcastForm.message,
      recipientExecutiveId: broadcastForm.recipientExecutiveId,
      tag: broadcastForm.tag,
      emoji: broadcastForm.emoji,
      actionUrl: broadcastForm.actionUrl
    });

    const targetText = broadcastForm.recipientExecutiveId === 'all' ? 'all executives' : 'selected executive';
    showToast(`Notification broadcasted to ${targetText}!`, "success");

    setBroadcastForm({
      title: "",
      message: "",
      recipientExecutiveId: "all",
      tag: "General",
      emoji: "📢",
      actionUrl: "/app/dashboard"
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Broadcast & Notification Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Send real-time alerts, surge notifications, milestone milestones, and safety updates to executives.
          </p>
        </div>
      </div>

      {/* Grid: Composer & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer Form */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Compose Notification</h3>
              <p className="text-xs text-slate-500">Sends alert directly to executive notification bell</p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Recipient Audience
              </label>
              <select
                value={broadcastForm.recipientExecutiveId}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, recipientExecutiveId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              >
                <option value="all">📢 Broadcast to All Executives</option>
                {executives.map((exec) => (
                  <option key={exec.id} value={exec.id}>👤 Direct to {exec.name} ({exec.id})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Tag / Category
                </label>
                <select
                  value={broadcastForm.tag}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, tag: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
                >
                  <option value="Milestone">Milestone</option>
                  <option value="Surge">Surge Alert</option>
                  <option value="Bonus">Bonus / Payout</option>
                  <option value="Leaderboard">Leaderboard</option>
                  <option value="Referral">Referral</option>
                  <option value="Safety">Safety & Weather</option>
                  <option value="General">General Announcement</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Emoji Icon
                </label>
                <input
                  type="text"
                  value={broadcastForm.emoji}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, emoji: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center text-base"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Notification Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ₹500 Bonus Credited!"
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Message Content *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Write the message text here..."
                value={broadcastForm.message}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Direct Link Action
              </label>
              <select
                value={broadcastForm.actionUrl}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, actionUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              >
                <option value="/app/dashboard">Dashboard</option>
                <option value="/app/milestones">Milestones</option>
                <option value="/app/orders">Orders</option>
                <option value="/app/earnings">Earnings</option>
                <option value="/app/weekly-contest">Weekly Contest</option>
                <option value="/app/leaderboard">Leaderboard</option>
                <option value="/app/rewards">Rewards</option>
                <option value="/app/referrals">Referrals</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notification</span>
            </button>
          </form>
        </div>

        {/* Sent Notifications Log */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Sent Notifications Log</h3>
              <p className="text-xs text-slate-500">{notifications.length} notifications in system</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto no-scrollbar">
            {notifications.map((notif) => (
              <div key={notif.id} className="py-3.5 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-navy-900">
                    <span>{notif.emoji || '📢'}</span>
                    <span className="truncate">{notif.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase shrink-0">
                    {notif.tag || 'General'}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {notif.timeAgo || "Recently"} • {notif.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
