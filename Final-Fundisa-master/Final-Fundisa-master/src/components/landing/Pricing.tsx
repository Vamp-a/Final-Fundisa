import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Pricing.module.css';

const PLANS = [
  {
    name: 'Free',
    price: 'R0',
    period: 'forever',
    desc: 'Start learning today with no commitment.',
    featured: false,
    cta: 'Get started free',
    features: [
      'Access to selected courses',
      'Basic progress tracking',
      'Certificates on selected courses',
      'Mobile-friendly learning',
      'Community forums',
    ],
    missing: ['Full course library', 'Personalised recommendations', 'Advanced analytics', 'Priority support'],
  },
  {
    name: 'Pro',
    price: 'R199',
    period: '/month',
    desc: 'Full access for dedicated learners.',
    featured: true,
    cta: 'Start Pro free for 14 days',
    features: [
      'Full course library access',
      'Advanced progress tracking',
      'All certificates included',
      'Personalised recommendations',
      'Offline downloads',
      'Priority support',
      'Learning streak rewards',
    ],
    missing: [],
  },
  {
    name: 'Business',
    price: 'R999',
    period: '/month',
    desc: 'For schools, companies, and organisations.',
    featured: false,
    cta: 'Explore for organisations',
    features: [
      'Everything in Pro',
      'Organisation management portal',
      'Advanced analytics & reports',
      'Team and group management',
      'Custom learning programs',
      'Branded certificates',
      'Dedicated account manager',
    ],
    missing: [],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  return (
    <section ref={ref} id="pricing" className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Pricing</span>
          <h2 className={styles.heading}>Simple, transparent pricing.</h2>
          <p className={styles.sub}>Start free. Upgrade when you are ready. Cancel any time.</p>
        </div>

        <div className={styles.grid}>
          {PLANS.map(plan => (
            <div key={plan.name} className={`${styles.card} ${plan.featured ? styles.cardFeatured : ''}`}>
              {plan.featured && <div className={styles.popularBadge}>Most popular</div>}

              <div className={styles.planTop}>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  <span className={styles.priceAmount}>{plan.price}</span>
                  <span className={styles.pricePeriod}>{plan.period}</span>
                </div>
                <p className={styles.planDesc}>{plan.desc}</p>
              </div>

              <button
                className={`${styles.planCta} ${plan.featured ? styles.planCtaFeatured : ''}`}
                onClick={() => navigate('/login')}
              >
                {plan.cta}
              </button>

              <ul className={styles.featureList}>
                {plan.features.map(f => (
                  <li key={f} className={styles.featureItem} data-included="true">
                    <span className={styles.checkIcon}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className={styles.featureItem} data-included="false">
                    <span className={styles.crossIcon}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className={styles.note}>All prices in ZAR. VAT included. Students get 50% off Pro with a valid student email.</p>
      </div>
    </section>
  );
}
