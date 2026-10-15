import styles from './ProgressBar.module.css';

interface Props {
  value: number; // 0–100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export default function ProgressBar({ value, label, showValue = true, size = 'md' }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={styles.wrapper}>
      {(label || showValue) && (
        <div className={styles.top}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{clamped}%</span>}
        </div>
      )}
      <div className={`${styles.track} ${styles[size]}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
