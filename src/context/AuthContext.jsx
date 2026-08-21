import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Role: 'executive' | 'manager'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('dp_role') || 'executive';
  });

  const [activeManager, setActiveManager] = useState(() => {
    return localStorage.getItem('dp_active_manager') || 'Manager 1';
  });

  const [activeExecutiveId, setActiveExecutiveId] = useState(() => {
    return localStorage.getItem('dp_active_exec_id') || 'EXE12345';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('dp_auth');
    return saved !== null ? saved === 'true' : true;
  });

  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(() => {
    const saved = localStorage.getItem('dp_mgr_auth');
    return saved !== null ? saved === 'true' : true;
  });

  const [pendingMobile, setPendingMobile] = useState(() => {
    return localStorage.getItem('dp_pending_mobile') || "+91 9030545655";
  });

  const [uiStateMode, setUiStateMode] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'

  useEffect(() => {
    localStorage.setItem('dp_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('dp_mgr_auth', isManagerAuthenticated ? 'true' : 'false');
  }, [isManagerAuthenticated]);

  useEffect(() => {
    localStorage.setItem('dp_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('dp_active_manager', activeManager);
  }, [activeManager]);

  useEffect(() => {
    localStorage.setItem('dp_active_exec_id', activeExecutiveId);
  }, [activeExecutiveId]);

  useEffect(() => {
    if (pendingMobile) {
      localStorage.setItem('dp_pending_mobile', pendingMobile);
    }
  }, [pendingMobile]);

  // Check initial Supabase session
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, []);

  const sendOtp = async (mobile) => {
    setPendingMobile(mobile);

    const cleaned = mobile.replace(/[^0-9+]/g, '');
    const formatted = cleaned.startsWith('+') ? cleaned : `+91${cleaned.slice(-10)}`;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: formatted,
        });

        if (error) {
          console.error("Supabase sendOtp error:", error);
          return {
            success: false,
            error: error.message || "Failed to send OTP through Supabase"
          };
        }

        return {
          success: true,
          isSupabase: true,
          message: `OTP sent successfully to ${formatted}`
        };
      } catch (err) {
        console.error("Supabase exception:", err);
        return {
          success: false,
          error: err.message || "Failed to send OTP"
        };
      }
    } else {
      // Fallback demo simulation
      await new Promise((r) => setTimeout(r, 400));
      return {
        success: true,
        isSupabase: false,
        message: `Demo OTP sent: 123456`
      };
    }
  };

  const verifyOtp = async (otp) => {
    const cleaned = pendingMobile.replace(/[^0-9+]/g, '');
    const formatted = cleaned.startsWith('+') ? cleaned : `+91${cleaned.slice(-10)}`;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formatted,
          token: otp,
          type: 'sms',
        });

        if (error) {
          console.error("Supabase verifyOtp error:", error);
          return {
            success: false,
            error: error.message || "Incorrect OTP code. Please try again."
          };
        }

        setIsAuthenticated(true);
        setRole('executive');
        return { success: true };
      } catch (err) {
        console.error("Supabase verification exception:", err);
        return {
          success: false,
          error: err.message || "Verification failed"
        };
      }
    } else {
      // Mock validation (Demo OTP = 123456)
      await new Promise((r) => setTimeout(r, 400));
      if (otp === "123456") {
        setIsAuthenticated(true);
        setRole('executive');
        return { success: true };
      }
      return { success: false, error: "Invalid OTP. Enter 123456 for demo code." };
    }
  };

  const loginAsManager = (managerName = "Manager 1") => {
    setActiveManager(managerName);
    setIsManagerAuthenticated(true);
    setRole('manager');
    return { success: true };
  };

  const switchRole = (newRole, identifier) => {
    setRole(newRole);
    if (newRole === 'manager') {
      if (identifier) setActiveManager(identifier);
      setIsManagerAuthenticated(true);
    } else if (newRole === 'executive') {
      if (identifier) setActiveExecutiveId(identifier);
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) { }
    }
    setIsAuthenticated(false);
    localStorage.setItem('dp_auth', 'false');
  };

  const logoutManager = () => {
    setIsManagerAuthenticated(false);
    localStorage.setItem('dp_mgr_auth', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isManagerAuthenticated,
        role,
        setRole,
        activeManager,
        setActiveManager,
        activeExecutiveId,
        setActiveExecutiveId,
        pendingMobile,
        sendOtp,
        verifyOtp,
        loginAsManager,
        switchRole,
        logout,
        logoutManager,
        uiStateMode,
        setUiStateMode,
        isSupabaseConfigured
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
