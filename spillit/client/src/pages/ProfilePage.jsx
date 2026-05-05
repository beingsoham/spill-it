import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore }    from '../store/authStore'
import { useProfile }      from '../hooks/useProfile'
import ProfileHeader       from '../components/features/Profile/ProfileHeader'
import ProfileTabs         from '../components/features/Profile/ProfileTabs'
import TeaCard             from '../components/features/TeaCard'
import styles              from './ProfilePage.module.css'

export default function ProfilePage() {
  const { username: paramUsername } = useParams()
  const { profile: myProfile, user } = useAuthStore()
  const navigate = useNavigate()

  // If no username in URL, show logged-in user's profile
  const targetUsername = paramUsername ?? myProfile?.username

  const { profile, posts, stats, loading, error, refetch, updateProfile } =
    useProfile(targetUsername)

  const [activeTab, setActiveTab] = useState('spills')

  // Redirect if no username yet
  useEffect(() => {
    if (!loading && !targetUsername) navigate('/')
  }, [loading, targetUsername])

  async function handleEditSave(fields) {
    const { error: updateError } = await updateProfile(fields)
    if (!updateError) refetch()
  }

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

  // ── Loading ──
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingBanner} />
        <div className={styles.loadingAvatar} />
        <div className={styles.loadingLines}>
          {[60, 40, 90].map((w, i) => (
            <div key={i} className={`skeleton`}
              style={{ height: 14, width: `${w}%`, borderRadius: 6 }} />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error || !profile) {
    return (
      <div className={styles.notFound}>
        <span style={{ fontSize: 40 }}>🫖</span>
        <p>User not found</p>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Go back</button>
      </div>
    )
  }

  return (
    <div className={styles.page} style={{ animation: 'fadeUp 200ms ease both' }}>

      {/* ── Header ── */}
      <ProfileHeader
        profile={profile}
        stats={stats}
        onEditSave={handleEditSave}
      />

      {/* ── Tabs ── */}
      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      {/* ── Content ── */}
      <div className={styles.content}>
        {activeTab === 'spills' && (
          <>
            {posts.length === 0 ? (
              <div className={styles.empty}>
                <span style={{ fontSize: 32 }}>🫖</span>
                <p>No spills yet</p>
                {user?.id === profile.id && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Share your first tea!
                  </p>
                )}
              </div>
            ) : (
              posts.map((raw, i) => (
                <TeaCard
                  key={raw.id}
                  post={shapePost(raw)}
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'liked' && (
          <div className={styles.empty}>
            <span style={{ fontSize: 32 }}>❤</span>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Liked posts coming soon
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
