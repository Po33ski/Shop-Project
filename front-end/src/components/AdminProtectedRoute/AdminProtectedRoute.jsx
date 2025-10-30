import { useAdmin } from '../../contexts/AdminContext';

export function AdminProtectedRoute({ children }) {
  const { isAdminLoggedIn, isLoading } = useAdmin();

  // Show loading while checking session
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '16px'
      }}>
        Sprawdzanie uprawnień...
      </div>
    );
  }

  // Don't render anything if not logged in - let Admin component handle redirect
  if (!isAdminLoggedIn) {
    return null;
  }

  return children;
}
