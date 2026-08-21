import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Trophy, Award, Clock, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeeklyContestPage() {
  const { activeExecutiveId } = useAuth();
  const { data, getExecutive } = useData();
  const user = getExecutive(activeExecutiveId);
  const contest = data.contest;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Contest Banner Card */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-900" />
              Live Contest
            </span>
            <span className="text-xs text-amber-100 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {contest.daysRemaining || 4} days remaining
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {contest.title}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl leading-relaxed">
            {contest.subtitle}
          </p>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <span>Contest Duration: <strong>{contest.dates}</strong></span>
            <Link
              to="/app/leaderboard"
              className="px-3 py-1.5 rounded-xl bg-white text-orange-700 font-bold hover:bg-amber-50 transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>View Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* User's Position Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-navy-900">Your Contest Standing</h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            {contest.userStanding?.trend || "Live Standing"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Current Rank</span>
            <p className="text-2xl font-extrabold text-brand-600 mt-0.5">
              #{user.stats.rank || contest.userStanding?.position || 12}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Orders Count</span>
            <p className="text-2xl font-extrabold text-navy-900 mt-0.5">
              {user.stats.weeklyOrders}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Gap to Top 10</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">
              {Math.max(0, 48 - user.stats.weeklyOrders)} Orders
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Zone Standing</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">
              Top 15%
            </p>
          </div>
        </div>
      </div>

      {/* Prize Pool Cards */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <h3 className="text-sm font-bold text-navy-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Contest Prize Pool & Rewards</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {(contest.prizes || []).map((prize) => (
            <div
              key={prize.position}
              className={`p-4 rounded-2xl border ${prize.bgColor || 'bg-slate-50 border-slate-200'} flex flex-col justify-between text-left`}
            >
              <div>
                <span className="text-xs font-extrabold text-navy-900 block">
                  {prize.badge}
                </span>
                <p className="text-2xl font-extrabold text-navy-900 mt-1">
                  {prize.amount}
                </p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {prize.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-black/5 text-[10px] font-bold text-slate-500 uppercase">
                Instant Bank Payout
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <h3 className="text-sm font-bold text-navy-900 mb-3 pb-2 border-b border-slate-100">
          Contest Rules & Eligibility
        </h3>

        <div className="space-y-2.5 text-xs text-slate-600">
          {(contest.rules || []).map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
