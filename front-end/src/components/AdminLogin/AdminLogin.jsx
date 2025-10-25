import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import styles from './AdminLogin.module.css';

export function AdminLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin, isAdminLoggedIn, logoutAdmin } = useAdmin();

  const handleLogin = (e) => {
    e.preventDefault();
    // Na razie bez weryfikacji - logowanie automatyczne
    loginAdmin({ username, role: 'admin' });
    setIsOpen(false);
    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    logoutAdmin();
  };

  if (isAdminLoggedIn) {
    return (
      <div className={styles.adminLoggedIn}>
        <span>Admin</span>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Wyloguj
        </button>
      </div>
    );
  }

  return (
    <div className={styles.adminLogin}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={styles.loginBtn}
      >
        Admin
      </button>
      
      {isOpen && (
        <div className={styles.loginModal}>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <h3>Logowanie Administratora</h3>
            <input
              type="text"
              placeholder="Nazwa użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <div className={styles.buttons}>
              <button type="submit" className={styles.submitBtn}>
                Zaloguj
              </button>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className={styles.cancelBtn}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
