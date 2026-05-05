import styles from './MediaPreview.module.css'

export default function MediaPreview({ file, onRemove }) {
  if (!file) return null

  const url = URL.createObjectURL(file)

  return (
    <div className={styles.wrap}>
      <img src={url} alt="Preview" className={styles.img} />
      <button
        type="button"
        className={styles.remove}
        onClick={onRemove}
        aria-label="Remove image"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M1 1l10 10M11 1L1 11" />
        </svg>
      </button>
    </div>
  )
}
