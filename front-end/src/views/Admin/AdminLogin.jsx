import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminContainer } from '../../components/AdminContainer/AdminContainer';
import { AdminHeader } from '../../components/AdminHeader/AdminHeader';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { 
  AdminForm, 
  AdminFormGroup, 
  AdminInput, 
  AdminFormActions 
} from '../../components/AdminForm/AdminForm';
import styles from './AdminLogin.module.css';

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple hardcoded credentials (in production, use proper authentication)
    // TODO: Move to environment variables for production
    const ADMIN_CREDENTIALS = {
      username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
      password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    };

    if (formData.username === ADMIN_CREDENTIALS.username && 
        formData.password === ADMIN_CREDENTIALS.password) {
      // Login successful
      loginAdmin({
        username: formData.username,
        loginTime: new Date().toISOString()
      });
      navigate('/admin');
    } else {
      setError('Nieprawidłowe dane logowania');
    }
  };

  return (
    <AdminContainer>
      <AdminHeader 
        title="🔐 Logowanie Administratora"
        actions={
          <AdminButton 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            ← Powrót do sklepu
          </AdminButton>
        }
      />

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2>Panel Administracyjny</h2>
          <p>Wprowadź dane logowania aby uzyskać dostęp do panelu administracyjnego</p>
          
          <AdminForm onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                ❌ {error}
              </div>
            )}

            <AdminFormGroup label="Nazwa użytkownika" required>
              <AdminInput
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Wprowadź nazwę użytkownika"
                required
              />
            </AdminFormGroup>

            <AdminFormGroup label="Hasło" required>
              <AdminInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Wprowadź hasło"
                required
              />
            </AdminFormGroup>

            <AdminFormActions>
              <AdminButton type="submit" variant="primary">
                🔐 Zaloguj się
              </AdminButton>
            </AdminFormActions>
          </AdminForm>

          <div className={styles.credentialsInfo}>
            <h4>Dane testowe:</h4>
            <p><strong>Użytkownik:</strong> {import.meta.env.VITE_ADMIN_USERNAME || 'admin'}</p>
            <p><strong>Hasło:</strong> {import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'}</p>
            <p><small>⚠️ W produkcji użyj zmiennych środowiskowych VITE_ADMIN_USERNAME i VITE_ADMIN_PASSWORD</small></p>
          </div>
        </div>
      </div>
    </AdminContainer>
  );
}
