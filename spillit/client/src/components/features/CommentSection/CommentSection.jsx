import { useRef, useEffect } from 'react'
import { useComments }  from '../../../hooks/useComments'
import CommentItem      from './CommentItem'
import CommentInput     from './CommentInput'
import styles           from './CommentSection.module.css'

export default function CommentSection({ postId, isOpen }) {
  const {
    comments, loading, submitting, error,
    content, setContent,
    isAnonymous, setIsAnonymous,
    submitComment, deleteComment,
  } = useComments(postId, isOpen)

  const listRef = useRef(null)

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    if (!isOpen || !listRef.current) return
    const el = listRef.current
    el.scrollTop = el.scrollHeight
  }, [comments.length, isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.wrap}>

      {/* ── Comment list ── */}
      <div className={styles.list} ref={listRef}>

        {loading && (
          <div className={styles.loading}>
            {[80, 60, 90].map((w, i) => (
              <div key={i} className={styles.skeletonRow}>
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
                <div className="skeleton" style={{ flex: 1, height: 44, borderRadius: 10, width: `${w}%` }} />
              </div>
            ))}
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className={styles.empty}>
            <span>💬</span>
            <p>No replies yet. Be the first.</p>
          </div>
        )}

        {!loading && comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={deleteComment}
          />
        ))}

        {error && (
          <p className={styles.error}>{error}</p>
        )}
      </div>

      {/* ── Input ── */}
      <CommentInput
        content={content}
        onChange={setContent}
        isAnonymous={isAnonymous}
        onToggleAnon={() => setIsAnonymous(v => !v)}
        onSubmit={submitComment}
        submitting={submitting}
      />

    </div>
  )
}
