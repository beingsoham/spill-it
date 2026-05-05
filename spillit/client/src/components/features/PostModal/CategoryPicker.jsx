import styles from './CategoryPicker.module.css'

const CATEGORIES = [
  { key: 'Work',    emoji: '💼' },
  { key: 'School',  emoji: '🏫' },
  { key: 'Tech',    emoji: '💻' },
  { key: 'Drama',   emoji: '💅' },
  { key: 'Culture', emoji: '🌍' },
  { key: 'Other',   emoji: '☕' },
]

export default function CategoryPicker({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Category</p>
      <div className={styles.grid}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            type="button"
            className={`${styles.item} ${value === c.key ? styles.active : ''}`}
            onClick={() => onChange(c.key)}
          >
            <span className={styles.emoji}>{c.emoji}</span>
            <span className={styles.name}>{c.key}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
