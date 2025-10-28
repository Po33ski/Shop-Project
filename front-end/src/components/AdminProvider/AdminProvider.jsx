import { useState } from 'react';
import { AdminContext } from '../../contexts/AdminContext';

export function AdminProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const loginAdmin = (userData) => {
    setIsAdminLoggedIn(true);
    setAdminUser(userData);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  const value = {
    isAdminLoggedIn,
    adminUser,
    loginAdmin,
    logoutAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
