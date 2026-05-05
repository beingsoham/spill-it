import { useSearchParams }    from 'react-router-dom'
import { useEffect }          from 'react'
import { useExplore }         from '../hooks/useExplore'
import { useTrending }        from '../hooks/useTrending'
import TeaCard                from '../components/features/TeaCard'
import styles                 from './ExplorePage.module.css'

const CATEGORIES = [
  { key: null,       label: '✨ All'      },
  { key: 'Work',     label: '💼 Work'    },
  { key: 'School',   label: '🏫 School'  },
  { key: 'Tech',     label: '💻 Tech'    },
  { key: 'Drama',    label: '💅 Drama'   },
  { key: 'Culture',  label: '🌍 Culture' },
  { key: 'Other',    label: '☕ Other'   },
]

export default function ExplorePage() {
  const [searchParams] = useSearchParams()
  const { query, setQuery, category, setCategory, posts, loading } = useExplore()
  const { tags } = useTrending()

  useEffect(() => {
    const tag = searchParams.get('tag')
    if (tag) setQuery(tag)
  }, [searchParams])

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
    <div className={styles.page} style={{ animation: 'fadeUp 200ms ease both' }}>

      {/* ── Search bar ── */}
      <div className={styles.searchWrap}>
        <div className={styles.searchBox}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
            stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" /><path d="M15 15l3 3" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search tea, #tags, topics..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className={styles.categories}>
        {CATEGORIES.map(c => (
          <button
            key={String(c.key)}
            className={`pill ${category === c.key ? 'active' : ''}`}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Trending tags (when no search) ── */}
      {!query && tags.length > 0 && (
        <div className={styles.tagsSection}>
          <p className={styles.tagsLabel}>Trending tags</p>
          <div className={styles.tagCloud}>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                className={styles.tagChip}
                onClick={() => setQuery(tag)}
              >
                {tag}
                <span className={styles.tagCount}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <div className={styles.results}>

        {/* Section label */}
        <p className={styles.resultsLabel}>
          {query
            ? `Results for "${query}"`
            : category
            ? `${category} tea`
            : 'Hot right now'}
        </p>

        {/* Skeletons */}
        {loading && (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 12, width: '25%', borderRadius: 4 }} />
                </div>
              </div>
              <div className="skeleton" style={{ height: 14, width: '90%', borderRadius: 4, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 4 }} />
            </div>
          ))
        )}

        {/* Empty */}
        {!loading && posts.length === 0 && (
          <div className={styles.empty}>
            <span style={{ fontSize: 36 }}>🫖</span>
            <p>{query ? `No tea found for "${query}"` : 'No tea here yet'}</p>
          </div>
        )}

        {/* Posts */}
        {!loading && posts.map((raw, i) => (
          <TeaCard
            key={raw.id}
            post={shapePost(raw)}
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}

      </div>
    </div>
  )
}
