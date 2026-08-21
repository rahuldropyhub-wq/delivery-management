import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ShieldCheck,
  Award,
  Bike,
  CreditCard,
  HeartPulse,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function ProfilePage() {
  const { activeExecutiveId } = useAuth();
  const { getExecutive } = useData();
  const user = getExecutive(activeExecutiveId);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-brand-100 shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full ring-4 ring-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                  {user.name}
                </h2>
                <p className="text-xs font-mono font-semibold text-slate-400 mt-0.5">
                  Executive ID: {user.id}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 sm:mt-0">
                <StatusBadge status={user.kycStatus || "Verified"} size="md" />
                <StatusBadge status={user.accountStatus || "Active"} size="md" />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Lifetime Orders</span>
                <span className="font-extrabold text-navy-900 text-sm">
                  {user.totalDeliveriesLifetime?.toLocaleString('en-IN') || 0}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Partner Rating</span>
                <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1 justify-center sm:justify-start">
                  ★ {user.rating} / 5.0
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Operating Zone</span>
                <span className="font-bold text-navy-900 text-xs truncate block">
                  {user.city} ({user.zone?.split('(')[1]?.replace(')', '') || 'Zone 3'})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3.5 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span>Personal Information</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Mobile Number</span>
              <p className="font-semibold text-navy-900 mt-0.5">{user.mobile}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Email Address</span>
              <p className="font-semibold text-navy-900 mt-0.5">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Date of Birth</span>
                <p className="font-semibold text-navy-900 mt-0.5">{user.dob}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Blood Group</span>
                <p className="font-semibold text-navy-900 mt-0.5">{user.bloodGroup}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Emergency Contact</span>
              <p className="font-semibold text-navy-900 mt-0.5">{user.emergencyContact}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Joining Date</span>
              <p className="font-semibold text-navy-900 mt-0.5">{user.joiningDate}</p>
            </div>
          </div>
        </div>

        {/* Vehicle & License Info */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3.5 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bike className="w-4 h-4 text-brand-600" />
            <span>Vehicle & License</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Registered Vehicle</span>
              <p className="font-semibold text-navy-900 mt-0.5">
                {user.vehicleInfo?.model} ({user.vehicleInfo?.type})
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Registration Number</span>
              <p className="font-mono font-bold text-navy-900 mt-0.5">{user.vehicleInfo?.regNumber}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Driving License (DL)</span>
              <p className="font-mono font-bold text-navy-900 mt-0.5">{user.drivingLicense}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Insurance Validity</span>
              <p className="font-semibold text-emerald-700 mt-0.5">
                Valid until {user.vehicleInfo?.insuranceExpiry}
              </p>
            </div>
          </div>
        </div>

        {/* Payout & Bank Account (Display only) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card md:col-span-2">
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3.5 pb-2 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-600" />
            <span>Linked Payout Bank Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block text-[11px]">Bank Name</span>
              <p className="font-bold text-navy-900 mt-0.5">{user.payoutAccount?.bankName}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block text-[11px]">Account Number</span>
              <p className="font-mono font-bold text-navy-900 mt-0.5">{user.payoutAccount?.accountNumberMasked}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block text-[11px]">IFSC Code</span>
              <p className="font-mono font-bold text-navy-900 mt-0.5">{user.payoutAccount?.ifsc}</p>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/60 text-slate-600 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Bank details are managed and verified by your Hub Operations Manager.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
