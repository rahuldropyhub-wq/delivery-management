import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatusBadge from '../components/common/StatusBadge';
import ProgressCard from '../components/common/ProgressCard';
import { Target, Gift, CheckCircle2, Lock, Sparkles, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MilestonesPage() {
  const { activeExecutiveId } = useAuth();
  const { data, getExecutive } = useData();
  const user = getExecutive(activeExecutiveId);
  const currentMilestone = data.milestone;
  const milestoneHistory = data.milestone.history || [];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Current Active Target Banner */}
      <ProgressCard
        title="CURRENT ACTIVE TARGET"
        targetName={currentMilestone.title}
        target={currentMilestone.targetOrders}
        current={currentMilestone.completedOrders}
        unit="Orders"
        percentage={currentMilestone.percentage}
        remaining={currentMilestone.remainingOrders}
        reward={currentMilestone.reward}
        linkTo={null}
      />

      {/* Milestone Tier Ladder */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-navy-900">
              Weekly Milestone Ladder
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cycle: {currentMilestone.period} • Ends {currentMilestone.deadline}
            </p>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-xl">
            {currentMilestone.tiers?.length || 4} Tiers
          </span>
        </div>

        <div className="space-y-3 relative">
          {(currentMilestone.tiers || []).map((tier, idx) => (
            <div
              key={tier.id}
              className={`p-4 rounded-2xl border transition-all ${
                tier.achieved
                  ? 'bg-emerald-50/50 border-emerald-200/80'
                  : tier.isCurrent
                  ? 'bg-blue-50/60 border-brand-300 ring-2 ring-brand-100'
                  : 'bg-slate-50 border-slate-200/80 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    tier.achieved
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : tier.isCurrent
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {tier.achieved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : tier.isCurrent ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-navy-900">
                      {tier.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target: <strong>{tier.target} Orders</strong>
                      {tier.achieved && <span className="text-emerald-700 font-semibold ml-1.5">• Unlocked {tier.achievedAt}</span>}
                      {tier.isCurrent && <span className="text-brand-700 font-semibold ml-1.5">• {currentMilestone.completedOrders}/{tier.target} Completed</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reward</span>
                  <span className={`text-xs sm:text-sm font-extrabold ${
                    tier.achieved ? 'text-emerald-700' : tier.isCurrent ? 'text-brand-600' : 'text-slate-600'
                  }`}>
                    {tier.reward}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Milestones History */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <h3 className="text-sm sm:text-base font-bold text-navy-900 mb-3 pb-2 border-b border-slate-100">
          Previous Milestones History
        </h3>

        <div className="divide-y divide-slate-100">
          {milestoneHistory.map((hist) => (
            <div key={hist.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-navy-900">{hist.period}</h4>
                  <StatusBadge status="Completed" size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Achieved: <strong className="text-slate-800">{hist.achieved} / {hist.target} Orders</strong> ({hist.completionPercentage}%)
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bonus Earned</span>
                  <span className="font-bold text-emerald-700">{hist.reward}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
