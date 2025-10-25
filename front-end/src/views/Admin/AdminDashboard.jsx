import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

export function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <h1>🛠️ Panel Administratora</h1>
        <p>Witaj w konsoli administracyjnej sklepu</p>
        
        <div className={styles.actions}>
          <Link to="/admin/products" className={styles.actionCard}>
            <h3>📦 Zarządzaj Produktami</h3>
            <p>Dodawaj, edytuj i usuwaj produkty</p>
          </Link>
          
          <Link to="/admin/products/add" className={styles.actionCard}>
            <h3>➕ Dodaj Nowy Produkt</h3>
            <p>Dodaj nowy produkt do sklepu</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
