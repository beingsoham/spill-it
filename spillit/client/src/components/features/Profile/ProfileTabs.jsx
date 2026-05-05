import styles from './ProfileTabs.module.css'

const TABS = [
  { key: 'spills',  label: '☕ Spills'   },
  { key: 'liked',   label: '❤ Liked'    },
]

export default function ProfileTabs({ active, onChange }) {
  return (
    <div className={styles.tabs}>
      {TABS.map(t => (
        <button
          key={t.key}
          className={`${styles.tab} ${active === t.key ? styles.active : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          {active === t.key && <span className={styles.indicator} />}
        </button>
      ))}
    </div>
  )
}
