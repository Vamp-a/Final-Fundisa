import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './TrustBar.module.css';

const STATS = [
  { value: '25K+', label: 'Learners' },
  { value: '500+', label: 'Courses' },
  { value: '120+', label: 'Instructors' },
  { value: '94%',  label: 'Satisfaction' },
];

const LOGOS = ['Wits University', 'UCT', 'UNISA', 'Stellenbosch', 'UJ', 'UKZN'];

export default function TrustBar() {
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} className={`${styles.section} reveal`}>
      <div className="container">
        <p className={styles.eyebrow}>Trusted by learners, educators and organisations</p>

        {/* Logo strip */}
        <div className={styles.logos}>
          {LOGOS.map(name => (
            <div key={name} className={styles.logoChip}>
              <span className={styles.logoInitial}>{name[0]}</span>
              <span className={styles.logoName}>{name}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {STATS.map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
