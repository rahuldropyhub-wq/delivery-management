import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';
import { Gift, IndianRupee, Shirt, CheckCircle2, Lock, Sparkles, PackageCheck } from 'lucide-react';

export default function RewardsPage() {
  const { activeExecutiveId } = useAuth();
  const { data, getExecutive, claimReward } = useData();
  const user = getExecutive(activeExecutiveId);
  const { showToast } = useToast();
  const [selectedReward, setSelectedReward] = useState(null);

  const rewards = data.rewards;

  const handleClaim = (reward) => {
    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    claimReward(reward.id, {
      executiveName: user.name,
      executiveId: user.id,
      hub: user.zone || "Nellore Central Hub"
    });

    setSelectedReward(null);
    showToast(`Successfully claimed: ${reward.title || reward.name}!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2.5 py-1 rounded-lg">
            Rewards Program
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-2">
            My Rewards & Merchandise
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Unlock exclusive milestone bonuses and official partner merchandise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Rewards</span>
            <span className="text-lg font-extrabold text-amber-300">
              {(rewards.cashRewards?.length || 0) + (rewards.physicalRewards?.length || 0)} Items
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Cash Rewards */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-navy-900">Cash Rewards</h3>
              <p className="text-[11px] text-slate-400">Directly deposited to your payout bank account</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {(rewards.cashRewards || []).map((reward) => {
            const currentStatus = reward.status;

            return (
              <div
                key={reward.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  currentStatus === 'Unlocked'
                    ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-100'
                    : currentStatus === 'Claimed'
                    ? 'bg-slate-50/60 border-slate-200'
                    : 'bg-slate-50/40 border-slate-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xl font-extrabold text-navy-900">
                      ₹{reward.amount}
                    </span>
                    <StatusBadge status={currentStatus} size="sm" />
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-navy-900 mt-2">
                    {reward.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {reward.criteria}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {currentStatus === 'Unlocked' ? (
                    <button
                      onClick={() => setSelectedReward(reward)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 tap-active"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Claim ₹{reward.amount} Bonus</span>
                    </button>
                  ) : currentStatus === 'Claimed' ? (
                    <span className="text-[11px] font-semibold text-indigo-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Credited to Bank Account</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked (In Progress)</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Physical Merchandise Rewards */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-navy-900">Physical Rewards & Merchandise</h3>
              <p className="text-[11px] text-slate-400">Collect gear from your local hub manager</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(rewards.physicalRewards || []).map((item) => {
            const currentStatus = item.status;

            return (
              <div
                key={item.id}
                className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between"
              >
                <div className="flex gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <StatusBadge status={currentStatus} size="sm" />
                    <h4 className="text-xs sm:text-sm font-bold text-navy-900 mt-1.5 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">
                      {item.type}
                    </p>
                    {item.size && (
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">
                        {item.size}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 text-xs">
                  {currentStatus === 'Unlocked' ? (
                    <button
                      onClick={() => setSelectedReward(item)}
                      className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 tap-active"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Claim & Pickup at Hub</span>
                    </button>
                  ) : currentStatus === 'Delivered' ? (
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>{item.trackingNote || "Delivered to Partner"}</span>
                    </p>
                  ) : currentStatus === 'Claimed' ? (
                    <p className="text-[11px] text-slate-600 font-medium">
                      {item.deliveryStatus || "Processing for Dispatch"}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{item.progress || "Locked"}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward Claim Confirmation Modal */}
      <Modal
        isOpen={Boolean(selectedReward)}
        onClose={() => setSelectedReward(null)}
        title="Claim Your Reward"
        subtitle="Confirm redemption for your achieved milestone"
      >
        {selectedReward && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-navy-900">
                {selectedReward.title || selectedReward.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {selectedReward.description || "Your reward will be credited or made ready for pickup at your Nellore Hub."}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-navy-900">{user.name} ({user.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-navy-900">
                  {selectedReward.amount ? (user.payoutAccount?.bankName || "HDFC Bank") : `${user.city || 'Nellore'} Central Hub Desk`}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleClaim(selectedReward)}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Confirm Claim
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
