import { getInitials } from '../../../lib/utils'
import styles from './TeaCard.module.css'

export default function Avatar({ user, size = 'sm' }) {
  // Anonymous post
  if (!user) {
    return (
      <div className={`avatar avatar-${size} avatar-anon ${styles.avatarAnon}`}
           title="Anonymous">
        👤
      </div>
    )
  }

  // Real user with photo
  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.display_name}
        className={`avatar avatar-${size}`}
        style={{ objectFit: 'cover' }}
      />
    )
  }

  // Initials fallback
  return (
    <div className={`avatar avatar-${size}`} title={user.display_name}>
      {getInitials(user.display_name)}
    </div>
  )
}
