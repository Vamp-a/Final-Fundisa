import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Features.module.css';

// Octopus palette: coral, sea-green, amber, periwinkle
const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    color: '#C4573A',
    bg: '#FDF0EC',
    title: 'Interactive Courses',
    desc: 'Learn through engaging video lessons, downloadable resources, and hands-on activities designed to build real skills.',
    tag: '500+ courses',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    color: '#5BAF8E',
    bg: '#E8F5F0',
    title: 'Track Your Progress',
    desc: 'See exactly where you are and what you need to complete next. Visual dashboards keep you motivated every step of the way.',
    tag: 'Real-time data',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    color: '#A07E2A',
    bg: '#FBF5E0',
    title: 'Certifications',
    desc: 'Earn recognised digital certificates when you complete your courses. Share them on LinkedIn or download as PDF.',
    tag: 'Shareable certs',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    color: '#5A6F9E',
    bg: '#EEF1F8',
    title: 'Personalised Learning',
    desc: 'Discover courses and learning paths tailored to your goals. AI-powered recommendations adapt as you progress.',
    tag: 'AI-powered',
  },
];

export default function Features() {
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} id="features" className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Platform features</span>
          <h2 className={styles.heading}>Everything you need to succeed</h2>
          <p className={styles.sub}>One platform. Every tool you need to learn, grow, and get certified.</p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.icon} style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </span>
                <span className={styles.tag} style={{ background: f.bg, color: f.color }}>
                  {f.tag}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
              <div className={styles.cardArrow} style={{ color: f.color }}>
                Learn more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
