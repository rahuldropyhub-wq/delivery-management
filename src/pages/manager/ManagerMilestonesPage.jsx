import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressCard from '../../components/common/ProgressCard';
import {
  Target,
  Gift,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

export default function ManagerMilestonesPage() {
  const { data, updateMilestone } = useData();
  const { showToast } = useToast();

  const milestone = data.milestone;

  const [milestoneForm, setMilestoneForm] = useState({
    title: milestone.title || "Weekly Target",
    targetOrders: milestone.targetOrders || 50,
    completedOrders: milestone.completedOrders || 42,
    reward: milestone.reward || "₹500 Bonus",
    period: milestone.period || "12 Aug - 18 Aug 2024",
    deadline: milestone.deadline || "18 Aug 2024, 11:59 PM"
  });

  const [tiers, setTiers] = useState(milestone.tiers || []);

  const handleSaveActiveMilestone = (e) => {
    e.preventDefault();
    updateMilestone({
      title: milestoneForm.title,
      targetOrders: Number(milestoneForm.targetOrders),
      completedOrders: Number(milestoneForm.completedOrders),
      reward: milestoneForm.reward,
      period: milestoneForm.period,
      deadline: milestoneForm.deadline,
      tiers: tiers
    });
    showToast("Active weekly milestone updated and published!", "success");
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Weekly Milestones Administration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Set order thresholds, incentive rewards, and milestone ladders for all delivery partners.
          </p>
        </div>
      </div>

      {/* Live Preview Card */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Live Executive View Preview
        </h3>
        <ProgressCard
          title="ACTIVE MILESTONE PREVIEW"
          targetName={milestoneForm.title}
          target={Number(milestoneForm.targetOrders)}
          current={Number(milestoneForm.completedOrders)}
          unit="Orders"
          percentage={Math.min(100, Math.round((Number(milestoneForm.completedOrders) / Number(milestoneForm.targetOrders)) * 100))}
          remaining={Math.max(0, Number(milestoneForm.targetOrders) - Number(milestoneForm.completedOrders))}
          reward={milestoneForm.reward}
        />
      </div>

      {/* Milestone Settings Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Active Milestone Configuration</h3>
              <p className="text-xs text-slate-500">Edit current target and unlockable cash bonus</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveActiveMilestone} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Milestone Title
              </label>
              <input
                type="text"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Reward Amount / Description
              </label>
              <input
                type="text"
                value={milestoneForm.reward}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, reward: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Target Orders Threshold
              </label>
              <input
                type="number"
                value={milestoneForm.targetOrders}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, targetOrders: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-navy-900 text-sm focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Executive Completed Orders (Rahul Demo)
              </label>
              <input
                type="number"
                value={milestoneForm.completedOrders}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, completedOrders: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-brand-600 text-sm focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Cycle Period (e.g. 12 Aug - 18 Aug 2024)
              </label>
              <input
                type="text"
                value={milestoneForm.period}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, period: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Deadline Timestamp
              </label>
              <input
                type="text"
                value={milestoneForm.deadline}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Tier Ladder Editor */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Milestone Tier Ladder</span>
            </h4>

            <div className="space-y-2">
              {tiers.map((tier, idx) => (
                <div key={tier.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Tier Name</label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Target (Orders)</label>
                    <input
                      type="number"
                      value={tier.target}
                      onChange={(e) => handleTierChange(idx, 'target', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Reward</label>
                    <input
                      type="text"
                      value={tier.reward}
                      onChange={(e) => handleTierChange(idx, 'reward', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-emerald-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Milestones</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
