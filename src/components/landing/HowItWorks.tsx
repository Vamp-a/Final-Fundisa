import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    num: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Choose a Course',
    desc: 'Browse our CAPS-aligned catalogue. Filter by subject, grade, or goal. Enrol in one click.',
  },
  {
    num: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
    title: 'Start Learning',
    desc: 'Work through video lessons and resources at your own pace — in English or your home language.',
  },
  {
    num: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"/>
      </svg>
    ),
    title: 'Complete Assessments',
    desc: 'Each module ends with a quiz. You get instant feedback and detailed explanations for every answer.',
  },
  {
    num: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: 'Earn Your Certificate',
    desc: 'Complete the course and receive a shareable digital certificate. Download as PDF or share to LinkedIn.',
  },
];

export default function HowItWorks() {
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>How it works</span>
          <h2 className={styles.heading}>From sign-up to certified in four steps.</h2>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={step.num} className={styles.stepWrapper}>
              <div className={styles.step}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={styles.connector} aria-hidden="true">
                  <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
                    <path d="M0 8h36M32 4l4 4-4 4" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
