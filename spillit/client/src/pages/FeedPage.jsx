import { useEffect, useRef } from 'react'
import { useFeedStore }       from '../store/feedStore'
import { useFeedRealtime }    from '../hooks/useFeedRealtime'
import { useAuthStore }       from '../store/authStore'
import TeaCard                from '../components/features/TeaCard'
import styles                 from './FeedPage.module.css'

const FILTERS = [
  { key: 'hot',    label: '🔥 Hot'      },
  { key: 'fresh',  label: '✨ Fresh'    },
  { key: 'foryou', label: '👀 For You'  },
  { key: 'cold',   label: '🧊 Cold'    },
]

export default function FeedPage() {
  const { user }    = useAuthStore()
  const {
    posts, loading, hasMore, filter, newTeaCount, error,
    fetchPosts, setFilter, toggleLike, flushNewTea,
  } = useFeedStore()

  // Sentinel div for infinite scroll
  const sentinelRef = useRef(null)

  // Subscribe to real-time new posts
  useFeedRealtime()

  // Initial load
  useEffect(() => { fetchPosts(true) }, [])

  // Infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && !error) fetchPosts()
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, error])

  // Shape Supabase row into the format TeaCard expects
  function shapePost(raw) {
    return {
      ...raw,
      liked_by_me: false,
      user: raw.is_anonymous ? null : {
        id:           raw.user_id,
        username:     raw.username,
        display_name: raw.display_name,
        avatar_url:   raw.avatar_url,
      },
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Filter pills ── */}
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`pill ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── New tea banner ── */}
      {newTeaCount > 0 && (
        <div className={styles.newTeaBanner} onClick={flushNewTea}>
          ↑ {newTeaCount} new tea{newTeaCount > 1 ? 's' : ''} — tap to refresh
        </div>
      )}

      {/* ── Feed ── */}
      <div className={styles.feed}>
        {posts.map((raw, i) => (
          <TeaCard
            key={raw.id}
            post={shapePost(raw)}
            style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}
            onLike={(id, liked) => toggleLike(id, liked)}
          />
        ))}

        {/* Error state */}
        {error && !loading && (
          <div className={styles.placeholder}>
            <span style={{ fontSize: 32 }}>⚠️</span>
            <p style={{ color: 'var(--accent)' }}>Couldn't load tea</p>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 'var(--sp-3)', fontSize: 13 }}
              onClick={() => {
                useFeedStore.getState().fetchPosts(true)
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Skeleton loaders */}
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={`skeleton ${styles.skAvatar}`} />
            <div className={styles.skLines}>
              <div className={`skeleton ${styles.skLine}`} style={{ width: '40%' }} />
              <div className={`skeleton ${styles.skLine}`} style={{ width: '90%' }} />
              <div className={`skeleton ${styles.skLine}`} style={{ width: '70%' }} />
            </div>
          </div>
        ))}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} style={{ height: 1 }} />

        {/* End of feed */}
        {!hasMore && !loading && posts.length > 0 && (
          <p className={styles.endMsg}>You've caught all the tea ☕</p>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className={styles.placeholder}>
            <span style={{ fontSize: 36 }}>🫖</span>
            <p>No tea here yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Be the first to spill something
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
