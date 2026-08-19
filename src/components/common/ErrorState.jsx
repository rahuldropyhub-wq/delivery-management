import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = "Unable to load information",
  description = "An unexpected error occurred while fetching your data. Please try again.",
  onRetry,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-2xl p-8 border border-rose-100 shadow-card text-center flex flex-col items-center justify-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-3.5 shadow-sm">
        <AlertTriangle className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h4 className="text-base font-bold text-navy-900">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
