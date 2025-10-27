import styles from './AdminButton.module.css';

export function AdminButton({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  type = 'button',
  disabled = false,
  ...props 
}) {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]}`;
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
