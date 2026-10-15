import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Courses', href: '#courses' },
  { label: 'Features', href: '#features' },
  { label: 'For Students', href: '#learners' },
  { label: 'For Organisations', href: '#organisations' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href === '#') return;
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`} aria-label="Main navigation">
        {/* Logo */}
        <button className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L3 8.5V15.5L12 21L21 15.5V8.5L12 3Z" fill="white" opacity="0.9"/>
              <path d="M12 3L3 8.5L12 14L21 8.5L12 3Z" fill="white"/>
            </svg>
          </span>
          <span className={styles.logoText}>Fundisa</span>
        </button>

        {/* Desktop nav */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <button className={styles.link} onClick={() => scrollTo(link.href)}>
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className={styles.actions}>
          <button className={styles.loginBtn} onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className={styles.ctaBtn} onClick={() => navigate('/login')}>
            Start Learning
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} aria-hidden={!menuOpen}>
        <ul className={styles.mobileLinks} role="list">
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <button className={styles.mobileLink} onClick={() => scrollTo(link.href)}>
                {link.label}
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.mobileActions}>
          <button className={styles.mobileLoginBtn} onClick={() => { setMenuOpen(false); navigate('/login'); }}>
            Log In
          </button>
          <button className={styles.mobileCtaBtn} onClick={() => { setMenuOpen(false); navigate('/login'); }}>
            Start Learning Free
          </button>
        </div>
      </div>
    </header>
  );
}
