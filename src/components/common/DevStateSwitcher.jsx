import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Sliders,
  CheckCircle,
  Loader2,
  PackageOpen,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

export default function DevStateSwitcher() {
  const { uiStateMode, setUiStateMode } = useAuth();
  const { resetToDefaults } = useData();
  const [isExpanded, setIsExpanded] = useState(false);

  const modes = [
    { id: 'normal', label: 'Live Normal Data', icon: CheckCircle, color: 'text-emerald-600' },
    { id: 'loading', label: 'Skeleton Loading UI', icon: Loader2, color: 'text-brand-600' },
    { id: 'empty', label: 'Empty State UI', icon: PackageOpen, color: 'text-amber-600' },
    { id: 'error', label: 'Error Fallback UI', icon: AlertCircle, color: 'text-rose-600' }
  ];

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden transition-all text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 flex items-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors w-full"
        >
          <Sliders className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">UI Mode:</span>
          <span className="font-bold text-navy-900 capitalize">{uiStateMode}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 ml-1 text-slate-400" />}
        </button>

        {isExpanded && (
          <div className="p-3 border-t border-slate-100 flex flex-col gap-3 min-w-[200px] bg-slate-50/70">

            {/* UI State Simulation */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                UI State Simulation
              </span>
              <div className="grid grid-cols-2 gap-1">
                {modes.map((m) => {
                  const Icon = m.icon;
                  const isCurrent = uiStateMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setUiStateMode(m.id);
                        setIsExpanded(false);
                      }}
                      className={`px-2 py-1 rounded text-[11px] text-left flex items-center gap-1 transition-colors ${
                        isCurrent
                          ? 'bg-slate-200 font-bold text-slate-900'
                          : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${m.color}`} />
                      <span>{m.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset to Factory Defaults */}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={resetToDefaults}
                className="w-full py-1.5 px-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
