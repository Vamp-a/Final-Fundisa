import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  const navigate = useNavigate();
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} className={`${styles.section} reveal`}>
      <div className={styles.inner}>
        <div className={styles.blob1} aria-hidden="true" />
        <div className={styles.blob2} aria-hidden="true" />

        <div className={`${styles.content} container`}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            25,000+ learners already on Fundisa
          </div>
          <h2 className={styles.heading}>
            Start building the skills<br />
            that shape your future.
          </h2>
          <p className={styles.sub}>
            Join thousands of learners already building their future with our platform. Free to start. No credit card required.
          </p>
          <div className={styles.ctas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/login')}>
              Start Learning Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Courses
            </button>
          </div>
          <div className={styles.metrics}>
            {[
              { val: '25K+', label: 'Active learners' },
              { val: '500+', label: 'Courses available' },
              { val: '94%',  label: 'Satisfaction rate' },
            ].map(m => (
              <div key={m.label} className={styles.metric}>
                <span className={styles.metricVal}>{m.val}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
