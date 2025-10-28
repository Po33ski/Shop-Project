import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import styles from './AdminConsoleButton.module.css';

export function AdminConsoleButton() {
  const { isAdminLoggedIn, logoutAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();
  

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.adminConsoleBtn} style={{ opacity: 0.6 }}>
        ⏳ Ładowanie...
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <div className={styles.adminButtons}>
        <Link to="/admin" className={styles.adminConsoleBtn}>
          🛠️ Admin Console
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Wyloguj
        </button>
      </div>
    );
  }

  return (
    <Link to="/admin/login" className={styles.adminConsoleBtn}>
      🔐 Admin
    </Link>
  );
}
