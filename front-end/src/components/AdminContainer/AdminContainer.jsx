import styles from './AdminContainer.module.css';

export function AdminContainer({ children }) {
  return (
    <div className={styles.adminContainer}>
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
}
