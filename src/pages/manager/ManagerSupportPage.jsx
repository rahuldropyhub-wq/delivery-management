import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import FilterTabs from '../../components/common/FilterTabs';
import {
  Headphones,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  User,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ManagerSupportPage() {
  const { data, replyTicket, updateTicketStatus } = useData();
  const { activeManager } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const tickets = data.tickets || [];
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [managerReplyText, setManagerReplyText] = useState("");

  useEffect(() => {
    const paramTicket = searchParams.get('ticket');
    if (paramTicket) {
      setSelectedTicketId(paramTicket);
    }
  }, [searchParams]);

  const filterCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length
  };

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === 'open' && t.status !== 'Open') return false;
    if (statusFilter === 'inProgress' && t.status !== 'In Progress') return false;
    if (statusFilter === 'resolved' && t.status !== 'Resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchSubject = t.subject.toLowerCase().includes(q);
      const matchExec = t.executiveName?.toLowerCase().includes(q);
      return matchId || matchSubject || matchExec;
    }
    return true;
  });

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0] || null;

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!managerReplyText.trim() || !activeTicket) return;

    replyTicket(activeTicket.id, {
      sender: "agent",
      senderName: `${activeManager} (Hub Operations)`,
      message: managerReplyText.trim(),
      status: activeTicket.status === 'Open' ? 'In Progress' : activeTicket.status
    });

    setManagerReplyText("");
    showToast(`Response sent to ${activeTicket.executiveName || "Executive"}!`, "success");
  };

  const handleChangeStatus = (newStatus) => {
    if (!activeTicket) return;
    updateTicketStatus(activeTicket.id, newStatus);
    showToast(`Ticket ${activeTicket.id} marked as ${newStatus}`, "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Support Helpdesk & Complaints Resolution
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review inquiries, investigate delivery discrepancies, and reply to partner tickets.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FilterTabs
          tabs={[
            { id: "all", label: "All Tickets", count: filterCounts.all },
            { id: "open", label: "Open", count: filterCounts.open },
            { id: "inProgress", label: "In Progress", count: filterCounts.inProgress },
            { id: "resolved", label: "Resolved", count: filterCounts.resolved },
          ]}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Split View: Tickets Queue & Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tickets Queue List (1 col) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-2 max-h-[700px] overflow-y-auto no-scrollbar">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Ticket Queue ({filteredTickets.length})
          </h3>

          {filteredTickets.map((t) => {
            const isSelected = activeTicket?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-xs space-y-1 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/20'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-navy-900">{t.id}</span>
                  <StatusBadge status={t.status} size="sm" />
                </div>
                <h4 className="font-bold text-navy-900 line-clamp-1">{t.subject}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {t.executiveName || "Rahul Sharma"} • {t.category}
                </p>
                <p className="text-[10px] text-slate-400 pt-1">
                  {t.createdAt} • {t.messages?.length || 1} messages
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Ticket Detail & Reply Thread (2 cols) */}
        {activeTicket ? (
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              {/* Ticket Top Info */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-navy-900">{activeTicket.id}</span>
                    <StatusBadge status={activeTicket.status} size="md" />
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {activeTicket.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy-900 mt-1">
                    {activeTicket.subject}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Raised by <strong>{activeTicket.executiveName || "Rahul Sharma"}</strong> ({activeTicket.executiveId || "EXE12345"}) • {activeTicket.createdAt}
                  </p>
                </div>

                {/* Status Switcher Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {activeTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => handleChangeStatus('Resolved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {activeTicket.status === 'Open' && (
                    <button
                      onClick={() => handleChangeStatus('In Progress')}
                      className="px-3 py-1.5 bg-blue-50 text-brand-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors"
                    >
                      <span>In Progress</span>
                    </button>
                  )}

                  {activeTicket.status === 'Resolved' && (
                    <button
                      onClick={() => handleChangeStatus('In Progress')}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      <span>Re-open</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="py-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {(activeTicket.messages || []).map((msg, idx) => {
                  const isAgent = msg.sender === 'agent';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-500">
                        <span className="font-semibold">{msg.senderName}:</span> {msg.message}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 text-xs ${isAgent ? 'flex-row-reverse' : ''}`}
                    >
                      {msg.avatar ? (
                        <img
                          src={msg.avatar}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}

                      <div className={`max-w-[80%] rounded-2xl p-3.5 ${
                        isAgent
                          ? 'bg-amber-500 text-slate-950 rounded-tr-none font-medium'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <span className={`font-bold text-[11px] ${isAgent ? 'text-slate-950 font-black' : 'text-navy-900'}`}>
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {msg.time}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manager Reply Box */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={managerReplyText}
                onChange={(e) => setManagerReplyText(e.target.value)}
                placeholder={`Type official manager response as ${activeManager}...`}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!managerReplyText.trim()}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Send Reply</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-3xl p-10 border border-slate-200/80 shadow-sm text-center text-slate-400 text-xs">
            Select a ticket from the queue to view and respond.
          </div>
        )}
      </div>
    </div>
  );
}
