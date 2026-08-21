import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  Trophy,
  Save,
  Clock,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function ManagerContestPage() {
  const { data, updateContest } = useData();
  const { showToast } = useToast();

  const contest = data.contest;

  const [contestForm, setContestForm] = useState({
    title: contest.title || "Weekly Delivery Champion",
    subtitle: contest.subtitle || "Compete with top executives across the zone to win exciting cash bonuses!",
    dates: contest.dates || "10 Aug – 16 Aug 2024",
    daysRemaining: contest.daysRemaining || 4,
    prize1: contest.prizes?.[0]?.amount || "₹1,000",
    prize2: contest.prizes?.[1]?.amount || "₹750",
    prize3: contest.prizes?.[2]?.amount || "₹500",
  });

  const handleSaveContest = (e) => {
    e.preventDefault();

    const updatedPrizes = [
      {
        position: 1,
        badge: "🥇 1st Place",
        amount: contestForm.prize1,
        description: "Gold Champion Trophy + Instant Payout",
        bgColor: "bg-amber-50 border-amber-200"
      },
      {
        position: 2,
        badge: "🥈 2nd Place",
        amount: contestForm.prize2,
        description: "Silver Runner-Up + Instant Payout",
        bgColor: "bg-slate-50 border-slate-200"
      },
      {
        position: 3,
        badge: "🥉 3rd Place",
        amount: contestForm.prize3,
        description: "Bronze Podium + Instant Payout",
        bgColor: "bg-amber-900/10 border-amber-800/20"
      }
    ];

    updateContest({
      title: contestForm.title,
      subtitle: contestForm.subtitle,
      dates: contestForm.dates,
      daysRemaining: Number(contestForm.daysRemaining),
      prizes: updatedPrizes
    });

    showToast("Weekly contest settings updated and published!", "success");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Weekly Contest Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and maintain weekly performance championship rules, dates, and cash prize tiers.
          </p>
        </div>
      </div>

      {/* Contest Configuration Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy-900">Active Championship Settings</h3>
            <p className="text-xs text-slate-500">Configure contest banner details</p>
          </div>
        </div>

        <form onSubmit={handleSaveContest} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contest Name / Title
            </label>
            <input
              type="text"
              value={contestForm.title}
              onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contest Tagline / Subtitle
            </label>
            <textarea
              rows={2}
              value={contestForm.subtitle}
              onChange={(e) => setContestForm({ ...contestForm, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-navy-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Contest Dates (e.g. 10 Aug – 16 Aug 2024)
              </label>
              <input
                type="text"
                value={contestForm.dates}
                onChange={(e) => setContestForm({ ...contestForm, dates: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Days Remaining
              </label>
              <input
                type="number"
                value={contestForm.daysRemaining}
                onChange={(e) => setContestForm({ ...contestForm, daysRemaining: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Prizes Configuration */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Cash Prize Pool by Rank Position
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                <label className="text-[10px] text-amber-900 font-extrabold uppercase block mb-1">
                  🥇 1st Place Cash Prize
                </label>
                <input
                  type="text"
                  value={contestForm.prize1}
                  onChange={(e) => setContestForm({ ...contestForm, prize1: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-black text-amber-900 text-sm"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-[10px] text-slate-700 font-extrabold uppercase block mb-1">
                  🥈 2nd Place Cash Prize
                </label>
                <input
                  type="text"
                  value={contestForm.prize2}
                  onChange={(e) => setContestForm({ ...contestForm, prize2: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-black text-slate-900 text-sm"
                />
              </div>

              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200">
                <label className="text-[10px] text-orange-900 font-extrabold uppercase block mb-1">
                  🥉 3rd Place Cash Prize
                </label>
                <input
                  type="text"
                  value={contestForm.prize3}
                  onChange={(e) => setContestForm({ ...contestForm, prize3: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-orange-300 rounded-xl font-black text-orange-900 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Contest Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
