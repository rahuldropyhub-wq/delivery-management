import React from 'react';
import { PackageOpen, RotateCcw } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = "No information found",
  description = "There is no data to display under this section at the moment.",
  actionLabel,
  onAction,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-2xl p-8 border border-slate-100 shadow-card text-center flex flex-col items-center justify-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3.5 shadow-sm">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-bold text-navy-900">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
