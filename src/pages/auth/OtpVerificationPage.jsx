import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Mail, Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const { pendingEmail, verifyEmailOtp, sendEmailOtp } = useAuth();
  const { showToast } = useToast();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    setErrorMessage("");
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleQuickFillDemo = () => {
    const demo = ["1", "2", "3", "4", "5", "6"];
    setOtp(demo);
    setErrorMessage("");
    showToast("Demo OTP 123456 entered", "info");
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullCode = otp.join('');
    
    if (fullCode.length < 6) {
      setErrorMessage("Please enter all 6 digits of the OTP.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    const result = await verifyEmailOtp(fullCode, 'executive');
    setIsVerifying(false);

    if (result.success) {
      showToast("Verification successful! Entering dashboard...", "success");
      navigate('/app/dashboard');
    } else {
      setErrorMessage(result.error || "Invalid OTP code entered.");
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    const result = await sendEmailOtp(pendingEmail, 'executive');
    setIsResending(false);

    if (result && !result.success) {
      showToast(result.error || "Failed to resend OTP", "error");
      return;
    }

    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setErrorMessage("");
    showToast(result?.message || "New OTP sent to your email", "success");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full mx-auto pt-6 sm:pt-10">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change email address</span>
        </Link>

        {/* Verification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
              Email Authentication
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-2.5">
              Verify Email OTP
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              6-digit verification code sent to <strong className="text-navy-900 font-semibold">{pendingEmail}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 Digit OTP Boxes */}
            <div>
              <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-full aspect-square text-center text-lg sm:text-xl font-bold rounded-2xl border transition-all focus:outline-none ${
                      errorMessage
                        ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus:ring-4 focus:ring-rose-100'
                        : digit
                        ? 'border-brand-500 bg-brand-50/20 text-navy-900 focus:ring-4 focus:ring-brand-100'
                        : 'border-slate-200 bg-slate-50/60 text-navy-900 focus:border-brand-600 focus:ring-4 focus:ring-brand-100'
                    }`}
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mt-2.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Quick Demo Fill Helper */}
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 bg-brand-50/80 hover:bg-brand-50 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click to Fill Demo OTP: <strong>123456</strong></span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 tap-active"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center justify-center gap-2 text-xs">
            {timer > 0 ? (
              <p className="text-slate-400 font-medium">
                Resend OTP in <span className="text-navy-900 font-bold">00:{timer < 10 ? `0${timer}` : timer}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1.5 tap-active"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>Resend Email OTP Code</span>
              </button>
            )}

            <Link
              to="/login"
              className="text-slate-500 hover:text-slate-700 font-medium mt-1 underline"
            >
              Change email address
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 max-w-md mx-auto">
        <p>© 2024 DeliveryPro Technologies. Partner Portal v1.0</p>
      </footer>
    </div>
  );
}
