import { Link } from 'react-router-dom';
import { AdminContainer } from '../../components/AdminContainer/AdminContainer';
import { AdminHeader } from '../../components/AdminHeader/AdminHeader';
import { AdminCard } from '../../components/AdminCard/AdminCard';
import styles from './AdminDashboard.module.css';

export function AdminDashboard() {
  return (
    <AdminContainer>
      <AdminHeader 
        title="🛠️ Panel Administratora"
        subtitle="Witaj w konsoli administracyjnej sklepu"
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
