import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  User,
  Building2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function DevStateSwitcher() {
  const { uiStateMode, setUiStateMode, role, switchRole, activeExecutiveId, activeManager } = useAuth();
  const { data, resetToDefaults } = useData();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isManagerPage = location.pathname.startsWith('/manager');

  const modes = [
    { id: 'normal', label: 'Live Normal Data', icon: CheckCircle, color: 'text-emerald-600' },
    { id: 'loading', label: 'Skeleton Loading UI', icon: Loader2, color: 'text-brand-600' },
    { id: 'empty', label: 'Empty State UI', icon: PackageOpen, color: 'text-amber-600' },
    { id: 'error', label: 'Error Fallback UI', icon: AlertCircle, color: 'text-rose-600' }
  ];

  const handleSwitchToManager = (mgrName = "Manager 1") => {
    switchRole('manager', mgrName);
    setIsExpanded(false);
    navigate('/manager/dashboard');
  };

  const handleSwitchToExecutive = (execId = "EXE12345") => {
    switchRole('executive', execId);
    setIsExpanded(false);
    navigate('/app/dashboard');
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden transition-all text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 flex items-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors w-full"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Portal Switcher:</span>
          <span className="font-bold text-navy-900 capitalize">
            {isManagerPage ? `Manager (${activeManager})` : `Executive (${activeExecutiveId === 'EXE12345' ? 'Rahul' : 'Exec'})`}
          </span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 ml-1 text-slate-400" />}
        </button>

        {isExpanded && (
          <div className="p-3 border-t border-slate-100 flex flex-col gap-3 min-w-[240px] bg-slate-50/70">
            {/* Quick Portal Switcher */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Switch Portal Role
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleSwitchToExecutive('EXE12345')}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors ${
                    !isManagerPage && activeExecutiveId === 'EXE12345'
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-600" />
                    <span>Executive (Rahul Sharma)</span>
                  </div>
                  {!isManagerPage && activeExecutiveId === 'EXE12345' && <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                </button>

                <button
                  onClick={() => handleSwitchToManager('Manager 1')}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors ${
                    isManagerPage && activeManager === 'Manager 1'
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Manager 1 Panel</span>
                  </div>
                  {isManagerPage && activeManager === 'Manager 1' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                </button>

                <button
                  onClick={() => handleSwitchToManager('Manager 2')}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors ${
                    isManagerPage && activeManager === 'Manager 2'
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Manager 2 Panel</span>
                  </div>
                  {isManagerPage && activeManager === 'Manager 2' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                </button>
              </div>
            </div>

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
