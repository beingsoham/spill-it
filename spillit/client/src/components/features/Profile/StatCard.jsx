import styles from './StatCard.module.css'

export default function StatCard({ value, label }) {
  return (
    <div className={styles.stat}>
      <span className={`font-display ${styles.value}`}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
