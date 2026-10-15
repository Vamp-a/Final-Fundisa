import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_MODULES, MOCK_TRANSLATIONS } from '../data/mockData';
import { SA_LANGUAGES, type SouthAfricanLanguage } from '../types';
import { useProgress } from '../context/ProgressContext';
import { useContent } from '../context/ContentContext';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Quiz from '../components/Quiz';
import styles from './ModuleViewer.module.css';

type View = 'content' | 'readComplete' | 'quiz';

function simulateTranslation(text: string, lang: SouthAfricanLanguage): string {
  const map = MOCK_TRANSLATIONS[lang];
  if (map?.[text]) return map[text];
  const prefix: Record<string, string> = {
    zulu: '[isiZulu] ', xhosa: '[isiXhosa] ', sotho: '[Sesotho] ',
    tswana: '[Setswana] ', venda: '[Tshivenḓa] ', tsonga: '[Xitsonga] ',
    swati: '[siSwati] ', ndebele: '[isiNdebele] ', afrikaans: '[Afrikaans] ',
  };
  return `${prefix[lang] ?? ''}${text}`;
}

export default function ModuleViewer() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate     = useNavigate();
  const mod          = MOCK_MODULES.find(m => m.id === moduleId);
  const { markSectionRead, getEntry } = useProgress();
  const { getUploadsForModule } = useContent();

  const [view,               setView]               = useState<View>('content');
  const [selectedLang,       setSelectedLang]       = useState<SouthAfricanLanguage | null>(null);
  const [translatedSections, setTranslatedSections] = useState<Record<string, Record<string, string>>>({});
  const [translating,        setTranslating]        = useState(false);
  const [langMenuOpen,       setLangMenuOpen]       = useState(false);
  const [activeSection,      setActiveSection]      = useState(0);

  // Mark the first section as read on mount
  useEffect(() => {
    if (!mod) return;
    markSectionRead(mod.id, mod.content[0].id, mod.content.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod?.id]);

  const handleSectionClick = (idx: number) => {
    if (!mod) return;
    setActiveSection(idx);
    markSectionRead(mod.id, mod.content[idx].id, mod.content.length);
  };

  // When the student clicks "Next" on the last section, show the readComplete screen
  const handleNextSection = () => {
    if (!mod) return;
    if (activeSection < mod.content.length - 1) {
      handleSectionClick(activeSection + 1);
    } else {
      // All sections navigated — prompt quiz
      setView('readComplete');
    }
  };

  const handleTranslate = useCallback((lang: SouthAfricanLanguage) => {
    setSelectedLang(lang);
    setLangMenuOpen(false);
    setTranslating(true);
    setTimeout(() => {
      if (!mod) return;
      const result: Record<string, Record<string, string>> = {};
      mod.content.forEach(sec => {
        result[sec.id] = {
          heading: simulateTranslation(sec.heading, lang),
          body:    simulateTranslation(sec.body,    lang),
        };
      });
      setTranslatedSections(result);
      setTranslating(false);
    }, 800);
  }, [mod]);

  const clearTranslation = () => { setSelectedLang(null); setTranslatedSections({}); };

  if (!mod) {
    return (
      <DashboardLayout activeId="modules" onNavClick={() => navigate('/student')}>
        <div className={styles.notFound}>
          <h2>Module not found</h2>
          <Button onClick={() => navigate('/student')}>Back to dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  const entry           = getEntry(mod.id);
  const isAlreadyDone   = entry.progress === 100;
  const totalSections   = mod.content.length;
  const isLastSection   = activeSection === totalSections - 1;
  const resources       = getUploadsForModule(mod.id);

  /* ── READ COMPLETE screen — shown after reading all sections ───────────── */
  if (view === 'readComplete') {
    return (
      <DashboardLayout activeId="modules" onNavClick={() => navigate('/student')}>
        <div className={styles.readCompleteWrap}>
          <div className={styles.readComplete}>

            <div className={styles.rcIcon} aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
            </div>

            <span className={styles.rcSubject}>{mod.subject}</span>
            <h1 className={styles.rcTitle}>You've finished reading</h1>
            <p className={styles.rcModule}>{mod.title}</p>
            <p className={styles.rcMsg}>
              You've worked through all {totalSections} section{totalSections !== 1 ? 's' : ''}.
              Now test what you've learned — pass the quiz with 60% or more to earn your certificate.
            </p>

            {/* Summary of sections read */}
            <div className={styles.rcSections}>
              {mod.content.map((sec, i) => (
                <div key={sec.id} className={styles.rcSection}>
                  <span className={styles.rcSectionCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </span>
                  <span className={styles.rcSectionNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.rcSectionLabel}>{sec.heading}</span>
                </div>
              ))}
            </div>

            <div className={styles.rcCtas}>
              <Button size="lg" onClick={() => setView('quiz')}>
                Take the quiz
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Button>
              <Button variant="ghost" size="lg" onClick={() => { setView('content'); setActiveSection(0); }}>
                Review content
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeId="modules" onNavClick={() => navigate('/student')}>
      <div className={styles.viewer}>

        {/* ── Module header bar ─────────────────────────────────────── */}
        <div className={styles.moduleBar}>
          <div className={styles.moduleBarLeft}>
            <button className={styles.backBtn} onClick={() => navigate('/student')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
              </svg>
              Back
            </button>
            <div className={styles.modMeta}>
              <span className={styles.modSubject}>{mod.subject}</span>
              <h1 className={styles.modTitle}>{mod.title}</h1>
            </div>
          </div>

          <div className={styles.moduleBarRight}>
            {/* Section progress pill */}
            <div className={styles.sectionPill}>
              <span className={styles.sectionPillText}>
                Section {activeSection + 1} of {totalSections}
              </span>
              <div className={styles.sectionPillBar}>
                <div
                  className={styles.sectionPillFill}
                  style={{ width: `${((activeSection + 1) / totalSections) * 100}%` }}
                />
              </div>
            </div>

            {/* Translation picker */}
            <div className={styles.translateWrap}>
              {selectedLang ? (
                <div className={styles.activeLang}>
                  <span>{SA_LANGUAGES.find(l => l.code === selectedLang)?.label}</span>
                  <button className={styles.clearLang} onClick={clearTranslation} aria-label="Remove translation">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className={styles.langDropWrap}>
                  <button
                    className={styles.translateBtn}
                    onClick={() => setLangMenuOpen(o => !o)}
                    aria-expanded={langMenuOpen}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                    </svg>
                    Translate
                  </button>
                  {langMenuOpen && (
                    <ul className={styles.langMenu} role="listbox">
                      {SA_LANGUAGES.map(lang => (
                        <li
                          key={lang.code}
                          className={styles.langOption}
                          role="option"
                          aria-selected={selectedLang === lang.code}
                          onClick={() => handleTranslate(lang.code)}
                        >
                          {lang.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* If already completed, show quiz button */}
            {(isAlreadyDone || view === 'quiz') && (
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${view === 'content' ? styles.tabActive : ''}`}
                  onClick={() => setView('content')}
                >
                  Module
                </button>
                <button
                  className={`${styles.tab} ${view === 'quiz' ? styles.tabActive : ''}`}
                  onClick={() => setView('quiz')}
                >
                  Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Content area ────────────────────────────────────────────── */}
        {view === 'content' && (
          <div className={`${styles.contentLayout} ${selectedLang ? styles.splitLayout : ''}`}>

            {/* Section sidebar */}
            <aside className={styles.sectionNav}>
              <p className={styles.sectionNavTitle}>Sections</p>
              {mod.content.map((sec, i) => {
                const isRead = entry.sectionsRead.has(sec.id);
                return (
                  <button
                    key={sec.id}
                    className={`${styles.sectionNavItem} ${i === activeSection ? styles.sectionNavActive : ''}`}
                    onClick={() => handleSectionClick(i)}
                  >
                    <span className={`${styles.sectionNavCheck} ${isRead ? styles.sectionNavCheckDone : ''}`}>
                      {isRead
                        ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                        : <span className={styles.sectionNavNum}>{String(i + 1).padStart(2, '0')}</span>
                      }
                    </span>
                    <span className={styles.sectionNavLabel}>{sec.heading}</span>
                  </button>
                );
              })}
            </aside>

            {/* English article — single section at a time */}
            <article className={styles.article}>
              {translating && (
                <div className={styles.translatingBar}>
                  <span className={styles.spinner} />
                  Translating with AI…
                </div>
              )}

              {/* Section content */}
              <div className={styles.section}>
                <div className={styles.sectionMeta}>
                  <span className={styles.sectionCount}>
                    {activeSection + 1} / {totalSections}
                  </span>
                  {entry.sectionsRead.has(mod.content[activeSection].id) && (
                    <span className={styles.sectionReadBadge}>Read</span>
                  )}
                </div>
                <h2 className={styles.secHeading}>{mod.content[activeSection].heading}</h2>
                <p className={styles.secBody}>{mod.content[activeSection].body}</p>
              </div>

              {/* Resources uploaded by lecturer */}
              {resources.length > 0 && (
                <div className={styles.resourcesPanel}>
                  <p className={styles.resourcesTitle}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Resources from your lecturer
                  </p>
                  <div className={styles.resourcesList}>
                    {resources.map(r => (
                      <div key={r.id} className={styles.resourceItem}>
                        <span className={styles.resourceType} data-type={r.type}>
                          {r.type === 'pdf'      && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                          {r.type === 'video'    && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                          {r.type === 'document' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                          {r.type === 'test'     && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
                          {r.type.toUpperCase()}
                        </span>
                        <div className={styles.resourceInfo}>
                          <span className={styles.resourceName}>{r.title}</span>
                          <span className={styles.resourceMeta}>{r.size} · Added {r.uploadedAt}</span>
                        </div>
                        <button className={styles.resourceDownload} aria-label={`Download ${r.title}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className={styles.sectionNav2}>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={activeSection === 0}
                  onClick={() => handleSectionClick(activeSection - 1)}
                >
                  ← Previous
                </Button>

                {isLastSection ? (
                  <Button size="md" onClick={handleNextSection}>
                    Finish reading — take quiz →
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleNextSection}>
                    Next section →
                  </Button>
                )}
              </div>
            </article>

            {/* Translation pane */}
            {selectedLang && !translating && (
              <aside className={styles.translationPane}>
                <div className={styles.paneHeader}>
                  <span className={styles.paneLang}>
                    {SA_LANGUAGES.find(l => l.code === selectedLang)?.label}
                  </span>
                  <span className={styles.paneAiBadge}>AI translation</span>
                </div>
                <div className={styles.section}>
                  <h2 className={styles.secHeading}>
                    {translatedSections[mod.content[activeSection].id]?.heading ?? mod.content[activeSection].heading}
                  </h2>
                  <p className={styles.secBody}>
                    {translatedSections[mod.content[activeSection].id]?.body ?? mod.content[activeSection].body}
                  </p>
                </div>
              </aside>
            )}
          </div>
        )}

        {/* ── Quiz ─────────────────────────────────────────────────────── */}
        {view === 'quiz' && (
          <div className={styles.quizWrap}>
            <Quiz moduleId={mod.id} onBack={() => setView('content')} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
