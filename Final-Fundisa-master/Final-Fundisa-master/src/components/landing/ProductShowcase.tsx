import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './ProductShowcase.module.css';

const PANELS = [
  {
    id: 'catalogue',
    tab: 'Course Catalogue',
    heading: 'Browse hundreds of courses in one place.',
    desc: 'Filter by subject, level, or duration. Every course shows your progress at a glance so you always know where to start next.',
    points: ['CAPS-aligned content', 'Filter by subject & level', 'Instant enrolment'],
    preview: {
      title: 'Course Catalogue',
      items: [
        { color: '#C4573A', name: 'Mathematics', level: 'Grade 11', progress: 100 },
        { color: '#5BAF8E', name: 'Life Sciences', level: 'Grade 11', progress: 72 },
        { color: '#D4A847', name: 'Physical Sciences', level: 'Grade 11', progress: 45 },
        { color: '#7B8FBA', name: 'History', level: 'Grade 11', progress: 0 },
      ]
    }
  },
  {
    id: 'player',
    tab: 'Course Player',
    heading: 'Focused, distraction-free learning.',
    desc: 'A clean video player with notes, bookmarks, and downloadable resources — everything you need right beside the lesson.',
    points: ['Video lessons', 'Downloadable resources', 'In-lesson notes'],
    preview: {
      title: 'Now Playing',
      player: true,
    }
  },
  {
    id: 'dashboard',
    tab: 'Dashboard',
    heading: 'Your entire learning journey at a glance.',
    desc: 'One dashboard shows your enrolled courses, recent activity, streak, certificates, and recommended next steps.',
    points: ['Live progress tracking', 'Learning streak', 'Smart recommendations'],
    preview: {
      title: 'Student Dashboard',
      stats: [
        { label: 'Courses', val: '6' },
        { label: 'Completed', val: '3' },
        { label: 'Streak', val: '14d' },
        { label: 'Score', val: '87%' },
      ]
    }
  },
  {
    id: 'analytics',
    tab: 'Analytics',
    heading: 'Understand exactly how you are learning.',
    desc: 'Visualise time spent, quiz performance, and module-by-module progress. Instructors get a full class overview too.',
    points: ['Per-module breakdown', 'Quiz score history', 'Time-on-task metrics'],
    preview: {
      title: 'Progress Analytics',
      bars: [80, 60, 95, 45, 70, 88],
    }
  },
];

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;
  const panel = PANELS[active];

  return (
    <section ref={ref} id="courses" className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Product tour</span>
          <h2 className={styles.heading}>Your entire learning journey, in one place.</h2>
          <p className={styles.sub}>From browsing to certification — here is what the platform looks like inside.</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {PANELS.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === active}
              className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
              onClick={() => setActive(i)}
            >
              {p.tab}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className={styles.panel}>
          {/* Left */}
          <div className={styles.panelLeft}>
            <h3 className={styles.panelHeading}>{panel.heading}</h3>
            <p className={styles.panelDesc}>{panel.desc}</p>
            <ul className={styles.points}>
              {panel.points.map(pt => (
                <li key={pt} className={styles.point}>
                  <span className={styles.pointCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: UI preview */}
          <div className={styles.panelRight}>
            <div className={styles.previewCard}>
              <div className={styles.previewChrome}>
                <span className={styles.chromeDot} style={{background:'#FF5F56'}}/>
                <span className={styles.chromeDot} style={{background:'#FFBD2E'}}/>
                <span className={styles.chromeDot} style={{background:'#27C93F'}}/>
                <span className={styles.chromeLabel}>{panel.preview.title}</span>
              </div>
              <div className={styles.previewBody}>
                {/* Catalogue */}
                {'items' in panel.preview && panel.preview.items && (
                  <div className={styles.catalogueList}>
                    {panel.preview.items.map((item) => (
                      <div key={item.name} className={styles.catalogueItem}>
                        <div className={styles.catalogueThumb} style={{background: item.color}} />
                        <div className={styles.catalogueInfo}>
                          <span className={styles.catalogueName}>{item.name}</span>
                          <span className={styles.catalogueLevel}>{item.level}</span>
                        </div>
                        <div className={styles.catalogueProgressWrap}>
                          <div className={styles.catalogueBar}>
                            <div className={styles.catalogueBarFill} style={{width:`${item.progress}%`, background: item.color}} />
                          </div>
                          <span className={styles.cataloguePct}>{item.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Player */}
                {'player' in panel.preview && panel.preview.player && (
                  <div className={styles.playerPreview}>
                    <div className={styles.playerScreen}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.8"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <div className={styles.playerControls}>
                      <div className={styles.playerProgress}>
                        <div className={styles.playerFill} style={{width:'38%'}} />
                      </div>
                      <div className={styles.playerMeta}>
                        <span>Newton's Laws — Module 3</span>
                        <span>14:22 / 36:10</span>
                      </div>
                    </div>
                    <div className={styles.playerNotes}>
                      <span className={styles.playerNotesLabel}>My Notes</span>
                      <div className={styles.noteLines}>
                        {[80,65,90,50].map((w,i) => (
                          <div key={i} className={styles.noteLine} style={{width:`${w}%`}} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dashboard */}
                {'stats' in panel.preview && panel.preview.stats && (
                  <div className={styles.dashStats}>
                    <div className={styles.dashStatsGrid}>
                      {panel.preview.stats.map(s => (
                        <div key={s.label} className={styles.dashStat}>
                          <span className={styles.dashStatVal}>{s.val}</span>
                          <span className={styles.dashStatLabel}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.dashRecentLabel}>Recent activity</div>
                    {['Mathematics — Module 3 completed','Life Sciences — Quiz: 85%','Physical Sciences — Started'].map((a,i) => (
                      <div key={i} className={styles.dashActivity}>
                        <span className={styles.dashActivityDot} />
                        {a}
                      </div>
                    ))}
                  </div>
                )}

                {/* Analytics */}
                {'bars' in panel.preview && panel.preview.bars && (
                  <div className={styles.analyticsPreview}>
                    <div className={styles.chartArea}>
                      {panel.preview.bars.map((h, i) => (
                        <div key={i} className={styles.chartCol}>
                          <div className={styles.chartBar} style={{ height: `${h}%`, background: ['#C4573A','#D4607A','#D4A847','#7B8FBA','#C4573A','#D4607A'][i] }} />
                          <span className={styles.chartLabel}>{['M1','M2','M3','M4','M5','M6'][i]}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartMetrics}>
                      <div className={styles.chartMetric}><span className={styles.chartMetricVal}>87%</span><span className={styles.chartMetricLabel}>Avg. score</span></div>
                      <div className={styles.chartMetric}><span className={styles.chartMetricVal}>14h</span><span className={styles.chartMetricLabel}>Time spent</span></div>
                      <div className={styles.chartMetric}><span className={styles.chartMetricVal}>6/6</span><span className={styles.chartMetricLabel}>Modules done</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
