import { useRef, useEffect } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { getInitials }  from '../../../lib/utils'
import styles from './CommentInput.module.css'

const MAX = 300

export default function CommentInput({
  content, onChange,
  isAnonymous, onToggleAnon,
  onSubmit, submitting,
}) {
  const { profile } = useAuthStore()
  const textareaRef = useRef(null)
  const remaining   = MAX - content.length

  // Auto-grow
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [content])

  function handleKeyDown(e) {
    // Cmd/Ctrl + Enter submits
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  const initials = getInitials(profile?.display_name ?? '?')

  return (
    <div className={styles.wrap}>

      {/* Avatar */}
      {isAnonymous ? (
        <div className={`avatar avatar-sm avatar-anon ${styles.avatar}`}>👤</div>
      ) : (
        <div className={`avatar avatar-sm ${styles.avatar}`}>{initials}</div>
      )}

      <div className={styles.inputWrap}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={isAnonymous ? 'Reply anonymously...' : 'Add a reply...'}
          value={content}
          onChange={e => e.target.value.length <= MAX && onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={submitting}
        />

        <div className={styles.actions}>
          {/* Anonymous toggle */}
          <button
            type="button"
            className={`${styles.anonBtn} ${isAnonymous ? styles.anonOn : ''}`}
            onClick={onToggleAnon}
            title="Toggle anonymous"
          >
            👤
          </button>

          {/* Char counter — only show when typing */}
          {content.length > 0 && (
            <span className={`font-mono ${styles.counter}
              ${remaining < 50 ? styles.warn : ''}
              ${remaining < 20 ? styles.danger : ''}`}>
              {remaining}
            </span>
          )}

          {/* Submit */}
          <button
            type="button"
            className={`${styles.submitBtn} ${content.trim() && !submitting ? styles.active : ''}`}
            onClick={onSubmit}
            disabled={!content.trim() || submitting}
            aria-label="Post comment"
          >
            {submitting ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10l16-8-8 16V10H2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
