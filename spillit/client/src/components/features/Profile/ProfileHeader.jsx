import { useState } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { useFollow }    from '../../../hooks/useFollow'
import { compactNumber } from '../../../lib/utils'
import StatCard          from './StatCard'
import styles            from './ProfileHeader.module.css'

export default function ProfileHeader({ profile, stats, onEditSave }) {
  const { user, profile: myProfile } = useAuthStore()
  const isOwn = user?.id === profile?.id

  const { following, toggle: toggleFollow, loading: followLoading } = useFollow(
    isOwn ? null : profile?.id
  )

  const [editing,     setEditing]     = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [bio,         setBio]         = useState(profile?.bio ?? '')
  const [saving,      setSaving]      = useState(false)

  async function handleSave() {
    setSaving(true)
    await onEditSave({ display_name: displayName, bio })
    setSaving(false)
    setEditing(false)
  }

  const streakTier =
    (profile?.streak_count ?? 0) >= 30 ? { label: '🏆 Tea Legend',  color: 'var(--amber)'  } :
    (profile?.streak_count ?? 0) >= 7  ? { label: '☕ Tea Master',   color: 'var(--accent)' } :
    (profile?.streak_count ?? 0) >= 3  ? { label: '🔥 On a Roll',    color: 'var(--temp-warm)' } :
                                         { label: '✨ Getting Started', color: 'var(--mint)' }

  const initials = (profile?.display_name ?? '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={styles.wrap}>

      {/* ── Banner gradient ── */}
      <div className={styles.banner} />

      {/* ── Avatar row ── */}
      <div className={styles.avatarRow}>
        <div className={styles.avatarWrap}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name}
              className={styles.avatar} />
          ) : (
            <div className={styles.avatar}>
              {initials}
            </div>
          )}
          {/* Streak ring */}
          {(profile?.streak_count ?? 0) >= 3 && (
            <div className={styles.streakRing} />
          )}
        </div>

        {/* Action button */}
        <div className={styles.action}>
          {isOwn ? (
            <button
              className={`btn btn-ghost ${styles.editBtn}`}
              onClick={() => setEditing(v => !v)}
            >
              {editing ? 'Cancel' : '✏️ Edit Profile'}
            </button>
          ) : (
            <button
              className={`btn ${following ? styles.unfollowBtn : 'btn-primary'} ${styles.followBtn}`}
              onClick={toggleFollow}
              disabled={followLoading}
            >
              {followLoading ? '...' : following ? 'Following ✓' : '+ Follow'}
            </button>
          )}
        </div>
      </div>

      {/* ── Identity ── */}
      <div className={styles.identity}>
        {editing ? (
          <input
            className={styles.nameInput}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            maxLength={40}
            placeholder="Display name"
          />
        ) : (
          <h1 className={`font-display ${styles.name}`}>
            {profile?.display_name}
            {profile?.is_verified && (
              <span className={styles.verified} title="Verified">✓</span>
            )}
          </h1>
        )}
        <span className={`font-mono ${styles.username}`}>@{profile?.username}</span>
      </div>

      {/* ── Bio ── */}
      <div className={styles.bioWrap}>
        {editing ? (
          <>
            <textarea
              className={styles.bioInput}
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Write a short bio..."
            />
            <button
              className={`btn btn-primary ${styles.saveBtn}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <p className={styles.bio}>
            {profile?.bio || (isOwn ? (
              <span className={styles.bioEmpty}
                onClick={() => setEditing(true)}>
                + Add a bio
              </span>
            ) : null)}
          </p>
        )}
      </div>

      {/* ── Streak badge ── */}
      {(profile?.streak_count ?? 0) > 0 && (
        <div className={styles.streakBadge} style={{ borderColor: streakTier.color + '55', color: streakTier.color, background: streakTier.color + '15' }}>
          {streakTier.label} · {profile.streak_count} day streak
        </div>
      )}

      {/* ── Stats ── */}
      <div className={styles.stats}>
        <StatCard value={compactNumber(stats.posts)}     label="Spills"   />
        <div className={styles.statDivider} />
        <StatCard value={compactNumber(stats.followers)} label="Sippers"  />
        <div className={styles.statDivider} />
        <StatCard value={compactNumber(stats.following)} label="Sipping"  />
      </div>

    </div>
  )
}
