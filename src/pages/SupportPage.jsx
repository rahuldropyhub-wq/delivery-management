import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatusBadge from '../components/common/StatusBadge';
import FilterTabs from '../components/common/FilterTabs';
import { useToast } from '../context/ToastContext';
import { Headphones, Send, PlusCircle, Clock, ChevronRight, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { activeExecutiveId } = useAuth();
  const { data, getExecutive, createTicket, supportCategories } = useData();
  const user = getExecutive(activeExecutiveId);
  const tickets = data.tickets || [];

  const [filter, setFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const filterCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'open') return t.status === 'Open';
    if (filter === 'inProgress') return t.status === 'In Progress';
    if (filter === 'resolved') return t.status === 'Resolved';
    return true;
  });

  const onSubmit = async (formData) => {
    await new Promise((r) => setTimeout(r, 400));

    const newTicket = createTicket({
      category: formData.category,
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority || "Medium",
      executiveId: user.id,
      executiveName: user.name
    });

    reset();
    setShowCreateForm(false);
    showToast(`Support Ticket ${newTicket.id} created successfully!`, 'success');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-navy-900">
              Partner Support & Complaints
            </h2>
            <p className="text-xs text-slate-500">
              Nellore Hub Helpdesk • Average response time: under 2 hours
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 tap-active shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showCreateForm ? "Close Form" : "Raise New Complaint"}</span>
        </button>
      </div>

      {/* Raise Complaint Form (Collapsible) */}
      {showCreateForm && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-200 shadow-lg ring-1 ring-brand-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-navy-900">
              Submit an Issue or Inquiry
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your issue category and describe what happened with relevant order or payout details.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Issue Category *
                </label>
                <select
                  {...register("category", { required: "Please select an issue category" })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-brand-600"
                >
                  <option value="">-- Select Issue Category --</option>
                  {(supportCategories || []).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  defaultValue="Medium"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:bg-white focus:outline-none focus:border-brand-600"
                >
                  <option value="Low">Low - General Query</option>
                  <option value="Medium">Medium - Standard Issue</option>
                  <option value="High">High - Urgent Earnings / Order Problem</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Line *
              </label>
              <input
                type="text"
                placeholder="e.g. Surge pay discrepancy for Order ORD123456"
                {...register("subject", { required: "Subject is required" })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy-900 focus:bg-white focus:outline-none focus:border-brand-600"
              />
              {errors.subject && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                placeholder="Please describe the issue in detail including any Order ID, date, or payout reference..."
                {...register("description", { required: "Description is required", minLength: { value: 10, message: "Please provide at least 10 characters" } })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy-900 focus:bg-white focus:outline-none focus:border-brand-600"
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Complaint"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-navy-900">
              My Support Tickets ({tickets.length})
            </h3>
            <p className="text-xs text-slate-500">Track and respond to raised inquiries</p>
          </div>

          <FilterTabs
            tabs={[
              { id: "all", label: "All Tickets", count: filterCounts.all },
              { id: "open", label: "Open", count: filterCounts.open },
              { id: "inProgress", label: "In Progress", count: filterCounts.inProgress },
              { id: "resolved", label: "Resolved", count: filterCounts.resolved },
            ]}
            activeTab={filter}
            onChange={setFilter}
          />
        </div>

        {/* Tickets List */}
        <div className="divide-y divide-slate-100">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/app/support/${ticket.id}`)}
              className="py-4 hover:bg-slate-50/80 -mx-2 px-2 rounded-2xl cursor-pointer transition-colors flex items-start justify-between gap-3 tap-active"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-navy-900">{ticket.id}</span>
                  <StatusBadge status={ticket.status} size="sm" />
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {ticket.category}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-navy-900 leading-snug">
                  {ticket.subject}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-1">
                  {ticket.description}
                </p>

                <p className="text-[10px] text-slate-400 font-medium pt-1">
                  Created: {ticket.createdAt} • {ticket.messages?.length || 1} messages
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2">
                <span className="text-xs font-semibold text-brand-600 hidden sm:inline">View Thread</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
