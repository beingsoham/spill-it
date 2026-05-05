import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile(username) {
  const [profile,  setProfile]  = useState(null)
  const [posts,    setPosts]    = useState([])
  const [stats,    setStats]    = useState({ followers: 0, following: 0, posts: 0 })
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!username) return
    fetchAll()
  }, [username])

  async function fetchAll() {
    setLoading(true)
    setError(null)

    try {
      // 1 — Fetch profile by username
      const { data: profileData, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (profileErr) throw new Error('User not found')
      setProfile(profileData)

      // 2 — Fetch their posts (non-anonymous only on public profiles)
      const { data: postsData } = await supabase
        .from('posts_with_counts')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('is_anonymous', false)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20)

      setPosts(postsData ?? [])

      // 3 — Fetch follower / following counts
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true })
          .eq('following_id', profileData.id),
        supabase.from('follows').select('*', { count: 'exact', head: true })
          .eq('follower_id', profileData.id),
      ])

      setStats({
        followers: followers ?? 0,
        following: following ?? 0,
        posts:     postsData?.length ?? 0,
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(fields) {
    const { data, error } = await supabase
      .from('users')
      .update(fields)
      .eq('id', profile.id)
      .select()
      .single()

    if (!error) setProfile(data)
    return { data, error }
  }

  return { profile, posts, stats, loading, error, refetch: fetchAll, updateProfile }
}
