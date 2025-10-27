import styles from './AdminForm.module.css';

export function AdminForm({ 
  children, 
  method = 'POST', 
  action, 
  encType = 'multipart/form-data',
  onSubmit 
}) {
  return (
    <form 
      method={method}
      action={action}
      encType={encType}
      onSubmit={onSubmit}
      className={styles.form}
    >
      {children}
    </form>
  );
}

export function AdminFormGrid({ children }) {
  return (
    <div className={styles.formGrid}>
      {children}
    </div>
  );
}

export function AdminFormGroup({ label, required = false, children }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {children}
    </div>
  );
}

export function AdminInput({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder,
  required = false,
  min,
  step,
  ...props 
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      step={step}
      className={styles.input}
      {...props}
    />
  );
}

export function AdminSelect({ 
  name, 
  value, 
  onChange, 
  required = false,
  children,
  ...props 
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={styles.select}
      {...props}
    >
      {children}
    </select>
  );
}

export function AdminTextarea({ 
  name, 
  value, 
  onChange, 
  rows = 4,
  ...props 
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className={styles.textarea}
      {...props}
    />
  );
}

export function AdminFormActions({ children }) {
  return (
    <div className={styles.formActions}>
      {children}
    </div>
  );
}
