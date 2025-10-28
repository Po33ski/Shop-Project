import { createContext, useContext } from 'react';

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

export { AdminContext };
