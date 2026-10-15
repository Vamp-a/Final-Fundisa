import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      {/* Background blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />

      <div className={`${styles.inner} container`}>
        {/* ── Left: Copy ── */}
        <div className={styles.copy}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Trusted by 25,000+ learners across Africa
          </div>

          <h1 className={styles.headline}>
            Learn Smarter.<br />
            <span className={styles.headlineAccent}>Grow Faster.</span>
          </h1>

          <p className={styles.sub}>
            Everything you need to learn new skills, track your progress, and achieve your goals — all in one powerful learning platform.
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

          <div className={styles.socialProof}>
            <div className={styles.avatarStack}>
              {['#C4573A','#D4A847','#5BAF8E','#7B8FBA'].map((c, i) => (
                <span key={i} className={styles.avatar} style={{ background: c, zIndex: 4 - i }} />
              ))}
            </div>
            <p className={styles.proofText}>
              <strong>4.9 ★</strong> rated by learners worldwide
            </p>
          </div>
        </div>

        {/* ── Right: Dashboard mockup ── */}
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.dashboard}>
            {/* Window chrome */}
            <div className={styles.chrome}>
              <span className={styles.dot} style={{ background: '#FF5F56' }} />
              <span className={styles.dot} style={{ background: '#FFBD2E' }} />
              <span className={styles.dot} style={{ background: '#27C93F' }} />
              <span className={styles.chromeTitle}>Fundisa Dashboard</span>
            </div>

            {/* Dashboard body */}
            <div className={styles.dashBody}>
              {/* Sidebar */}
              <aside className={styles.sidebar}>
                <div className={styles.sideAvatar}>SN</div>
                <div className={styles.sideLinks}>
                  {['Dashboard','My Courses','Progress','Certificates','Settings'].map((l, i) => (
                    <div key={l} className={`${styles.sideLink} ${i === 0 ? styles.sideLinkActive : ''}`}>{l}</div>
                  ))}
                </div>
              </aside>

              {/* Main content */}
              <main className={styles.dashMain}>
                {/* Greeting */}
                <div className={styles.dashGreeting}>
                  <div>
                    <p className={styles.dashGreetingSmall}>Good morning,</p>
                    <p className={styles.dashGreetingName}>Sipho 👋</p>
                  </div>
                  <div className={styles.streakChip}>
                    🔥 14-day streak
                  </div>
                </div>

                {/* Stats row */}
                <div className={styles.statsRow}>
                  {[
                    { label: 'Courses', val: '4' },
                    { label: 'Completed', val: '2' },
                    { label: 'Certificates', val: '2' },
                  ].map(s => (
                    <div key={s.label} className={styles.statBox}>
                      <span className={styles.statVal}>{s.val}</span>
                      <span className={styles.statLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Current course */}
                <p className={styles.dashSectionLabel}>Continue learning</p>
                <div className={styles.courseCard}>
                  <div className={styles.courseCardLeft}>
                    <div className={styles.courseThumb} style={{ background: 'linear-gradient(135deg,#C4573A,#D4607A)' }} />
                    <div>
                      <p className={styles.courseTitle}>Cell Biology</p>
                      <p className={styles.courseSubject}>Life Sciences</p>
                    </div>
                  </div>
                  <div className={styles.courseProgress}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: '72%' }} />
                    </div>
                    <span className={styles.progressPct}>72%</span>
                  </div>
                </div>

                {/* Upcoming */}
                <p className={styles.dashSectionLabel}>Up next</p>
                <div className={styles.upcomingRow}>
                  {['Newton\'s Laws','Algebra Basics'].map((t,i) => (
                    <div key={t} className={styles.upcomingCard}>
                      <div className={styles.upcomingIcon} style={{ background: i===0?'#FDF0EC':'#FBF5E0' }}>
                        {i===0
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4573A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A847" strokeWidth="2"><path d="M4 19l4-8 4 4 4-6 4 10"/></svg>
                        }
                      </div>
                      <span className={styles.upcomingTitle}>{t}</span>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </div>

          {/* Floating badges */}
          <div className={`${styles.float} ${styles.float1}`}>
            <span className={styles.floatIcon}>✓</span>
            <div>
              <p className={styles.floatTitle}>Course Completed!</p>
              <p className={styles.floatSub}>Introduction to Maths</p>
            </div>
          </div>

          <div className={`${styles.float} ${styles.float2}`}>
            <div className={styles.float2Inner}>
              <p className={styles.float2Pct}>85%</p>
              <p className={styles.float2Label}>Progress</p>
            </div>
            <svg width="48" height="48" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#E4DBD5" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#C4573A" strokeWidth="3"
                strokeDasharray="94.2" strokeDashoffset="14.1" strokeLinecap="round"
                transform="rotate(-90 18 18)"/>
            </svg>
          </div>

          <div className={`${styles.float} ${styles.float3}`}>
            <span style={{ fontSize: '1.2rem' }}>🏆</span>
            <div>
              <p className={styles.floatTitle}>New Certificate</p>
              <p className={styles.floatSub}>Life Sciences</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
