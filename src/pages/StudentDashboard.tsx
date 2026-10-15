import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useContent } from '../context/ContentContext';
import { MOCK_MODULES } from '../data/mockData';
import DashboardLayout from '../components/DashboardLayout';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import styles from './StudentDashboard.module.css';

type ActiveView = 'dashboard' | 'modules' | 'progress' | 'certificates' | 'resources';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  pdf: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  video: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  document: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  test: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
};

const TYPE_COLORS: Record<string, string> = {
  pdf:      '#C4573A',
  video:    '#7B8FBA',
  document: '#5BAF8E',
  test:     '#D4A847',
};

export default function StudentDashboard() {
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const { getEntry } = useProgress();
  const { uploads }  = useContent();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Merge live progress into module list
  const modules     = MOCK_MODULES.map(m => ({ ...m, progress: getEntry(m.id).progress }));
  const completed   = modules.filter(m => m.progress === 100).length;
  const inProgress  = modules.filter(m => m.progress > 0 && m.progress < 100).length;
  const overall     = Math.round(modules.reduce((a, m) => a + m.progress, 0) / modules.length);
  const certModules = modules.filter(m => m.progress === 100);

  return (
    <DashboardLayout
      activeId={activeView}
      onNavClick={id => setActiveView(id as ActiveView)}
    >

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  DASHBOARD overview                                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeView === 'dashboard' && (
        <div className={styles.page}>
          <div className={styles.greeting}>
            <div>
              <p className={styles.greetSub}>Good day,</p>
              <h1 className={styles.greetName}>{user?.name}</h1>
            </div>
            <div className={styles.streakBadge}>🔥 Keep your streak going</div>
          </div>

          <div className={styles.statGrid}>
            {[
              { label: 'Modules available', value: modules.length,                                       color: 'default' },
              { label: 'Completed',         value: completed,                                            color: 'brand'   },
              { label: 'In progress',       value: inProgress,                                           color: 'amber'   },
              { label: 'Resources',         value: uploads.length, onClick: () => setActiveView('resources'), color: 'periwinkle' },
            ].map(s => (
              <div
                key={s.label}
                className={`${styles.statCard} ${styles[`statCard_${s.color}`]} ${'onClick' in s ? styles.statCardClickable : ''}`}
                onClick={'onClick' in s ? s.onClick : undefined}
                role={'onClick' in s ? 'button' : undefined}
                tabIndex={'onClick' in s ? 0 : undefined}
              >
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
                {'onClick' in s && <span className={styles.statArrow}>→</span>}
              </div>
            ))}
          </div>

          <div className={styles.overallCard}>
            <div className={styles.overallLeft}>
              <span className={styles.overallLabel}>Overall course progress</span>
              <span className={styles.overallPct}>{overall}%</span>
            </div>
            <div className={styles.overallBar}>
              <ProgressBar value={overall} showValue={false} />
            </div>
          </div>

          {/* Continue learning */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Continue learning</h2>
              <button className={styles.seeAll} onClick={() => setActiveView('modules')}>
                See all modules →
              </button>
            </div>
            <div className={styles.continueGrid}>
              {modules.filter(m => m.progress > 0 && m.progress < 100).slice(0, 3).map(mod => (
                <div key={mod.id} className={styles.continueCard}>
                  <div className={styles.continueThumb} style={{ background: 'linear-gradient(135deg,#C4573A,#D4607A)' }}>
                    <span className={styles.continueSubject}>{mod.subject.slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div className={styles.continueInfo}>
                    <span className={styles.continueSubjectLabel}>{mod.subject}</span>
                    <p className={styles.continueTitle}>{mod.title}</p>
                    <ProgressBar value={mod.progress} size="sm" showValue />
                  </div>
                  <Button size="sm" onClick={() => navigate(`/module/${mod.id}`)}>Continue</Button>
                </div>
              ))}
              {modules.filter(m => m.progress > 0 && m.progress < 100).length === 0 && (
                <p className={styles.emptyNote}>
                  No modules in progress yet.{' '}
                  <button className={styles.emptyLink} onClick={() => setActiveView('modules')}>Browse modules →</button>
                </p>
              )}
            </div>
          </section>

          {/* Latest resources */}
          {uploads.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Latest resources from your lecturer</h2>
                <button className={styles.seeAll} onClick={() => setActiveView('resources')}>
                  View all resources →
                </button>
              </div>
              <div className={styles.resourcesPreview}>
                {uploads.slice(0, 4).map(r => {
                  const mod = MOCK_MODULES.find(m => m.id === r.moduleId);
                  return (
                    <div key={r.id} className={styles.resourcePreviewItem}>
                      <span
                        className={styles.resourcePreviewIcon}
                        style={{ background: `${TYPE_COLORS[r.type]}18`, color: TYPE_COLORS[r.type] }}
                      >
                        {TYPE_ICONS[r.type]}
                      </span>
                      <div className={styles.resourcePreviewInfo}>
                        <span className={styles.resourcePreviewTitle}>{r.title}</span>
                        <span className={styles.resourcePreviewMeta}>
                          {mod?.subject ?? r.moduleId} · {r.type.toUpperCase()} · {r.size}
                        </span>
                      </div>
                      <span className={styles.resourcePreviewDate}>{r.uploadedAt}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Recent completions */}
          {certModules.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Recently completed</h2>
                <button className={styles.seeAll} onClick={() => setActiveView('certificates')}>
                  View certificates →
                </button>
              </div>
              <div className={styles.recentList}>
                {certModules.slice(0, 3).map(mod => (
                  <div key={mod.id} className={styles.recentItem}>
                    <span className={styles.recentCheck}>✓</span>
                    <div className={styles.recentInfo}>
                      <span className={styles.recentTitle}>{mod.title}</span>
                      <span className={styles.recentMeta}>{mod.subject} · {mod.duration}</span>
                    </div>
                    <span className={styles.recentBadge}>Complete</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  MODULES / PROGRESS                                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {(activeView === 'modules' || activeView === 'progress') && (
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>
              {activeView === 'progress' ? 'My Progress' : 'My Modules'}
            </h1>
            <p className={styles.pageSub}>
              {activeView === 'progress'
                ? 'Track your scores and completion across every module.'
                : `${modules.length} modules · ${completed} completed`}
            </p>
          </div>

          <div className={styles.moduleList}>
            {modules.map((mod, idx) => (
              <div key={mod.id} className={`${styles.moduleRow} ${mod.locked ? styles.moduleLocked : ''}`}>
                <span className={styles.moduleIdx}>{String(idx + 1).padStart(2, '0')}</span>
                <div className={styles.moduleChip} style={{
                  background: mod.progress === 100
                    ? 'linear-gradient(135deg,#5BAF8E,#3D9070)'
                    : mod.progress > 0
                      ? 'linear-gradient(135deg,#C4573A,#D4607A)'
                      : mod.locked ? '#D1D5DB'
                        : 'linear-gradient(135deg,#7B8FBA,#5A6F9E)',
                }} />
                <div className={styles.moduleInfo}>
                  <div className={styles.moduleTopRow}>
                    <span className={styles.moduleSubject}>{mod.subject}</span>
                    {mod.progress === 100 && <span className={styles.chip} data-v="done">Complete</span>}
                    {mod.progress > 0 && mod.progress < 100 && <span className={styles.chip} data-v="active">In progress</span>}
                    {mod.locked && <span className={styles.chip} data-v="locked">Locked</span>}
                  </div>
                  <p className={styles.moduleTitle}>{mod.title}</p>
                  <p className={styles.moduleDesc}>{mod.description}</p>
                  <div className={styles.moduleMeta}>
                    <span>{mod.duration}</span>
                    <span className={styles.metaDot} />
                    <span>{mod.content.length} sections</span>
                  </div>
                </div>
                <div className={styles.moduleRight}>
                  {!mod.locked && (
                    <div className={styles.modProgressWrap}>
                      <ProgressBar value={mod.progress} size="sm" showValue />
                    </div>
                  )}
                  <Button
                    variant={mod.locked ? 'ghost' : mod.progress === 100 ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={mod.locked}
                    onClick={() => navigate(`/module/${mod.id}`)}
                  >
                    {mod.locked ? 'Locked' : mod.progress === 0 ? 'Start' : mod.progress === 100 ? 'Review' : 'Continue'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  RESOURCES — all lecturer uploads                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeView === 'resources' && (
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Resources</h1>
            <p className={styles.pageSub}>
              {uploads.length} file{uploads.length !== 1 ? 's' : ''} uploaded by your lecturer
            </p>
          </div>

          {uploads.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📂</div>
              <h3 className={styles.emptyTitle}>No resources yet</h3>
              <p className={styles.emptyText}>Your lecturer hasn't uploaded any files yet. Check back later.</p>
            </div>
          ) : (
            <>
              {/* Group by module */}
              {MOCK_MODULES.filter(m => uploads.some(u => u.moduleId === m.id)).map(mod => {
                const modUploads = uploads.filter(u => u.moduleId === mod.id);
                return (
                  <section key={mod.id} className={styles.resourceGroup}>
                    <div className={styles.resourceGroupHead}>
                      <div className={styles.resourceGroupLeft}>
                        <span className={styles.resourceGroupSubject}>{mod.subject}</span>
                        <h2 className={styles.resourceGroupTitle}>{mod.title}</h2>
                      </div>
                      <span className={styles.resourceGroupCount}>{modUploads.length} file{modUploads.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className={styles.resourceCards}>
                      {modUploads.map(r => (
                        <div key={r.id} className={styles.resourceCard}>
                          <div
                            className={styles.resourceCardIcon}
                            style={{ background: `${TYPE_COLORS[r.type]}18`, color: TYPE_COLORS[r.type] }}
                          >
                            {TYPE_ICONS[r.type]}
                          </div>
                          <div className={styles.resourceCardInfo}>
                            <span className={styles.resourceCardTitle}>{r.title}</span>
                            <div className={styles.resourceCardMeta}>
                              <span
                                className={styles.resourceCardType}
                                style={{ background: `${TYPE_COLORS[r.type]}18`, color: TYPE_COLORS[r.type] }}
                              >
                                {r.type.toUpperCase()}
                              </span>
                              <span>{r.size}</span>
                              <span>·</span>
                              <span>Added {r.uploadedAt}</span>
                            </div>
                          </div>
                          <button
                            className={styles.resourceCardDownload}
                            style={{ color: TYPE_COLORS[r.type] }}
                            aria-label={`Download ${r.title}`}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* Any uploads without a matching module */}
              {uploads.filter(u => !MOCK_MODULES.find(m => m.id === u.moduleId)).length > 0 && (
                <section className={styles.resourceGroup}>
                  <div className={styles.resourceGroupHead}>
                    <h2 className={styles.resourceGroupTitle}>Other resources</h2>
                  </div>
                  <div className={styles.resourceCards}>
                    {uploads.filter(u => !MOCK_MODULES.find(m => m.id === u.moduleId)).map(r => (
                      <div key={r.id} className={styles.resourceCard}>
                        <div className={styles.resourceCardIcon} style={{ background: `${TYPE_COLORS[r.type]}18`, color: TYPE_COLORS[r.type] }}>
                          {TYPE_ICONS[r.type]}
                        </div>
                        <div className={styles.resourceCardInfo}>
                          <span className={styles.resourceCardTitle}>{r.title}</span>
                          <div className={styles.resourceCardMeta}>
                            <span className={styles.resourceCardType} style={{ background: `${TYPE_COLORS[r.type]}18`, color: TYPE_COLORS[r.type] }}>{r.type.toUpperCase()}</span>
                            <span>{r.size}</span>
                          </div>
                        </div>
                        <button className={styles.resourceCardDownload} style={{ color: TYPE_COLORS[r.type] }} aria-label={`Download ${r.title}`}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  CERTIFICATES                                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeView === 'certificates' && (
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Certificates</h1>
            <p className={styles.pageSub}>{certModules.length} certificate{certModules.length !== 1 ? 's' : ''} earned</p>
          </div>

          {certModules.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏆</div>
              <h3 className={styles.emptyTitle}>No certificates yet</h3>
              <p className={styles.emptyText}>Complete a module to earn your first certificate.</p>
              <Button onClick={() => setActiveView('modules')}>Browse modules</Button>
            </div>
          ) : (
            <div className={styles.certGrid}>
              {certModules.map(mod => (
                <div key={mod.id} className={styles.certCard}>
                  <div className={styles.certHeader}>
                    <span className={styles.certTrophy}>🏆</span>
                    <span className={styles.certBadge}>Certificate of Completion</span>
                  </div>
                  <div className={styles.certBody}>
                    <p className={styles.certIssued}>This certifies that</p>
                    <p className={styles.certName}>{user?.name}</p>
                    <p className={styles.certCompleted}>has successfully completed</p>
                    <p className={styles.certModule}>{mod.title}</p>
                    <p className={styles.certSubject}>{mod.subject}</p>
                  </div>
                  <div className={styles.certFooter}>
                    <span className={styles.certMeta}>
                      Fundisa · 2026
                      {getEntry(mod.id).quizScore !== null && ` · Score: ${getEntry(mod.id).quizScore}%`}
                    </span>
                    <Button size="sm" variant="secondary">Download PDF</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </DashboardLayout>
  );
}
