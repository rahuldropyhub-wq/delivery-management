import React from 'react';

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-card animate-pulse ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="h-3.5 bg-slate-200 rounded w-1/3" />
        <div className="w-7 h-7 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card animate-pulse">
          <div className="flex justify-between items-start mb-2.5">
            <div className="space-y-1.5 w-2/3">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
            <div className="h-5 bg-slate-200 rounded-full w-20" />
          </div>
          <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
            <div className="h-3.5 bg-slate-100 rounded w-1/4" />
            <div className="h-5 bg-slate-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-7 bg-slate-200 rounded-xl w-24" />
      </div>
      <div className="h-48 bg-slate-100 rounded-xl flex items-end justify-between p-4 gap-2">
        <div className="w-8 bg-slate-200 rounded-t h-1/3" />
        <div className="w-8 bg-slate-200 rounded-t h-2/3" />
        <div className="w-8 bg-slate-200 rounded-t h-1/2" />
        <div className="w-8 bg-slate-200 rounded-t h-4/5" />
        <div className="w-8 bg-slate-200 rounded-t h-3/4" />
        <div className="w-8 bg-slate-200 rounded-t h-full" />
        <div className="w-8 bg-slate-200 rounded-t h-1/4" />
      </div>
    </div>
  );
}
