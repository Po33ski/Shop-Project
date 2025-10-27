import { useAdmin } from '../../contexts/AdminContext';
import { Navigate } from 'react-router-dom';

export function AdminProtectedRoute({ children }) {
  const { isAdminLoggedIn } = useAdmin();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
