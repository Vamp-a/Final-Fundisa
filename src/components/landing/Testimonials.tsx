import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Testimonials.module.css';

const TESTIMONIALS = [
  {
    name: 'Amahle Dlamini',
    role: 'Grade 11 Student',
    location: 'Durban',
    initials: 'AD',
    color: '#C4573A',   /* coral */
    quote: 'The isiZulu translations changed everything for me. I finally understood Cell Biology properly when I could read it in my home language alongside the English.',
    stars: 5,
    course: 'Life Sciences',
  },
  {
    name: 'Dr. Naledi Khumalo',
    role: 'Secondary School Educator',
    location: 'Johannesburg',
    initials: 'NK',
    color: '#5BAF8E',   /* sea-green */
    quote: 'The lecturer dashboard gives me a real picture of every student\'s progress. I spend less time chasing submissions and more time actually teaching.',
    stars: 5,
    course: 'Mathematics',
  },
  {
    name: 'Tebogo Mokoena',
    role: 'First-year University Student',
    location: 'Cape Town',
    initials: 'TM',
    color: '#D4A847',   /* amber spot */
    quote: 'I used Fundisa to revise for matric and got a distinction in Physical Sciences. The quizzes after every module kept me on track and showed me exactly where to focus.',
    stars: 5,
    course: 'Physical Sciences',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#D4A847" stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>What learners say</span>
          <h2 className={styles.heading}>Real results from real students.</h2>
          <p className={styles.sub}>From school classrooms to university lecture halls — here is how Fundisa is making a difference.</p>
        </div>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`${styles.card} ${i === 1 ? styles.cardFeatured : ''}`}>
              {i === 1 && <div className={styles.featuredBadge}>Most helpful</div>}
              <Stars count={t.stars} />
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.footer}>
                <div className={styles.avatar} style={{ background: t.color }}>{t.initials}</div>
                <div className={styles.person}>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>{t.role} · {t.location}</p>
                </div>
                <span className={styles.coursePill}>{t.course}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
