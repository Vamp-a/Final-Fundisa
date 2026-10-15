import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './OrganisationSection.module.css';

const FEATURES = [
  { icon: '👥', label: 'Manage learners', desc: 'Add, organise, and track learners across groups and cohorts.' },
  { icon: '📚', label: 'Create courses', desc: 'Build and publish courses from your own content with our course editor.' },
  { icon: '📈', label: 'Track progress', desc: 'See live progress and quiz scores for every learner across every course.' },
  { icon: '📊', label: 'Analytics & reports', desc: 'Export detailed reports on completion rates, scores, and engagement.' },
  { icon: '📝', label: 'Assessments', desc: 'Create custom tests, assign them to groups, and auto-grade results.' },
  { icon: '🎓', label: 'Certificates', desc: 'Issue branded certificates automatically when learners complete a course.' },
];

export default function OrganisationSection() {
  const navigate = useNavigate();
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} id="organisations" className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.inner}>
          {/* Left: Dashboard preview */}
          <div className={styles.left}>
            <div className={styles.orgDash}>
              <div className={styles.orgDashHeader}>
                <span className={styles.orgDashDot} style={{background:'#FF5F56'}} />
                <span className={styles.orgDashDot} style={{background:'#FFBD2E'}} />
                <span className={styles.orgDashDot} style={{background:'#27C93F'}} />
                <span className={styles.orgDashLabel}>Fundisa — Lecturer Portal</span>
              </div>
              <div className={styles.orgDashBody}>
                {/* Top stats */}
                <div className={styles.orgStats}>
                  {[{v:'3',l:'Active Courses'},{v:'48',l:'Learners'},{v:'82%',l:'Avg. Progress'},{v:'94%',l:'Satisfaction'}].map(s=>(
                    <div key={s.l} className={styles.orgStat}>
                      <span className={styles.orgStatVal}>{s.v}</span>
                      <span className={styles.orgStatLabel}>{s.l}</span>
                    </div>
                  ))}
                </div>

                {/* Learner table */}
                <div className={styles.orgTable}>
                  <div className={styles.orgTableHead}>
                    {['Learner','Course','Progress','Score','Status'].map(h => (
                      <span key={h} className={styles.orgTableHeadCell}>{h}</span>
                    ))}
                  </div>
                  {[
                    {name:'Sipho N.', course:'Mathematics', pct:100, score:'88%', status:'done'},
                    {name:'Amahle D.', course:'Life Sciences', pct:72, score:'85%', status:'active'},
                    {name:'Tebogo M.', course:'History', pct:45, score:'76%', status:'active'},
                    {name:'Lerato K.', course:'English', pct:20, score:'—', status:'new'},
                  ].map(row=>(
                    <div key={row.name} className={styles.orgTableRow}>
                      <div className={styles.orgTableAvatar}>{row.name.split(' ').map(n=>n[0]).join('')}</div>
                      <span className={styles.orgTableCell}>{row.course}</span>
                      <div className={styles.orgTableProgress}>
                        <div className={styles.orgProgressBar}>
                          <div className={styles.orgProgressFill} style={{width:`${row.pct}%`}} />
                        </div>
                        <span>{row.pct}%</span>
                      </div>
                      <span className={styles.orgTableScore}>{row.score}</span>
                      <span className={`${styles.orgTableStatus} ${styles[`status_${row.status}`]}`}>
                        {row.status === 'done' ? 'Complete' : row.status === 'active' ? 'In Progress' : 'New'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div className={styles.right}>
            <span className={styles.eyebrow}>For organisations</span>
            <h2 className={styles.heading}>Powerful learning tools for organisations.</h2>
            <p className={styles.sub}>
              Schools, universities, and companies use Fundisa to manage learners, deliver courses, and measure outcomes — all from one portal.
            </p>

            <div className={styles.featureList}>
              {FEATURES.map(f => (
                <div key={f.label} className={styles.feature}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <div>
                    <p className={styles.featureLabel}>{f.label}</p>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.cta} onClick={() => navigate('/login')}>
              Explore for Organisations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
