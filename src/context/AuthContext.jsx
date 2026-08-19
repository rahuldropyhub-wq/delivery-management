import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser } from '../data/user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('dp_auth');
    return saved !== null ? saved === 'true' : true; // Default true for immediate access, or false if explicitly logged out
  });
  
  const [pendingMobile, setPendingMobile] = useState(() => {
    return localStorage.getItem('dp_pending_mobile') || "+91 9876543210";
  });

  const [user, setUser] = useState(currentUser);
  
  // UI State simulation switcher for demonstrating loading/empty/error states
  const [uiStateMode, setUiStateMode] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'

  useEffect(() => {
    localStorage.setItem('dp_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    if (pendingMobile) {
      localStorage.setItem('dp_pending_mobile', pendingMobile);
    }
  }, [pendingMobile]);

  const sendOtp = async (mobile) => {
    setPendingMobile(mobile);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, message: "OTP sent successfully to " + mobile };
  };

  const verifyOtp = async (otp) => {
    await new Promise((r) => setTimeout(r, 600));
    if (otp === "123456") {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: "Invalid OTP. Please enter 123456 for demo verification." };
  };

  const logout = () => {
    setIsAuthenticated(false);
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
        setUiStateMode
      }}
    >
      {children}
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
