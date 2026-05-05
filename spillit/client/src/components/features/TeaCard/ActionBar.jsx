import { useState } from 'react'
import { compactNumber } from '../../../lib/utils'
import styles from './ActionBar.module.css'

export default function ActionBar({ post, onLike, onComment, onListen, commentsOpen }) {
  const [liked, setLiked] = useState(post.liked_by_me)
  const [likeCount, setLikeCount] = useState(post.likes_count)
  const [isPlaying, setIsPlaying] = useState(false)

  function handleLike() {
    // Optimistic update — flip immediately, sync with API later
    const next = !liked
    setLiked(next)
    setLikeCount(c => c + (next ? 1 : -1))
    onLike?.(post.id, next)
  }

  function handleListen() {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(post.content)
    utterance.rate  = 1.05
    utterance.pitch = 0.95
    utterance.onend = () => setIsPlaying(false)

    // Pick a slightly warmer voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen')
    )
    if (preferred) utterance.voice = preferred

    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
    onListen?.(post.id)
  }

  return (
    <div className={styles.bar}>

      {/* Like */}
      <button
        className={`${styles.action} ${liked ? styles.liked : ''}`}
        onClick={handleLike}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
        <span>{compactNumber(likeCount)}</span>
      </button>

      {/* Comment */}
      <button
        className={`${styles.action} ${commentsOpen ? styles.commentOpen : ''}`}
        onClick={() => onComment?.(post.id)}
        aria-label="Comment"
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 3V5z" />
        </svg>
        <span>{compactNumber(post.comments_count)}</span>
      </button>

      {/* Listen (TTS) */}
      <button
        className={`${styles.action} ${isPlaying ? styles.playing : ''}`}
        onClick={handleListen}
        aria-label={isPlaying ? 'Stop' : 'Listen'}
      >
        {isPlaying ? (
          <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="4" width="4" height="12" rx="1"/>
            <rect x="12" y="4" width="4" height="12" rx="1"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19V5l-7 4v6l7 4zM9 5l7 4v6l-7 4" />
          </svg>
        )}
        <span>{isPlaying ? 'Stop' : 'Listen'}</span>
      </button>

      {/* Share — right-aligned */}
      <button
        className={styles.action}
        style={{ marginLeft: 'auto' }}
        onClick={() => {
          navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id)
        }}
        aria-label="Share"
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v3a1 1 0 001 1h10a1 1 0 001-1v-3" />
          <path d="M10 3v10M7 6l3-3 3 3" />
        </svg>
      </button>

    </div>
  )
}
