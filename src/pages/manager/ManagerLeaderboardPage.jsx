import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  Award,
  Trophy,
  Save,
  Edit,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function ManagerLeaderboardPage() {
  const { data, updateLeaderboard } = useData();
  const { showToast } = useToast();

  const leaderboard = data.leaderboard;
  const [zoneName, setZoneName] = useState(leaderboard.zoneName || "Nellore Zone & Coastal Region");
  const [period, setPeriod] = useState(leaderboard.period || "This Week (10 Aug - 16 Aug)");
  const [rankings, setRankings] = useState(leaderboard.rankingsList || []);

  const handleRankOrderChange = (index, newOrders) => {
    const updated = [...rankings];
    updated[index] = { ...updated[index], orders: Number(newOrders) };
    setRankings(updated);
  };

  const handleSaveLeaderboard = (e) => {
    e.preventDefault();

    // Sort by orders descending
    const sorted = [...rankings].sort((a, b) => b.orders - a.orders).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    updateLeaderboard({
      zoneName,
      period,
      rankingsList: sorted
    });

    setRankings(sorted);
    showToast("Leaderboard rankings sorted and published!", "success");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Zone Leaderboard Administration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain rankings, completed orders count, and partner standings for the zone.
          </p>
        </div>
      </div>

      {/* Leaderboard Table / Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <form onSubmit={handleSaveLeaderboard} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Zone Title
              </label>
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Active Cycle Period
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-navy-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              Executive Rankings List ({rankings.length})
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {rankings.map((exec, idx) => (
                <div
                  key={exec.id || idx}
                  className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm w-7 text-slate-500">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-navy-900">{exec.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{exec.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-semibold">Orders:</label>
                      <input
                        type="number"
                        value={exec.orders}
                        onChange={(e) => handleRankOrderChange(idx, e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg font-bold text-navy-900 text-center"
                      />
                    </div>

                    <span className="text-slate-500 font-semibold w-20 text-right">
                      {exec.earnings}
                    </span>
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
              <span>Sort & Publish Leaderboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
