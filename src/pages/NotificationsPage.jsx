import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import FilterTabs from '../components/common/FilterTabs';
import { useToast } from '../context/ToastContext';
import { CheckCheck, Bell, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';

export default function NotificationsPage() {
  const { showToast } = useToast();
  const { data, markNotificationRead, markAllNotificationsRead } = useData();
  const [filter, setFilter] = useState("all");

  const notifications = data.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const handleMarkAsRead = (id) => {
    markNotificationRead(id);
    showToast("Notification marked as read", "info");
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsRead();
    showToast("All notifications marked as read", "success");
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy-900">Notifications</h2>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread updates` : "You're all caught up!"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 tap-active"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs
        tabs={[
          { id: "all", label: "All Notifications", count: notifications.length },
          { id: "unread", label: "Unread", count: unreadCount },
        ]}
        activeTab={filter}
        onChange={setFilter}
      />

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="There are no unread notifications to display right now."
          actionLabel="Show All Notifications"
          onAction={() => setFilter('all')}
        />
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.isRead
                  ? 'bg-white border-slate-100 shadow-card opacity-85'
                  : 'bg-white border-brand-200 shadow-card ring-1 ring-brand-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  {item.emoji || '📢'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-navy-900 leading-snug">
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.timeAgo} • {item.date}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase shrink-0">
                      {item.tag || 'General'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-xs">
                    {item.actionUrl ? (
                      <Link
                        to={item.actionUrl}
                        className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span />
                    )}

                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-[11px] font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as read</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
