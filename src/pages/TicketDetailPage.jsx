import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Send, ShieldCheck, Headphones, CheckCircle2, User } from 'lucide-react';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { activeExecutiveId } = useAuth();
  const { data, getExecutive, replyTicket } = useData();
  const user = getExecutive(activeExecutiveId);
  const { showToast } = useToast();

  const ticket = (data.tickets || []).find((t) => t.id === ticketId) || data.tickets[0];
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    replyTicket(ticket.id, {
      sender: "user",
      senderName: user.name,
      avatar: user.avatar,
      message: replyText.trim()
    });

    setReplyText("");
    showToast("Reply sent to support desk", "info");
  };

  if (!ticket) {
    return (
      <div className="p-10 text-center text-slate-500">
        Ticket not found. <Link to="/app/support" className="text-brand-600 font-bold">Back to tickets</Link>
      </div>
    );
  }

  const messages = ticket.messages || [];

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        to="/app/support"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all tickets</span>
      </Link>

      {/* Ticket Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-extrabold text-navy-900">{ticket.id}</span>
            <StatusBadge status={ticket.status} size="md" />
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
              {ticket.category}
            </span>
          </div>
          <span className="text-xs text-slate-400">Created: {ticket.createdAt}</span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-navy-900 mt-3">
          {ticket.subject}
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Messages / Discussion Thread */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
          Conversation Thread ({messages.length} messages)
        </h3>

        <div className="space-y-3.5">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">{msg.senderName}:</span> {msg.message}
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${isUser ? 'flex-row-reverse' : ''}`}
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
                  isUser
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className={`font-bold text-[11px] ${isUser ? 'text-blue-100' : 'text-navy-900'}`}>
                      {msg.senderName}
                    </span>
                    <span className={`text-[10px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your message or response..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-600"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50 tap-active"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
