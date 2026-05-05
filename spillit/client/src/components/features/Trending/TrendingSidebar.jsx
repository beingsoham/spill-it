import { useNavigate } from 'react-router-dom'
import { useTrending }  from '../../../hooks/useTrending'
import { compactNumber, timeAgo, getTempTier } from '../../../lib/utils'
import styles from './TrendingSidebar.module.css'

export default function TrendingSidebar() {
  const { tags, posts, loading } = useTrending()
  const navigate = useNavigate()

  return (
    <div className={styles.wrap}>

      {/* ── Trending Tags ── */}
      <div className={styles.section}>
        <h3 className={`font-display ${styles.heading}`}>🔥 Trending</h3>

        {loading ? (
          <div className={styles.skeletons}>
            {[70, 50, 80, 60, 40].map((w, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 32, borderRadius: 8, width: `${w}%` }}
              />
            ))}
          </div>
        ) : tags.length === 0 ? (
          <p className={styles.empty}>No trending tags yet</p>
        ) : (
          <div className={styles.tags}>
            {tags.map(({ tag, count }, i) => (
              <button
                key={tag}
                className={styles.tag}
                onClick={() => navigate(`/explore?tag=${tag}`)}
              >
                <span className={styles.tagRank}>#{i + 1}</span>
                <span className={styles.tagName}>{tag}</span>
                <span className={styles.tagCount}>{compactNumber(count)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* ── Hot Posts ── */}
      <div className={styles.section}>
        <h3 className={`font-display ${styles.heading}`}>☕ Hot Tea</h3>

        {loading ? (
          <div className={styles.skeletons}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 60, borderRadius: 10 }}
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className={styles.empty}>No hot tea yet</p>
        ) : (
          <div className={styles.hotPosts}>
            {posts.map(post => {
              const temp = getTempTier(post.temp_score)
              return (
                <div key={post.id} className={styles.hotPost}>
                  <span className={`badge ${temp.cls} ${styles.tempBadge}`}>
                    {temp.label}
                  </span>
                  <p className={styles.hotContent}>
                    {post.content.slice(0, 80)}{post.content.length > 80 ? '...' : ''}
                  </p>
                  <span className={`font-mono ${styles.hotMeta}`}>
                    {compactNumber(post.likes_count)} likes · {timeAgo(post.created_at)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <p>Made with ☕ · SpillIt</p>
      </div>

    </div>
  )
}
