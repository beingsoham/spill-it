import { NavLink } from 'react-router-dom'
import { usePostModal } from '../../hooks/usePostModal'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Feed',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--accent)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="7" rx="2" fill={active ? 'var(--accent)' : 'none'} />
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
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--accent)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="9" cy="9" r="6" />
        <path d="M15 15l3 3" />
      </svg>
    ),
  },
  {
    to: '/notifications',
    label: 'Notifs',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--accent)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" />
        <path d="M10 18a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--accent)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="10" cy="7" r="3" />
        <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const { open } = usePostModal()

  return (
    <nav className={`${styles.nav} glass show-mobile`}>

      {NAV_ITEMS.slice(0, 2).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {item.icon(isActive)}
              <span className={styles.label}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Center post button */}
      <button className={styles.postBtn} aria-label="Spill tea" onClick={open}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <path d="M11 4v14M4 11h14" />
        </svg>
      </button>

      {NAV_ITEMS.slice(2).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {item.icon(isActive)}
              <span className={styles.label}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}

    </nav>
  )
}
