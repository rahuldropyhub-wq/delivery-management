import React from 'react';
import { Check, X, Clock, ShieldCheck, AlertTriangle, Lock, Gift, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const norm = String(status || '').toLowerCase().trim();

  let config = {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: null
  };

  if (norm.includes('completed') || norm === 'delivered' || norm === 'resolved') {
    config = {
      label: norm === 'delivered' ? '✓ Delivered' : norm === 'resolved' ? '✓ Resolved' : '✓ Completed',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium',
      icon: <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
    };
  } else if (norm.includes('cancel')) {
    config = {
      label: '✕ Cancelled',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium',
      icon: <X className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
    };
  } else if (norm.includes('review') || norm.includes('progress') || norm === 'pending') {
    config = {
      label: norm.includes('review') ? '◷ Under Review' : norm.includes('progress') ? '◷ In Progress' : '⏳ Pending',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium',
      icon: <Clock className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />
    };
  } else if (norm === 'active') {
    config = {
      label: '● Active',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
      icon: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
    };
  } else if (norm === 'verified') {
    config = {
      label: '✓ Verified',
      bg: 'bg-blue-50 text-brand-700 border-brand-200 font-semibold',
      icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-brand-600 stroke-[2.5]" />
    };
  } else if (norm === 'unlocked') {
    config = {
      label: '🎁 Unlocked',
      bg: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
      icon: <Gift className="w-3.5 h-3.5 shrink-0 text-amber-600" />
    };
  } else if (norm === 'claimed') {
    config = {
      label: '✓ Claimed',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
    };
  } else if (norm === 'locked') {
    config = {
      label: '🔒 Locked',
      bg: 'bg-slate-100 text-slate-500 border-slate-200 font-medium',
      icon: <Lock className="w-3 h-3 shrink-0 text-slate-400" />
    };
  } else if (norm === 'open') {
    config = {
      label: '● Open',
      bg: 'bg-sky-50 text-sky-700 border-sky-200 font-semibold',
      icon: <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
    };
  }

  const sizeClasses = size === 'lg'
    ? 'text-sm px-3 py-1 gap-1.5'
    : size === 'md'
    ? 'text-xs px-2.5 py-0.5 gap-1.5'
    : 'text-[11px] px-2 py-0.5 gap-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm select-none ${sizeClasses} ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label.replace(/^[✓✕◷●🎁🔒⏳]\s*/, '')}</span>
    </span>
  );
}
