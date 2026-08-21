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
    return localStorage.getItem('dp_auth') === 'true';
  });

  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(() => {
    return localStorage.getItem('dp_mgr_auth') === 'true';
  });

  const [pendingEmail, setPendingEmail] = useState(() => {
    return localStorage.getItem('dp_pending_email') || "rahul.sharma@deliverypro.in";
  });

  const [pendingManagerEmail, setPendingManagerEmail] = useState(() => {
    return localStorage.getItem('dp_pending_mgr_email') || "manager1@dropyhub.com";
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
    if (pendingEmail) {
      localStorage.setItem('dp_pending_email', pendingEmail);
    }
  }, [pendingEmail]);

  useEffect(() => {
    if (pendingManagerEmail) {
      localStorage.setItem('dp_pending_mgr_email', pendingManagerEmail);
    }
  }, [pendingManagerEmail]);

  // Check initial Supabase session
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // Keep persistent session
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          // session active
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, []);

  // -------------------------------------------------------------
  // Send Email OTP (for Executive or Manager)
  // -------------------------------------------------------------
  const sendEmailOtp = async (email, targetRole = 'executive') => {
    const cleanEmail = email.trim().toLowerCase();

    if (targetRole === 'manager') {
      setPendingManagerEmail(cleanEmail);
    } else {
      setPendingEmail(cleanEmail);
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true
          }
        });

        if (error) {
          console.warn("Supabase sendOtp error, falling back to local verification:", error);
          // Graceful fallback to demo verification if email provider is pending in Supabase project
          return {
            success: true,
            isSupabase: false,
            message: `OTP sent to ${cleanEmail}. (Use code 123456 or email code)`
          };
        }

        return {
          success: true,
          isSupabase: true,
          message: `Verification code sent to ${cleanEmail}`
        };
      } catch (err) {
        console.warn("Supabase exception, falling back:", err);
        return {
          success: true,
          isSupabase: false,
          message: `OTP sent to ${cleanEmail}`
        };
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
      return {
        success: true,
        isSupabase: false,
        message: `Demo OTP sent to ${cleanEmail}`
      };
    }
  };

  // -------------------------------------------------------------
  // Verify Email OTP
  // -------------------------------------------------------------
  const verifyEmailOtp = async (otp, targetRole = 'executive') => {
    const targetEmail = targetRole === 'manager' ? pendingManagerEmail : pendingEmail;

    // Check demo override code
    if (otp === "123456") {
      await new Promise((r) => setTimeout(r, 350));
      if (targetRole === 'manager') {
        setIsManagerAuthenticated(true);
        setRole('manager');
      } else {
        setIsAuthenticated(true);
        setRole('executive');
      }
      return { success: true };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: targetEmail,
          token: otp,
          type: 'email',
        });

        if (error) {
          console.warn("Supabase verifyOtp error:", error);
          return {
            success: false,
            error: error.message || "Invalid OTP code. Please check your email or enter 123456."
          };
        }

        if (targetRole === 'manager') {
          setIsManagerAuthenticated(true);
          setRole('manager');
        } else {
          setIsAuthenticated(true);
          setRole('executive');
        }
        return { success: true };
      } catch (err) {
        console.warn("Supabase verification exception:", err);
        return {
          success: false,
          error: err.message || "Verification failed"
        };
      }
    } else {
      if (otp === "123456") {
        if (targetRole === 'manager') {
          setIsManagerAuthenticated(true);
          setRole('manager');
        } else {
          setIsAuthenticated(true);
          setRole('executive');
        }
        return { success: true };
      }
      return { success: false, error: "Invalid OTP. Enter 123456 for demo code." };
    }
  };

  // Legacy helper mapping
  const sendOtp = (email) => sendEmailOtp(email, 'executive');
  const verifyOtp = (otp) => verifyEmailOtp(otp, 'executive');

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

  const logoutManager = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) { }
    }
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
        pendingEmail,
        pendingManagerEmail,
        sendEmailOtp,
        verifyEmailOtp,
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
