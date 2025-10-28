import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

export function Admin() {
  const { isAdminLoggedIn, isLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If not logged in and not on login page, redirect to login
    if (!isAdminLoggedIn && location.pathname !== '/admin/login') {
      navigate('/admin/login', { replace: true });
    }

    // If logged in and on login page, redirect to dashboard
    if (isAdminLoggedIn && location.pathname === '/admin/login') {
      navigate('/admin', { replace: true });
    }
  }, [isAdminLoggedIn, isLoading, location.pathname, navigate]);

  // Show loading while checking session
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Ładowanie...
      </div>
    );
  }

  return <Outlet />;
}
