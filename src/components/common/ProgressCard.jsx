import React from 'react';
import { motion } from 'framer-motion';
import { Target, Gift, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProgressCard({
  title = "NEXT MILESTONE",
  targetName = "Weekly Target",
  target = 50,
  current = 42,
  unit = "Orders",
  percentage = 84,
  remaining = 8,
  reward = "₹500 Bonus",
  linkTo = "/app/milestones",
  className = ""
}) {
  return (
    <div
      className={`bg-gradient-to-br from-navy-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-navy-800 relative overflow-hidden ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-brand-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300">
              {title}
            </span>
          </div>
          {linkTo && (
            <Link
              to={linkTo}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-0.5 group transition-colors"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">{targetName}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className="text-xl font-extrabold text-white">{current}</span>
              <span className="text-slate-400"> / {target} {unit}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-brand-500/20 border border-brand-400/30 text-brand-300 font-bold text-sm">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-slate-700/60 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 via-blue-400 to-emerald-400 shadow-sm"
          />
        </div>

        {/* Footer reward tag */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <p className="text-slate-300">
            <strong className="text-white font-semibold">{remaining} more {unit.toLowerCase()}</strong> to unlock
          </p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>{reward}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
