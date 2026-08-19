import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { referralData } from '../data/referrals';
import StatusBadge from '../components/common/StatusBadge';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Copy,
  Share2,
  Check,
  Send,
  MessageCircle,
  IndianRupee,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ReferralsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const stats = referralData.stats;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralData.referralCode);
    setCopied(true);
    showToast(`Referral code ${referralData.referralCode} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join DeliveryPro as a Delivery Executive using my referral code *${referralData.referralCode}* and earn high weekly payouts + signup bonuses! Register here: ${referralData.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Join DeliveryPro using code ${referralData.referralCode}: ${referralData.referralLink}`
    );
    window.open(`https://t.me/share/url?url=${referralData.referralLink}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Referral Code Hero Card */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-800 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="relative z-10 text-center max-w-md mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full inline-block mb-2">
            Refer & Earn ₹300 per Friend
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Invite Friends & Grow Together
          </h2>

          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            {referralData.termsSummary}
          </p>

          {/* Referral Code Box */}
          <div className="mt-5 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between gap-3">
            <div className="text-left pl-2">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Your Referral Code</span>
              <span className="text-xl sm:text-2xl font-mono font-black tracking-widest text-white">
                {referralData.referralCode}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 bg-white hover:bg-blue-50 text-brand-700 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 tap-active shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Share Buttons */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 tap-active"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleShareTelegram}
              className="flex-1 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 tap-active"
            >
              <Send className="w-4 h-4" />
              <span>Share on Telegram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Invited</span>
          <p className="text-2xl font-extrabold text-navy-900 mt-0.5">{stats.totalInvited}</p>
          <span className="text-[10px] text-slate-400">Contacts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Registered</span>
          <p className="text-2xl font-extrabold text-brand-600 mt-0.5">{stats.registered}</p>
          <span className="text-[10px] text-slate-400">Account created</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Successful</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{stats.successful}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">25 Deliveries done</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Earned</span>
          <p className="text-2xl font-extrabold text-navy-900 mt-0.5">₹{stats.totalEarned}</p>
          <span className="text-[10px] text-slate-400">₹{stats.pendingBonus} in progress</span>
        </div>
      </div>

      {/* Referral History List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
        <h3 className="text-sm font-bold text-navy-900 mb-3 pb-2 border-b border-slate-100">
          Your Referral Network ({referralData.referralsList.length})
        </h3>

        <div className="divide-y divide-slate-100">
          {referralData.referralsList.map((ref) => (
            <div key={ref.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-navy-900">{ref.name}</h4>
                  <StatusBadge status={ref.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {ref.mobileMasked} • Joined {ref.date}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Deliveries: <strong className="text-navy-900">{ref.deliveriesCompleted}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bonus Status</span>
                <span className={`text-xs font-bold ${
                  ref.status === 'Successful' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {ref.reward}
                </span>
                {ref.creditedDate && (
                  <span className="text-[10px] text-slate-400 block">Credited on {ref.creditedDate}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
