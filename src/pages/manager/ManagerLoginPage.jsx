import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, ArrowRight, UserCheck, Lock, Building2 } from 'lucide-react';

export default function ManagerLoginPage() {
  const navigate = useNavigate();
  const { loginAsManager } = useAuth();
  const { showToast } = useToast();
  const [selectedManager, setSelectedManager] = useState("Manager 1");

  const handleLogin = (e) => {
    e.preventDefault();
    loginAsManager(selectedManager);
    showToast(`Logged in successfully as ${selectedManager}`, "success");
    navigate('/manager/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-white">
      <div className="max-w-md w-full mx-auto pt-8 sm:pt-14">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            M
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white leading-none block">
              Manager<span className="text-amber-400">Portal</span>
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Delivery Operations Administration
            </span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-md">
              Operations Control
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2.5">
              Hub Manager Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Select your Manager profile to access and maintain delivery executive records.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Active Manager
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedManager("Manager 1")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedManager === "Manager 1"
                      ? "bg-amber-500/15 border-amber-400 text-white ring-2 ring-amber-400/30"
                      : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <UserCheck className={`w-5 h-5 mb-2 ${selectedManager === "Manager 1" ? "text-amber-400" : "text-slate-500"}`} />
                  <p className="font-bold text-sm text-white">Manager 1</p>
                  <p className="text-[10px] text-slate-400">Zone 1 & 3 Operations</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedManager("Manager 2")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedManager === "Manager 2"
                      ? "bg-amber-500/15 border-amber-400 text-white ring-2 ring-amber-400/30"
                      : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <UserCheck className={`w-5 h-5 mb-2 ${selectedManager === "Manager 2" ? "text-amber-400" : "text-slate-500"}`} />
                  <p className="font-bold text-sm text-white">Manager 2</p>
                  <p className="text-[10px] text-slate-400">Zone 2 & 4 Operations</p>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 tap-active"
              >
                <span>Enter as {selectedManager}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Data Management Access</span>
            </span>

            <button
              onClick={() => navigate('/login')}
              className="text-brand-400 hover:underline font-semibold"
            >
              Executive Login →
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-500 max-w-md mx-auto">
        <p>© 2024 DeliveryPro Hub Operations • Manager Panel v1.0</p>
      </footer>
    </div>
  );
}
