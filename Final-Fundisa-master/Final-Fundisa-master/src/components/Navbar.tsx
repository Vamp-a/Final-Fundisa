import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>F</span>
          <span className={styles.logoText}>undisa</span>
        </Link>

        <div className={styles.right}>
          {user ? (
            <>
              <span className={styles.greeting}>
                {user.name.split(' ')[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
