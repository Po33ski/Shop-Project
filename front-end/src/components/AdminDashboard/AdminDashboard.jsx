import { Link, useNavigate } from 'react-router-dom';
import { AdminContainer } from '../AdminContainer/AdminContainer';
import { AdminHeader } from '../AdminHeader/AdminHeader';
import { AdminCard } from '../AdminCard/AdminCard';
import { AdminButton } from '../AdminButton/AdminButton';
import { useAdmin } from '../../contexts/AdminContext';
import styles from './AdminDashboard.module.css';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { adminUser, logoutAdmin } = useAdmin();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <AdminContainer>
      <AdminHeader 
        title="🛠️ Panel Administratora"
        subtitle={`Witaj ${adminUser?.username || 'Administratorze'}!`}
        actions={
          <AdminButton 
            variant="danger" 
            onClick={handleLogout}
          >
            🚪 Wyloguj się
          </AdminButton>
        }
      />
      
      <div className={styles.actions}>
        <Link to="/admin/products">
          <AdminCard
            icon="📦"
            title="Zarządzaj Produktami"
            description="Dodawaj, edytuj i usuwaj produkty"
          />
        </Link>
        
        <Link to="/admin/products/add">
          <AdminCard
            icon="➕"
            title="Dodaj Nowy Produkt"
            description="Dodaj nowy produkt do sklepu"
          />
        </Link>
      </div>
    </AdminContainer>
  );
}
