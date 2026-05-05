import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useFollow(targetUserId) {
  const { user } = useAuthStore()
  const [following, setFollowing] = useState(false)
  const [loading,   setLoading]   = useState(false)

  // Check if current user already follows this profile
  useEffect(() => {
    if (!user || !targetUserId || user.id === targetUserId) return

    supabase
      .from('follows')
      .select('follower_id')
      .match({ follower_id: user.id, following_id: targetUserId })
      .single()
      .then(({ data }) => setFollowing(!!data))
  }, [user, targetUserId])

  async function toggle() {
    if (!user || loading) return
    setLoading(true)

    if (following) {
      await supabase.from('follows')
        .delete()
        .match({ follower_id: user.id, following_id: targetUserId })
    } else {
      await supabase.from('follows')
        .insert({ follower_id: user.id, following_id: targetUserId })
    }

    setFollowing(v => !v)
    setLoading(false)
  }

  return { following, toggle, loading }
}
