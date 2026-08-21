import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Loader2, Sparkles, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ManagerOtpVerificationPage() {
  const navigate = useNavigate();
  const { pendingManagerEmail, activeManager, verifyEmailOtp, sendEmailOtp } = useAuth();
  const { showToast } = useToast();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
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
    showToast("Demo Security Code 123456 entered", "info");
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullCode = otp.join('');
    
    if (fullCode.length < 6) {
      setErrorMessage("Please enter all 6 digits of the security OTP.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    const result = await verifyEmailOtp(fullCode, 'manager');
    setIsVerifying(false);

    if (result.success) {
      showToast(`Authenticated successfully as ${activeManager}`, "success");
      navigate('/manager/dashboard');
    } else {
      setErrorMessage(result.error || "Invalid Security OTP code.");
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    const result = await sendEmailOtp(pendingManagerEmail, 'manager');
    setIsResending(false);

    if (result && !result.success) {
      showToast(result.error || "Failed to resend OTP", "error");
      return;
    }

    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setErrorMessage("");
    showToast(result?.message || "New security OTP sent", "success");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-white">
      <div className="max-w-md w-full mx-auto pt-6 sm:pt-10">
        {/* Back Link */}
        <Link
          to="/manager/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manager Login</span>
        </Link>

        {/* Verification Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-md">
              Security Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2.5">
              Verify Manager Mail OTP
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Security verification code sent to <strong className="text-amber-300 font-semibold">{pendingManagerEmail}</strong>
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
                        ? 'border-rose-400 bg-rose-950/40 text-rose-300 focus:ring-2 focus:ring-rose-400/30'
                        : digit
                        ? 'border-amber-400 bg-amber-500/15 text-white focus:ring-2 focus:ring-amber-400/30'
                        : 'border-slate-700 bg-slate-900/80 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                    }`}
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-400 mt-2.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Quick Demo Fill Helper */}
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-slate-900/60 border border-slate-700/80 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Click to Enter Demo OTP: <strong>123456</strong></span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 tap-active"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Manager Key...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Enter Manager Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 flex flex-col items-center justify-center gap-2 text-xs">
            {timer > 0 ? (
              <p className="text-slate-400 font-medium">
                Resend code in <span className="text-white font-bold">00:{timer < 10 ? `0${timer}` : timer}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 tap-active"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>Resend Security OTP</span>
              </button>
            )}

            <Link
              to="/manager/login"
              className="text-slate-400 hover:text-white font-medium mt-1 underline"
            >
              Change manager email
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-500 max-w-md mx-auto">
        <p>© 2024 DeliveryPro Hub Operations • Manager Panel v1.0</p>
      </footer>
    </div>
  );
}
