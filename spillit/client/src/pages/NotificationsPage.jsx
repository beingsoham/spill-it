import { useEffect }        from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { timeAgo, getInitials } from '../lib/utils'
import styles from './NotificationsPage.module.css'

const TYPE_CONFIG = {
  like:     { icon: '❤',  label: 'liked your tea'       },
  comment:  { icon: '💬', label: 'replied to your tea'  },
  follow:   { icon: '👤', label: 'started sipping you'  },
  trending: { icon: '🔥', label: 'Your tea is trending!' },
}

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markAllRead } = useNotifications()

  useEffect(() => {
    if (unreadCount > 0) markAllRead()
  }, [])

  return (
    <div className={styles.page} style={{ animation: 'fadeUp 200ms ease both' }}>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={`font-display ${styles.title}`}>Notifications</h1>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount} new</span>
        )}
      </div>

      {/* List */}
      <div className={styles.list}>

        {loading && (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="skeleton" style={{ height: 13, width: '60%', borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 11, width: '40%', borderRadius: 6 }} />
              </div>
            </div>
          ))
        )}

        {!loading && notifications.length === 0 && (
          <div className={styles.empty}>
            <span style={{ fontSize: 36 }}>🔔</span>
            <p>No notifications yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              When someone likes or replies to your tea, it'll show up here
            </p>
          </div>
        )}

        {!loading && notifications.map(notif => {
          const config   = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.like
          const initials = getInitials(notif.actor?.display_name ?? '?')
          const isUnread = !notif.is_read

          return (
            <div
              key={notif.id}
              className={`${styles.item} ${isUnread ? styles.unread : ''}`}
            >
              {/* Actor avatar */}
              <div className={styles.avatarWrap}>
                <div className={`avatar avatar-sm ${styles.avatar}`}>
                  {initials}
                </div>
                <span className={styles.typeIcon}>{config.icon}</span>
              </div>

              {/* Content */}
              <div className={styles.content}>
                <p className={styles.text}>
                  {notif.type === 'trending' ? (
                    <span className={styles.highlight}>🔥 Your tea is trending!</span>
                  ) : (
                    <>
                      <span className={styles.actor}>
                        @{notif.actor?.username ?? 'someone'}
                      </span>
                      {' '}{config.label}
                    </>
                  )}
                </p>

                {notif.post?.content && (
                  <p className={styles.preview}>
                    "{notif.post.content.slice(0, 60)}{notif.post.content.length > 60 ? '...' : ''}"
                  </p>
                )}

                <span className={`font-mono ${styles.time}`}>
                  {timeAgo(notif.created_at)}
                </span>
              </div>

              {/* Unread dot */}
              {isUnread && <div className={styles.dot} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
