import { Link } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import styles from './AdminConsoleButton.module.css';

export function AdminConsoleButton() {
  const { isAdminLoggedIn } = useAdmin();

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <Link to="/admin" className={styles.adminConsoleBtn}>
      🛠️ Admin Console
    </Link>
  );
}
