import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_COLORS, getTempTier, timeAgo } from '../../../lib/utils'
import Avatar from './Avatar'
import ActionBar from './ActionBar'
import CommentSection from '../CommentSection'
import styles from './TeaCard.module.css'

export default function TeaCard({ post, onLike, style }) {
  const [showComments, setShowComments] = useState(false)
  const temp  = getTempTier(post.temp_score)
  const catStyle = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Other

  return (
    <article className={`${styles.card} card card-shine`} style={style}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <Avatar user={post.is_anonymous ? null : post.user} size="sm" />

        <div className={styles.meta}>
          {post.is_anonymous ? (
            <span className={styles.anonName}>Anonymous</span>
          ) : (
            <Link
              to={`/profile/${post.user?.username}`}
              className={styles.username}
              onClick={e => e.stopPropagation()}
            >
              @{post.user?.username ?? 'unknown'}
            </Link>
          )}
          <span className={`${styles.time} font-mono`}>
            {timeAgo(post.created_at)}
          </span>
        </div>

        <div className={styles.badges}>
          {/* Category pill */}
          <span
            className={styles.catBadge}
            style={{ background: catStyle.bg, color: catStyle.color }}
          >
            {post.category}
          </span>

          {/* Temperature badge */}
          <span className={`badge ${temp.cls}`}>
            {temp.label}
          </span>
        </div>
      </header>

      {/* ── Content ── */}
      <p className={styles.content}>{post.content}</p>

      {/* ── Media (if any) ── */}
      {post.media_url && (
        <div className={styles.media}>
          <img src={post.media_url} alt="Tea attachment" />
        </div>
      )}

      {/* ── Action Bar ── */}
      <ActionBar
        post={post}
        onLike={onLike}
        onComment={() => setShowComments(v => !v)}
        commentsOpen={showComments}
      />

      {/* ── Comment Section ── */}
      <CommentSection
        postId={post.id}
        isOpen={showComments}
      />

    </article>
  )
}
