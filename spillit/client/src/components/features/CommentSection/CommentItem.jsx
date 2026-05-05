import { useAuthStore } from '../../../store/authStore'
import { timeAgo, getInitials } from '../../../lib/utils'
import styles from './CommentItem.module.css'

export default function CommentItem({ comment, onDelete }) {
  const { user } = useAuthStore()

  const isOwn    = user?.id === comment.user?.id
  const isAnon   = comment.is_anonymous
  const initials = getInitials(comment.user?.display_name ?? '?')

  return (
    <div className={styles.item}>

      {/* Avatar */}
      {isAnon ? (
        <div className={`avatar avatar-sm avatar-anon ${styles.avatar}`}>👤</div>
      ) : (
        <div className={`avatar avatar-sm ${styles.avatar}`}>{initials}</div>
      )}

      {/* Bubble */}
      <div className={styles.bubble}>
        <div className={styles.meta}>
          <span className={styles.name}>
            {isAnon ? 'Anonymous' : `@${comment.user?.username ?? 'unknown'}`}
          </span>
          <span className={`font-mono ${styles.time}`}>
            {timeAgo(comment.created_at)}
          </span>
          {isOwn && (
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(comment.id)}
              aria-label="Delete comment"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          )}
        </div>
        <p className={styles.content}>{comment.content}</p>
      </div>

    </div>
  )
}
