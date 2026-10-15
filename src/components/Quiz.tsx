import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_QUIZZES, MOCK_MODULES } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import styles from './Quiz.module.css';

interface Props {
  moduleId: string;
  onBack: () => void;
}

type Phase = 'intro' | 'playing' | 'result' | 'completed';

export default function Quiz({ moduleId, onBack }: Props) {
  const quiz    = MOCK_QUIZZES.find(q => q.moduleId === moduleId);
  const mod     = MOCK_MODULES.find(m => m.id === moduleId);
  const { completeModule, getEntry } = useProgress();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [phase,     setPhase]     = useState<Phase>('intro');
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers,   setAnswers]   = useState<(number | null)[]>([]);
  const [streak,    setStreak]    = useState(0);

  if (!quiz) {
    return (
      <div className={styles.empty}>
        <p>No quiz available for this module yet.</p>
        <Button variant="secondary" size="sm" onClick={onBack}>Back to module</Button>
      </div>
    );
  }

  const question = quiz.questions[current];
  const totalQ   = quiz.questions.length;
  const isLast   = current === totalQ - 1;

  const handleSelect = (idx: number) => { if (!confirmed) setSelected(idx); };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === question.correctIndex) setStreak(s => s + 1);
    else setStreak(0);
  };

  const handleNext = () => {
    const nextAnswers = [...answers, selected];
    if (isLast) {
      const score = nextAnswers.reduce<number>((acc, ans, i) =>
        acc + (ans != null && ans === quiz.questions[i].correctIndex ? 1 : 0), 0);
      const pct = Math.round((score / totalQ) * 100);
      setAnswers(nextAnswers);
      // Pass threshold = 60%
      if (pct >= 60) {
        completeModule(moduleId, pct);
        setPhase('completed');
      } else {
        setPhase('result');
      }
    } else {
      setAnswers(nextAnswers);
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRestart = () => {
    setPhase('intro');
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers([]);
    setStreak(0);
  };

  /* Computed after answers are finalised */
  const score = answers.reduce<number>((acc, ans, i) =>
    acc + (ans != null && ans === quiz.questions[i].correctIndex ? 1 : 0), 0);
  const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

  const getResultTier = () => {
    if (pct === 100) return { label: 'Perfect score!',    msg: 'Outstanding — every question correct.',                            color: 'gold'  };
    if (pct >= 80)   return { label: 'Well done',         msg: 'Strong result. Review any missed questions.',                       color: 'green' };
    if (pct >= 60)   return { label: 'Getting there',     msg: 'Good foundation. Go back through the module before retrying.',      color: 'amber' };
    return               { label: 'Keep practising',    msg: 'Re-read the module carefully, then try the quiz again.',             color: 'red'   };
  };

  /* ── INTRO ─────────────────────────────────────────────────────────────── */
  if (phase === 'intro') {
    const entry = getEntry(moduleId);
    const alreadyPassed = entry.quizScore !== null && entry.quizScore >= 60;
    return (
      <div className={styles.intro}>
        <div className={styles.introIcon} aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <h2 className={styles.introTitle}>{quiz.title}</h2>
        {alreadyPassed && (
          <div className={styles.alreadyPassed}>
            You scored <strong>{entry.quizScore}%</strong> on your last attempt — module complete.
          </div>
        )}
        <p className={styles.introDesc}>
          {totalQ} questions based on what you just read. Pass mark is 60%. Unlimited retries.
        </p>
        <div className={styles.introStats}>
          <div className={styles.introStat}>
            <span className={styles.introStatNum}>{totalQ}</span>
            <span className={styles.introStatLabel}>Questions</span>
          </div>
          <div className={styles.introStat}>
            <span className={styles.introStatNum}>60%</span>
            <span className={styles.introStatLabel}>Pass mark</span>
          </div>
          <div className={styles.introStat}>
            <span className={styles.introStatNum}>∞</span>
            <span className={styles.introStatLabel}>Attempts</span>
          </div>
        </div>
        <div className={styles.introCtas}>
          <Button size="lg" onClick={() => setPhase('playing')}>
            {alreadyPassed ? 'Retake quiz' : 'Start quiz'}
          </Button>
          <Button variant="ghost" size="lg" onClick={onBack}>Back to module</Button>
        </div>
      </div>
    );
  }

  /* ── COMPLETION CELEBRATION ─────────────────────────────────────────────── */
  if (phase === 'completed') {
    return (
      <div className={styles.completionWrap}>
        <div className={styles.completion}>
          {/* Confetti dots */}
          <div className={styles.confetti} aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={styles.confettiDot} style={{
                '--delay': `${i * 0.08}s`,
                '--x': `${(i % 6) * 60 - 150}px`,
                '--hue': `${i * 30}`,
              } as React.CSSProperties} />
            ))}
          </div>

          <div className={styles.completionTrophy}>🏆</div>
          <div className={styles.completionScore}>
            <span className={styles.completionPct}>{pct}%</span>
            <span className={styles.completionFraction}>{score}/{totalQ} correct</span>
          </div>
          <h2 className={styles.completionTitle}>Module complete!</h2>
          <p className={styles.completionMsg}>
            You passed the quiz and earned a certificate for <strong>{mod?.title}</strong>.
          </p>

          {/* Certificate preview */}
          <div className={styles.certPreview}>
            <div className={styles.certPreviewHeader}>
              <span className={styles.certPreviewIcon}>🏆</span>
              <span className={styles.certPreviewBadge}>Certificate of Completion</span>
            </div>
            <div className={styles.certPreviewBody}>
              <p className={styles.certPreviewIssued}>This certifies that</p>
              <p className={styles.certPreviewName}>{user?.name}</p>
              <p className={styles.certPreviewCompleted}>has successfully completed</p>
              <p className={styles.certPreviewModule}>{mod?.title}</p>
              <p className={styles.certPreviewMeta}>Fundisa · {new Date().getFullYear()} · Score: {pct}%</p>
            </div>
          </div>

          <div className={styles.completionCtas}>
            <Button size="lg" onClick={() => navigate('/student')}>
              View my certificates
            </Button>
            <Button variant="secondary" size="lg" onClick={handleRestart}>
              Retake quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── RESULT (failed — score < 60%) ─────────────────────────────────────── */
  if (phase === 'result') {
    const tier = getResultTier();
    return (
      <div className={styles.result}>
        <div className={`${styles.resultScore} ${styles[`score_${tier.color}`]}`}>
          <span className={styles.resultPct}>{pct}%</span>
          <span className={styles.resultFraction}>{score}/{totalQ}</span>
        </div>
        <h2 className={styles.resultTitle}>{tier.label}</h2>
        <p className={styles.resultMsg}>{tier.msg}</p>
        <p className={styles.failNote}>You need 60% to pass. Try again after reviewing the module.</p>

        <div className={styles.resultBreakdown}>
          {quiz.questions.map((q, i) => {
            const ans     = answers[i];
            const correct = ans === q.correctIndex;
            return (
              <div key={q.id} className={`${styles.breakdownItem} ${correct ? styles.breakdownCorrect : styles.breakdownWrong}`}>
                <div className={styles.breakdownIndicator}>
                  {correct
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  }
                </div>
                <div className={styles.breakdownContent}>
                  <p className={styles.breakdownQ}>{q.question}</p>
                  {!correct && (
                    <p className={styles.breakdownExp}><strong>Correct:</strong> {q.options[q.correctIndex]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.resultCtas}>
          <Button size="lg" onClick={handleRestart}>Try again</Button>
          <Button variant="secondary" size="lg" onClick={onBack}>Review module</Button>
        </div>
      </div>
    );
  }

  /* ── PLAYING ─────────────────────────────────────────────────────────────── */
  const isCorrect = selected === question.correctIndex;

  return (
    <div className={styles.playing}>
      <div className={styles.playingHeader}>
        <div className={styles.qProgress}>
          <div className={styles.qProgressFill} style={{ width: `${(current / totalQ) * 100}%` }} />
        </div>
        <div className={styles.playingMeta}>
          <span className={styles.qCount}>{current + 1} / {totalQ}</span>
          {streak >= 2 && (
            <span className={styles.streak}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                <path d="M13.5 2c0 4-2.5 6-2.5 10 0 2.2 1.8 4 4 4s4-1.8 4-4c0-5-5.5-7-5.5-10z"/>
                <path d="M6 14c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
              </svg>
              {streak} in a row
            </span>
          )}
        </div>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.questionText}>{question.question}</p>
        <ul className={styles.options} role="radiogroup" aria-label="Answer options">
          {question.options.map((opt, i) => {
            let state: 'default' | 'selected' | 'correct' | 'wrong' | 'correct-reveal' = 'default';
            if (confirmed) {
              if (i === question.correctIndex) state = 'correct-reveal';
              else if (i === selected && !isCorrect) state = 'wrong';
              else if (i === selected && isCorrect) state = 'correct';
            } else if (i === selected) {
              state = 'selected';
            }
            return (
              <li key={i}>
                <button
                  className={`${styles.option} ${styles[`option_${state}`]}`}
                  onClick={() => handleSelect(i)}
                  disabled={confirmed}
                  role="radio"
                  aria-checked={selected === i}
                >
                  <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  <span className={styles.optionText}>{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {confirmed && (
          <div className={`${styles.explanation} ${isCorrect ? styles.expCorrect : styles.expWrong}`}>
            <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {question.explanation}
          </div>
        )}
      </div>

      <div className={styles.playingActions}>
        {!confirmed
          ? <Button size="lg" disabled={selected === null} onClick={handleConfirm}>Confirm answer</Button>
          : <Button size="lg" onClick={handleNext}>{isLast ? 'See my results' : 'Next question'}</Button>
        }
      </div>
    </div>
  );
}
