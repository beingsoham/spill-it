import { Router } from 'express'
import { supabase } from '../db/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── GET /api/users/:username ──────────────────────────────────
router.get('/:username', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, bio, is_verified, streak_count, created_at')
      .eq('username', req.params.username)
      .single()

    if (error || !data) return res.status(404).json({ error: 'User not found' })

    // Counts
    const [{ count: followers }, { count: following }, { count: posts }] =
      await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', data.id),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id',  data.id),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', data.id).eq('status', 'active'),
      ])

    res.json({ user: { ...data, followers, following, posts } })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// ── PATCH /api/users/me ───────────────────────────────────────
router.patch('/me', requireAuth, async (req, res) => {
  try {
    const allowed = ['display_name', 'bio', 'avatar_url']
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    )

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single()

    if (error) throw error
    res.json({ user: data })

  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// ── POST /api/users/:id/follow ────────────────────────────────
router.post('/:id/follow', requireAuth, async (req, res) => {
  try {
    const followingId = req.params.id
    const followerId  = req.user.id

    if (followerId === followingId) {
      return res.status(400).json({ error: "Can't follow yourself" })
    }

    const { data: existing } = await supabase
      .from('follows')
      .select('follower_id')
      .match({ follower_id: followerId, following_id: followingId })
      .single()

    if (existing) {
      await supabase.from('follows').delete()
        .match({ follower_id: followerId, following_id: followingId })
      return res.json({ following: false })
    }

    await supabase.from('follows')
      .insert({ follower_id: followerId, following_id: followingId })

    res.json({ following: true })

  } catch (err) {
    res.status(500).json({ error: 'Follow action failed' })
  }
})

export default router
