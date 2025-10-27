import styles from './AdminCard.module.css';

export function AdminCard({ title, description, icon, to, onClick, children }) {
  const content = (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {children}
    </div>
  );

  if (to) {
    return (
      <a href={to} className={styles.cardLink}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={styles.cardButton}>
        {content}
      </button>
    );
  }

  return content;
}
