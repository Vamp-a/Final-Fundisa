import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './LearnerSection.module.css';

const BENEFITS = [
  { icon: '⏱', title: 'Learn at your own pace', desc: 'No deadlines, no pressure. Start, pause, and continue whenever you want — from any device.' },
  { icon: '📱', title: 'Mobile-friendly', desc: 'A fully responsive experience whether you are on a phone, tablet, or laptop.' },
  { icon: '📊', title: 'Progress tracking', desc: 'Your dashboard shows exactly how far you have come and what is left to complete.' },
  { icon: '🎯', title: 'Personalised picks', desc: 'The platform recommends your next course based on what you have already completed.' },
  { icon: '🏆', title: 'Certificates', desc: 'Earn a digital certificate for every course you complete. Share it or download the PDF.' },
  { icon: '🌍', title: 'All 9 SA languages', desc: 'Read any module in your home language. AI translates content side-by-side instantly.' },
];

export default function LearnerSection() {
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} id="learners" className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.inner}>
          {/* Left */}
          <div className={styles.left}>
            <span className={styles.eyebrow}>For students</span>
            <h2 className={styles.heading}>Learning that fits your life.</h2>
            <p className={styles.sub}>
              Fundisa is built around how students actually study — in short bursts, on any device, often in a language that is not their first. Every feature is designed around that reality.
            </p>

            <div className={styles.benefits}>
              {BENEFITS.map(b => (
                <div key={b.title} className={styles.benefit}>
                  <span className={styles.benefitIcon}>{b.icon}</span>
                  <div>
                    <p className={styles.benefitTitle}>{b.title}</p>
                    <p className={styles.benefitDesc}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div className={styles.right}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch} />
              <div className={styles.phoneScreen}>
                {/* Header */}
                <div className={styles.phoneHeader}>
                  <span className={styles.phoneBack}>←</span>
                  <span className={styles.phoneTitle}>Cell Biology</span>
                  <span className={styles.phonePct}>72%</span>
                </div>
                {/* Progress */}
                <div className={styles.phoneProgressBar}>
                  <div className={styles.phoneProgressFill} />
                </div>
                {/* Video thumb */}
                <div className={styles.phoneVideo}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" opacity="0.9"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                {/* Content */}
                <div className={styles.phoneContent}>
                  <p className={styles.phoneSection}>Section 2 of 3</p>
                  <p className={styles.phoneSubhead}>Cell Organelles</p>
                  <div className={styles.phoneLines}>
                    {[100,88,95,70].map((w,i) => <div key={i} className={styles.phoneLine} style={{width:`${w}%`}} />)}
                  </div>
                  {/* Lang toggle */}
                  <div className={styles.phoneLangRow}>
                    <span className={styles.phoneLangChip} data-on="true">isiZulu</span>
                    <span className={styles.phoneLangChip}>English</span>
                  </div>
                </div>
                {/* Bottom nav */}
                <div className={styles.phoneNav}>
                  {['←','⏸','→'].map((s,i) => (
                    <span key={i} className={styles.phoneNavBtn}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating */}
            <div className={styles.floatBadge} data-pos="top">
              🔥 <strong>14-day streak!</strong>
            </div>
            <div className={styles.floatBadge} data-pos="bottom">
              ✓ Quiz passed — <strong>92%</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
