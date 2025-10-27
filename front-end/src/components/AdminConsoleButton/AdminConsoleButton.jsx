import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import styles from './AdminConsoleButton.module.css';

export function AdminConsoleButton() {
  const { isAdminLoggedIn, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  
  console.log('AdminConsoleButton rendered, isAdminLoggedIn:', isAdminLoggedIn);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

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
