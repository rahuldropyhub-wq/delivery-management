import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser } from '../data/user';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('dp_auth');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [pendingMobile, setPendingMobile] = useState(() => {
    return localStorage.getItem('dp_pending_mobile') || "+91 9876543210";
  });

  const [user, setUser] = useState(currentUser);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [uiStateMode, setUiStateMode] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'

  useEffect(() => {
    localStorage.setItem('dp_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    if (pendingMobile) {
      localStorage.setItem('dp_pending_mobile', pendingMobile);
    }
  }, [pendingMobile]);

  // Setup invisible reCAPTCHA verifier for Firebase Phone Auth
  const setupRecaptcha = (containerId = 'recaptcha-container') => {
    if (!isFirebaseConfigured) return null;
    
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved - allow signInWithPhoneNumber
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        }
      });
    }
    return window.recaptchaVerifier;
  };

  const sendOtp = async (mobile) => {
    setPendingMobile(mobile);

    // Format mobile number to E.164 standard (e.g. +919876543210)
    const cleaned = mobile.replace(/[^0-9+]/g, '');
    const formatted = cleaned.startsWith('+') ? cleaned : `+91${cleaned.slice(-10)}`;

    if (isFirebaseConfigured) {
      try {
        const verifier = setupRecaptcha('recaptcha-container');
        const confirmation = await signInWithPhoneNumber(auth, formatted, verifier);
        setConfirmationResult(confirmation);
        return {
          success: true,
          isFirebase: true,
          message: `Live SMS OTP sent by Firebase to ${formatted}`
        };
      } catch (error) {
        console.error("Firebase sendOtp error:", error);
        // Reset reCAPTCHA on error
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          } catch (e) {}
        }
        return {
          success: false,
          error: error.message || "Failed to send live SMS OTP. Please check your Firebase settings."
        };
      }
    } else {
      // Fallback demo simulation
      await new Promise((r) => setTimeout(r, 600));
      return {
        success: true,
        isFirebase: false,
        message: `Demo OTP sent: 123456 (Configure .env for Live Firebase SMS)`
      };
    }
  };

  const verifyOtp = async (otp) => {
    if (isFirebaseConfigured && confirmationResult) {
      try {
        const result = await confirmationResult.confirm(otp);
        const firebaseUser = result.user;
        
        setIsAuthenticated(true);
        setUser((prev) => ({
          ...prev,
          mobile: firebaseUser.phoneNumber || pendingMobile
        }));
        return { success: true };
      } catch (error) {
        console.error("Firebase verifyOtp error:", error);
        return {
          success: false,
          error: error.code === 'auth/invalid-verification-code'
            ? "Incorrect OTP code. Please check your SMS and try again."
            : error.message || "Verification failed"
        };
      }
    } else {
      // Mock validation
      await new Promise((r) => setTimeout(r, 600));
      if (otp === "123456") {
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: "Invalid OTP. Enter 123456 for demo code." };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setConfirmationResult(null);
    localStorage.setItem('dp_auth', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        pendingMobile,
        sendOtp,
        verifyOtp,
        logout,
        uiStateMode,
        setUiStateMode,
        isFirebaseConfigured
      }}
    >
      {children}
      {/* Invisible container for Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
