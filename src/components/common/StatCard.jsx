import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({
  title,
  value,
  subtitle = "This Week",
  icon: Icon,
  accentColor = "blue", // "blue" | "emerald" | "amber" | "purple"
  trend,
  onClick,
  className = ""
}) {
  const accentStyles = {
    blue: {
      bg: "bg-blue-50 text-brand-600 border-blue-100",
      pill: "text-brand-700 bg-brand-50/80",
      valueColor: "text-navy-900"
    },
    emerald: {
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pill: "text-emerald-700 bg-emerald-50/80",
      valueColor: "text-navy-900"
    },
    amber: {
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      pill: "text-amber-700 bg-amber-50/80",
      valueColor: "text-navy-900"
    },
    purple: {
      bg: "bg-purple-50 text-purple-600 border-purple-100",
      pill: "text-purple-700 bg-purple-50/80",
      valueColor: "text-navy-900"
    }
  };

  const style = accentStyles[accentColor] || accentStyles.blue;

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-card relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-card-hover hover:border-slate-200' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${style.bg} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-1">
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${style.valueColor}`}>
          {value}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-slate-400">
        <span>{subtitle}</span>
        {trend && (
          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
