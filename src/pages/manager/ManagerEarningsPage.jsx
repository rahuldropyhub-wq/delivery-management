import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  Wallet,
  IndianRupee,
  Gift,
  Users,
  CheckCircle2,
  Clock,
  Edit,
  Save,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function ManagerEarningsPage() {
  const { data, updateEarnings, updatePayoutStatus, getExecutive } = useData();
  const { showToast } = useToast();

  const executives = data.executives || [];
  const earningsSummary = data.earnings.summary;
  const payoutHistory = data.earnings.payoutHistory || [];

  const [selectedExecutiveId, setSelectedExecutiveId] = useState("EXE12345");
  const currentExec = getExecutive(selectedExecutiveId);

  const [earningsForm, setEarningsForm] = useState({
    deliveryEarnings: currentExec.stats?.deliveryEarnings ?? 4200,
    bonusEarnings: currentExec.stats?.bonusEarnings ?? 500,
    referralEarnings: currentExec.stats?.referralEarnings ?? 300
  });

  const [editingPayout, setEditingPayout] = useState(null);
  const [payoutForm, setPayoutForm] = useState({
    status: "Credited",
    utr: "HDFCN24229988101",
    expectedDate: "18 Aug 2024"
  });

  const handleSelectExecutive = (id) => {
    setSelectedExecutiveId(id);
    const exec = getExecutive(id);
    setEarningsForm({
      deliveryEarnings: exec.stats?.deliveryEarnings ?? 4200,
      bonusEarnings: exec.stats?.bonusEarnings ?? 500,
      referralEarnings: exec.stats?.referralEarnings ?? 300
    });
  };

  const handleSaveEarnings = (e) => {
    e.preventDefault();
    updateEarnings(selectedExecutiveId, {
      deliveryEarnings: Number(earningsForm.deliveryEarnings),
      bonusEarnings: Number(earningsForm.bonusEarnings),
      referralEarnings: Number(earningsForm.referralEarnings)
    });
    showToast(`Earnings ledger updated for ${currentExec.name}!`, "success");
  };

  const handleOpenEditPayout = (payout) => {
    setEditingPayout(payout);
    setPayoutForm({
      status: payout.status,
      utr: payout.utr === "Pending" ? `HDFCN${Math.floor(10000000000 + Math.random() * 90000000000)}` : payout.utr,
      expectedDate: payout.expectedDate
    });
  };

  const handleSavePayout = (e) => {
    e.preventDefault();
    if (!editingPayout) return;

    updatePayoutStatus(editingPayout.id, {
      status: payoutForm.status,
      utr: payoutForm.utr,
      expectedDate: payoutForm.expectedDate
    });

    showToast(`Payout cycle ${editingPayout.id} updated!`, "success");
    setEditingPayout(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Earnings & Payout Ledger Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure delivery compensation, bonus payouts, and process bank transfer status for executives.
          </p>
        </div>
      </div>

      {/* Grid: Executive Earnings Adjustment & Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Executive Earnings Editor */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-navy-900">
              Executive Compensation Adjuster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Select partner to modify weekly earnings</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Executive:
            </label>
            <select
              value={selectedExecutiveId}
              onChange={(e) => handleSelectExecutive(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-navy-900 focus:bg-white focus:outline-none"
            >
              {executives.map((exec) => (
                <option key={exec.id} value={exec.id}>{exec.name} ({exec.id})</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSaveEarnings} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Trip Delivery Earnings (₹)
              </label>
              <input
                type="number"
                value={earningsForm.deliveryEarnings}
                onChange={(e) => setEarningsForm({ ...earningsForm, deliveryEarnings: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Milestone & Incentive Bonus (₹)
              </label>
              <input
                type="number"
                value={earningsForm.bonusEarnings}
                onChange={(e) => setEarningsForm({ ...earningsForm, bonusEarnings: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Referral Program Payout (₹)
              </label>
              <input
                type="number"
                value={earningsForm.referralEarnings}
                onChange={(e) => setEarningsForm({ ...earningsForm, referralEarnings: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Live Total Calculated */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-900">Total Calculated Payout:</span>
              <span className="text-base font-black text-emerald-700">
                ₹{(Number(earningsForm.deliveryEarnings) + Number(earningsForm.bonusEarnings) + Number(earningsForm.referralEarnings)).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Update Executive Earnings</span>
            </button>
          </form>
        </div>

        {/* Right Column: Payout Cycles Manager (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-900">
                Weekly Payout Cycles Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage bank transfer status and UTR references</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
              {payoutHistory.length} Cycles
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-navy-900 text-sm">{payout.id}</span>
                    <StatusBadge status={payout.status.includes('Credited') ? 'Completed' : 'Pending'} size="sm" />
                  </div>
                  <p className="text-slate-600">
                    Cycle: <strong>{payout.period}</strong> • {payout.bank}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Expected / Processed Date: {payout.expectedDate} • UTR: {payout.utr}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Disbursal</span>
                    <span className="text-base font-extrabold text-navy-900">
                      ₹{payout.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenEditPayout(payout)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 transition-colors"
                    title="Edit Payout Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Edit Payout Cycle */}
      <Modal
        isOpen={Boolean(editingPayout)}
        onClose={() => setEditingPayout(null)}
        title={`Update Payout Cycle ${editingPayout?.id}`}
        subtitle="Mark as credited and enter transaction UTR reference"
      >
        <form onSubmit={handleSavePayout} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Disbursal Status
            </label>
            <select
              value={payoutForm.status}
              onChange={(e) => setPayoutForm({ ...payoutForm, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
            >
              <option value="Credited">Credited (Transferred)</option>
              <option value="Pending Transfer">Pending Transfer</option>
              <option value="Processing">Processing</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Bank UTR / Transaction Reference Number
            </label>
            <input
              type="text"
              value={payoutForm.utr}
              onChange={(e) => setPayoutForm({ ...payoutForm, utr: e.target.value })}
              placeholder="e.g. HDFCN24218849102"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-navy-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Scheduled / Credited Date
            </label>
            <input
              type="text"
              value={payoutForm.expectedDate}
              onChange={(e) => setPayoutForm({ ...payoutForm, expectedDate: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setEditingPayout(null)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Payout</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
