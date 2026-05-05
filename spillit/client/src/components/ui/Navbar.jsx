import { Link, useLocation, useNavigate }  from 'react-router-dom'
import { usePostModal }        from '../../hooks/usePostModal'
import { useAuthStore }        from '../../store/authStore'
import { useNotifications }    from '../../hooks/useNotifications'
import { getInitials }         from '../../lib/utils'
import styles                  from './Navbar.module.css'

export default function Navbar() {
  const { pathname }             = useLocation()
  const navigate                 = useNavigate()
  const { open }                 = usePostModal()
  const { profile }              = useAuthStore()
  const { unreadCount }          = useNotifications()

  const initials = getInitials(profile?.display_name ?? 'ST')

  const pageTitle = {
    '/':              'For You',
    '/explore':       'Explore',
    '/notifications': 'Notifications',
    '/profile':       'Profile',
  }[pathname] ?? 'SpillIt'

  return (
    <header className={`${styles.nav} glass`}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={`${styles.logo} font-display gradient-text`}>
          SpillIt ☕
        </Link>

        {/* Center title — visible on mobile only */}
        <span className={`${styles.pageTitle} show-mobile`}>{pageTitle}</span>

        {/* Right actions */}
        <div className={styles.actions}>
          {/* Desktop "Spill" button — hidden on mobile (BottomNav handles it) */}
          <button
            className={`btn btn-primary hide-mobile ${styles.spillNavBtn}`}
            onClick={open}
          >
            🫖 Spill Tea
          </button>
          <button
            className="btn-icon"
            title="Search"
            aria-label="Search"
            onClick={() => navigate('/explore')}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="9" cy="9" r="6" />
              <path d="M14 14l3 3" />
            </svg>
          </button>

          <button
            className="btn-icon"
            style={{ position: 'relative' }}
            title="Notifications"
            aria-label="Notifications"
            onClick={() => navigate('/notifications')}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" />
              <path d="M10 18a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
            </svg>
            {/* Unread dot */}
            {unreadCount > 0 && <span className={styles.notifDot} />}
          </button>

          {/* Profile avatar → links to own profile */}
          <Link
            to={`/profile/${profile?.username ?? ''}`}
            className={`avatar avatar-sm ${styles.navAvatar}`}
            aria-label="Profile"
          >
            {initials}
          </Link>
        </div>
      </div>
    </header>
  )
}
