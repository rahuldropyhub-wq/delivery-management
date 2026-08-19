import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaderboardData } from '../data/leaderboard';
import { Trophy, Award, Medal, Flame, Sparkles, TrendingUp } from 'lucide-react';
import FilterTabs from '../components/common/FilterTabs';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("thisWeek");

  const podium = leaderboardData.topPerformers;
  const rankings = leaderboardData.rankingsList;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy-900">Zone Leaderboard</h2>
          <p className="text-xs text-slate-500">
            {leaderboardData.zoneName} • {leaderboardData.period}
          </p>
        </div>

        <FilterTabs
          tabs={[
            { id: "thisWeek", label: "This Week" },
            { id: "lastWeek", label: "Last Week" },
            { id: "thisMonth", label: "This Month" }
          ]}
          activeTab={period}
          onChange={setPeriod}
        />
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
        {/* 2nd Place (Silver) */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-card flex flex-col items-center text-center order-1 relative">
          <div className="absolute -top-3 w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center shadow-sm">
            2
          </div>
          <img
            src={podium[1].avatar}
            alt={podium[1].name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-slate-300 mt-2"
          />
          <h4 className="text-xs sm:text-sm font-bold text-navy-900 mt-2 truncate w-full">
            {podium[1].name}
          </h4>
          <span className="text-[10px] sm:text-xs font-extrabold text-brand-600">
            {podium[1].orders} Orders
          </span>
          <span className="text-[10px] text-slate-400">
            {podium[1].earnings}
          </span>
        </div>

        {/* 1st Place (Gold) - Elevated */}
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-3.5 sm:p-5 border-2 border-amber-300 shadow-lg flex flex-col items-center text-center order-2 relative -mt-3">
          <div className="absolute -top-4 w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-md">
            👑 1
          </div>
          <img
            src={podium[0].avatar}
            alt={podium[0].name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-amber-400 mt-2 shadow-sm"
          />
          <h4 className="text-xs sm:text-sm font-extrabold text-navy-900 mt-2 truncate w-full">
            {podium[0].name}
          </h4>
          <span className="text-xs sm:text-sm font-extrabold text-amber-600">
            {podium[0].orders} Orders
          </span>
          <span className="text-[10px] text-slate-400">
            {podium[0].earnings}
          </span>
        </div>

        {/* 3rd Place (Bronze) */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-amber-100 shadow-card flex flex-col items-center text-center order-3 relative">
          <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center shadow-sm">
            3
          </div>
          <img
            src={podium[2].avatar}
            alt={podium[2].name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-amber-200 mt-2"
          />
          <h4 className="text-xs sm:text-sm font-bold text-navy-900 mt-2 truncate w-full">
            {podium[2].name}
          </h4>
          <span className="text-[10px] sm:text-xs font-extrabold text-brand-600">
            {podium[2].orders} Orders
          </span>
          <span className="text-[10px] text-slate-400">
            {podium[2].earnings}
          </span>
        </div>
      </div>

      {/* Sticky User Position Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-blue-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-extrabold text-base">
            #12
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm">Your Standing</span>
              <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded">YOU</span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Rahul Sharma • 42 Orders completed
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-blue-200 block">Weekly Earnings</span>
          <span className="text-base font-extrabold">₹4,250</span>
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-card">
        <h3 className="text-sm font-bold text-navy-900 mb-3 pb-2 border-b border-slate-100">
          Complete Executive Rankings
        </h3>

        <div className="divide-y divide-slate-100">
          {rankings.map((exec) => {
            const isUser = exec.isCurrentUser;
            return (
              <div
                key={exec.rank}
                className={`py-3 px-3 rounded-2xl flex items-center justify-between transition-colors ${
                  isUser
                    ? 'bg-brand-50/80 border border-brand-200/80 my-1'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`font-mono text-xs font-extrabold w-7 text-center ${
                    isUser ? 'text-brand-700 font-black text-sm' : 'text-slate-500'
                  }`}>
                    #{exec.rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs truncate ${isUser ? 'font-black text-navy-900' : 'font-bold text-slate-800'}`}>
                        {exec.name}
                      </span>
                      {isUser && (
                        <span className="text-[9px] font-extrabold bg-brand-600 text-white px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {exec.id} • ★ {exec.rating}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs ${isUser ? 'font-black text-brand-700' : 'font-bold text-navy-900'}`}>
                    {exec.orders} Orders
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {exec.earnings}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
