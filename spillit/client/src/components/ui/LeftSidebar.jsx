import { NavLink, Link } from 'react-router-dom'
import { useAuthStore }  from '../../store/authStore'
import { usePostModal }  from '../../hooks/usePostModal'
import { getInitials } from '../../lib/utils'
import styles from './LeftSidebar.module.css'

const NAV_ITEMS = [
  {
    to: '/',
    end: true,
    label: 'Feed',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={active ? 'var(--accent)' : 'currentColor'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="7" rx="2"
          fill={active ? 'var(--accent)' : 'none'} />
        <rect x="11" y="2" width="7" height="7" rx="2" />
        <rect x="2" y="11" width="7" height="7" rx="2" />
        <rect x="11" y="11" width="7" height="7" rx="2" />
      </svg>
    ),
  },
  {
    to: '/explore',
    label: 'Explore',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={active ? 'var(--accent)' : 'currentColor'}
        strokeWidth="1.8" strokeLinecap="round">
        <circle cx="9" cy="9" r="6" />
        <path d="M15 15l3 3" />
      </svg>
    ),
  },
  {
    to: '/notifications',
    label: 'Notifications',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={active ? 'var(--accent)' : 'currentColor'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" />
        <path d="M10 18a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={active ? 'var(--accent)' : 'currentColor'}
        strokeWidth="1.8" strokeLinecap="round">
        <circle cx="10" cy="7" r="3" />
        <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      </svg>
    ),
  },
]

export default function LeftSidebar() {
  const { profile, signOut } = useAuthStore()
  const { open } = usePostModal()
  const initials = getInitials(profile?.display_name ?? '?')

  return (
    <div className={styles.wrap}>

      {/* Logo */}
      <Link to="/" className={`font-display gradient-text ${styles.logo}`}>
        SpillIt ☕
      </Link>

      {/* Nav links */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navActive : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={styles.navIcon}>{item.icon(isActive)}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Spill button */}
      <button className={`btn btn-primary ${styles.spillBtn}`} onClick={open}>
        🫖 Spill Tea
      </button>

      {/* Profile card at bottom */}
      {profile && (
        <div className={styles.profileCard}>
          <Link
            to={`/profile/${profile.username}`}
            className={styles.profileInner}
          >
            <div className={`avatar avatar-sm ${styles.avatar}`}>
              {initials}
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>
                {profile.display_name}
              </span>
              <span className={`font-mono ${styles.profileHandle}`}>
                @{profile.username}
              </span>
            </div>
          </Link>
          <button
            className={styles.signOutBtn}
            onClick={signOut}
            title="Sign out"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M13 16l4-6-4-6" />
              <path d="M7 10h10" />
              <path d="M3 4v12" />
            </svg>
          </button>
        </div>
      )}

    </div>
  )
}
