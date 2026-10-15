import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your school email address.'); return; }
    setIsLoading(true);
    setError('');

    // Simulate async check
    setTimeout(() => {
      const result = login(email);
      setIsLoading(false);
      if (!result.success) {
        setError(result.error ?? 'Login failed.');
        return;
      }
      // AuthContext holds the user; re-read from login result via navigate
      const stored = sessionStorage.getItem('fundisa_user');
      if (stored) {
        const user = JSON.parse(stored);
        navigate(user.role === 'lecturer' ? '/lecturer' : '/student');
      }
    }, 500);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.logoMark}>F</div>
          <h1 className={styles.heading}>Sign in to Fundisa</h1>
          <p className={styles.sub}>Use the email address your school registered you with.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>School email address</label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="you@school.co.za"
              autoComplete="email"
              autoFocus
            />
            {error && <p className={styles.error} role="alert">{error}</p>}
          </div>

          <Button type="submit" fullWidth size="lg" disabled={isLoading}>
            {isLoading ? 'Checking…' : 'Continue to my dashboard'}
          </Button>
        </form>

        <div className={styles.hint}>
          <p className={styles.hintTitle}>Demo accounts</p>
          <div className={styles.hintList}>
            <div className={styles.hintItem}>
              <span className={styles.hintRole}>Student</span>
              <code className={styles.hintEmail} onClick={() => setEmail('student@fundisa.co.za')}>student@fundisa.co.za</code>
            </div>
            <div className={styles.hintItem}>
              <span className={styles.hintRole}>Lecturer</span>
              <code className={styles.hintEmail} onClick={() => setEmail('lecturer@fundisa.co.za')}>lecturer@fundisa.co.za</code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
