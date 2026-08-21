import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  Gift,
  Shirt,
  IndianRupee,
  CheckCircle2,
  PackageCheck,
  Edit,
  Save,
  Truck,
  Building2,
  Sparkles
} from 'lucide-react';

export default function ManagerRewardsPage() {
  const { data, updateReward } = useData();
  const { showToast } = useToast();

  const rewards = data.rewards;
  const cashRewards = rewards.cashRewards || [];
  const physicalRewards = rewards.physicalRewards || [];

  const [editingItem, setEditingItem] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "Delivered",
    trackingNote: "Collected at Nellore Hub by executive"
  });

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setStatusForm({
      status: item.status || "Claimed",
      trackingNote: item.trackingNote || "Handed over by Hub Manager"
    });
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    updateReward(editingItem.id, {
      status: statusForm.status,
      trackingNote: statusForm.trackingNote,
      deliveryStatus: statusForm.status === 'Delivered' ? 'Delivered' : `In Transit / ${statusForm.status}`
    });

    showToast(`Updated reward status for ${editingItem.title || editingItem.name}`, "success");
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Rewards & Merchandise Fulfillment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage unlock status, claims, dispatch, and hub handover for merchandise and cash bonuses.
          </p>
        </div>
      </div>

      {/* Physical Merchandise Tracking Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Physical Merchandise Inventory & Dispatch</h3>
              <p className="text-xs text-slate-500">Track delivery status of partner gear</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {physicalRewards.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-navy-900 text-xs leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase mt-0.5">{item.type}</p>
                      {item.size && <p className="text-[11px] text-slate-600 mt-0.5">{item.size}</p>}
                    </div>
                  </div>

                  <StatusBadge status={item.status} size="sm" />
                </div>

                <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-700">Fulfillment Note:</p>
                  <p className="text-slate-500 mt-0.5">{item.trackingNote || item.deliveryStatus || "No fulfillment update yet."}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Update Fulfillment Status</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Rewards Catalog Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy-900">Cash Incentive Bonuses</h3>
            <p className="text-xs text-slate-500">Milestone bonuses eligible for executive bank transfer</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {cashRewards.map((reward) => (
            <div key={reward.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy-900 text-sm">{reward.title}</span>
                  <StatusBadge status={reward.status} size="sm" />
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">{reward.criteria}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-black text-emerald-700 text-base">₹{reward.amount}</span>
                <button
                  onClick={() => handleOpenEdit(reward)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Update status"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Edit Reward Status */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title={`Update Status: ${editingItem?.title || editingItem?.name}`}
        subtitle="Changes will reflect on executive's reward dashboard"
      >
        <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Fulfillment Status
            </label>
            <select
              value={statusForm.status}
              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
            >
              <option value="Unlocked">Unlocked (Ready to Claim)</option>
              <option value="Claimed">Claimed (Processing)</option>
              <option value="Dispatched">Dispatched to Hub</option>
              <option value="Delivered">Delivered / Handed Over</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tracking Note / Hub Handover Detail
            </label>
            <textarea
              rows={3}
              value={statusForm.trackingNote}
              onChange={(e) => setStatusForm({ ...statusForm, trackingNote: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-navy-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Status</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
