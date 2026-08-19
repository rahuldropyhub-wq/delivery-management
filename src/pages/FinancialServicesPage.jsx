import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialServicesData } from '../data/financialServices';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import {
  CreditCard,
  Banknote,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Percent,
  Clock
} from 'lucide-react';

export default function FinancialServicesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(null); // 'loan' | 'card' | 'company'
  const [loanAmount, setLoanAmount] = useState(50000);

  const { personalLoan, creditCard, companyCard } = financialServicesData;

  const handleApplyLoan = () => {
    setActiveModal(null);
    showToast(`Loan application of ₹${loanAmount.toLocaleString('en-IN')} submitted! Verification in 2 hours.`, 'success');
  };

  const handleApplyCard = () => {
    setActiveModal(null);
    showToast("Credit Card application received! Delivery to hub in 3 working days.", 'success');
  };

  const handleTopupRequest = () => {
    setActiveModal(null);
    showToast("Fuel allowance top-up request sent to Hub Manager.", 'success');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-navy-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-1 rounded-lg">
            Partner Financial Benefits
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-2">
            Financial Services for Delivery Executives
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Exclusive low-interest loans, fuel cashback credit cards, and prepaid expense wallets designed for DeliveryPro partners.
          </p>
        </div>
      </div>

      {/* 3 Main Product Cards */}
      <div className="space-y-4">
        {/* Card 1: Personal Loan */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Banknote className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-navy-900">Personal Loan</h3>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Pre-Approved
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{personalLoan.tagline}</p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-700">
                  <div className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Up to {personalLoan.maxAmount}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 font-semibold">
                    <Percent className="w-3.5 h-3.5 text-brand-600" />
                    <span>{personalLoan.interestRate}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{personalLoan.tenure}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('loan')}
              className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 tap-active shrink-0"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Credit Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <CreditCard className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-navy-900">Partner RuPay Credit Card</h3>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Lifetime Free
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{creditCard.tagline}</p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-700">
                  <div className="flex items-center gap-1 font-semibold">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                    <span>{creditCard.cashback}</span>
                  </div>
                  <span>•</span>
                  <div className="font-semibold text-slate-700">
                    {creditCard.limit}
                  </div>
                  <span>•</span>
                  <div className="text-emerald-700 font-semibold">
                    {creditCard.annualFee}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('card')}
              className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-navy-900 rounded-2xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 tap-active shrink-0"
            >
              <span>View Offers</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Card 3: Company Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Fuel className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-navy-900">Company Fuel & Expense Card</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{companyCard.tagline}</p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Wallet Balance:</span>
                  <span className="text-lg font-extrabold text-navy-900">{companyCard.currentBalance}</span>
                  <span className="text-[11px] text-slate-400 font-mono">({companyCard.cardNumberMasked})</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('company')}
              className="px-5 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 tap-active shrink-0"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal 1: Personal Loan Eligibility */}
      <Modal
        isOpen={activeModal === 'loan'}
        onClose={() => setActiveModal(null)}
        title="Personal Loan Eligibility"
        subtitle="Pre-approved instant disbursal for delivery partners"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Select Loan Amount</span>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-2xl font-black text-brand-600">
                ₹{loanAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">Max: ₹75,000</span>
            </div>
            <input
              type="range"
              min="10000"
              max="75000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>₹10,000</span>
              <span>₹40,000</span>
              <span>₹75,000</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Monthly Interest Rate:</span>
              <strong className="text-navy-900">1.1% flat</strong>
            </div>
            <div className="flex justify-between">
              <span>Est. Weekly EMI:</span>
              <strong className="text-emerald-700">₹{Math.round(loanAmount / 24 + (loanAmount * 0.011) / 4)} / week</strong>
            </div>
            <div className="flex justify-between">
              <span>Tenure:</span>
              <strong className="text-navy-900">6 Months (24 weeks)</strong>
            </div>
          </div>

          <button
            onClick={handleApplyLoan}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Submit Loan Application
          </button>
        </div>
      </Modal>

      {/* Modal 2: Credit Card Offers */}
      <Modal
        isOpen={activeModal === 'card'}
        onClose={() => setActiveModal(null)}
        title="DeliveryPro Fuel Credit Card"
        subtitle="Exclusive co-branded RuPay partner card"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-tr from-slate-900 to-indigo-900 text-white rounded-2xl shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] tracking-widest text-indigo-300 font-bold uppercase">RuPay Platinum</span>
                <p className="text-base font-extrabold mt-1">DeliveryPro Executive</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-6 flex justify-between items-end">
              <span className="font-mono text-xs tracking-wider text-slate-300">•••• •••• •••• 9840</span>
              <span className="text-xs font-bold text-emerald-400">₹35,000 Limit</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {creditCard.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleApplyCard}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Apply for Free Card
          </button>
        </div>
      </Modal>

      {/* Modal 3: Company Expense Card Details */}
      <Modal
        isOpen={activeModal === 'company'}
        onClose={() => setActiveModal(null)}
        title="Company Expense Card"
        subtitle="Prepaid fuel allowance statement and allowance tracking"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Available Balance</span>
              <p className="text-2xl font-extrabold text-navy-900 mt-0.5">{companyCard.currentBalance}</p>
              <span className="text-[10px] text-slate-500">{companyCard.monthlyAllowanceRemaining} remaining</span>
            </div>
            <button
              onClick={handleTopupRequest}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Request Top-up
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Recent Fuel Transactions</h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {companyCard.recentTransactions.map((tx) => (
                <div key={tx.id} className="p-2.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-navy-900">{tx.merchant}</p>
                    <span className="text-[10px] text-slate-400">{tx.date}</span>
                  </div>
                  <span className={`font-extrabold ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-navy-900'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
