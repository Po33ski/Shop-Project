import { useAdmin } from '../../contexts/AdminContext';
import { AdminDashboard } from '../../components/AdminDashboard/AdminDashboard';
import { AdminLogin } from '../../components/AdminLogin/AdminLogin';

export function Admin() {
  const { isAdminLoggedIn, isLoading } = useAdmin();

  // Render AdminLogin if not logged in, AdminDashboard if logged in

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

  // Render AdminLogin if not logged in, AdminDashboard if logged in
  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
