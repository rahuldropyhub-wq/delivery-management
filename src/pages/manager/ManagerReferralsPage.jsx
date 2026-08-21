import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  Share2,
  Users,
  Edit,
  Save,
  CheckCircle2,
  Clock,
  IndianRupee,
  Sparkles
} from 'lucide-react';

export default function ManagerReferralsPage() {
  const { data, updateReferral } = useData();
  const { showToast } = useToast();

  const referralData = data.referrals;
  const referralsList = referralData.referralsList || [];
  const stats = referralData.stats || {};

  const [editingRef, setEditingRef] = useState(null);
  const [refForm, setRefForm] = useState({
    status: "Successful",
    deliveriesCompleted: "25/25",
    reward: "₹300 Credited",
    creditedDate: "Today"
  });

  const handleOpenEdit = (ref) => {
    setEditingRef(ref);
    setRefForm({
      status: ref.status || "In Progress",
      deliveriesCompleted: ref.deliveriesCompleted || "18/25",
      reward: ref.reward || "₹300 Pending",
      creditedDate: ref.creditedDate || "Today"
    });
  };

  const handleSaveReferral = (e) => {
    e.preventDefault();
    if (!editingRef) return;

    updateReferral(editingRef.id, {
      status: refForm.status,
      deliveriesCompleted: refForm.deliveriesCompleted,
      reward: refForm.status === 'Successful' ? '₹300 Credited' : refForm.reward,
      creditedDate: refForm.status === 'Successful' ? (refForm.creditedDate || 'Today') : null
    });

    showToast(`Updated referral candidate ${editingRef.name}`, "success");
    setEditingRef(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Referral Program Administration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and credit referral bonus payments when referred friends complete their 25 deliveries requirement.
          </p>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Invited</span>
          <p className="text-2xl font-extrabold text-navy-900 mt-0.5">{stats.totalInvited || 10}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Registered</span>
          <p className="text-2xl font-extrabold text-brand-600 mt-0.5">{stats.registered || 8}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Successful (25/25)</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{stats.successful || 5}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Referral Payouts</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">₹{stats.totalEarned || 1500}</p>
        </div>
      </div>

      {/* Referrals Network List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-navy-900">
            Referred Candidates Ledger ({referralsList.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Track and update completion progress</p>
        </div>

        <div className="divide-y divide-slate-100">
          {referralsList.map((ref) => (
            <div key={ref.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy-900 text-sm">{ref.name}</span>
                  <StatusBadge status={ref.status} size="sm" />
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Phone: {ref.mobileMasked} • Joined on {ref.date}
                </p>
                <p className="text-slate-700 font-semibold mt-0.5">
                  Deliveries: <strong>{ref.deliveriesCompleted}</strong>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bonus Status</span>
                  <span className={`font-bold ${ref.status === 'Successful' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {ref.reward}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenEdit(ref)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Update</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Edit Candidate Status */}
      <Modal
        isOpen={Boolean(editingRef)}
        onClose={() => setEditingRef(null)}
        title={`Update Candidate: ${editingRef?.name}`}
        subtitle="Modify delivery count or credit referral payout"
      >
        <form onSubmit={handleSaveReferral} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Referral Status
            </label>
            <select
              value={refForm.status}
              onChange={(e) => setRefForm({ ...refForm, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
            >
              <option value="Successful">Successful (25 Deliveries Completed & Bonus Credited)</option>
              <option value="In Progress">In Progress (Active Deliveries)</option>
              <option value="Registered">Registered (0-5 Deliveries)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Deliveries Completed (e.g. 25/25 or 18/25)
            </label>
            <input
              type="text"
              value={refForm.deliveriesCompleted}
              onChange={(e) => setRefForm({ ...refForm, deliveriesCompleted: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setEditingRef(null)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Referral Data</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
