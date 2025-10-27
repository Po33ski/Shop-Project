import styles from './AdminHeader.module.css';

export function AdminHeader({ title, subtitle, children }) {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children && (
        <div className={styles.actions}>
          {children}
        </div>
      )}
    </div>
  );
}
