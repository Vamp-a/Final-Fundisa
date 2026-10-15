import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const LINKS = {
  Product: ['Courses', 'Features', 'Pricing', 'For Organisations', 'Resources'],
  Company: ['About', 'Contact', 'Privacy Policy', 'Terms of Service'],
};

const SOCIALS = [
  {
    label: 'X / Twitter',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        {/* Top */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <button className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className={styles.logoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L3 8.5V15.5L12 21L21 15.5V8.5L12 3Z" fill="white" opacity="0.9"/>
                  <path d="M12 3L3 8.5L12 14L21 8.5L12 3Z" fill="white"/>
                </svg>
              </span>
              <span className={styles.logoText}>Fundisa</span>
            </button>
            <p className={styles.brandTagline}>
              Teaching that reaches every student,<br />in every language.
            </p>
            <div className={styles.socials}>
              {SOCIALS.map(s => (
                <button key={s.label} className={styles.socialBtn} aria-label={s.label}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>{group}</span>
              {links.map(link => (
                <button
                  key={link}
                  className={styles.footerLink}
                  onClick={() => {
                    if (link === 'Courses') document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                    else if (link === 'Features') document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    else if (link === 'Pricing') document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/login');
                  }}
                >
                  {link}
                </button>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <span className={styles.linkGroupTitle}>Stay updated</span>
            <p className={styles.newsletterDesc}>Get learning tips and new course alerts.</p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email"
                className={styles.newsletterInput}
                aria-label="Email address for newsletter"
              />
              <button className={styles.newsletterBtn}>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={styles.copy}>© 2026 Fundisa. All rights reserved.</span>
          <span className={styles.motto}>"Fundisa" — to teach, in isiZulu & isiXhosa</span>
          <div className={styles.bottomLinks}>
            <button className={styles.bottomLink} onClick={() => navigate('/login')}>Privacy</button>
            <button className={styles.bottomLink} onClick={() => navigate('/login')}>Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
