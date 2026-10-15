import { useState, useRef, type ChangeEvent } from 'react';
import { MOCK_STUDENT_PROGRESS, MOCK_MODULES } from '../data/mockData';
import { useContent } from '../context/ContentContext';
import DashboardLayout from '../components/DashboardLayout';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import styles from './LecturerDashboard.module.css';

type ActiveView = 'progress' | 'upload' | 'tests' | 'analytics';

interface UploadForm {
  title: string;
  type: 'pdf' | 'video' | 'document' | 'test';
  moduleId: string;
  file: File | null;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  pdf: 'PDF', video: 'Video', document: 'Doc', test: 'Test',
};

export default function LecturerDashboard() {
  // Auth used via DashboardLayout (sidebar handles sign-out + user display)
  const { uploads, addUpload } = useContent();
  const [activeView, setActiveView] = useState<ActiveView>('progress');
  const [form, setForm] = useState<UploadForm>({ title: '', type: 'pdf', moduleId: '', file: null });
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [testTitle, setTestTitle] = useState('');
  const [testModule, setTestModule] = useState('');
  const [testCreated, setTestCreated] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const avgProgress = Math.round(
    MOCK_STUDENT_PROGRESS.reduce((a, s) => a + (s.modulesCompleted / s.totalModules) * 100, 0) /
    MOCK_STUDENT_PROGRESS.length
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, file: e.target.files?.[0] ?? null }));
  };

  const handleUpload = () => {
    if (!form.title || !form.moduleId || !form.file) return;
    setUploadStatus('uploading');
    setTimeout(() => {
      addUpload({
        title:      form.title,
        type:       form.type,
        moduleId:   form.moduleId,
        uploadedAt: new Date().toISOString().slice(0, 10),
        size:       `${(form.file!.size / 1048576).toFixed(1)} MB`,
      });
      setForm({ title: '', type: 'pdf', moduleId: '', file: null });
      if (fileRef.current) fileRef.current.value = '';
      setUploadStatus('done');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }, 1200);
  };

  const handleCreateTest = () => {
    if (!testTitle || !testModule) return;
    setTestCreated(true);
    setTimeout(() => setTestCreated(false), 3000);
    setTestTitle('');
    setTestModule('');
  };

  return (
    <DashboardLayout
      activeId={activeView}
      onNavClick={id => setActiveView(id as ActiveView)}
    >

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* STUDENT PROGRESS                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeView === 'progress' && (
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Student Progress</h1>
              <p className={styles.pageSub}>Click a student row to expand quiz scores.</p>
            </div>
            {/* Quick stats */}
            <div className={styles.quickStats}>
              {[
                { v: MOCK_STUDENT_PROGRESS.length, l: 'Students' },
                { v: `${avgProgress}%`, l: 'Avg. progress' },
                { v: uploads.length, l: 'Uploads' },
              ].map(s => (
                <div key={s.l} className={styles.quickStat}>
                  <span className={styles.quickStatVal}>{s.v}</span>
                  <span className={styles.quickStatLabel}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.studentList}>
            {MOCK_STUDENT_PROGRESS.map(s => {
              const pct   = Math.round((s.modulesCompleted / s.totalModules) * 100);
              const isOpen = expandedStudent === s.studentId;
              return (
                <div key={s.studentId} className={styles.studentCard}>
                  <button
                    className={styles.studentRow}
                    onClick={() => setExpandedStudent(isOpen ? null : s.studentId)}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.studentLeft}>
                      <div className={styles.avatar}>
                        {s.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className={styles.studentName}>{s.studentName}</p>
                        <p className={styles.studentEmail}>{s.studentEmail}</p>
                      </div>
                    </div>

                    <div className={styles.studentMid}>
                      <div className={styles.progressWrap}>
                        <ProgressBar value={pct} size="sm" showValue />
                      </div>
                      <span className={styles.modCount}>{s.modulesCompleted}/{s.totalModules} modules</span>
                    </div>

                    <div className={styles.studentRight}>
                      <span className={styles.activeDate}>Active {s.lastActive}</span>
                      <svg
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                      >
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.expandPanel}>
                      <p className={styles.expandLabel}>Quiz scores</p>
                      <div className={styles.quizGrid}>
                        {Object.entries(s.quizScores).map(([modId, score]) => {
                          const mod = MOCK_MODULES.find(m => m.id === modId);
                          return (
                            <div key={modId} className={styles.quizItem}>
                              <span className={styles.quizSubject}>{mod?.subject ?? modId}</span>
                              <ProgressBar value={score} size="sm" showValue />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* UPLOAD CONTENT                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeView === 'upload' && (
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Upload Content</h1>
              <p className={styles.pageSub}>Attach PDFs, videos, or documents to a module.</p>
            </div>
          </div>

          <div className={styles.uploadLayout}>
            {/* Form card */}
            <div className={styles.formCard}>
              <h2 className={styles.cardTitle}>New upload</h2>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Content title</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. Chapter 3 Summary"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Type</label>
                  <select
                    className={styles.fieldSelect}
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as UploadForm['type'] }))}
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="test">Test</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Module</label>
                  <select
                    className={styles.fieldSelect}
                    value={form.moduleId}
                    onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))}
                  >
                    <option value="">Select module…</option>
                    {MOCK_MODULES.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>File</label>
                <div className={styles.dropzone} onClick={() => fileRef.current?.click()}>
                  {form.file
                    ? <span className={styles.dropzoneFile}>{form.file.name}</span>
                    : (
                      <>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--gray-400)'}}>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span className={styles.dropzoneText}>Click to choose a file</span>
                        <span className={styles.dropzoneSub}>PDF, MP4, DOCX up to 500 MB</span>
                      </>
                    )
                  }
                </div>
                <input ref={fileRef} type="file" className={styles.hiddenInput}
                  onChange={handleFileChange} accept=".pdf,.mp4,.docx,.doc,.pptx" />
              </div>

              {uploadStatus === 'done' && (
                <div className={styles.successBanner}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Content uploaded successfully.
                </div>
              )}

              <Button
                fullWidth size="lg" onClick={handleUpload}
                disabled={!form.title || !form.moduleId || !form.file || uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? 'Uploading…' : 'Upload content'}
              </Button>
            </div>

            {/* Uploaded files list */}
            <div className={styles.uploadedCard}>
              <h2 className={styles.cardTitle}>Uploaded files <span className={styles.countBadge}>{uploads.length}</span></h2>
              {uploads.length === 0
                ? <p className={styles.emptyNote}>No files uploaded yet.</p>
                : uploads.map(u => {
                  const mod = MOCK_MODULES.find(m => m.id === u.moduleId);
                  return (
                    <div key={u.id} className={styles.uploadedItem}>
                      <span className={styles.typeTag}>{CONTENT_TYPE_LABELS[u.type]}</span>
                      <div className={styles.uploadedInfo}>
                        <span className={styles.uploadedTitle}>{u.title}</span>
                        <span className={styles.uploadedMeta}>{mod?.subject ?? u.moduleId} · {u.size} · {u.uploadedAt}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CREATE TESTS                                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeView === 'tests' && (
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Create a Test</h1>
              <p className={styles.pageSub}>AI generates a draft from your module content.</p>
            </div>
          </div>

          <div className={styles.testLayout}>
            <div className={styles.formCard}>
              <h2 className={styles.cardTitle}>Test details</h2>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Test title</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. Term 3 Assessment"
                  value={testTitle}
                  onChange={e => setTestTitle(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Assign to module</label>
                <select
                  className={styles.fieldSelect}
                  value={testModule}
                  onChange={e => setTestModule(e.target.value)}
                >
                  <option value="">Select module…</option>
                  {MOCK_MODULES.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className={styles.aiHint}>
                <div className={styles.aiHintIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <p className={styles.aiHintTitle}>AI-assisted generation</p>
                  <p className={styles.aiHintBody}>Fundisa reads the module content and drafts quiz questions. You review and edit before publishing.</p>
                </div>
              </div>

              {testCreated && (
                <div className={styles.successBanner}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Test created and assigned to the module.
                </div>
              )}

              <Button fullWidth size="lg" disabled={!testTitle || !testModule} onClick={handleCreateTest}>
                Generate test draft
              </Button>
            </div>

            <div className={styles.stepsCard}>
              <h2 className={styles.cardTitle}>What happens next</h2>
              <ol className={styles.stepList}>
                {[
                  'Fundisa generates a draft test from the module content.',
                  'You review, edit, and remove questions in the test editor.',
                  'Publish the test — it becomes available to all students.',
                  'Student results appear in the progress tab automatically.',
                ].map((step, i) => (
                  <li key={i} className={styles.stepItem}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span className={styles.stepText}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ANALYTICS                                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeView === 'analytics' && (
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Analytics</h1>
              <p className={styles.pageSub}>Class-wide progress and performance overview.</p>
            </div>
          </div>

          {/* Real metrics only — no fabricated numbers */}
          <div className={styles.analyticsGrid}>
            {[
              { label: 'Total students',  value: MOCK_STUDENT_PROGRESS.length,    color: 'default' },
              { label: 'Avg. completion', value: `${avgProgress}%`,               color: 'brand'   },
              { label: 'Total uploads',   value: uploads.length,                  color: 'default' },
            ].map(m => (
              <div key={m.label} className={`${styles.metricCard} ${styles[`metric_${m.color}`]}`}>
                <span className={styles.metricVal}>{m.value}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </div>
            ))}
          </div>

          {/* Per-student breakdown */}
          <div className={styles.formCard}>
            <h2 className={styles.cardTitle}>Per-student breakdown</h2>
            <div className={styles.breakdownTable}>
              <div className={styles.breakdownHead}>
                <span>Student</span>
                <span>Modules done</span>
                <span>Progress</span>
                <span>Last active</span>
              </div>
              {MOCK_STUDENT_PROGRESS.map(s => {
                const pct = Math.round((s.modulesCompleted / s.totalModules) * 100);
                return (
                  <div key={s.studentId} className={styles.breakdownRow}>
                    <div className={styles.breakdownStudent}>
                      <div className={styles.avatar}>{s.studentName.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                      <div>
                        <p className={styles.studentName}>{s.studentName}</p>
                        <p className={styles.studentEmail}>{s.studentEmail}</p>
                      </div>
                    </div>
                    <span className={styles.breakdownMod}>{s.modulesCompleted}/{s.totalModules}</span>
                    <div className={styles.breakdownProgress}>
                      <ProgressBar value={pct} size="sm" showValue />
                    </div>
                    <span className={styles.breakdownDate}>{s.lastActive}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
