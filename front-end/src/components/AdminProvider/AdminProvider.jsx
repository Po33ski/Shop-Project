import { useState, useEffect } from 'react';
import { AdminContext } from '../../contexts/AdminContext';

const ADMIN_STORAGE_KEY = 'shop-admin-session';

export function AdminProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load admin session from localStorage on mount
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        // Check if session is still valid (e.g., not expired)
        const now = new Date().getTime();
        if (session.expiresAt && now < session.expiresAt) {
          setIsAdminLoggedIn(true);
          setAdminUser(session.user);
        } else {
          // Session expired, remove it
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading admin session:', error);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAdmin = (userData) => {
    const session = {
      user: userData,
      expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000), // 24 hours
      loginTime: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      setIsAdminLoggedIn(true);
      setAdminUser(userData);
    } catch (error) {
      console.error('Error saving admin session:', error);
    }
  };

  const logoutAdmin = () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing admin session:', error);
    }
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  const value = {
    isAdminLoggedIn,
    adminUser,
    loginAdmin,
    logoutAdmin,
    isLoading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
