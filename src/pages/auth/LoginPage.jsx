import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, ArrowRight, Mail, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { sendEmailOtp } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await sendEmailOtp(data.email, 'executive');
    setIsLoading(false);

    if (result && !result.success) {
      showToast(result.error || "Failed to send Email OTP", "error");
      return;
    }

    showToast(result?.message || `OTP sent successfully to ${data.email}`, "success");
    navigate('/verify-otp');
  };

  const handleQuickFill = () => {
    setValue("email", "rahul.sharma@deliverypro.in", { shouldValidate: true });
    showToast("Filled: rahul.sharma@deliverypro.in", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Brand Header */}
      <div className="max-w-md w-full mx-auto pt-6 sm:pt-10">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-glow-brand">
            D
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-navy-900 leading-none block">
              Delivery<span className="text-brand-600">Pro</span>
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Delivery Executive Portal
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
              Executive Sign In
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-2.5">
              Welcome Back 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Enter your registered email address to receive your 6-digit verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Registered Email Address
              </label>
              <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100 transition-all">
                <div className="px-3.5 py-3.5 border-r border-slate-200 text-slate-400 flex items-center justify-center bg-slate-100/60 rounded-l-2xl">
                  <Mail className="w-4 h-4 text-brand-600" />
                </div>
                <input
                  type="email"
                  placeholder="name@deliverypro.in"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className="w-full px-3.5 py-3.5 bg-transparent text-navy-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none tracking-wide"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-rose-600 mt-1.5 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 tap-active"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Mail OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Mail OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-500">Secure Email OTP authentication</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 max-w-md mx-auto">
        <p>© 2024 DeliveryPro Technologies. Partner Portal v1.0</p>
      </footer>
    </div>
  );
}
